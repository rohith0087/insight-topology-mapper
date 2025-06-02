
import React from 'react';
import { Button } from '../ui/button';
import { TestTube } from 'lucide-react';
import { TestResult } from '../../types/dataSourceTypes';

interface TestConnectionComponentProps {
  testResult: TestResult | null;
  testing: boolean;
  onTest: () => void;
}

const TestConnectionComponent: React.FC<TestConnectionComponentProps> = ({ 
  testResult, 
  testing, 
  onTest 
}) => {
  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={onTest}
        disabled={testing}
        className="border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
      >
        <TestTube className={`w-4 h-4 mr-2 ${testing ? 'animate-pulse' : ''}`} />
        {testing ? 'Testing...' : 'Test Connection'}
      </Button>

      {testResult && (
        <div className={`p-4 rounded-lg border ${
          testResult.success 
            ? 'bg-green-900/20 border-green-600' 
            : 'bg-red-900/20 border-red-600'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${
              testResult.success ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className={`font-medium ${
              testResult.success ? 'text-green-200' : 'text-red-200'
            }`}>
              {testResult.message}
            </span>
          </div>
          {testResult.details && (
            <div className="bg-slate-900 rounded p-3 mt-2">
              <div className="text-xs text-slate-300 space-y-1">
                {Object.entries(testResult.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium">{key}:</span>
                    <span className="text-cyan-400">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TestConnectionComponent;
