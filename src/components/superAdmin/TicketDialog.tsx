
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTickets, SupportTicket } from '@/hooks/useTickets';
import { Clock, AlertTriangle, CheckCircle, User } from 'lucide-react';

interface TicketDialogProps {
  ticket: SupportTicket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TicketDialog: React.FC<TicketDialogProps> = ({ ticket, open, onOpenChange }) => {
  const { updateTicketStatus } = useTickets();
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  if (!ticket) return null;

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;
    
    try {
      await updateTicketStatus(ticket.id, selectedStatus);
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-slate-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-600';
      case 'in_progress': return 'bg-purple-600';
      case 'resolved': return 'bg-green-600';
      case 'closed': return 'bg-slate-600';
      default: return 'bg-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <AlertTriangle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      case 'closed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">{ticket.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Ticket Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400">Client</label>
              <p className="text-white">{ticket.tenant?.name || 'Unknown'}</p>
            </div>
            <div>
              <label className="text-sm text-slate-400">Company</label>
              <p className="text-white">{ticket.tenant?.company_name || 'Unknown'}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-slate-400">Priority</label>
              <div className="mt-1">
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400">Status</label>
              <div className="mt-1">
                <Badge className={getStatusColor(ticket.status)}>
                  {getStatusIcon(ticket.status)}
                  <span className="ml-1">{ticket.status.replace('_', ' ')}</span>
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400">Created</label>
              <p className="text-white">{new Date(ticket.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-slate-400">Description</label>
            <div className="mt-2 p-4 bg-slate-900 rounded-lg">
              <p className="text-white whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </div>

          {/* Status Update */}
          <div className="border-t border-slate-700 pt-4">
            <label className="text-sm text-slate-400 mb-2 block">Update Status</label>
            <div className="flex space-x-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                  <SelectValue placeholder="Select new status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleStatusUpdate}
                disabled={!selectedStatus || selectedStatus === ticket.status}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Update Status
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TicketDialog;
