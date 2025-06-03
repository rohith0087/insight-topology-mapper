
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, Shield, Zap, Globe, Users, BarChart3, Lock, CheckCircle, ArrowRight, Star, Play, ChevronRight, Building, Cpu, Cloud, Database } from 'lucide-react';

const LumenNetLanding: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Network className="w-6 h-6" />,
      title: "Network Discovery",
      description: "Automatically discover and map your entire network infrastructure with advanced scanning capabilities."
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Security Monitoring",
      description: "Real-time threat detection and vulnerability assessment across all network endpoints."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Performance Analytics",
      description: "Monitor network performance, bandwidth utilization, and identify bottlenecks instantly."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Multi-Cloud Support",
      description: "Unified visibility across AWS, Azure, GCP, and on-premises infrastructure."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Team Collaboration",
      description: "Role-based access control and collaborative incident response workflows."
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Executive Dashboards",
      description: "High-level insights and KPIs for strategic decision making and compliance reporting."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CISO",
      company: "TechCorp Inc.",
      content: "LumenNet transformed our security operations. We now have complete visibility into our network infrastructure.",
      rating: 5
    },
    {
      name: "Michael Rodriguez",
      role: "Network Administrator", 
      company: "Global Systems Ltd.",
      content: "The automated discovery feature saved us weeks of manual mapping. Incredible tool for network management.",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "IT Director",
      company: "Innovation Labs",
      content: "Best investment we've made for our IT infrastructure. The real-time monitoring is game-changing.",
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 100 network nodes",
        "Basic monitoring & alerts",
        "Email support",
        "Standard integrations",
        "7-day data retention"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      description: "Advanced features for growing organizations",
      features: [
        "Up to 1,000 network nodes",
        "Advanced threat detection",
        "24/7 priority support",
        "Custom integrations",
        "30-day data retention",
        "Team collaboration tools"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Tailored solutions for large enterprises",
      features: [
        "Unlimited network nodes",
        "AI-powered analytics",
        "Dedicated support team",
        "Custom development",
        "Unlimited data retention",
        "Advanced compliance features"
      ],
      popular: false
    }
  ];

  const integrations = [
    { name: "AWS", icon: <Cloud className="w-8 h-8" /> },
    { name: "Azure", icon: <Cloud className="w-8 h-8" /> },
    { name: "Splunk", icon: <Database className="w-8 h-8" /> },
    { name: "Datadog", icon: <BarChart3 className="w-8 h-8" /> },
    { name: "Sentinel", icon: <Shield className="w-8 h-8" /> },
    { name: "QRadar", icon: <Network className="w-8 h-8" /> }
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-950 text-white relative selection:bg-cyan-500 selection:text-white overflow-x-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 opacity-20 -z-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(56, 189, 248, 0.07) 1px, transparent 1px),
                linear-gradient(90deg, rgba(56, 189, 248, 0.07) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 via-transparent to-purple-600/5" />
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl animate-pulse opacity-50"></div>
          <div className="absolute -bottom-32 -left-40 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl animate-pulse opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-500/5 blur-3xl animate-pulse opacity-30"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-50 px-6 py-4 border-b border-gray-800/50 backdrop-blur-lg bg-gray-950/80">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight">LumenNet</h1>
                <p className="text-xs text-gray-400 -mt-1">Security Operations Center</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">Features</a>
              <a href="#testimonials" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">Testimonials</a>
              <a href="#pricing" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">Pricing</a>
              <a href="#integrations" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">Integrations</a>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/auth')}
                className="text-gray-300 hover:text-cyan-400 hover:bg-gray-800/50 transition-colors"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium px-6 py-2 transition-all shadow-lg hover:shadow-cyan-500/30"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-20 pb-32 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <Badge className="mb-6 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20 transition-colors">
              <Zap className="w-3 h-3 mr-1" />
              Next-Generation Network Security
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
              Unified Security
              <br />
              Operations Center
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Discover, monitor, and secure your entire network infrastructure with advanced AI-powered analytics and real-time threat detection.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold px-8 py-4 text-lg transition-all shadow-xl hover:shadow-cyan-500/30 group"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:text-white px-8 py-4 text-lg transition-all group"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {[
                { number: "99.9%", label: "Uptime" },
                { number: "50K+", label: "Networks Secured" },
                { number: "<5min", label: "Average Response" },
                { number: "500+", label: "Enterprise Clients" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-cyan-400 mb-1">{stat.number}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20">
                <Shield className="w-3 h-3 mr-1" />
                Core Features
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Everything You Need for
                <br />
                Network Security
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Comprehensive network visibility, threat detection, and security analytics in one unified platform
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="bg-gray-900/60 backdrop-blur-lg border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300 group hover:bg-gray-900/80">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition-all">
                      <div className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
                        {feature.icon}
                      </div>
                    </div>
                    <CardTitle className="text-white text-xl font-semibold group-hover:text-cyan-400 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 px-6 bg-gray-900/30 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-green-500/10 text-green-400 border-green-500/20">
                <Users className="w-3 h-3 mr-1" />
                Customer Stories
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Trusted by Security Leaders
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                See how organizations worldwide are securing their networks with LumenNet
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="bg-gray-900/60 backdrop-blur-lg border-gray-700/50 hover:border-green-500/50 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <CardDescription className="text-gray-300 leading-relaxed italic">
                      "{testimonial.content}"
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="pt-4 border-t border-gray-700">
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm">{testimonial.role}</div>
                      <div className="text-cyan-400 text-sm">{testimonial.company}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Integrations Section */}
        <section id="integrations" className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
                <Building className="w-3 h-3 mr-1" />
                Integrations
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Connect Your Existing Tools
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Seamlessly integrate with your current security stack and infrastructure
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
              {integrations.map((integration, index) => (
                <div key={index} className="flex flex-col items-center group">
                  <div className="w-16 h-16 bg-gray-800/60 backdrop-blur-lg border border-gray-700/50 rounded-xl flex items-center justify-center mb-3 group-hover:border-cyan-500/50 group-hover:bg-gray-800/80 transition-all">
                    <div className="text-gray-400 group-hover:text-cyan-400 transition-colors">
                      {integration.icon}
                    </div>
                  </div>
                  <span className="text-gray-400 font-medium group-hover:text-white transition-colors">{integration.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6 bg-gray-900/30 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                <BarChart3 className="w-3 h-3 mr-1" />
                Pricing Plans
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Choose Your Plan
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Flexible pricing options to fit organizations of all sizes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <Card key={index} className={`relative bg-gray-900/60 backdrop-blur-lg border-gray-700/50 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-cyan-500/50 scale-105 bg-gray-900/80' 
                    : 'hover:border-gray-600/50 hover:bg-gray-900/80'
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold text-white mb-2">{plan.name}</CardTitle>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-cyan-400">{plan.price}</span>
                      {plan.period && <span className="text-gray-400 text-lg">{plan.period}</span>}
                    </div>
                    <CardDescription className="text-gray-400">{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`w-full font-semibold py-3 transition-all ${
                        plan.popular
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg hover:shadow-cyan-500/30'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-600'
                      }`}
                      onClick={() => navigate('/auth')}
                    >
                      {plan.price === "Custom" ? "Contact Sales" : "Start Free Trial"}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-cyan-600/10 to-purple-600/10 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Ready to Secure Your Network?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of organizations that trust LumenNet to protect their critical infrastructure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold px-8 py-4 text-lg transition-all shadow-xl hover:shadow-cyan-500/30 group"
                >
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:text-white px-8 py-4 text-lg transition-all"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800/50 py-12 px-6 bg-gray-950/80 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Network className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">LumenNet</span>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-cyan-400 transition-colors">Support</a>
                <span>© 2024 LumenNet Technologies, Inc.</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LumenNetLanding;
