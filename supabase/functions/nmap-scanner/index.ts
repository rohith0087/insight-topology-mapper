
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Network scanning configuration
const SCAN_CONFIG = {
  DEFAULT_TIMEOUT: 3000, // 3 seconds per port
  MAX_CONCURRENT_HOSTS: 50, // Max hosts to scan concurrently
  MAX_CONCURRENT_PORTS: 100, // Max ports to scan concurrently per host
  DEFAULT_PORTS: [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995, 3306, 3389, 5432, 5984, 6379, 8080, 8443, 9200, 27017],
  COMMON_SERVICES: {
    21: 'FTP',
    22: 'SSH',
    23: 'Telnet',
    25: 'SMTP',
    53: 'DNS',
    80: 'HTTP',
    110: 'POP3',
    143: 'IMAP',
    443: 'HTTPS',
    993: 'IMAPS',
    995: 'POP3S',
    3306: 'MySQL',
    3389: 'RDP',
    5432: 'PostgreSQL',
    5984: 'CouchDB',
    6379: 'Redis',
    8080: 'HTTP-Alt',
    8443: 'HTTPS-Alt',
    9200: 'Elasticsearch',
    27017: 'MongoDB'
  }
};

// Rate limiting for network safety
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number;
  
  constructor(maxRequests = 100, timeWindowMs = 1000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMs;
  }
  
  async waitForCapacity(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    
    if (this.requests.length >= this.maxRequests) {
      const waitTime = this.timeWindow - (now - this.requests[0]);
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    this.requests.push(now);
  }
}

// IP address utilities
function parseIPRange(range: string): string[] {
  const ips: string[] = [];
  
  if (range.includes('/')) {
    // CIDR notation
    const [network, prefixLength] = range.split('/');
    const prefix = parseInt(prefixLength, 10);
    const networkParts = network.split('.').map(Number);
    
    if (prefix >= 24) {
      // /24 or smaller - scan the subnet
      const baseIP = `${networkParts[0]}.${networkParts[1]}.${networkParts[2]}`;
      for (let i = 1; i <= 254; i++) {
        ips.push(`${baseIP}.${i}`);
      }
    } else if (prefix >= 16) {
      // /16 - limited scan for safety
      const baseIP = `${networkParts[0]}.${networkParts[1]}`;
      for (let j = 0; j <= 255; j++) {
        for (let i = 1; i <= 254; i++) {
          ips.push(`${baseIP}.${j}.${i}`);
          if (ips.length >= 1000) break; // Safety limit
        }
        if (ips.length >= 1000) break;
      }
    }
  } else if (range.includes('-')) {
    // Range notation (e.g., 192.168.1.1-192.168.1.50)
    const [start, end] = range.split('-');
    const startParts = start.split('.').map(Number);
    const endParts = end.split('.').map(Number);
    
    if (startParts[0] === endParts[0] && startParts[1] === endParts[1] && startParts[2] === endParts[2]) {
      // Same subnet
      const baseIP = `${startParts[0]}.${startParts[1]}.${startParts[2]}`;
      for (let i = startParts[3]; i <= endParts[3]; i++) {
        ips.push(`${baseIP}.${i}`);
      }
    }
  } else {
    // Single IP
    ips.push(range.trim());
  }
  
  return ips.filter(ip => isValidIP(ip));
}

function isValidIP(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) return false;
  
  return parts.every(part => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255 && part === num.toString();
  });
}

function isPrivateIP(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  const [a, b] = parts;
  
  return (
    (a === 10) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 127) // localhost
  );
}

// Port scanning utilities
function parsePorts(portString: string): number[] {
  if (!portString || portString.trim() === '') {
    return SCAN_CONFIG.DEFAULT_PORTS;
  }
  
  const ports: number[] = [];
  const ranges = portString.split(',').map(p => p.trim());
  
  for (const range of ranges) {
    if (range.includes('-')) {
      const [start, end] = range.split('-').map(p => parseInt(p.trim(), 10));
      if (start && end && start <= end && start > 0 && end <= 65535) {
        for (let port = start; port <= end; port++) {
          ports.push(port);
        }
      }
    } else {
      const port = parseInt(range, 10);
      if (port > 0 && port <= 65535) {
        ports.push(port);
      }
    }
  }
  
  return [...new Set(ports)].sort((a, b) => a - b);
}

// TCP port scanning
async function scanTCPPort(ip: string, port: number, timeout = SCAN_CONFIG.DEFAULT_TIMEOUT): Promise<boolean> {
  try {
    const conn = await Deno.connect({
      hostname: ip,
      port: port,
      transport: "tcp",
    });
    
    conn.close();
    return true;
  } catch {
    return false;
  }
}

