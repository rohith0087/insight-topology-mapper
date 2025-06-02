
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, AlertTriangle } from 'lucide-react';

interface TenantDetails {
  tenant_id: string;
  tenant_name: string;
  tenant_slug: string;
  company_name: string;
  domain: string;
  is_active: boolean;
  user_count: number;
  data_source_count: number;
  last_activity: string;
  health_score: number;
  open_tickets: number;
}

interface CreateTicketDialogProps {
  tenant: TenantDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTicketCreated?: () => void;
}

const CreateTicketDialog: React.FC<CreateTicketDialogProps> = ({ 
  tenant, 
  open, 
  onOpenChange, 
  onTicketCreated 
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant || !formData.title.trim() || !formData.description.trim()) return;

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          tenant_id: tenant.tenant_id,
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          status: 'open'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Support ticket created successfully",
      });

      // Reset form
      setFormData({ title: '', description: '', priority: 'medium' });
      onOpenChange(false);
      onTicketCreated?.();
    } catch (error: any) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create ticket",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!tenant) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Create Support Ticket - {tenant.tenant_name}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Brief description of the issue"
              className="bg-slate-900 border-slate-600 text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detailed description of the issue..."
              rows={4}
              className="bg-slate-900 border-slate-600 text-white"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Priority
            </label>
            <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
              <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
                    Critical
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading || !formData.title.trim() || !formData.description.trim()}
            >
              {loading ? 'Creating...' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketDialog;
