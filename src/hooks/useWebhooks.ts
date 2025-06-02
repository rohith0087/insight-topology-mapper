
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WebhookPayload {
  event: string;
  timestamp: string;
  data: Record<string, any>;
  source: string;
}

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  headers: Record<string, string>;
  enabled: boolean;
}

export const useWebhooks = () => {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);

  const triggerWebhooks = useCallback(async (event: string, data: Record<string, any>) => {
    console.log('Triggering webhooks for event:', event, data);
    
    const matchingWebhooks = webhooks.filter(
      webhook => webhook.enabled && webhook.events.includes(event)
    );

    if (matchingWebhooks.length === 0) {
      console.log('No webhooks configured for event:', event);
      return;
    }

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data,
      source: 'lumennet'
    };

    // Execute webhooks in parallel
    const webhookPromises = matchingWebhooks.map(async (webhook) => {
      try {
        console.log(`Triggering webhook: ${webhook.name} for event: ${event}`);
        
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...webhook.headers
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        console.log(`Webhook ${webhook.name} triggered successfully`);
        return { webhook, success: true };
      } catch (error) {
        console.error(`Webhook ${webhook.name} failed:`, error);
        return { webhook, success: false, error };
      }
    });

    const results = await Promise.allSettled(webhookPromises);
    
    // Show summary toast
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    if (successful > 0) {
      toast({
        title: "Webhooks Triggered",
        description: `${successful} webhook(s) executed successfully${failed > 0 ? `, ${failed} failed` : ''}`
      });
    }

    if (failed > 0 && successful === 0) {
      toast({
        title: "Webhook Failures",
        description: `${failed} webhook(s) failed to execute`,
        variant: "destructive"
      });
    }
  }, [webhooks, toast]);

  // Convenience methods for common events
  const triggerAlert = useCallback((severity: 'critical' | 'warning', alertData: Record<string, any>) => {
    triggerWebhooks(`alert.${severity}`, alertData);
  }, [triggerWebhooks]);

  const triggerDeviceEvent = useCallback((status: 'online' | 'offline', deviceData: Record<string, any>) => {
    triggerWebhooks(`device.${status}`, deviceData);
  }, [triggerWebhooks]);

  const triggerSecurityEvent = useCallback((threatData: Record<string, any>) => {
    triggerWebhooks('security.threat', threatData);
  }, [triggerWebhooks]);

  return {
    webhooks,
    setWebhooks,
    triggerWebhooks,
    triggerAlert,
    triggerDeviceEvent,
    triggerSecurityEvent
  };
};
