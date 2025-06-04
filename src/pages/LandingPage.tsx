
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Network, Shield, Brain, BarChart3, Users, Database, ArrowRight, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect authenticated users to the app
  React.useEffect(() => {
    if (!loading && user) {
      navigate('/app');
    }
  }, [user, loading, navigate]);

  const features = [
    {
      icon: Network,
      title: "Network Topology Mapping",
      description: "Automatically discover and visualize your entire network infrastructure in real-time"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get intelligent recommendations and threat analysis powered by advanced machine learning"
    },
    {
      icon: Shield,
      title: "Security Operations Center",
      description: "Centralized security monitoring with automated threat detection and response"
    },
    {
      icon: BarChart3,
      title: "Executive Dashboard",
      description: "High-level metrics and KPIs for informed decision making"
    },
    {
      icon: Users,
      title: "Multi-Tenant Management",
      description: "Secure, scalable platform supporting multiple organizations and user roles"
    },
    {
      icon: Database,
      title: "Data Source Integration",
      description: "Connect with popular security tools like Splunk, QRadar, Sentinel, and more"
    }
  ];

  const benefits = [
    "Real-time network visibility and monitoring",
    "Automated threat detection and response",
    "Comprehensive security analytics",
    "Scalable multi-tenant architecture",
    "AI-driven insights and recommendations",
    "Integration with existing security tools"
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Background Grid */}
      <div className="fixed inset-0 opacity-10 -z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Header */}
      <nav className="relative z-10 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Network className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">LumenNet</span>
              <span className="hidden sm:inline text-xs text-gray-500 ml-1 pt-0.5">SOC Intelligence Platform</span>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate('/auth')}
                variant="outline"
                className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
            AI-Powered Security
            <br />
            Operations Center
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your network security with intelligent monitoring, automated threat detection, 
            and comprehensive visibility across your entire infrastructure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-xl shadow-cyan-500/25 px-8 py-4 text-lg"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 px-8 py-4 text-lg"
            >
              Watch Demo
            </Button>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8 shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center border border-gray-600">
                <div className="text-center">
                  <Network className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                  <p className="text-gray-400">Network Topology Visualization</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Comprehensive Security Platform</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to monitor, analyze, and protect your network infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-white">Why Choose LumenNet?</h2>
              <p className="text-xl text-gray-300 mb-8">
                Built for modern security teams who need comprehensive visibility, 
                intelligent automation, and scalable architecture.
              </p>
              
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                onClick={() => navigate('/auth')}
                className="mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300">Network Health: 98.5%</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className="text-gray-300">Active Monitoring: 1,247 devices</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300">Threats Detected: 15 (resolved)</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className="text-gray-300">AI Insights: 8 recommendations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-600/10 to-blue-600/10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4 text-white">Ready to Secure Your Network?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of security professionals who trust LumenNet to protect their infrastructure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-xl shadow-cyan-500/25 px-8 py-4 text-lg"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 px-8 py-4 text-lg"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Network className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">LumenNet</span>
            </div>
            
            <p className="text-gray-400">
              © 2024 LumenNet. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
