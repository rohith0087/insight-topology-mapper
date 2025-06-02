
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user info
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    // Get user's tenant
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('tenant_id')
      .eq('id', user.id)
      .single()

    if (!profile?.tenant_id) {
      throw new Error('No tenant found for user')
    }

    // Calculate current metrics
    const { data: metricsData, error: metricsError } = await supabaseClient
      .rpc('calculate_executive_metrics', { p_tenant_id: profile.tenant_id })

    if (metricsError) {
      throw metricsError
    }

    // Store metrics in database
    const today = new Date().toISOString().split('T')[0]
    
    const metricTypes = [
      'security_score',
      'network_health', 
      'uptime_percentage',
      'incidents_resolved',
      'cost_savings',
      'compliance_score'
    ]

    for (const metricType of metricTypes) {
      if (metricsData[metricType] !== undefined) {
        await supabaseClient
          .from('executive_metrics')
          .upsert({
            tenant_id: profile.tenant_id,
            metric_type: metricType,
            metric_value: { value: metricsData[metricType], timestamp: new Date().toISOString() },
            calculation_date: today
          }, {
            onConflict: 'tenant_id,metric_type,calculation_date'
          })
      }
    }

    // Get historical data for trends (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: historicalData } = await supabaseClient
      .from('executive_metrics')
      .select('*')
      .eq('tenant_id', profile.tenant_id)
      .gte('calculation_date', thirtyDaysAgo.toISOString().split('T')[0])
      .order('calculation_date', { ascending: true })

    // Format response with trends
    const formatMetricsWithTrends = (current: any, historical: any[]) => {
      const getTrend = (metricType: string) => {
        const values = historical
          .filter(h => h.metric_type === metricType)
          .map(h => h.metric_value.value)
        
        if (values.length < 2) return { trend: 'stable', change: 0 }
        
        const current = values[values.length - 1]
        const previous = values[values.length - 2]
        const change = ((current - previous) / previous) * 100
        
        return {
          trend: change > 2 ? 'up' : change < -2 ? 'down' : 'stable',
          change: Math.round(change * 10) / 10
        }
      }

      return {
        overview: {
          total_nodes: current.total_nodes,
          critical_nodes: current.critical_nodes,
          healthy_nodes: current.healthy_nodes,
          total_connections: current.total_connections
        },
        kpis: [
          {
            title: 'Security Score',
            value: current.security_score,
            unit: '%',
            trend: getTrend('security_score'),
            target: 95,
            status: current.security_score >= 95 ? 'excellent' : current.security_score >= 80 ? 'good' : 'needs_attention'
          },
          {
            title: 'Network Health',
            value: current.network_health,
            unit: '%',
            trend: getTrend('network_health'),
            target: 98,
            status: current.network_health >= 98 ? 'excellent' : current.network_health >= 90 ? 'good' : 'needs_attention'
          },
          {
            title: 'Uptime',
            value: current.uptime_percentage,
            unit: '%',
            trend: getTrend('uptime_percentage'),
            target: 99.9,
            status: current.uptime_percentage >= 99.9 ? 'excellent' : current.uptime_percentage >= 99 ? 'good' : 'needs_attention'
          },
          {
            title: 'Compliance Score',
            value: current.compliance_score,
            unit: '%',
            trend: getTrend('compliance_score'),
            target: 95,
            status: current.compliance_score >= 95 ? 'excellent' : current.compliance_score >= 85 ? 'good' : 'needs_attention'
          }
        ],
        financial: {
          cost_savings: current.cost_savings,
          incidents_resolved: current.incidents_resolved,
          estimated_roi: current.cost_savings * 1.2 // Simple ROI calculation
        },
        alerts: {
          critical: current.critical_nodes,
          high_priority: Math.max(0, current.total_nodes - current.healthy_nodes - current.critical_nodes),
          total_active: current.critical_nodes + Math.max(0, current.total_nodes - current.healthy_nodes - current.critical_nodes)
        }
      }
    }

    const formattedMetrics = formatMetricsWithTrends(metricsData, historicalData || [])

    return new Response(
      JSON.stringify({
        success: true,
        metrics: formattedMetrics,
        last_updated: new Date().toISOString(),
        tenant_id: profile.tenant_id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Executive metrics error:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
