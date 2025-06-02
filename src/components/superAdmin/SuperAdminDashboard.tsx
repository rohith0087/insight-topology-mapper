
import React, { useState } from 'react';
import SuperAdminHeader from './SuperAdminHeader';
import SuperAdminOverview from './SuperAdminOverview';
import TenantsManagement from './TenantsManagement';
import SupportTickets from './SupportTickets';
import SystemHealth from './SystemHealth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white">
      <SuperAdminHeader />
      
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b border-slate-700 px-6">
            <TabsList className="bg-slate-800 border-slate-600">
              <TabsTrigger value="overview" className="data-[state=active]:bg-slate-700">
                Overview
              </TabsTrigger>
              <TabsTrigger value="tenants" className="data-[state=active]:bg-slate-700">
                Client Management
              </TabsTrigger>
              <TabsTrigger value="support" className="data-[state=active]:bg-slate-700">
                Support Tickets
              </TabsTrigger>
              <TabsTrigger value="health" className="data-[state=active]:bg-slate-700">
                System Health
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="overview" className="h-full m-0">
              <SuperAdminOverview />
            </TabsContent>
            
            <TabsContent value="tenants" className="h-full m-0">
              <TenantsManagement />
            </TabsContent>
            
            <TabsContent value="support" className="h-full m-0">
              <SupportTickets />
            </TabsContent>
            
            <TabsContent value="health" className="h-full m-0">
              <SystemHealth />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
