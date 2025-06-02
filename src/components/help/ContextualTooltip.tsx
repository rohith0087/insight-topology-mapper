
import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContextualTooltipProps {
  children: React.ReactNode;
  content: string;
  context?: string;
  userRole?: string;
  currentPage?: string;
  isFirstTime?: boolean;
  className?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  showIcon?: boolean;
  delayDuration?: number;
}

const ContextualTooltip: React.FC<ContextualTooltipProps> = ({
  children,
  content,
  context,
  userRole,
  currentPage,
  isFirstTime = false,
  className,
  side = 'top',
  showIcon = false,
  delayDuration = 300
}) => {
  const [isOpen, setIsOpen] = useState(isFirstTime);

  // Smart content based on context
  const getSmartContent = () => {
    let smartContent = content;
    
    // Add role-specific context
    if (userRole === 'network_admin') {
      smartContent += ' (Admin tip: You have full access to modify these settings)';
    } else if (userRole === 'viewer') {
      smartContent += ' (Note: You have read-only access to this feature)';
    }

    // Add page-specific context
    if (currentPage === 'network-topology' && context === 'filter') {
      smartContent += ' Pro tip: Use Ctrl+Click to select multiple items.';
    }

    return smartContent;
  };

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <div className={cn("relative inline-flex items-center", className)}>
            {children}
            {showIcon && (
              <HelpCircle className="w-4 h-4 ml-1 text-slate-400 hover:text-cyan-400 transition-colors" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side={side}
          className="max-w-xs bg-slate-700 text-white border-slate-600 text-sm p-3"
        >
          <div className="space-y-1">
            <p>{getSmartContent()}</p>
            {isFirstTime && (
              <p className="text-xs text-cyan-300 mt-2">💡 First time here? This tooltip will help you get started!</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ContextualTooltip;
