
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TestConnectionComponentProps {
  sourceType: string;
  config: Record<string, any>;
  credentialId?: string;
}

const TestConnectionComponent: React.FC<TestConnectionComponentProps> = ({
  sourceType,
  config,
  credentialId
}) => {
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    details?: Record<string, any>;
  } | null>(null);
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    if (!credentialId && ['aws', 'azure', 'splunk', 'sentinelone', 'qradar', 'datadog', 'microsoft-sentinel'].includes(sourceType)) {
      setTestResult({
        success: false,
        message: 'Please configure credentials before testing connection'
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('test-connection', {
        body: {
          type: sourceType,
          config,
          credentialId
        }
      });

      if (error) throw error;

      setTestResult(data);
    } catch (error) {
      console.error('Connection test error:', error);
      setTestResult({
        success: false,
        message: 'Connection test failed: ' + error.message
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Test Connection</h3>
        <Button 
          onClick={testConnection} 
          disabled={testing}
          variant="outline"
        >
          {testing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Connection'
          )}
        </Button>
      </div>

      {testResult && (
        <Alert className={testResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <div className="flex items-start space-x-2">
            {testResult.success ? (
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
            )}
            <div className="flex-1">
              <AlertDescription className={testResult.success ? 'text-green-800' : 'text-red-800'}>
                {testResult.message}
              </AlertDescription>
              {testResult.details && (
                <div className="mt-2 text-sm opacity-75">
                  <pre className="text-xs">
                    {JSON.stringify(testResult.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </Alert>
      )}
    </div>
  );
};

export default TestConnectionComponent;
