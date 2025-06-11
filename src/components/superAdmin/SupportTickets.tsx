
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTickets, SupportTicket } from '@/hooks/useTickets';
import { Search, Plus, Clock, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import TicketDialog from './TicketDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useSupportAuth } from '@/contexts/SupportAuthContext';

const SupportTickets = () => {
  const { tickets, loading, fetchTickets, createTicket } = useTickets();
  const { user: supportUser } = useSupportAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium'
  });

  const handleCreateTestTicket = async () => {
    if (!newTicket.title.trim() || !newTicket.description.trim()) return;

    try {
      await createTicket(newTicket.title, newTicket.description, newTicket.priority);
      setNewTicket({ title: '', description: '', priority: 'medium' });
      setCreateDialogOpen(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.tenant?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

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

  const handleViewTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setTicketDialogOpen(true);
  };

  console.log('=== SUPPORT TICKETS COMPONENT DEBUG ===');
  console.log('Support user:', supportUser);
  console.log('Loading:', loading);
  console.log('Tickets:', tickets);
  console.log('Filtered tickets:', filteredTickets);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-600 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-800 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Support Tickets</h2>
          <p className="text-slate-400">
            Manage customer support requests and issues
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={fetchTickets} variant="outline" className="border-slate-600 text-slate-300 hover:text-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          {supportUser && (
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Test Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-800 border-slate-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Create Test Support Ticket</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">
                      Title
                    </label>
                    <Input
                      value={newTicket.title}
                      onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                      placeholder="Brief description of the issue"
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">
                      Description
                    </label>
                    <Textarea
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                      placeholder="Detailed description of the issue..."
                      rows={4}
                      className="bg-slate-900 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-300 mb-2 block">
                      Priority
                    </label>
                    <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
                      <SelectTrigger className="bg-slate-900 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTestTicket} className="bg-blue-600 hover:bg-blue-700">
                      Create Ticket
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Debug Information */}
      {supportUser && (
        <Card className="bg-slate-900 border-yellow-600">
          <CardHeader>
            <CardTitle className="text-yellow-400 text-sm">Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-slate-300 space-y-1">
              <p>Support User: {supportUser ? 'Yes' : 'No'}</p>
              <p>Total Tickets in DB: {tickets.length}</p>
              <p>Filtered Tickets: {filteredTickets.length}</p>
              <p>Loading: {loading ? 'Yes' : 'No'}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="text-white">All Tickets ({filteredTickets.length})</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-900 border-slate-600 text-white"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-slate-900 border-slate-600 text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32 bg-slate-900 border-slate-600 text-white">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTickets.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-slate-400 mb-4">
                {tickets.length === 0 ? (
                  <>
                    <Clock className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                    <p className="text-lg mb-2">No support tickets found</p>
                    <p className="text-sm">No tickets exist in the database yet.</p>
                    {supportUser && (
                      <p className="text-xs mt-2 text-blue-400">Click "Create Test Ticket" to add some sample data.</p>
                    )}
                  </>
                ) : (
                  <>
                    <Search className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                    <p className="text-lg mb-2">No tickets match your filters</p>
                    <p className="text-sm">Try adjusting your search criteria.</p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Ticket</TableHead>
                  <TableHead className="text-slate-300">Client</TableHead>
                  <TableHead className="text-slate-300">Priority</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Created</TableHead>
                  <TableHead className="text-slate-300">Updated</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id} className="border-slate-700">
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{ticket.title}</p>
                        <p className="text-sm text-slate-400 line-clamp-1">
                          {ticket.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-white">{ticket.tenant?.name || 'Unknown'}</p>
                        <p className="text-sm text-slate-400">{ticket.tenant?.company_name || 'No company'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(ticket.status)}>
                          {getStatusIcon(ticket.status)}
                          <span className="ml-1">{ticket.status.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {new Date(ticket.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-slate-300 hover:text-white"
                        onClick={() => handleViewTicket(ticket)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <TicketDialog
        ticket={selectedTicket}
        open={ticketDialogOpen}
        onOpenChange={setTicketDialogOpen}
      />
    </div>
  );
};

export default SupportTickets;
