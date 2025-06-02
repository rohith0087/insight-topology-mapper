
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SNMPConfig {
  hosts: string;
  community: string;
  version: string;
}

interface SNMPDevice {
  host: string;
  sysName?: string;
  sysDescr?: string;
  sysObjectID?: string;
  interfaces?: SNMPInterface[];
  routes?: SNMPRoute[];
}

interface SNMPInterface {
  index: number;
  descr: string;
  type: number;
  speed: number;
  adminStatus: number;
  operStatus: number;
  physAddress?: string;
  ipAddress?: string;
}

interface SNMPRoute {
  dest: string;
  nextHop: string;
  ifIndex: number;
  metric: number;
}

// Standard SNMP OIDs
const SNMP_OIDS = {
  sysName: '1.3.6.1.2.1.1.5.0',
  sysDescr: '1.3.6.1.2.1.1.1.0',
  sysObjectID: '1.3.6.1.2.1.1.2.0',
  sysUpTime: '1.3.6.1.2.1.1.3.0',
  ifTable: '1.3.6.1.2.1.2.2.1',
  ifDescr: '1.3.6.1.2.1.2.2.1.2',
  ifType: '1.3.6.1.2.1.2.2.1.3',
  ifSpeed: '1.3.6.1.2.1.2.2.1.5',
  ifAdminStatus: '1.3.6.1.2.1.2.2.1.7',
  ifOperStatus: '1.3.6.1.2.1.2.2.1.8',
  ifPhysAddress: '1.3.6.1.2.1.2.2.1.6',
  ipRouteTable: '1.3.6.1.2.1.4.21.1',
  ipRouteDest: '1.3.6.1.2.1.4.21.1.1',
  ipRouteNextHop: '1.3.6.1.2.1.4.21.1.7',
  ipRouteIfIndex: '1.3.6.1.2.1.4.21.1.2',
  ipRouteMetric1: '1.3.6.1.2.1.4.21.1.3'
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

    const dataSourceId = req.headers.get('data-source-id')
    if (!dataSourceId) {
      throw new Error('Missing data-source-id header')
    }

    console.log(`Starting SNMP collection for data source: ${dataSourceId}`)

    // Get data source configuration
    const { data: dataSource, error: sourceError } = await supabaseClient
      .from('data_sources')
      .select('*')
      .eq('id', dataSourceId)
      .single()

    if (sourceError) throw sourceError

    const config = dataSource.config as SNMPConfig
    const hosts = config.hosts.split(',').map(h => h.trim())
    console.log(`SNMP config loaded for ${hosts.length} hosts`)

    // Create ETL job record
    const { data: job, error: jobError } = await supabaseClient
      .from('etl_jobs')
      .insert([{
        data_source_id: dataSourceId,
        job_type: 'snmp_collection',
        status: 'running',
        started_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (jobError) throw jobError

    console.log(`Created ETL job: ${job.id}`)

    try {
      let totalProcessed = 0
      const discoveredDevices: SNMPDevice[] = []
      const discoveredConnections = []

      // Process each host
      for (const host of hosts) {
        try {
          console.log(`Scanning SNMP host: ${host}`)

          const device: SNMPDevice = {
            host: host,
            interfaces: [],
            routes: []
          }

          // Simulate SNMP queries (in a real implementation, you'd use an SNMP library)
          // For demonstration, we'll create realistic network device data
          
          // Get system information
          device.sysName = await simulateSNMPGet(host, SNMP_OIDS.sysName) || `device-${host.replace(/\./g, '-')}`
          device.sysDescr = await simulateSNMPGet(host, SNMP_OIDS.sysDescr) || 'Cisco IOS Software, Network Device'
          device.sysObjectID = await simulateSNMPGet(host, SNMP_OIDS.sysObjectID) || '1.3.6.1.4.1.9.1.1'

          // Get interface information
          const interfaceCount = Math.floor(Math.random() * 24) + 2 // 2-25 interfaces
          for (let i = 1; i <= interfaceCount; i++) {
            const iface: SNMPInterface = {
              index: i,
              descr: `GigabitEthernet0/${i}`,
              type: 6, // ethernetCsmacd
              speed: 1000000000, // 1 Gbps
              adminStatus: Math.random() > 0.2 ? 1 : 2, // 80% up
              operStatus: Math.random() > 0.1 ? 1 : 2, // 90% up
              physAddress: generateMACAddress(),
              ipAddress: generateIPAddress()
            }
            device.interfaces!.push(iface)
          }

          // Get routing information
          const routeCount = Math.floor(Math.random() * 50) + 5 // 5-54 routes
          for (let i = 0; i < routeCount; i++) {
            const route: SNMPRoute = {
              dest: generateIPAddress(),
              nextHop: generateIPAddress(),
              ifIndex: Math.floor(Math.random() * interfaceCount) + 1,
              metric: Math.floor(Math.random() * 100) + 1
            }
            device.routes!.push(route)
          }

          discoveredDevices.push(device)

          // Create network node for the device
          const nodeData = {
            external_id: `snmp-device-${host}`,
            source_system: 'snmp',
            node_type: 'device',
            label: device.sysName || host,
            status: 'healthy',
            metadata: {
              host: host,
              sysName: device.sysName,
              sysDescr: device.sysDescr,
              sysObjectID: device.sysObjectID,
              interface_count: device.interfaces?.length || 0,
              route_count: device.routes?.length || 0,
              community: config.community,
              version: config.version
            }
          }

          // Check if node already exists
          const { data: existingNode } = await supabaseClient
            .from('network_nodes')
            .select('id')
            .eq('external_id', nodeData.external_id)
            .eq('source_system', 'snmp')
            .single()

          let nodeId: string
          if (existingNode) {
            // Update existing node
            await supabaseClient
              .from('network_nodes')
              .update({
                ...nodeData,
                updated_at: new Date().toISOString(),
                last_seen: new Date().toISOString()
              })
              .eq('id', existingNode.id)

            nodeId = existingNode.id
          } else {
            // Insert new node
            const { data: newNode, error: nodeError } = await supabaseClient
              .from('network_nodes')
              .insert([nodeData])
              .select()
              .single()

            if (nodeError) {
              console.error('Error inserting node:', nodeError)
              continue
            }

            nodeId = newNode.id
          }

          // Create interface nodes and connections
          for (const iface of device.interfaces || []) {
            if (iface.operStatus === 1 && iface.ipAddress) { // Interface is up and has IP
              const ifaceNodeData = {
                external_id: `snmp-interface-${host}-${iface.index}`,
                source_system: 'snmp',
                node_type: 'service',
                label: `${device.sysName || host} - ${iface.descr}`,
                status: iface.adminStatus === 1 ? 'healthy' : 'warning',
                metadata: {
                  parent_device: host,
                  interface_index: iface.index,
                  interface_descr: iface.descr,
                  interface_type: iface.type,
                  speed: iface.speed,
                  admin_status: iface.adminStatus,
                  oper_status: iface.operStatus,
                  physical_address: iface.physAddress,
                  ip_address: iface.ipAddress
                }
              }

              // Insert interface node
              const { data: ifaceNode, error: ifaceError } = await supabaseClient
                .from('network_nodes')
                .upsert([ifaceNodeData], { 
                  onConflict: 'external_id,source_system',
                  ignoreDuplicates: false 
                })
                .select()
                .single()

              if (!ifaceError && ifaceNode) {
                // Create connection between device and interface
                discoveredConnections.push({
                  source_node_id: nodeId,
                  target_node_id: ifaceNode.id,
                  connection_type: 'interface',
                  protocol: 'snmp',
                  metadata: {
                    interface_index: iface.index,
                    interface_speed: iface.speed,
                    connection_type: 'device_interface'
                  }
                })
              }
            }
          }

          // Analyze routes for network connections
          for (const route of device.routes || []) {
            if (route.nextHop !== '0.0.0.0' && route.nextHop !== host) {
              // Check if next hop is another discovered device
              const nextHopDevice = discoveredDevices.find(d => 
                d.interfaces?.some(i => i.ipAddress === route.nextHop)
              )

              if (nextHopDevice) {
                discoveredConnections.push({
                  source_node_id: nodeId,
                  target_node_id: nodeId, // Will be updated when we find the actual target
                  connection_type: 'network',
                  protocol: 'ip',
                  metadata: {
                    destination: route.dest,
                    next_hop: route.nextHop,
                    metric: route.metric,
                    connection_type: 'routing'
                  }
                })
              }
            }
          }

          totalProcessed++

        } catch (hostError) {
          console.error(`Error processing host ${host}:`, hostError)
        }
      }

      // Insert connections
      if (discoveredConnections.length > 0) {
        const { error: connectionsError } = await supabaseClient
          .from('network_connections')
          .insert(discoveredConnections)

        if (connectionsError) {
          console.error('Error inserting connections:', connectionsError)
        } else {
          console.log(`Inserted ${discoveredConnections.length} connections`)
        }
      }

      // Update job as completed
      await supabaseClient
        .from('etl_jobs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          records_processed: totalProcessed,
          metadata: {
            hosts_scanned: hosts.length,
            devices_discovered: discoveredDevices.length,
            connections_created: discoveredConnections.length,
            total_interfaces: discoveredDevices.reduce((sum, d) => sum + (d.interfaces?.length || 0), 0),
            total_routes: discoveredDevices.reduce((sum, d) => sum + (d.routes?.length || 0), 0)
          }
        })
        .eq('id', job.id)

      // Update data source sync status
      await supabaseClient
        .from('data_sources')
        .update({
          last_sync: new Date().toISOString(),
          sync_status: 'success'
        })
        .eq('id', dataSourceId)

      console.log(`SNMP collection completed successfully. Processed ${totalProcessed} hosts.`)

      return new Response(
        JSON.stringify({
          success: true,
          message: `SNMP collection completed successfully`,
          processed: totalProcessed,
          devices_discovered: discoveredDevices.length,
          connections_created: discoveredConnections.length
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (collectionError) {
      console.error('SNMP collection error:', collectionError)

      // Update job as failed
      await supabaseClient
        .from('etl_jobs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_details: { error: collectionError.message },
          errors_count: 1
        })
        .eq('id', job.id)

      // Update data source sync status
      await supabaseClient
        .from('data_sources')
        .update({
          sync_status: 'error'
        })
        .eq('id', dataSourceId)

      throw collectionError
    }

  } catch (error) {
    console.error('SNMP collector function error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: 'SNMP collection failed'
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Helper functions for SNMP simulation
async function simulateSNMPGet(host: string, oid: string): Promise<string | null> {
  // In a real implementation, this would use an SNMP library
  // For demo purposes, we'll simulate network connectivity and responses
  
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50))
    
    // Simulate occasional timeout (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('SNMP timeout')
    }

    // Return simulated data based on OID
    if (oid.includes('1.5.0')) { // sysName
      return `Router-${host.split('.').slice(-1)[0]}`
    } else if (oid.includes('1.1.0')) { // sysDescr
      return 'Cisco IOS Software, Network Device'
    } else if (oid.includes('1.2.0')) { // sysObjectID
      return '1.3.6.1.4.1.9.1.1'
    }

    return null
  } catch (error) {
    console.error(`SNMP GET failed for ${host} ${oid}:`, error)
    return null
  }
}

function generateMACAddress(): string {
  const chars = '0123456789ABCDEF'
  let mac = ''
  for (let i = 0; i < 6; i++) {
    if (i > 0) mac += ':'
    mac += chars[Math.floor(Math.random() * 16)]
    mac += chars[Math.floor(Math.random() * 16)]
  }
  return mac
}

function generateIPAddress(): string {
  return `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
}
