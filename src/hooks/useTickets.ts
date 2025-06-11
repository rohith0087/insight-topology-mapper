
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useSupportAuth } from '@/contexts/SupportAuthContext';

export interface SupportTicket {
  id: string;
  tenant_id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  created_by?: string;
  assigned_to?: string;
  metadata?: any;
  tags?: any;
  tenant?: {
    name: string;
    company_name: string;
  };
}

export const useTickets = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { profile } = useAuth();
  const { user: supportUser } = useSupportAuth();

  const fetchTickets = async () => {
    try {
      setLoading(true);
      console.log('=== DETAILED TICKETS FETCH DEBUG ===');
      console.log('Profile object:', JSON.stringify(profile, null, 2));
      console.log('Support User object:', JSON.stringify(supportUser, null, 2));
      console.log('Profile tenant_id:', profile?.tenant_id);
      console.log('Is Support Admin?:', !!supportUser);
      
      // First, let's see what's in the support_tickets table
      console.log('--- CHECKING ALL TICKETS IN DATABASE ---');
      const { data: allTicketsCheck, error: allTicketsError } = await supabase
        .from('support_tickets')
        .select('id, tenant_id, title, status, created_at')
        .order('created_at', { ascending: false });
      
      if (allTicketsError) {
        console.error('Error checking all tickets:', allTicketsError);
      } else {
        console.log('ALL TICKETS IN DATABASE:', allTicketsCheck);
        console.log('Total tickets in database:', allTicketsCheck?.length || 0);
      }

      // Now build the actual query
      let query = supabase
        .from('support_tickets')
        .select(`
          *,
          tenant:tenants(name, company_name)
        `)
        .order('created_at', { ascending: false });

      // If this is NOT a support admin, filter by tenant
      if (!supportUser && profile?.tenant_id) {
        console.log('=== APPLYING TENANT FILTER ===');
        console.log('Filtering by tenant_id:', profile.tenant_id);
        query = query.eq('tenant_id', profile.tenant_id);
      } else {
        console.log('=== NO TENANT FILTER (SUPPORT ADMIN OR NO PROFILE) ===');
        if (supportUser) {
          console.log('Support admin - showing all tickets');
        } else {
          console.log('No profile or tenant_id - this might be the issue!');
        }
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching tickets with query:', error);
        throw error;
      }
      
      console.log('=== QUERY RESULTS ===');
      console.log('Raw ticket data from filtered query:', data);
      console.log('Number of tickets from filtered query:', data?.length || 0);
      
      // Let's also check what tenants exist
      const { data: tenantsData, error: tenantsError } = await supabase
        .from('tenants')
        .select('id, name, company_name');
      
      if (tenantsError) {
        console.error('Error fetching tenants:', tenantsError);
      } else {
        console.log('AVAILABLE TENANTS:', tenantsData);
      }
      
      const typedTickets = (data || []).map(ticket => ({
        ...ticket,
        priority: ticket.priority as SupportTicket['priority'],
        status: ticket.status as SupportTicket['status'],
      }));
      
      console.log('=== FINAL PROCESSED TICKETS ===');
      console.log('Processed tickets for display:', typedTickets);
      setTickets(typedTickets);
    } catch (error: any) {
      console.error('Error fetching tickets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tickets: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTicket = async (title: string, description: string, priority: string = 'medium') => {
    try {
      console.log('Creating ticket:', { title, description, priority });
      const { data, error } = await supabase.rpc('create_support_ticket', {
        p_title: title,
        p_description: description,
        p_priority: priority
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Support ticket created successfully",
      });
      
      fetchTickets(); // Refresh the list
      return data;
    } catch (error: any) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create ticket",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string, assignedTo?: string) => {
    try {
      const { data, error } = await supabase.rpc('update_ticket_status', {
        p_ticket_id: ticketId,
        p_status: status,
        p_assigned_to: assignedTo || null
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Ticket updated successfully",
      });
      
      fetchTickets(); // Refresh the list
      return data;
    } catch (error: any) {
      console.error('Error updating ticket:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update ticket",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    console.log('=== useTickets useEffect triggered ===');
    console.log('Dependencies - profile?.tenant_id:', profile?.tenant_id);
    console.log('Dependencies - supportUser:', supportUser);
    fetchTickets();
  }, [profile?.tenant_id, supportUser]);

  return {
    tickets,
    loading,
    fetchTickets,
    createTicket,
    updateTicketStatus,
  };
};