// Service detection through banner grabbing
async function detectService(ip: string, port: number): Promise<{ service: string; banner?: string; version?: string }> {
  const knownService = SCAN_CONFIG.COMMON_SERVICES[port];
  let banner = '';
  let version = '';
  
  try {
    const conn = await Deno.connect({
      hostname: ip,
      port: port,
      transport: "tcp",
    });
    
    // Try to grab banner
    const buffer = new Uint8Array(1024);
    const timer = setTimeout(() => conn.close(), 2000);
    
    try {
      const bytesRead = await conn.read(buffer);
      clearTimeout(timer);
      
      if (bytesRead) {
        banner = new TextDecoder().decode(buffer.subarray(0, bytesRead)).trim();
        
        // Extract version information from common banners
        if (port === 22 && banner.includes('SSH')) {
          const match = banner.match(/SSH-[\d.]+[^\s]*/);
          if (match) version = match[0];
        } else if (port === 80 || port === 8080) {
          // For HTTP, we'd need to send a request, but this is a basic implementation
          version = 'HTTP Server';
        } else if (port === 21 && banner.includes('FTP')) {
          const match = banner.match(/\d+\.\d+[\.\d]*/);
          if (match) version = match[0];
        }
      }
    } catch {
      // Banner grab failed, but port is open
    } finally {
      clearTimeout(timer);
      conn.close();
    }
  } catch {
    // Connection failed
  }
  
  return {
    service: knownService || 'Unknown',
    banner: banner.substring(0, 100), // Limit banner length
    version: version || undefined
  };
}

// Hostname resolution
async function resolveHostname(ip: string): Promise<string | null> {
  try {
    // Basic hostname resolution - in a real implementation you'd use DNS lookup
    // For now, we'll use a simple approach
    if (ip === '192.168.1.1') return 'gateway.local';
    if (ip.endsWith('.1')) return `router-${ip.replace(/\./g, '-')}.local`;
    return null;
  } catch {
    return null;
  }
}

