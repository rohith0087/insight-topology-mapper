
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, X } from 'lucide-react';
import { useHelp } from './HelpSystem';
import ContextualTooltip from './ContextualTooltip';

interface SmartHelpButtonProps {
  context: string;
  helpContent: string;
  className?: string;
}

const SmartHelpButton: React.FC<SmartHelpButtonProps> = ({
  context,
  helpContent,
  className
}) => {
  const { currentPage, userRole, trackHelpInteraction, helpPreferences } = useHelp();
  const [showDetailedHelp, setShowDetailedHelp] = useState(false);

  if (!helpPreferences.showTooltips) {
    return null;
  }

  const handleHelpClick = () => {
    setShowDetailedHelp(!showDetailedHelp);
    trackHelpInteraction('help_button_click', context);
  };

  return (
    <div className={className}>
      <ContextualTooltip
        content={helpContent}
        context={context}
        userRole={userRole}
        currentPage={currentPage}
        side="left"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={handleHelpClick}
          className="text-slate-400 hover:text-cyan-400 p-1"
        >
          {showDetailedHelp ? <X className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
        </Button>
      </ContextualTooltip>

      {showDetailedHelp && (
        <div className="absolute top-8 right-0 w-80 bg-slate-800 border border-slate-600 rounded-lg p-4 shadow-lg z-50">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-cyan-400">Help: {context}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetailedHelp(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-slate-300">{helpContent}</p>
            
            {userRole && (
              <div className="text-xs text-slate-500 border-t border-slate-600 pt-2">
                <p>Role: {userRole.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                <p>Page: {currentPage}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartHelpButton;
