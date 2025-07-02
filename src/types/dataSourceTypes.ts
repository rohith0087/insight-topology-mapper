
export interface DataSourceConfig {
  name: string;
  type: string;
  config: any;
  enabled: boolean;
  credentialId?: string;
}

export interface DataSourceConfigDialogProps {
  onSourceAdded?: () => void;
  editingSource?: any;
  onClose?: () => void;
  children?: React.ReactNode;
}

export interface ConfigFormProps {
  config: any;
  onChange: (config: any) => void;
}

export interface TestResult {
  success: boolean;
  message: string;
  details?: Record<string, any>;
}
