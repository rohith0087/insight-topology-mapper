import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Brain,
  Network,
  Shield,
  TrendingUp,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  analysis_type?: string;
}

interface NetworkAIChatProps {
  onClose?: () => void;
}

// Component to format AI text with markdown-like parsing
const FormattedText: React.FC<{ content: string }> = ({ content }) => {
  const formatText = (text: string) => {
    const lines = text.split('\n');
    const formattedLines: JSX.Element[] = [];

    lines.forEach((line, index) => {
      let formattedLine: JSX.Element;

      // Main headings (### text)
      if (line.startsWith('### ')) {
        formattedLine = (
          <h3 key={index} className="text-lg font-bold text-cyan-300 mt-4 mb-2 border-b border-slate-600 pb-1">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Secondary headings (## text)
      else if (line.startsWith('## ')) {
        formattedLine = (
          <h2 key={index} className="text-xl font-bold text-cyan-200 mt-4 mb-2">
            {line.replace('## ', '')}
          </h2>
        );
      }
      // Tertiary headings (# text)
      else if (line.startsWith('# ')) {
        formattedLine = (
          <h1 key={index} className="text-2xl font-bold text-cyan-100 mt-4 mb-3">
            {line.replace('# ', '')}
          </h1>
        );
      }
      // Bold text (**text**)
      else if (line.includes('**')) {
        const parts = line.split(/(\*\*.*?\*\*)/);
        formattedLine = (
          <p key={index} className="mb-2 leading-relaxed text-slate-100">
            {parts.map((part, partIndex) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={partIndex} className="font-semibold text-cyan-300">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        );
      }
      // List items (- text)
      else if (line.startsWith('- ')) {
        formattedLine = (
          <div key={index} className="flex items-start mb-2">
            <span className="text-cyan-400 mr-2 mt-1">•</span>
            <span className="leading-relaxed text-slate-100">{line.replace('- ', '')}</span>
          </div>
        );
      }
      // Numbered lists (1. text)
      else if (/^\d+\.\s/.test(line)) {
        const match = line.match(/^(\d+)\.\s(.*)$/);
        if (match) {
          formattedLine = (
            <div key={index} className="flex items-start mb-2">
              <span className="text-cyan-400 mr-2 mt-1 font-medium">{match[1]}.</span>
              <span className="leading-relaxed text-slate-100">{match[2]}</span>
            </div>
          );
        } else {
          formattedLine = <p key={index} className="mb-2 leading-relaxed text-slate-100">{line}</p>;
        }
      }
      // Empty lines
      else if (line.trim() === '') {
        formattedLine = <div key={index} className="mb-2"></div>;
      }
      // Regular text
      else {
        formattedLine = <p key={index} className="mb-2 leading-relaxed text-slate-100">{line}</p>;
      }

      formattedLines.push(formattedLine);
    });

    return formattedLines;
  };

  return <div className="space-y-1">{formatText(content)}</div>;
};

const NetworkAIChat: React.FC<NetworkAIChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<string>('overview');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const analysisTypes = [
    { id: 'overview', label: 'Network Overview', icon: Network, color: 'bg-blue-500' },
    { id: 'security', label: 'Security Analysis', icon: Shield, color: 'bg-red-500' },
    { id: 'performance', label: 'Performance Analysis', icon: TrendingUp, color: 'bg-green-500' },
    { id: 'topology', label: 'Topology Analysis', icon: Eye, color: 'bg-purple-500' },
    { id: 'custom', label: 'Custom Query', icon: Brain, color: 'bg-cyan-500' }
  ];

  const quickQuestions = [
    "What's the overall health of my network?",
    "Are there any security vulnerabilities?",
    "How can I optimize network performance?",
    "What devices need attention?",
    "Show me the network topology structure"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Welcome message
    setMessages([{
      id: crypto.randomUUID(),
      type: 'ai',
      content: `# Welcome to AI Network Analyst! 🤖

I'm your AI network analyst. I can help you understand your network topology, identify security issues, analyze performance, and answer any questions about your infrastructure.

## What I can do:
- **Network Overview**: Comprehensive analysis of your network structure
- **Security Analysis**: Identify vulnerabilities and threats
- **Performance Analysis**: Find bottlenecks and optimization opportunities
- **Topology Analysis**: Understand connectivity patterns

Choose an analysis type or ask me anything about your network!`,
      timestamp: new Date()
    }]);
  }, []);

  const sendMessage = async (message: string, analysisType: string = selectedAnalysisType) => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content: message,
      timestamp: new Date(),
      analysis_type: analysisType
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);

    try {
      console.log('Sending analysis request:', { query: message, analysis_type: analysisType });

      const { data, error } = await supabase.functions.invoke('network-ai-analysis', {
        body: {
          query: message,
          analysis_type: analysisType,
          include_metrics: true,
          client_context: {
            timestamp: new Date().toISOString(),
            user_session: crypto.randomUUID()
          }
        }
      });

      if (error) {
        console.error('AI analysis error:', error);
        throw error;
      }

      console.log('AI analysis response:', data);

      const aiMessage: Message = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: data.analysis || 'I apologize, but I encountered an issue analyzing your network. Please try again.',
        timestamp: new Date(),
        analysis_type: analysisType
      };

      setMessages(prev => [...prev, aiMessage]);

      if (data.insights && data.insights.length > 0) {
        toast({
          title: "Network Insights Generated",
          description: `Found ${data.insights.length} insights about your network`,
        });
      }

    } catch (error) {
      console.error('Error in AI chat:', error);
      
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        type: 'ai',
        content: `# Analysis Error ⚠️

I apologize, but I encountered an error while analyzing your network. This might be due to:

## Possible Issues:
1. **Network connectivity issues**
2. **API configuration problems**
3. **Insufficient data in your network topology**

## Next Steps:
- Please check your network data sources and try again
- If the problem persists, contact your system administrator`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);

      toast({
        title: "Analysis Error",
        description: error.message || "Failed to analyze network",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    sendMessage(question, 'custom');
  };

  const handleAnalysisTypeSelect = (type: string) => {
    setSelectedAnalysisType(type);
    const analysisTypeLabels = {
      overview: 'Please provide a comprehensive overview of my network topology',
      security: 'Analyze my network for security vulnerabilities and threats',
      performance: 'Analyze my network performance and identify bottlenecks',
      topology: 'Describe my network topology structure and connectivity patterns'
    };
    
    if (type !== 'custom') {
      sendMessage(analysisTypeLabels[type as keyof typeof analysisTypeLabels] || 'Analyze my network', type);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-600 h-full flex flex-col text-white">
      <CardHeader className="flex-shrink-0 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <CardTitle className="text-cyan-400 flex items-center space-x-2">
            <Brain className="w-5 h-5" />
            <span>AI Network Analyst</span>
          </CardTitle>
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              ✕
            </Button>
          )}
        </div>
        
        {/* Analysis Type Selector */}
        <div className="flex flex-wrap gap-2 mt-4">
          {analysisTypes.map(type => {
            const Icon = type.icon;
            return (
              <Button
                key={type.id}
                onClick={() => handleAnalysisTypeSelect(type.id)}
                variant={selectedAnalysisType === type.id ? "default" : "outline"}
                size="sm"
                className={`flex items-center space-x-1 text-xs ${
                  selectedAnalysisType === type.id 
                    ? `${type.color} text-white border-transparent` 
                    : 'border-slate-500 text-slate-200 bg-slate-700 hover:bg-slate-600 hover:text-white hover:border-slate-400'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{type.label}</span>
              </Button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0">
        {/* Messages Area with Proper Scrolling */}
        <ScrollArea className="flex-1 max-h-[calc(100vh-400px)]">
          <div className="space-y-4 p-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'bg-cyan-600' : 'bg-slate-600'
                  }`}>
                    {message.type === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  <div className={`rounded-lg p-4 ${
                    message.type === 'user' 
                      ? 'bg-cyan-600 text-white' 
                      : 'bg-slate-700 text-slate-100'
                  }`}>
                    <div className="text-sm">
                      {message.type === 'ai' ? (
                        <FormattedText content={message.content} />
                      ) : (
                        <div className="whitespace-pre-wrap text-white">{message.content}</div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-600">
                      <div className="text-xs opacity-70 text-slate-300">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                      {message.analysis_type && (
                        <Badge variant="outline" className="text-xs border-slate-500 text-slate-300 bg-slate-600">
                          {analysisTypes.find(t => t.id === message.analysis_type)?.label || message.analysis_type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                      <span className="text-sm text-slate-100">Analyzing your network...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="flex-shrink-0 p-4 border-t border-slate-700 bg-slate-800">
            <p className="text-sm text-slate-300 mb-3">Try these quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  variant="outline"
                  size="sm"
                  className="text-xs border-slate-500 text-slate-200 hover:bg-slate-700 hover:text-white bg-slate-700 hover:border-slate-400"
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex-shrink-0 p-4 border-t border-slate-700 bg-slate-800">
          <div className="flex space-x-2">
            <Textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder={selectedAnalysisType === 'custom' ? "Ask me anything about your network..." : `Ask about ${analysisTypes.find(t => t.id === selectedAnalysisType)?.label.toLowerCase()}...`}
              className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400 resize-none"
              rows={2}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(currentMessage);
                }
              }}
            />
            <Button
              onClick={() => sendMessage(currentMessage)}
              disabled={!currentMessage.trim() || isLoading}
              className="bg-cyan-600 hover:bg-cyan-700 text-white self-end"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkAIChat;
