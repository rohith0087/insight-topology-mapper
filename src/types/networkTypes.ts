
export interface BaseNodeData {
  label: string;
  type: 'device' | 'service' | 'application' | 'cloud';
  status: 'healthy' | 'warning' | 'critical';
}

export interface DeviceMetadata {
  ip: string;
  vendor: string;
  model: string;
  location: string;
  ports?: number;
}

export interface ServiceMetadata {
  port: number;
  protocol: string;
  server?: string;
  scope?: string;
}

export interface ApplicationMetadata {
  version: string;
  database: string;
  users: number;
}

export interface CloudMetadata {
  region: string;
  cidr: string;
  subnets: number;
}

export interface DeviceNodeData extends BaseNodeData {
  type: 'device';
  metadata: DeviceMetadata;
}

export interface ServiceNodeData extends BaseNodeData {
  type: 'service';
  metadata: ServiceMetadata;
}

export interface ApplicationNodeData extends BaseNodeData {
  type: 'application';
  metadata: ApplicationMetadata;
}

export interface CloudNodeData extends BaseNodeData {
  type: 'cloud';
  metadata: CloudMetadata;
}

export type NodeData = DeviceNodeData | ServiceNodeData | ApplicationNodeData | CloudNodeData;
