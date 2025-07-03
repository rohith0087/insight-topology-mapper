
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { EC2Client, DescribeInstancesCommand, DescribeVpcsCommand, DescribeSubnetsCommand, DescribeSecurityGroupsCommand } from 'https://esm.sh/@aws-sdk/client-ec2@3'
import { RDSClient, DescribeDBInstancesCommand, DescribeDBClustersCommand } from 'https://esm.sh/@aws-sdk/client-rds@3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AWSCredentials {
  access_key_id: string;
  secret_access_key: string;
  session_token?: string;
}

interface AWSConfig {
  regions?: string;
  services?: string;
}

// Rate limiting configuration
const RATE_LIMIT = {
  requestsPerSecond: 10,
  burstLimit: 50,
  retryDelay: 1000,
  maxRetries: 3
};

class RateLimiter {
  private requests: number[] = [];
  
  async waitForCapacity(): Promise<void> {
    const now = Date.now();
    // Remove requests older than 1 second
    this.requests = this.requests.filter(time => now - time < 1000);
    
    if (this.requests.length >= RATE_LIMIT.requestsPerSecond) {
      const waitTime = 1000 - (now - this.requests[0]);
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    
    this.requests.push(now);
  }
}

const rateLimiter = new RateLimiter();

async function getCredentials(supabaseClient: any, credentialId: string): Promise<AWSCredentials> {
  console.log('Retrieving credentials for ID:', credentialId);
  
  const { data, error } = await supabaseClient.functions.invoke('credential-manager', {
    body: {
      action: 'retrieve',
      credentialId
    }
  });

  if (error) {
    console.error('Error retrieving credentials:', error);
    throw new Error('Failed to retrieve AWS credentials');
  }

  if (!data?.success || !data?.credentialData) {
    throw new Error('Invalid credential data received');
  }

  return data.credentialData as AWSCredentials;
}

async function createAWSClients(credentials: AWSCredentials, region: string) {
  const clientConfig = {
    region,
    credentials: {
      accessKeyId: credentials.access_key_id,
      secretAccessKey: credentials.secret_access_key,
      ...(credentials.session_token && { sessionToken: credentials.session_token })
    }
  };

  return {
    ec2: new EC2Client(clientConfig),
    rds: new RDSClient(clientConfig)
  };
}

async function discoverEC2Instances(ec2Client: EC2Client, region: string): Promise<any[]> {
  console.log(`Discovering EC2 instances in region: ${region}`);
  const instances: any[] = [];
  let nextToken: string | undefined;

  do {
    await rateLimiter.waitForCapacity();
    
    const command = new DescribeInstancesCommand({
      MaxResults: 100,
      NextToken: nextToken
    });

    try {
      const response = await ec2Client.send(command);
      nextToken = response.NextToken;

      if (response.Reservations) {
        for (const reservation of response.Reservations) {
          if (reservation.Instances) {
            for (const instance of reservation.Instances) {
              instances.push({
                id: instance.InstanceId,
                type: 'EC2',
                name: instance.Tags?.find(tag => tag.Key === 'Name')?.Value || instance.InstanceId,
                region,
                vpc: instance.VpcId,
                subnet: instance.SubnetId,
                status: instance.State?.Name || 'unknown',
                instanceType: instance.InstanceType,
                privateIp: instance.PrivateIpAddress,
                publicIp: instance.PublicIpAddress,
                securityGroups: instance.SecurityGroups?.map(sg => sg.GroupId) || [],
                launchTime: instance.LaunchTime,
                metadata: {
                  resource_type: 'EC2',
                  region,
                  vpc: instance.VpcId,
                  subnet: instance.SubnetId,
                  instance_type: instance.InstanceType,
                  private_ip: instance.PrivateIpAddress,
                  public_ip: instance.PublicIpAddress,
                  security_groups: instance.SecurityGroups?.map(sg => sg.GroupId) || [],
                  tags: instance.Tags || []
                }
              });
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error discovering EC2 instances in ${region}:`, error);
      throw error;
    }
  } while (nextToken);

  return instances;
}

async function discoverRDSInstances(rdsClient: RDSClient, region: string): Promise<any[]> {
  console.log(`Discovering RDS instances in region: ${region}`);
  const instances: any[] = [];
  let marker: string | undefined;

  do {
    await rateLimiter.waitForCapacity();
    
    const command = new DescribeDBInstancesCommand({
      MaxRecords: 100,
      Marker: marker
    });

    try {
      const response = await rdsClient.send(command);
      marker = response.Marker;

      if (response.DBInstances) {
        for (const instance of response.DBInstances) {
          instances.push({
            id: instance.DBInstanceIdentifier,
            type: 'RDS',
            name: instance.DBInstanceIdentifier,
            region,
            engine: instance.Engine,
            status: instance.DBInstanceStatus,
            endpoint: instance.Endpoint?.Address,
            port: instance.Endpoint?.Port,
            vpc: instance.DBSubnetGroup?.VpcId,
            metadata: {
              resource_type: 'RDS',
              region,
              engine: instance.Engine,
              engine_version: instance.EngineVersion,
              instance_class: instance.DBInstanceClass,
              allocated_storage: instance.AllocatedStorage,
              storage_type: instance.StorageType,
              multi_az: instance.MultiAZ,
              publicly_accessible: instance.PubliclyAccessible,
              vpc: instance.DBSubnetGroup?.VpcId,
              subnet_group: instance.DBSubnetGroup?.DBSubnetGroupName,
              security_groups: instance.VpcSecurityGroups?.map(sg => sg.VpcSecurityGroupId) || []
            }
          });
        }
      }
    } catch (error) {
      console.error(`Error discovering RDS instances in ${region}:`, error);
      throw error;
    }
  } while (marker);

  return instances;
}

async function discoverVPCs(ec2Client: EC2Client, region: string): Promise<any[]> {
  console.log(`Discovering VPCs in region: ${region}`);
  const vpcs: any[] = [];
  let nextToken: string | undefined;

  do {
    await rateLimiter.waitForCapacity();
    
    const command = new DescribeVpcsCommand({
      MaxResults: 100,
      NextToken: nextToken
    });

    try {
      const response = await ec2Client.send(command);
      nextToken = response.NextToken;

      if (response.Vpcs) {
        for (const vpc of response.Vpcs) {
          vpcs.push({
            id: vpc.VpcId,
            type: 'VPC',
            name: vpc.Tags?.find(tag => tag.Key === 'Name')?.Value || vpc.VpcId,
            region,
            cidr: vpc.CidrBlock,
            status: vpc.State,
            metadata: {
              resource_type: 'VPC',
              region,
              cidr: vpc.CidrBlock,
              state: vpc.State,
              is_default: vpc.IsDefault,
              tags: vpc.Tags || []
            }
          });
        }
      }
    } catch (error) {
      console.error(`Error discovering VPCs in ${region}:`, error);
      throw error;
    }
  } while (nextToken);

  return vpcs;
}

async function processResourcesWithRetry(
  supabaseClient: any,
  resources: any[],
  maxRetries = RATE_LIMIT.maxRetries
): Promise<{ processed: number; errors: number }> {
  let recordsProcessed = 0;
  let errorsCount = 0;

  for (const resource of resources) {
    let attempts = 0;
    let success = false;

    while (attempts < maxRetries && !success) {
      try {
        const nodeType = resource.type === 'EC2' ? 'device' : 
                        resource.type === 'RDS' ? 'service' : 'cloud';

        const status = resource.status === 'running' || 
                      resource.status === 'available' || 
                      resource.status === 'active' ? 'healthy' : 
                      resource.status === 'stopped' || 
                      resource.status === 'terminated' ? 'critical' : 'warning';

        const { error: nodeError } = await supabaseClient
          .from('network_nodes')
          .upsert({
            external_id: resource.id,
            source_system: 'aws',
            node_type: nodeType,
            label: resource.name,
            status: status,
            metadata: resource.metadata,
            last_seen: new Date().toISOString()
          }, {
            onConflict: 'external_id,source_system'
          });

        if (nodeError) {
          throw nodeError;
        }

        recordsProcessed++;
        success = true;
      } catch (error) {
        attempts++;
        console.error(`Attempt ${attempts} failed for resource ${resource.id}:`, error);
        
        if (attempts < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, RATE_LIMIT.retryDelay * attempts));
        } else {
          errorsCount++;
          console.error(`Failed to process resource ${resource.id} after ${maxRetries} attempts`);
        }
      }
    }
  }

  return { processed: recordsProcessed, errors: errorsCount };
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

    const dataSourceId = req.headers.get('data-source-id');
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

    if (!dataSource.credential_id) {
      throw new Error('AWS credentials not configured for this data source');
    }

    // Create ETL job record
    const { data: etlJob, error: etlError } = await supabaseClient
      .from('etl_jobs')
      .insert({
        data_source_id: dataSourceId,
        job_type: 'aws_discovery',
        status: 'running',
        started_at: new Date().toISOString()
      })
      .select()
      .single()

    if (etlError) {
      console.error('Error creating ETL job:', etlError);
      throw etlError;
    }

    console.log(`Starting AWS discovery for data source: ${dataSourceId}`);

    // Get AWS credentials
    const credentials = await getCredentials(supabaseClient, dataSource.credential_id);
    console.log('Successfully retrieved AWS credentials');

    // Parse configuration
    const config: AWSConfig = dataSource.config || {};
    const regions = config.regions ? config.regions.split(',').map(r => r.trim()) : ['us-east-1'];
    const services = config.services ? config.services.split(',').map(s => s.trim().toLowerCase()) : ['ec2', 'rds', 'vpc'];

    console.log(`Discovering services: ${services.join(', ')} in regions: ${regions.join(', ')}`);

    let totalRecordsProcessed = 0;
    let totalErrorsCount = 0;
    const allResources: any[] = [];

    // Discover resources in each region
    for (const region of regions) {
      try {
        console.log(`Processing region: ${region}`);
        const { ec2, rds } = await createAWSClients(credentials, region);
        
        // Discover EC2 instances
        if (services.includes('ec2')) {
          const ec2Instances = await discoverEC2Instances(ec2, region);
          allResources.push(...ec2Instances);
          console.log(`Found ${ec2Instances.length} EC2 instances in ${region}`);
        }

        // Discover RDS instances
        if (services.includes('rds')) {
          const rdsInstances = await discoverRDSInstances(rds, region);
          allResources.push(...rdsInstances);
          console.log(`Found ${rdsInstances.length} RDS instances in ${region}`);
        }

        // Discover VPCs
        if (services.includes('vpc')) {
          const vpcs = await discoverVPCs(ec2, region);
          allResources.push(...vpcs);
          console.log(`Found ${vpcs.length} VPCs in ${region}`);
        }

      } catch (error) {
        console.error(`Error processing region ${region}:`, error);
        totalErrorsCount++;
      }
    }

    console.log(`Total resources discovered: ${allResources.length}`);

    // Process all discovered resources
    if (allResources.length > 0) {
      const { processed, errors } = await processResourcesWithRetry(supabaseClient, allResources);
      totalRecordsProcessed += processed;
      totalErrorsCount += errors;
    }

    // Update ETL job status
    const jobStatus = totalErrorsCount === 0 ? 'completed' : 'completed_with_errors';
    await supabaseClient
      .from('etl_jobs')
      .update({
        status: jobStatus,
        completed_at: new Date().toISOString(),
        records_processed: totalRecordsProcessed,
        errors_count: totalErrorsCount,
        metadata: {
          regions_processed: regions,
          services_discovered: services,
          total_resources_found: allResources.length
        }
      })
      .eq('id', etlJob.id)

    // Update data source last sync
    const syncStatus = totalErrorsCount === 0 ? 'success' : 'partial_success';
    await supabaseClient
      .from('data_sources')
      .update({
        last_sync: new Date().toISOString(),
        sync_status: syncStatus
      })
      .eq('id', dataSourceId)

    console.log(`AWS discovery completed: ${totalRecordsProcessed} processed, ${totalErrorsCount} errors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        recordsProcessed: totalRecordsProcessed, 
        errorsCount: totalErrorsCount,
        jobId: etlJob.id,
        regionsProcessed: regions.length,
        servicesDiscovered: services,
        totalResourcesFound: allResources.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('AWS discovery error:', error);
    
    // Try to update ETL job with error status if we have the job ID
    try {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      )
      
      // We can't get the job ID here since it might have failed before creation
      // The calling code should handle this case
    } catch (updateError) {
      console.error('Failed to update ETL job with error status:', updateError);
    }

    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: error.stack 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
