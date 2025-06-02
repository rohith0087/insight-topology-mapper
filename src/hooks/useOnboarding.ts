
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  component?: string;
  isOptional?: boolean;
  estimatedTime?: string;
}

export interface OnboardingProgress {
  id: string;
  user_id: string;
  tenant_id: string;
  current_step: number;
  completed_steps: number[];
  onboarding_data: Record<string, any>;
  is_completed: boolean;
  started_at: string;
  completed_at?: string;
  updated_at: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 1,
    title: "Welcome to LumenNet",
    description: "Let's get you started with your network visualization platform",
    component: "welcome",
    estimatedTime: "2 min"
  },
  {
    id: 2,
    title: "Connect Your First Data Source",
    description: "Connect a data source to start discovering your network",
    component: "data-source",
    estimatedTime: "5 min"
  },
  {
    id: 3,
    title: "Explore Network Topology",
    description: "Learn how to navigate and interact with your network topology",
    component: "topology-tour",
    estimatedTime: "3 min"
  },
  {
    id: 4,
    title: "Set Up Monitoring & Alerts",
    description: "Configure monitoring preferences and alert thresholds",
    component: "monitoring-setup",
    isOptional: true,
    estimatedTime: "5 min"
  },
  {
    id: 5,
    title: "Customize Your Dashboard",
    description: "Personalize your dashboard and explore advanced features",
    component: "dashboard-setup",
    isOptional: true,
    estimatedTime: "3 min"
  }
];

export const useOnboarding = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(false);

  // Get current onboarding progress
  const { data: progress, isLoading } = useQuery({
    queryKey: ['onboarding-progress'],
    queryFn: async (): Promise<OnboardingProgress | null> => {
      console.log('Fetching onboarding progress...');
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log('No onboarding record exists yet');
          // No onboarding record exists yet
          return null;
        }
        console.error('Error fetching onboarding progress:', error);
        throw error;
      }

      console.log('Raw onboarding data from DB:', data);

      // Transform the data to match our interface, handling Json types properly
      const transformedData = {
        ...data,
        completed_steps: Array.isArray(data.completed_steps) 
          ? data.completed_steps as number[]
          : typeof data.completed_steps === 'string' 
          ? JSON.parse(data.completed_steps) 
          : [],
        onboarding_data: typeof data.onboarding_data === 'object' 
          ? data.onboarding_data as Record<string, any>
          : {}
      } as OnboardingProgress;

      console.log('Transformed onboarding progress:', transformedData);
      return transformedData;
    },
  });

  // Update onboarding progress
  const updateProgressMutation = useMutation({
    mutationFn: async ({ step, stepData }: { step: number; stepData?: Record<string, any> }) => {
      console.log('Updating onboarding progress:', { step, stepData });
      
      const { data, error } = await supabase
        .rpc('update_onboarding_progress', {
          p_step: step,
          p_step_data: stepData || {}
        });

      if (error) {
        console.error('Onboarding update error:', error);
        throw error;
      }

      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress'] });
      
      const stepInfo = ONBOARDING_STEPS.find(s => s.id === variables.step);
      if (stepInfo) {
        toast({
          title: "Progress Saved",
          description: `Completed: ${stepInfo.title}`,
        });
      }

      // Check if onboarding is complete
      if (variables.step >= ONBOARDING_STEPS.length) {
        toast({
          title: "Onboarding Complete! 🎉",
          description: "You're all set up and ready to explore LumenNet",
        });
        setIsOnboardingVisible(false);
      }
    },
    onError: (error) => {
      console.error('Failed to update onboarding progress:', error);
      toast({
        title: "Progress Save Failed",
        description: error.message || "Failed to save your progress",
        variant: "destructive",
      });
    },
  });

  // Start onboarding
  const startOnboarding = () => {
    console.log('Starting onboarding, current progress:', progress);
    console.log('Setting isOnboardingVisible to true');
    setIsOnboardingVisible(true);
    
    // If no progress exists, create initial progress
    if (!progress) {
      console.log('No progress found, creating initial progress');
      updateProgressMutation.mutate({ step: 1 });
    }
  };

  // Complete step
  const completeStep = (step: number, stepData?: Record<string, any>) => {
    updateProgressMutation.mutate({ step, stepData });
  };

  // Skip onboarding
  const skipOnboarding = () => {
    updateProgressMutation.mutate({ step: ONBOARDING_STEPS.length, stepData: { skipped: true } });
    setIsOnboardingVisible(false);
  };

  // Get current step info
  const getCurrentStep = (): OnboardingStep | null => {
    if (!progress) return ONBOARDING_STEPS[0];
    return ONBOARDING_STEPS.find(step => step.id === progress.current_step) || null;
  };

  // Check if step is completed
  const isStepCompleted = (stepId: number): boolean => {
    return progress?.completed_steps.includes(stepId) || false;
  };

  // Calculate completion percentage
  const getCompletionPercentage = (): number => {
    if (!progress) return 0;
    return Math.round((progress.completed_steps.length / ONBOARDING_STEPS.length) * 100);
  };

  console.log('useOnboarding state:', {
    isOnboardingVisible,
    progress,
    isLoading
  });

  return {
    steps: ONBOARDING_STEPS,
    progress,
    isLoading,
    isOnboardingVisible,
    setIsOnboardingVisible,
    currentStep: getCurrentStep(),
    completionPercentage: getCompletionPercentage(),
    isStepCompleted,
    startOnboarding,
    completeStep,
    skipOnboarding,
    isUpdating: updateProgressMutation.isPending
  };
};
