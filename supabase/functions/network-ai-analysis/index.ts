
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NetworkAnalysisRequest {
  query?: string;
  analysis_type: 'overview' | 'security' | 'performance' | 'topology' | 'custom';
  include_metrics?: boolean;
  client_context?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const requestData: NetworkAnalysisRequest = await req.json();
    console.log('Network analysis request:', requestData);

    // Fetch network topology data
    const { data: nodes, error: nodesError } = await supabaseClient
      .from('network_nodes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (nodesError) {
      console.error('Error fetching nodes:', nodesError);
      throw nodesError;
    }

    const { data: connections, error: connectionsError } = await supabaseClient
      .from('network_connections')
      .select('*')
      .order('discovered_at', { ascending: false })
      .limit(100);

    if (connectionsError) {
      console.error('Error fetching connections:', connectionsError);
      throw connectionsError;
    }

    // Fetch data quality metrics if requested
    let qualityMetrics = null;
    if (requestData.include_metrics) {
      const { data: metrics, error: metricsError } = await supabaseClient
        .from('data_quality_metrics')
        .select(`
          *,
          data_sources(name, type)
        `)
        .order('calculated_at', { ascending: false })
        .limit(50);

      if (!metricsError) {
        qualityMetrics = metrics;
      }
    }

    // Fetch data conflicts for analysis
    const { data: conflicts, error: conflictsError } = await supabaseClient
      .from('data_conflicts')
      .select('*')
      .eq('status', 'pending')
      .limit(20);

    if (conflictsError) {
      console.error('Error fetching conflicts:', conflictsError);
    }

    // Prepare network summary for AI analysis
    const networkSummary = {
      total_nodes: nodes?.length || 0,
      total_connections: connections?.length || 0,
      node_types: nodes?.reduce((acc, node) => {
        acc[node.node_type] = (acc[node.node_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {},
      connection_types: connections?.reduce((acc, conn) => {
        acc[conn.connection_type] = (acc[conn.connection_type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {},
      status_distribution: nodes?.reduce((acc, node) => {
        acc[node.status] = (acc[node.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {},
      pending_conflicts: conflicts?.length || 0,
      avg_confidence_score: nodes?.reduce((acc, node) => acc + (node.confidence_score || 0.5), 0) / (nodes?.length || 1) || 0.5
    };

    // Generate AI analysis prompt based on request type
    let systemPrompt = '';
    let userPrompt = '';

    switch (requestData.analysis_type) {
      case 'overview':
        systemPrompt = `You are a network security expert analyzing network topology. Provide a comprehensive overview of the network structure, identify patterns, and suggest improvements. Focus on network architecture, device distribution, and overall health.`;
        userPrompt = `Analyze this network topology data and provide a detailed overview:

Network Summary:
- Total Nodes: ${networkSummary.total_nodes}
- Total Connections: ${networkSummary.total_connections}
- Node Types: ${JSON.stringify(networkSummary.node_types, null, 2)}
- Connection Types: ${JSON.stringify(networkSummary.connection_types, null, 2)}
- Status Distribution: ${JSON.stringify(networkSummary.status_distribution, null, 2)}
- Pending Conflicts: ${networkSummary.pending_conflicts}
- Average Confidence Score: ${networkSummary.avg_confidence_score.toFixed(2)}

${qualityMetrics ? `Data Quality Metrics:
${qualityMetrics.map(m => `- ${m.metric_type}: ${m.metric_value}% (${m.data_sources?.name})`).join('\n')}` : ''}

Please provide:
1. Network architecture analysis
2. Device and connection distribution insights
3. Health and status assessment
4. Potential security concerns
5. Optimization recommendations`;
        break;

      case 'security':
        systemPrompt = `You are a cybersecurity expert specializing in network security analysis. Focus on identifying security vulnerabilities, attack vectors, and defensive recommendations.`;
        userPrompt = `Perform a security analysis of this network topology:

${JSON.stringify(networkSummary, null, 2)}

Recent Nodes (potential entry points):
${nodes?.slice(0, 10).map(n => `- ${n.label} (${n.node_type}, ${n.status})`).join('\n') || 'No nodes available'}

Focus on:
1. Security vulnerabilities and attack vectors
2. Network segmentation assessment
3. Device security posture
4. Critical security recommendations
5. Compliance considerations`;
        break;

      case 'performance':
        systemPrompt = `You are a network performance expert. Analyze network topology for performance bottlenecks, optimization opportunities, and capacity planning.`;
        userPrompt = `Analyze network performance characteristics:

${JSON.stringify(networkSummary, null, 2)}

Connections Analysis:
${connections?.slice(0, 10).map(c => `- ${c.connection_type} connection (${c.protocol || 'unknown protocol'})`).join('\n') || 'No connections available'}

Provide insights on:
1. Performance bottlenecks
2. Network capacity and utilization
3. Connection efficiency
4. Scalability considerations
5. Performance optimization recommendations`;
        break;

      case 'topology':
        systemPrompt = `You are a network topology expert. Analyze the network structure, connectivity patterns, and architectural design.`;
        userPrompt = `Analyze the network topology structure:

${JSON.stringify(networkSummary, null, 2)}

Network Structure:
- Nodes: ${nodes?.map(n => `${n.label} (${n.node_type})`).join(', ') || 'No nodes'}
- Connections: ${connections?.length || 0} total connections

Analyze:
1. Network topology patterns and design
2. Connectivity efficiency and redundancy
3. Network hierarchy and segmentation
4. Architectural strengths and weaknesses
5. Topology optimization suggestions`;
        break;

      case 'custom':
        systemPrompt = `You are a network analysis expert. Answer the specific question about the network topology data provided.`;
        userPrompt = `User Question: ${requestData.query || 'Please provide a general analysis'}

Network Data:
${JSON.stringify(networkSummary, null, 2)}

${requestData.client_context ? `Client Context: ${JSON.stringify(requestData.client_context, null, 2)}` : ''}

Please provide a detailed, accurate response based on the available network data.`;
        break;
    }

    console.log('Sending request to OpenAI...');

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const openAIData = await openAIResponse.json();
    const analysis = openAIData.choices[0].message.content;

    console.log('Analysis completed successfully');

    // Generate insights and recommendations
    const insights = await generateNetworkInsights(networkSummary, conflicts || []);

    const response = {
      success: true,
      analysis: analysis,
      network_summary: networkSummary,
      insights: insights,
      quality_metrics: qualityMetrics,
      timestamp: new Date().toISOString(),
      analysis_type: requestData.analysis_type
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Network analysis error:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        message: 'Network analysis failed'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function generateNetworkInsights(networkSummary: any, conflicts: any[]): any[] {
  const insights = [];

  // Critical insight for conflicts
  if (conflicts.length > 5) {
    insights.push({
      id: crypto.randomUUID(),
      title: 'High Number of Data Conflicts',
      description: `${conflicts.length} pending data conflicts detected. This may indicate inconsistent data sources or configuration issues.`,
      type: 'critical',
      confidence: 0.9,
      affected_nodes: conflicts.map(c => c.node_id || c.connection_id).filter(Boolean),
      suggested_actions: [
        'Review data source priorities',
        'Implement automatic conflict resolution',
        'Validate data source configurations'
      ],
      created_at: new Date().toISOString()
    });
  }

  // Performance insight
  if (networkSummary.avg_confidence_score < 0.6) {
    insights.push({
      id: crypto.randomUUID(),
      title: 'Low Data Confidence Scores',
      description: `Average confidence score is ${networkSummary.avg_confidence_score.toFixed(2)}, indicating potential data quality issues.`,
      type: 'warning',
      confidence: 0.8,
      affected_nodes: [],
      suggested_actions: [
        'Review data source reliability',
        'Implement data validation rules',
        'Increase monitoring frequency'
      ],
      created_at: new Date().toISOString()
    });
  }

  // Topology insight
  if (networkSummary.total_nodes > 100) {
    insights.push({
      id: crypto.randomUUID(),
      title: 'Large Network Topology',
      description: `Network has ${networkSummary.total_nodes} nodes. Consider implementing network segmentation for better management.`,
      type: 'recommendation',
      confidence: 0.7,
      affected_nodes: [],
      suggested_actions: [
        'Implement network segmentation',
        'Create node grouping strategies',
        'Consider hierarchical topology views'
      ],
      created_at: new Date().toISOString()
    });
  }

  return insights;
}
