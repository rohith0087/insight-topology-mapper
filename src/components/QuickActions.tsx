
import React from 'react';
import { Button } from './ui/button';

const QuickActions: React.FC = () => {
  return (
    <div className="pt-4 border-t border-slate-700">
      <h4 className="font-medium text-slate-200 mb-3">Quick Actions</h4>
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
        >
          <span className="mr-2">🔍</span>
          Show All Critical
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
        >
          <span className="mr-2">📊</span>
          Network Overview
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start border-slate-600 hover:bg-slate-700 bg-slate-900 text-slate-300 hover:text-white"
        >
          <span className="mr-2">⚡</span>
          Recent Changes
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
