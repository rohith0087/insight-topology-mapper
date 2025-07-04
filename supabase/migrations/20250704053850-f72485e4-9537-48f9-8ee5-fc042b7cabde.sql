-- Update ETL jobs RLS policy to allow service role access
DROP POLICY IF EXISTS "Admins can manage ETL jobs in their tenant" ON public.etl_jobs;
DROP POLICY IF EXISTS "Allow read access to etl jobs" ON public.etl_jobs;
DROP POLICY IF EXISTS "Users can view ETL jobs in their tenant" ON public.etl_jobs;

-- Create new policies that allow service role to manage ETL jobs
CREATE POLICY "Service role can manage all ETL jobs" ON public.etl_jobs
FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage ETL jobs in their tenant" ON public.etl_jobs
FOR ALL
USING (
  auth.role() = 'authenticated' AND
  tenant_id = get_user_tenant(auth.uid()) AND 
  get_user_role(auth.uid()) = ANY (ARRAY['super_admin'::user_role, 'tenant_admin'::user_role, 'network_admin'::user_role])
);

CREATE POLICY "Users can view ETL jobs in their tenant" ON public.etl_jobs
FOR SELECT
USING (
  auth.role() = 'authenticated' AND
  tenant_id = get_user_tenant(auth.uid())
);

-- Update network nodes RLS policy to allow service role access
DROP POLICY IF EXISTS "Admins can manage nodes in their tenant" ON public.network_nodes;
DROP POLICY IF EXISTS "Allow read access to network nodes" ON public.network_nodes;
DROP POLICY IF EXISTS "Users can view nodes in their tenant" ON public.network_nodes;

-- Create new policies that allow service role to manage network nodes
CREATE POLICY "Service role can manage all network nodes" ON public.network_nodes
FOR ALL
USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage nodes in their tenant" ON public.network_nodes
FOR ALL
USING (
  auth.role() = 'authenticated' AND
  tenant_id = get_user_tenant(auth.uid()) AND 
  get_user_role(auth.uid()) = ANY (ARRAY['super_admin'::user_role, 'tenant_admin'::user_role, 'network_admin'::user_role])
);

CREATE POLICY "Users can view nodes in their tenant" ON public.network_nodes
FOR SELECT
USING (
  auth.role() = 'authenticated' AND
  tenant_id = get_user_tenant(auth.uid())
);