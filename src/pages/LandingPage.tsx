
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Network, Shield, Activity, Database, Zap, Eye, Globe, Server, Lock, TrendingUp,
  CheckCircle, ArrowRight, Play, Menu, X, Star, Users, Clock, Target, Layers,
  GitBranch, BarChart3, Cpu, Cloud, Search, Code, Terminal, Workflow, AlertTriangle,
  ArrowDown, MousePointer, Wifi, MonitorSpeaker, FileText, Settings2, PlusCircle,
  RefreshCw, BarChartHorizontalBig, Gauge, Users2, ListChecks, Lightbulb
} from 'lucide-react';

const LumenNetLanding: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeStoryStep, setActiveStoryStep] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      const heroSection = document.getElementById('hero-section');
      const chapter1 = document.getElementById('chapter-1-ingestion');
      const chapter2 = document.getElementById('chapter-2-mapping');
      const chapter3 = document.getElementById('chapter-3-insights');
      
      if (!heroSection || !chapter1 || !chapter2 || !chapter3) return;

      const heroHeight = heroSection.offsetHeight;
      const chapter1Top = chapter1.offsetTop - window.innerHeight / 2;
      const chapter2Top = chapter2.offsetTop - window.innerHeight / 2;
      const chapter3Top = chapter3.offsetTop - window.innerHeight / 2;

      if (currentScrollY < chapter1Top) {
        setActiveStoryStep(0);
      } else if (currentScrollY >= chapter1Top && currentScrollY < chapter2Top) {
        setActiveStoryStep(1);
      } else if (currentScrollY >= chapter2Top && currentScrollY < chapter3Top) {
        setActiveStoryStep(2);
      } else if (currentScrollY >= chapter3Top) {
        setActiveStoryStep(3);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const storySteps = [
    { step: 0, label: "Ingest", icon: <Database className="w-4 h-4" /> },
    { step: 1, label: "Map", icon: <Network className="w-4 h-4" /> },
    { step: 2, label: "Analyze", icon: <Lightbulb className="w-4 h-4" /> },
    { step: 3, label: "Report", icon: <FileText className="w-4 h-4" /> }
  ];

  const dataSources = [
    { name: "Splunk SIEM Cluster", type: "SIEM", icon: <Shield className="w-6 h-6 text-orange-400" />, status: "Syncing", lastSync: "5m ago", events: "1.2M/hr" },
    { name: "AWS Prod Environment", type: "Cloud", icon: <Cloud className="w-6 h-6 text-sky-400" />, status: "Connected", lastSync: "2m ago", events: "800K/hr" },
    { name: "Internal Network Scan", type: "Scanner", icon: <Wifi className="w-6 h-6 text-teal-400" />, status: "Active", lastSync: "15m ago", events: "N/A" },
    { name: "Azure Sentinel", type: "Cloud SIEM", icon: <MonitorSpeaker className="w-6 h-6 text-indigo-400" />, status: "Pending Setup", lastSync: "Never", events: "0/hr" }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white relative selection:bg-cyan-500 selection:text-white">
      {/* Background Grid */}
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

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-gray-950/80 backdrop-blur-lg border-b border-gray-800 shadow-xl' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Network className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">LumenNet</span>
              <span className="hidden sm:inline text-xs text-gray-500 ml-1 pt-0.5">SOC Intelligence Platform</span>
            </div>

            <div className="hidden md:flex items-center space-x-1">
              {["Product", "Solutions", "Pricing", "Docs"].map(item => (
                <a key={item} href="#" className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-cyan-400 transition-colors rounded-md">
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <button 
                onClick={() => navigate('/auth')}
                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-md"
              >
                Sign in
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-md text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50"
              >
                Start Your Project
              </button>
            </div>

            <button
              className="md:hidden p-2 text-gray-300 hover:text-cyan-400"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-gray-800 py-4">
            <div className="px-4 space-y-2">
              {["Product", "Solutions", "Pricing", "Docs"].map(item => (
                <a key={item} href="#" className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-cyan-400 hover:bg-gray-800 rounded-md transition-colors">
                  {item}
                </a>
              ))}
              <button 
                onClick={() => navigate('/auth')}
                className="w-full text-left block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
              >
                Sign in
              </button>
              <button 
                onClick={() => navigate('/auth')}
                className="w-full mt-2 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-md text-base font-medium transition-colors"
              >
                Start Your Project
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero-section" className="relative pt-36 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow opacity-50"></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slower opacity-50"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-medium mb-8 shadow-sm">
              <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full mr-2.5 animate-pulse" />
              Empowering 1,200+ Security Teams Worldwide
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
              <span className="block text-gray-100">Your Security Operations,</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mt-2">
                Revealed as a Story
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              LumenNet transforms complex security data into a clear, actionable narrative.
              From initial data ingestion to executive-level insights, witness your infrastructure's security story unfold.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => navigate('/auth')}
                className="px-7 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 flex items-center transform hover:scale-105"
              >
                Begin Your Security Story
                <ArrowRight className="ml-2.5 w-5 h-5" />
              </button>
              <button className="px-7 py-3.5 border border-gray-700 hover:border-gray-600 hover:bg-gray-800/50 rounded-lg font-semibold text-lg text-gray-300 hover:text-white transition-colors flex items-center transform hover:scale-105">
                <Play className="mr-2.5 w-5 h-5 text-cyan-400" />
                Watch the Demo
              </button>
            </div>
          </div>

          {/* Story Navigation */}
          <div className="flex justify-center mt-20 mb-10">
            <div className="flex items-center space-x-2 md:space-x-3 bg-gray-900/60 backdrop-blur-md border border-gray-700/50 rounded-full p-2 md:p-3 shadow-xl">
              {storySteps.map((item, index) => (
                <React.Fragment key={index}>
                  <div className={`flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2.5 rounded-full transition-all duration-500 ease-out ${
                    activeStoryStep >= item.step ? 'bg-cyan-500/20 text-cyan-300 shadow-md' : 'text-gray-500 hover:text-gray-300'
                  }`}>
                    {React.cloneElement(item.icon, { className: `w-5 h-5 ${activeStoryStep >= item.step ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'}` })}
                    <span className="text-sm font-medium hidden sm:inline">{item.label}</span>
                  </div>
                  {index < storySteps.length - 1 && (
                    <ArrowRight className={`w-5 h-5 mx-1 md:mx-2 transition-colors duration-500 ${
                      activeStoryStep > item.step ? 'text-cyan-400' : 'text-gray-600'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 1: Data Ingestion Story */}
      <section id="chapter-1-ingestion" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-green-500/5 to-transparent opacity-50 blur-3xl"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-300 text-sm font-semibold mb-6 shadow-sm">
                Chapter 1: The Genesis of Data
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Every Great Story Begins with
                <span className="block bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mt-1">Rich, Connected Data</span>
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                LumenNet seamlessly ingests data from your entire security stack—SIEMs, cloud platforms, EDRs, network scanners, and CMDBs—laying the foundation for a comprehensive security narrative.
              </p>
              
              <ul className="space-y-4 mb-10">
                {[
                  { text: "Unified data lake for all security telemetry.", icon: <Layers className="text-green-400" /> },
                  { text: "Over 200+ out-of-the-box integrations.", icon: <Zap className="text-green-400" /> },
                  { text: "Real-time ingestion and normalization.", icon: <RefreshCw className="text-green-400" /> },
                ].map(item => (
                  <li key={item.text} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center mt-0.5">
                      {React.cloneElement(item.icon, { className: "w-4 h-4" })}
                    </div>
                    <span className="text-gray-300">{item.text}</span>
                  </li>
                ))}
              </ul>
              <button className="group flex items-center text-green-400 hover:text-green-300 font-medium transition-colors">
                Explore Data Connectors
                <ArrowRight className="ml-2 w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-70"></div>
              <div className="relative bg-gray-900/70 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-semibold text-green-300">Connected Data Streams</h3>
                  <button className="p-2 text-gray-400 hover:text-green-300 transition-colors">
                    <Settings2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3.5">
                  {dataSources.map((source) => (
                    <div key={source.name} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-green-500/50 transition-all duration-300 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {source.icon}
                          <span className="font-medium text-gray-100">{source.name}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          source.status === 'Connected' || source.status === 'Active' ? 'bg-green-500/20 text-green-300' :
                          source.status === 'Syncing' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {source.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 text-xs text-gray-400 mt-3">
                        <p>Last Sync: <span className="text-gray-300">{source.lastSync}</span></p>
                        <p>Events: <span className="text-gray-300">{source.events}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-5 py-2.5 bg-green-600/20 hover:bg-green-500/30 text-green-300 rounded-md font-medium transition-colors flex items-center justify-center text-sm">
                  <PlusCircle className="w-4 h-4 mr-2" /> Add New Data Source
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 2: Network Topology Story */}
      <section id="chapter-2-mapping" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-blue-500/5 to-transparent opacity-50 blur-3xl"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-70"></div>
              <div className="relative bg-gray-900/70 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-blue-300">Live Security Topology</h3>
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <span className="flex items-center"><div className="w-2 h-2 bg-green-400 rounded-full mr-1.5"></div>Live</span>
                    <span><Network className="w-3 h-3 inline mr-1" />312 Assets</span>
                    <span><GitBranch className="w-3 h-3 inline mr-1" />1890 Connections</span>
                  </div>
                </div>
                <div className="relative h-80 bg-gray-800/40 rounded-lg overflow-hidden border border-gray-700">
                  <svg className="w-full h-full" viewBox="0 0 500 300">
                    {/* Connections */}
                    {[
                      { x1: 50, y1: 150, x2: 150, y2: 80, stroke: "#38bdf8" }, // Cloud to Firewall
                      { x1: 150, y1: 80, x2: 250, y2: 150, stroke: "#38bdf8" }, // Firewall to Server
                      { x1: 150, y1: 80, x2: 150, y2: 220, stroke: "#8b5cf6" }, // Firewall to DB
                      { x1: 250, y1: 150, x2: 350, y2: 80, stroke: "#34d399" }, // Server to App
                      { x1: 250, y1: 150, x2: 350, y2: 220, stroke: "#f472b6", d: "5,5" }, // Server to Ext Service (dashed)
                      { x1: 50, y1: 150, x2: 150, y2: 220, stroke: "#8b5cf6" } // Cloud to DB
                    ].map((line, i) => (
                      <line key={i} {...line} strokeWidth="1.5" opacity="0.7" strokeDasharray={line.d} />
                    ))}
                    {/* Nodes */}
                    {[
                      { x: 40, y: 140, r: 12, fill: "#0ea5e9", icon: <Cloud className="w-3 h-3 text-white" />, label: "Cloud Infra" },
                      { x: 140, y: 70, r: 15, fill: "#ef4444", icon: <Shield className="w-4 h-4 text-white" />, label: "Firewall Prime" },
                      { x: 240, y: 140, r: 12, fill: "#10b981", icon: <Server className="w-3 h-3 text-white" />, label: "App Server 01" },
                      { x: 140, y: 210, r: 12, fill: "#8b5cf6", icon: <Database className="w-3 h-3 text-white" />, label: "Primary DB" },
                      { x: 340, y: 70, r: 10, fill: "#34d399", icon: <Zap className="w-3 h-3 text-white" />, label: "Microservice A" },
                      { x: 340, y: 210, r: 10, fill: "#f472b6", icon: <Globe className="w-3 h-3 text-white" />, label: "External API" }
                    ].map((node, i) => (
                      <g key={i} transform={`translate(${node.x}, ${node.y})`}>
                        <circle r={node.r} fill={node.fill} className="transition-all duration-300 hover:r-[18px]" />
                        <foreignObject x={-node.r} y={-node.r} width={node.r*2} height={node.r*2} className="flex items-center justify-center">
                           {React.cloneElement(node.icon, {className: `${node.icon.props.className} opacity-80`})}
                        </foreignObject>
                        <text x="0" y={node.r + 12} textAnchor="middle" className="text-[8px] fill-gray-300 pointer-events-none">{node.label}</text>
                      </g>
                    ))}
                     {/* Animated particle */}
                    <circle r="2.5" fill="#facc15">
                        <animateMotion dur="6s" repeatCount="indefinite" path="M50,150 Q100,100 150,80 T250,150 T350,80" />
                    </circle>
                  </svg>
                </div>
                 <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {[
                      {label: "Cloud", color: "bg-sky-500"}, {label: "Firewall", color: "bg-red-500"},
                      {label: "Servers", color: "bg-green-500"}, {label: "Databases", color: "bg-purple-500"}
                    ].map(item => (
                      <div key={item.label} className="flex items-center space-x-1.5 p-1.5 bg-gray-800/50 rounded">
                        <div className={`w-2.5 h-2.5 ${item.color} rounded-sm`}></div>
                        <span className="text-gray-400">{item.label}</span>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-6 shadow-sm">
                Chapter 2: Visualizing Connections
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                See Your Infrastructure's
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mt-1">Interconnected Story</span>
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                LumenNet maps your assets and their relationships in real-time, creating a dynamic visual narrative of your security posture. Understand dependencies, identify critical paths, and spot anomalies at a glance.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  { text: "Automated discovery and mapping of all assets.", icon: <Search className="text-blue-400" /> },
                  { text: "Visualize data flows and attack paths.", icon: <GitBranch className="text-blue-400" /> },
                  { text: "Contextual insights overlaid on the topology.", icon: <Eye className="text-blue-400" /> },
                ].map(item => (
                  <li key={item.text} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500/10 rounded-full flex items-center justify-center mt-0.5">
                      {React.cloneElement(item.icon, { className: "w-4 h-4" })}
                    </div>
                    <span className="text-gray-300">{item.text}</span>
                  </li>
                ))}
              </ul>
              <button className="group flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors">
                Explore Topology Features
                <ArrowRight className="ml-2 w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter 3: Executive Insights Story */}
      <section id="chapter-3-insights" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-purple-500/5 to-transparent opacity-50 blur-3xl"></div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm font-semibold mb-6 shadow-sm">
                Chapter 3: The Decisive Narrative
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                Transform Data into
                <span className="block bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mt-1">Actionable Executive Insights</span>
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                LumenNet culminates your security story with clear, concise executive dashboards. Communicate risk, demonstrate ROI, and align security initiatives with business objectives using compelling visual narratives.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  { text: "Customizable dashboards for different stakeholders.", icon: <Users2 className="text-purple-400" /> },
                  { text: "Track KPIs and measure security program effectiveness.", icon: <TrendingUp className="text-purple-400" /> },
                  { text: "Automated reporting for compliance and governance.", icon: <ListChecks className="text-purple-400" /> },
                ].map(item => (
                  <li key={item.text} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-500/10 rounded-full flex items-center justify-center mt-0.5">
                      {React.cloneElement(item.icon, { className: "w-4 h-4" })}
                    </div>
                    <span className="text-gray-300">{item.text}</span>
                  </li>
                ))}
              </ul>
              <button className="group flex items-center text-purple-400 hover:text-purple-300 font-medium transition-colors">
                View Sample Executive Reports
                <ArrowRight className="ml-2 w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-70"></div>
              <div className="relative bg-gray-900/70 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xl font-semibold text-purple-300">CISO Dashboard Overview</h3>
                  <span className="text-xs text-gray-500">As of: Today, 09:15 AM</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-300">Overall Security Score</h4>
                      <Gauge className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="text-3xl font-bold text-yellow-400 mb-1">68<span className="text-xl">%</span></div>
                    <p className="text-xs text-yellow-500">Needs Improvement (Target: 90%)</p>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                      <div className="bg-yellow-400 h-1.5 rounded-full" style={{width: "68%"}}></div>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-gray-300">Critical Asset Uptime</h4>
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-3xl font-bold text-green-400 mb-1">99.92<span className="text-xl">%</span></div>
                    <p className="text-xs text-green-500">Excellent (Target: 99.9%)</p>
                     <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                      <div className="bg-green-400 h-1.5 rounded-full" style={{width: "99.92%"}}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Risk Exposure Trend (90 Days)</h4>
                  <div className="h-32">
                     <svg className="w-full h-full" viewBox="0 0 300 100">
                        <defs>
                          <linearGradient id="riskTrendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.5"/>
                            <stop offset="100%" stopColor="#f472b6" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        <path d="M0,60 C50,70 100,40 150,50 S250,20 300,30" fill="url(#riskTrendGradient)" stroke="#f472b6" strokeWidth="2"/>
                        <circle cx="300" cy="30" r="3" fill="#f472b6" />
                        <text x="285" y="25" className="text-[8px] fill-pink-400">High</text>
                      </svg>
                  </div>
                   <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>90 days ago</span>
                    <span>45 days ago</span>
                    <span>Today</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Complete Story - Integration */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm font-semibold mb-8 shadow-sm">
            The Complete Security Narrative
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            From Raw Data to Strategic Decision,
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              LumenNet Connects the Dots
            </span>
          </h2>
          
          <p className="text-lg text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed">
            LumenNet is more than a platform; it's your security co-pilot, weaving disparate data points into an intelligent, actionable story that empowers your team and informs your leadership.
          </p>

          <div className="relative max-w-5xl mx-auto mb-20">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-700 to-transparent -translate-y-1/2 -z-10"></div>
            <div className="grid md:grid-cols-4 gap-8 md:gap-4 items-start">
              {[
                { title: "Ingest & Normalize", desc: "Data from all sources unified.", icon: <Database className="w-7 h-7" />, color: "from-green-400 to-emerald-500" },
                { title: "Map & Visualize", desc: "Live topology of assets & risks.", icon: <Network className="w-7 h-7" />, color: "from-blue-400 to-cyan-500" },
                { title: "Analyze & Detect", desc: "AI-driven threat identification.", icon: <Lightbulb className="w-7 h-7" />, color: "from-yellow-400 to-orange-500" },
                { title: "Report & Strategize", desc: "Clear insights for leadership.", icon: <FileText className="w-7 h-7" />, color: "from-purple-400 to-pink-500" }
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center relative p-4">
                   <div className="md:hidden absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full w-0.5 h-8 bg-gray-700" style={{ display: index === 0 ? 'none' : 'block' }}></div>
                  <div className={`w-20 h-20 mb-5 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300`}>
                    {React.cloneElement(step.icon, { className: "text-white"})}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-100">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.desc}</p>
                  {index < 3 && (
                    <ArrowRight className="w-8 h-8 text-gray-600 mt-6 hidden md:block absolute top-1/2 -translate-y-1/2" 
                      style={{ right: '-2rem' }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/50 via-gray-900/70 to-gray-800/50 backdrop-blur-md border border-gray-700 rounded-2xl p-10 md:p-16 shadow-xl">
            <h3 className="text-3xl font-bold mb-6 text-gray-100">Ready to Author Your Security Success Story?</h3>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Join over a thousand security teams who trust LumenNet to illuminate their path to a stronger security posture.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <button 
                onClick={() => navigate('/auth')}
                className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 transform hover:scale-105"
              >
                Start Your 30-Day Free Trial
              </button>
              <button className="px-8 py-3.5 border border-gray-600 hover:border-cyan-500 hover:text-cyan-300 rounded-lg font-semibold text-lg text-gray-300 transition-colors transform hover:scale-105">
                Book a Personalized Demo
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-8">
              No credit card required. Full access to all features.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 pt-16 pb-12 px-4 sm:px-6 lg:px-8 bg-gray-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 lg:col-span-5">
              <div className="flex items-center space-x-3 mb-5">
                <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <Network className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">LumenNet</span>
              </div>
              <p className="text-gray-400 text-sm mb-6 max-w-md">
                The SOC Intelligence Platform that transforms complex security data into clear, actionable narratives. Understand your posture, communicate risk, and make smarter decisions.
              </p>
            </div>
            
            <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {[
                {
                  title: "Product",
                  links: ["Platform Overview", "Integrations", "Topology Mapping", "Executive Dashboards", "Pricing", "Changelog"]
                },
                {
                  title: "Resources", 
                  links: ["Documentation", "API Reference", "Blog", "Case Studies", "Support Center", "Security Best Practices"]
                },
                {
                  title: "Company",
                  links: ["About Us", "Careers", "Press", "Partners", "Contact Sales", "Brand Assets"]
                }
              ].map((section) => (
                <div key={section.title}>
                  <h4 className="font-semibold mb-4 text-gray-200 tracking-wide">{section.title}</h4>
                  <ul className="space-y-2.5">
                    {section.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm hover:underline">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-800/50 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} LumenNet Technologies, Inc. All rights reserved.
            </p>
            <div className="flex space-x-5 mt-4 md:mt-0">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(link => (
                 <a key={link} href="#" className="text-gray-500 hover:text-gray-300 transition-colors text-sm hover:underline">
                    {link}
                  </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
      
      {/* Additional CSS for subtle animations if needed */}
      <style jsx global>{`
        .animate-pulse-slow {
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-slower {
            animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          50% {
            opacity: .2;
            transform: scale(1.1);
          }
        }
      `}</style>

    </div>
  );
};

export default LumenNetLanding;