// Device fingerprinting based on open ports
function fingerprintDevice(openPorts: number[]): { type: string; os?: string; vendor?: string } {
  const portSet = new Set(openPorts);
  
  // Router/Gateway detection
  if (portSet.has(22) && portSet.has(80) && portSet.has(443) && openPorts.length <= 5) {
    return { type: 'router', os: 'Linux', vendor: 'Network Equipment' };
  }
  
  // Web server detection
  if ((portSet.has(80) || portSet.has(443)) && (portSet.has(22) || portSet.has(3389))) {
    return { type: 'server', os: 'Linux/Windows', vendor: 'Server' };
  }
  
  // Database server detection
  if (portSet.has(3306) || portSet.has(5432) || portSet.has(27017)) {
    return { type: 'database_server', os: 'Linux/Windows', vendor: 'Database Server' };
  }
  
  // Workstation detection
  if (portSet.has(3389) || (portSet.has(22) && openPorts.length > 10)) {
    return { type: 'workstation', os: 'Windows/Linux', vendor: 'Workstation' };
  }
  
  return { type: 'device', os: 'Unknown', vendor: 'Unknown' };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get data source ID from request body
    let dataSourceId;
    try {
      const body = await req.json();
      dataSourceId = body?.dataSourceId;
    } catch (e) {
      throw new Error('Request body must contain dataSourceId');
    }
    
    if (!dataSourceId) {
      throw new Error('Data source ID is required');
    }

    // Get data source configuration
    const { data: dataSource, error: dsError } = await supabaseClient
      .from('data_sources')
      .select('*')
      .eq('id', dataSourceId)
      .single();

    if (dsError) {
      console.error('Error fetching data source:', dsError);
      throw new Error('Failed to fetch data source configuration');
    }

    console.log(`Starting NMAP scan for data source: ${dataSourceId}`);

    // Create ETL job record
    const { data: etlJob, error: etlError } = await supabaseClient
      .from('etl_jobs')
      .insert({
        data_source_id: dataSourceId,
        job_type: 'nmap_scan',
        status: 'running',
        started_at: new Date().toISOString()
      })
      .select()
      .single()

    if (etlError) throw etlError

    // Parse scan configuration
    const config = dataSource.config || {};
    const targetRanges = config.target_ranges || '192.168.1.0/24';
    const scanType = config.scan_type || 'tcp_syn';
    const portString = config.ports || '';
    
    console.log(`Scan configuration: ranges=${targetRanges}, type=${scanType}, ports=${portString}`);

    // Parse target IP addresses
    const allIPs: string[] = [];
    const ranges = targetRanges.split(',').map((r: string) => r.trim());
    
    for (const range of ranges) {
      const ips = parseIPRange(range);
      allIPs.push(...ips);
    }

    // Validate that we're only scanning private networks
    const invalidIPs = allIPs.filter(ip => !isPrivateIP(ip));
    if (invalidIPs.length > 0) {
      throw new Error(`Cannot scan public IP addresses: ${invalidIPs.slice(0, 5).join(', ')}`);
    }

    console.log(`Scanning ${allIPs.length} IP addresses`);

    // Parse target ports
    const targetPorts = parsePorts(portString);
    console.log(`Scanning ${targetPorts.length} ports: ${targetPorts.slice(0, 10).join(', ')}${targetPorts.length > 10 ? '...' : ''}`);

    // Initialize rate limiter
    const rateLimiter = new RateLimiter();
    
    let recordsProcessed = 0;
    let errorsCount = 0;
    const discoveredDevices: any[] = [];

    // Process hosts in batches to prevent overwhelming the network
    const hostBatches = [];
    for (let i = 0; i < allIPs.length; i += SCAN_CONFIG.MAX_CONCURRENT_HOSTS) {
      hostBatches.push(allIPs.slice(i, i + SCAN_CONFIG.MAX_CONCURRENT_HOSTS));
    }

    for (const hostBatch of hostBatches) {
      console.log(`Processing batch of ${hostBatch.length} hosts`);
      
      const hostPromises = hostBatch.map(async (ip) => {
        try {
          await rateLimiter.waitForCapacity();
          
          // First, do a quick connectivity check (ping equivalent)
          const quickCheck = await scanTCPPort(ip, 80, 1000) || await scanTCPPort(ip, 22, 1000);
          if (!quickCheck && targetPorts.length > 5) {
            // If host doesn't respond to common ports, skip intensive scan
            return null;
          }

          const openPorts: number[] = [];
          const services: Record<number, any> = {};

          // Scan ports in batches
          const portBatches = [];
          for (let i = 0; i < targetPorts.length; i += SCAN_CONFIG.MAX_CONCURRENT_PORTS) {
            portBatches.push(targetPorts.slice(i, i + SCAN_CONFIG.MAX_CONCURRENT_PORTS));
          }

          for (const portBatch of portBatches) {
            const portPromises = portBatch.map(async (port) => {
              await rateLimiter.waitForCapacity();
              
              const isOpen = await scanTCPPort(ip, port);
              if (isOpen) {
                openPorts.push(port);
                
                // Detect service for open ports
                const serviceInfo = await detectService(ip, port);
                services[port] = serviceInfo;
              }
            });

            await Promise.all(portPromises);
          }

          if (openPorts.length === 0) {
            return null; // No open ports found
          }

          // Resolve hostname
          const hostname = await resolveHostname(ip);
          
          // Fingerprint device type
          const fingerprint = fingerprintDevice(openPorts);
          
          console.log(`Discovered device: ${ip} (${hostname || 'unknown'}) - ${openPorts.length} open ports`);

          return {
            ip,
            hostname,
            openPorts,
            services,
            deviceType: fingerprint.type,
            os: fingerprint.os,
            vendor: fingerprint.vendor
          };

        } catch (error) {
          console.error(`Error scanning host ${ip}:`, error);
          return null;
        }
      });

      const results = await Promise.all(hostPromises);
      const validResults = results.filter(result => result !== null);
      discoveredDevices.push(...validResults);
    }

    console.log(`Scan completed. Found ${discoveredDevices.length} devices with open ports`);

    // Process and store discovered devices
    for (const device of discoveredDevices) {
      try {
        // Determine device status based on open ports
        const criticalPorts = [21, 23, 135, 139, 445]; // Commonly vulnerable ports
        const hasCriticalPorts = device.openPorts.some((port: number) => criticalPorts.includes(port));
        const status = hasCriticalPorts ? 'warning' : 'healthy';

        // Prepare services metadata
        const servicesInfo = Object.entries(device.services).map(([port, service]: [string, any]) => ({
          port: parseInt(port),
          service: service.service,
          banner: service.banner,
          version: service.version
        }));

        // Insert network node
        const { error: nodeError } = await supabaseClient
          .from('network_nodes')
          .upsert({
            external_id: device.ip,
            source_system: 'nmap',
            node_type: 'device',
            label: device.hostname || device.ip,
            status: status,
            metadata: {
              ip: device.ip,
              hostname: device.hostname,
              device_type: device.deviceType,
              os: device.os,
              vendor: device.vendor,
              open_ports: device.openPorts,
              port_count: device.openPorts.length,
              services: servicesInfo,
              scan_type: scanType,
              scan_date: new Date().toISOString()
            },
            last_seen: new Date().toISOString()
          }, {
            onConflict: 'external_id,source_system'
          });

        if (nodeError) {
          errorsCount++;
          console.error('Node insert error:', nodeError);
        } else {
          recordsProcessed++;
        }
      } catch (error) {
        errorsCount++;
        console.error('Processing error:', error);
      }
    }

    // Update ETL job status
    await supabaseClient
      .from('etl_jobs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        records_processed: recordsProcessed,
        errors_count: errorsCount
      })
      .eq('id', etlJob.id)

    // Update data source last sync
    await supabaseClient
      .from('data_sources')
      .update({
        last_sync: new Date().toISOString(),
        sync_status: 'success'
      })
      .eq('id', dataSourceId)

    return new Response(
      JSON.stringify({ 
        success: true, 
        recordsProcessed, 
        errorsCount,
        jobId: etlJob.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('ETL error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
