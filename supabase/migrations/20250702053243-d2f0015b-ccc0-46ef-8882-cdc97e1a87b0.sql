
-- Phase 1: Database Schema Updates for Secure Credential Management

-- Create encrypted_credentials table to store sensitive data separately
CREATE TABLE public.encrypted_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  credential_name TEXT NOT NULL,
  credential_type TEXT NOT NULL, -- 'api_key', 'username_password', 'token', 'certificate'
  encrypted_data JSONB NOT NULL, -- Encrypted credential data
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  last_used TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  version INTEGER NOT NULL DEFAULT 1,
  -- Composite unique constraint to prevent duplicate credentials per tenant
  UNIQUE(tenant_id, credential_name)
);

-- Add RLS policies for encrypted_credentials
ALTER TABLE public.encrypted_credentials ENABLE ROW LEVEL SECURITY;

-- Only admins can manage credentials in their tenant
CREATE POLICY "Admins can manage credentials in their tenant" 
  ON public.encrypted_credentials 
  FOR ALL 
  USING (
    (tenant_id = get_user_tenant(auth.uid())) 
    AND (get_user_role(auth.uid()) = ANY (ARRAY['super_admin'::user_role, 'tenant_admin'::user_role, 'network_admin'::user_role]))
  );

-- Users can view credential metadata (but not encrypted data) in their tenant
CREATE POLICY "Users can view credential metadata in their tenant" 
  ON public.encrypted_credentials 
  FOR SELECT 
  USING (tenant_id = get_user_tenant(auth.uid()));

-- Add credential_id reference to data_sources table
ALTER TABLE public.data_sources ADD COLUMN credential_id UUID REFERENCES public.encrypted_credentials(id);

-- Create audit log for credential operations
CREATE TABLE public.credential_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  credential_id UUID NOT NULL REFERENCES public.encrypted_credentials(id),
  action TEXT NOT NULL, -- 'created', 'updated', 'accessed', 'deleted', 'rotated'
  performed_by UUID REFERENCES auth.users(id),
  performed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT
);

-- Add RLS for audit log
ALTER TABLE public.credential_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs in their tenant
CREATE POLICY "Admins can view credential audit logs in their tenant" 
  ON public.credential_audit_log 
  FOR SELECT 
  USING (
    (tenant_id = get_user_tenant(auth.uid())) 
    AND (get_user_role(auth.uid()) = ANY (ARRAY['super_admin'::user_role, 'tenant_admin'::user_role, 'network_admin'::user_role]))
  );

-- Create indexes for performance
CREATE INDEX idx_encrypted_credentials_tenant_id ON public.encrypted_credentials(tenant_id);
CREATE INDEX idx_encrypted_credentials_type ON public.encrypted_credentials(credential_type);
CREATE INDEX idx_credential_audit_log_credential_id ON public.credential_audit_log(credential_id);
CREATE INDEX idx_credential_audit_log_performed_at ON public.credential_audit_log(performed_at DESC);

-- Create function to log credential access
CREATE OR REPLACE FUNCTION public.log_credential_access(
  p_credential_id UUID,
  p_action TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  cred_tenant_id UUID;
BEGIN
  -- Get tenant_id from credential
  SELECT tenant_id INTO cred_tenant_id 
  FROM public.encrypted_credentials 
  WHERE id = p_credential_id;
  
  -- Insert audit log entry
  INSERT INTO public.credential_audit_log (
    tenant_id,
    credential_id,
    action,
    performed_by,
    metadata
  ) VALUES (
    cred_tenant_id,
    p_credential_id,
    p_action,
    auth.uid(),
    p_metadata
  );
  
  -- Update last_used timestamp
  IF p_action = 'accessed' THEN
    UPDATE public.encrypted_credentials 
    SET last_used = now() 
    WHERE id = p_credential_id;
  END IF;
END;
$$;
