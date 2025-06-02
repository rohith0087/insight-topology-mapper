
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface DataSourceCardTestResultsProps {
  testResult: any;
}

const DataSourceCardTestResults: React.FC<DataSourceCardTestResultsProps> = ({ testResult }) => {
  if (!testResult) return null;

  return (
    <div className={`p-3 rounded-lg border ${
      testResult.success 
        ? 'bg-green-900/20 border-green-600 text-green-200' 
        : 'bg-red-900/20 border-red-600 text-red-200'
    }`}>
      <div className="flex items-center space-x-2">
        {testResult.success ? 
          <CheckCircle className="w-4 h-4" /> : 
          <XCircle className="w-4 h-4" />
        }
        <span className="font-medium">{testResult.message}</span>
      </div>
      {testResult.details && (
        <div className="mt-2 text-xs opacity-80">
          {Object.entries(testResult.details).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span>{key}:</span>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DataSourceCardTestResults;
