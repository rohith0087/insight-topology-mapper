
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { NetworkAnalysisRequest, NetworkInsight } from '@/types/dataReconciliation';

export const useNetworkAnalysis = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (request: NetworkAnalysisRequest) => {
      console.log('Sending network analysis request:', request);
      
      const { data, error } = await supabase.functions.invoke('network-ai-analysis', {
        body: request
      });

      if (error) {
        console.error('Network analysis error:', error);
        throw error;
      }

      console.log('Network analysis response:', data);
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis Complete",
        description: "Network analysis has been generated successfully",
      });
    },
    onError: (error) => {
      console.error('Network analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze network",
        variant: "destructive",
      });
    },
  });
};

export const useNetworkInsights = () => {
  const [insights, setInsights] = useState<NetworkInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateInsights = async (analysisType: string = 'overview') => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('network-ai-analysis', {
        body: {
          analysis_type: analysisType,
          include_metrics: true
        }
      });

      if (error) throw error;

      if (data.insights) {
        setInsights(data.insights);
      }

      return data;
    } catch (error) {
      console.error('Error generating insights:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearInsights = () => {
    setInsights([]);
  };

  return {
    insights,
    isLoading,
    generateInsights,
    clearInsights
  };
};

export const useNetworkReports = () => {
  const generateReport = async (
    reportType: 'executive' | 'technical' | 'security' | 'performance',
    clientContext?: Record<string, any>
  ) => {
    const analysisRequests = {
      executive: {
        analysis_type: 'overview' as const,
        include_metrics: true,
        client_context: { report_level: 'executive', ...clientContext }
      },
      technical: {
        analysis_type: 'topology' as const,
        include_metrics: true,
        client_context: { report_level: 'technical', ...clientContext }
      },
      security: {
        analysis_type: 'security' as const,
        include_metrics: true,
        client_context: { report_level: 'security', ...clientContext }
      },
      performance: {
        analysis_type: 'performance' as const,
        include_metrics: true,
        client_context: { report_level: 'performance', ...clientContext }
      }
    };

    const request = analysisRequests[reportType];
    
    const { data, error } = await supabase.functions.invoke('network-ai-analysis', {
      body: request
    });

    if (error) throw error;

    return {
      ...data,
      report_type: reportType,
      generated_at: new Date().toISOString()
    };
  };

  return { generateReport };
};
