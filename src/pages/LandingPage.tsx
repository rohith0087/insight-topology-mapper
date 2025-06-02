
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Network, 
  Shield, 
  Eye, 
  Zap, 
  Users, 
  BarChart3,
  ArrowRight,
  CheckCircle,
  Globe,
  Lock,
  TrendingUp
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If user is already logged in, redirect to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Network,
      title: "Network Topology Mapping",
      description: "Visualize your entire network infrastructure with real-time topology mapping and automated discovery."
    },
    {
      icon: Shield,
      title: "Multi-Source Security Intelligence",
      description: "Integrate data from multiple security tools and platforms for comprehensive threat visibility."
    },
    {
      icon: Eye,
      title: "Real-time Monitoring",
      description: "Monitor network health, security posture, and performance metrics in real-time."
    },
    {
      icon: Zap,
      title: "Automated Response",
      description: "Configure automated responses to security incidents and network anomalies."
    },
    {
      icon: Users,
      title: "Multi-Tenant Management",
      description: "Manage multiple organizations and teams with role-based access controls."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Gain insights with AI-powered analytics and customizable dashboards."
    }
  ];

  const benefits = [
    "Centralized security operations center",
    "Reduced mean time to detection",
    "Automated threat response",
    "Compliance reporting & auditing",
    "Scalable multi-tenant architecture",
    "24/7 monitoring & alerting"
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Network className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold text-cyan-400">LumenNet</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/auth')}
                className="text-slate-300 hover:text-white"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate('/auth')}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Unified Security
              <span className="text-cyan-400 block">Operations Center</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Transform your cybersecurity operations with LumenNet's comprehensive platform 
              that unifies network topology mapping, threat intelligence, and real-time monitoring 
              in one powerful solution.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 text-lg"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-3 text-lg"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">99.9%</div>
              <div className="text-slate-300">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">50%</div>
              <div className="text-slate-300">Faster Threat Detection</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">24/7</div>
              <div className="text-slate-300">Monitoring & Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Comprehensive Security Platform
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Everything you need to build, monitor, and secure your network infrastructure 
              from a single, intuitive dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-slate-700 border-slate-600 hover:bg-slate-650 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-6">
                Why Choose LumenNet?
              </h2>
              <p className="text-lg text-slate-300 mb-8">
                Built by security professionals for security teams, LumenNet provides 
                the tools and insights you need to stay ahead of evolving threats.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700 p-6 text-center">
                <Globe className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-2">Global</div>
                <div className="text-slate-300 text-sm">Worldwide Infrastructure</div>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700 p-6 text-center">
                <Lock className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-2">Secure</div>
                <div className="text-slate-300 text-sm">Enterprise-Grade Security</div>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700 p-6 text-center">
                <TrendingUp className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-2">Scalable</div>
                <div className="text-slate-300 text-sm">Grows With Your Business</div>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700 p-6 text-center">
                <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-2">Fast</div>
                <div className="text-slate-300 text-sm">Real-Time Processing</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Security Operations?
          </h2>
          <p className="text-xl text-cyan-100 mb-8">
            Join thousands of organizations already using LumenNet to secure their infrastructure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-white text-cyan-600 hover:bg-slate-100 px-8 py-3 text-lg font-semibold"
            >
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-cyan-600 px-8 py-3 text-lg"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <Network className="w-6 h-6 text-cyan-400" />
              <span className="text-xl font-bold text-cyan-400">LumenNet</span>
            </div>
            
            <div className="text-slate-400 text-sm">
              © 2024 LumenNet. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
