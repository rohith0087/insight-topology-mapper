
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Webhook, Plus, Trash2, TestTube, Settings, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  headers: Record<string, string>;
  enabled: boolean;
  lastTriggered?: string;
  description?: string;
}

interface WebhookManagerProps {
  onClose: () => void;
}

const AVAILABLE_EVENTS = [
  { value: 'alert.critical', label: 'Critical Alert' },
  { value: 'alert.warning', label: 'Warning Alert' },
  { value: 'device.offline', label: 'Device Offline' },
  { value: 'device.online', label: 'Device Online' },
  { value: 'network.anomaly', label: 'Network Anomaly' },
  { value: 'security.threat', label: 'Security Threat' },
  { value: 'backup.failed', label: 'Backup Failed' },
  { value: 'maintenance.scheduled', label: 'Maintenance Scheduled' }
];

const WebhookManager: React.FC<WebhookManagerProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(null);

  const [newWebhook, setNewWebhook] = useState<Partial<WebhookConfig>>({
    name: '',
    url: '',
    events: [],
    headers: {},
    enabled: true,
    description: ''
  });

  const handleCreateWebhook = () => {
    if (!newWebhook.name || !newWebhook.url) {
      toast({
        title: "Validation Error",
        description: "Name and URL are required",
        variant: "destructive"
      });
      return;
    }

    const webhook: WebhookConfig = {
      id: Date.now().toString(),
      name: newWebhook.name!,
      url: newWebhook.url!,
      events: newWebhook.events || [],
      headers: newWebhook.headers || {},
      enabled: newWebhook.enabled || true,
      description: newWebhook.description
    };

    setWebhooks([...webhooks, webhook]);
    setNewWebhook({ name: '', url: '', events: [], headers: {}, enabled: true, description: '' });
    setShowCreateDialog(false);
    
    toast({
      title: "Webhook Created",
      description: `${webhook.name} has been created successfully`
    });
  };

  const handleEditWebhook = () => {
    if (!editingWebhook || !editingWebhook.name || !editingWebhook.url) {
      toast({
        title: "Validation Error",
        description: "Name and URL are required",
        variant: "destructive"
      });
      return;
    }

    setWebhooks(webhooks.map(w => 
      w.id === editingWebhook.id ? editingWebhook : w
    ));
    setEditingWebhook(null);
    setShowEditDialog(false);
    
    toast({
      title: "Webhook Updated",
      description: `${editingWebhook.name} has been updated successfully`
    });
  };

  const handleTestWebhook = async (webhook: WebhookConfig) => {
    try {
      const testPayload = {
        event: 'webhook.test',
        timestamp: new Date().toISOString(),
        data: {
          message: 'This is a test webhook from LumenNet',
          webhook_id: webhook.id,
          webhook_name: webhook.name
        }
      };

      toast({
        title: "Testing Webhook",
        description: `Sending test request to ${webhook.name}...`
      });

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...webhook.headers
        },
        body: JSON.stringify(testPayload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      toast({
        title: "Test Successful",
        description: `${webhook.name} responded successfully`
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: `Failed to reach ${webhook.name}`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteWebhook = (id: string) => {
    const webhook = webhooks.find(w => w.id === id);
    setWebhooks(webhooks.filter(w => w.id !== id));
    toast({
      title: "Webhook Deleted",
      description: `${webhook?.name || 'Webhook'} has been removed`
    });
  };

  const toggleWebhook = (id: string) => {
    setWebhooks(webhooks.map(w => 
      w.id === id ? { ...w, enabled: !w.enabled } : w
    ));
  };

  const openEditDialog = (webhook: WebhookConfig) => {
    setEditingWebhook({ ...webhook });
    setShowEditDialog(true);
  };

  const resetNewWebhook = () => {
    setNewWebhook({ name: '', url: '', events: [], headers: {}, enabled: true, description: '' });
  };

  const resetEditWebhook = () => {
    setEditingWebhook(null);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-600 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyan-400 flex items-center">
            <Webhook className="w-6 h-6 mr-2" />
            Webhook Automation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Actions */}
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400">Automate responses to network events</p>
              <p className="text-sm text-slate-500">{webhooks.length} webhook(s) configured</p>
            </div>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Webhook
            </Button>
          </div>

          {/* Webhooks List */}
          <div className="space-y-4">
            {webhooks.map((webhook) => (
              <Card key={webhook.id} className="bg-slate-700 border-slate-600">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-lg text-white">{webhook.name}</CardTitle>
                      <Badge variant={webhook.enabled ? "default" : "secondary"}>
                        {webhook.enabled ? "Active" : "Disabled"}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestWebhook(webhook)}
                        className="border-slate-600 hover:bg-slate-600"
                      >
                        <TestTube className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(webhook)}
                        className="border-slate-600 hover:bg-slate-600"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleWebhook(webhook.id)}
                        className="border-slate-600 hover:bg-slate-600"
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteWebhook(webhook.id)}
                        className="border-slate-600 hover:bg-red-600 text-red-400 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {webhook.description && (
                    <p className="text-sm text-slate-300">{webhook.description}</p>
                  )}
                  <div>
                    <Label className="text-xs text-slate-500">URL</Label>
                    <p className="text-sm text-slate-300 font-mono bg-slate-800 p-2 rounded">
                      {webhook.url}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Triggers ({webhook.events.length})</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {webhook.events.map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {AVAILABLE_EVENTS.find(e => e.value === event)?.label || event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {webhook.lastTriggered && (
                    <p className="text-xs text-slate-500">
                      Last triggered: {new Date(webhook.lastTriggered).toLocaleString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}

            {webhooks.length === 0 && (
              <div className="text-center py-12">
                <Webhook className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-400 mb-2">No Webhooks Configured</h3>
                <p className="text-slate-500 mb-4">Get started by adding your first webhook automation</p>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-cyan-600 hover:bg-cyan-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Webhook
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Create Webhook Dialog */}
        {showCreateDialog && (
          <Dialog open={showCreateDialog} onOpenChange={(open) => {
            setShowCreateDialog(open);
            if (!open) resetNewWebhook();
          }}>
            <DialogContent className="bg-slate-800 border-slate-600">
              <DialogHeader>
                <DialogTitle className="text-xl text-cyan-400">Create New Webhook</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="webhook-name">Name</Label>
                  <Input
                    id="webhook-name"
                    value={newWebhook.name || ''}
                    onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                    placeholder="e.g., ServiceNow Integration"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div>
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    value={newWebhook.url || ''}
                    onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                    placeholder="https://your-service.com/webhook"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div>
                  <Label htmlFor="webhook-description">Description (Optional)</Label>
                  <Textarea
                    id="webhook-description"
                    value={newWebhook.description || ''}
                    onChange={(e) => setNewWebhook({ ...newWebhook, description: e.target.value })}
                    placeholder="What does this webhook do?"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div>
                  <Label>Event Triggers</Label>
                  <Select
                    onValueChange={(value) => {
                      const currentEvents = newWebhook.events || [];
                      if (!currentEvents.includes(value)) {
                        setNewWebhook({ ...newWebhook, events: [...currentEvents, value] });
                      }
                    }}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select events to trigger this webhook" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {AVAILABLE_EVENTS.map((event) => (
                        <SelectItem key={event.value} value={event.value}>
                          {event.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {newWebhook.events && newWebhook.events.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {newWebhook.events.map((event) => (
                        <Badge
                          key={event}
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-red-600"
                          onClick={() => {
                            setNewWebhook({
                              ...newWebhook,
                              events: newWebhook.events?.filter(e => e !== event) || []
                            });
                          }}
                        >
                          {AVAILABLE_EVENTS.find(e => e.value === event)?.label || event} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateDialog(false)}
                    className="border-slate-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateWebhook}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    Create Webhook
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Webhook Dialog */}
        {showEditDialog && editingWebhook && (
          <Dialog open={showEditDialog} onOpenChange={(open) => {
            setShowEditDialog(open);
            if (!open) resetEditWebhook();
          }}>
            <DialogContent className="bg-slate-800 border-slate-600">
              <DialogHeader>
                <DialogTitle className="text-xl text-cyan-400">Edit Webhook</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-webhook-name">Name</Label>
                  <Input
                    id="edit-webhook-name"
                    value={editingWebhook.name || ''}
                    onChange={(e) => setEditingWebhook({ ...editingWebhook, name: e.target.value })}
                    placeholder="e.g., ServiceNow Integration"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-webhook-url">Webhook URL</Label>
                  <Input
                    id="edit-webhook-url"
                    value={editingWebhook.url || ''}
                    onChange={(e) => setEditingWebhook({ ...editingWebhook, url: e.target.value })}
                    placeholder="https://your-service.com/webhook"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-webhook-description">Description (Optional)</Label>
                  <Textarea
                    id="edit-webhook-description"
                    value={editingWebhook.description || ''}
                    onChange={(e) => setEditingWebhook({ ...editingWebhook, description: e.target.value })}
                    placeholder="What does this webhook do?"
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div>
                  <Label>Event Triggers</Label>
                  <Select
                    onValueChange={(value) => {
                      const currentEvents = editingWebhook.events || [];
                      if (!currentEvents.includes(value)) {
                        setEditingWebhook({ ...editingWebhook, events: [...currentEvents, value] });
                      }
                    }}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue placeholder="Select events to trigger this webhook" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {AVAILABLE_EVENTS.map((event) => (
                        <SelectItem key={event.value} value={event.value}>
                          {event.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {editingWebhook.events && editingWebhook.events.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {editingWebhook.events.map((event) => (
                        <Badge
                          key={event}
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-red-600"
                          onClick={() => {
                            setEditingWebhook({
                              ...editingWebhook,
                              events: editingWebhook.events?.filter(e => e !== event) || []
                            });
                          }}
                        >
                          {AVAILABLE_EVENTS.find(e => e.value === event)?.label || event} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowEditDialog(false)}
                    className="border-slate-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditWebhook}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    Update Webhook
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WebhookManager;
