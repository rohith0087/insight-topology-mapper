
import React from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ExternalLink, Key, Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import { DataSourceDoc } from './DataSourceDocumentationData';

interface DataSourceDocumentationContentProps {
  currentSource: DataSourceDoc;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DataSourceDocumentationContent: React.FC<DataSourceDocumentationContentProps> = ({
  currentSource,
  activeTab,
  onTabChange
}) => {
  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Source Header */}
      <div className="p-6 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center justify-center w-8 h-8">
            {typeof currentSource.icon === 'string' ? (
              <span className="text-3xl">{currentSource.icon}</span>
            ) : (
              <div className="scale-125">{currentSource.icon}</div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">{currentSource.name}</h3>
            <Badge variant="outline" className="border-cyan-500 text-cyan-400">
              {currentSource.category}
            </Badge>
          </div>
        </div>
        <p className="text-slate-300">{currentSource.description}</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1 flex flex-col min-h-0">
        <div className="px-6 pt-4 flex-shrink-0">
          <TabsList className="grid w-full grid-cols-4 bg-slate-900">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="credentials" className="data-[state=active]:bg-cyan-600">
              <Key className="w-4 h-4 mr-2" />
              Credentials
            </TabsTrigger>
            <TabsTrigger value="configuration" className="data-[state=active]:bg-cyan-600">
              <Settings className="w-4 h-4 mr-2" />
              Configuration
            </TabsTrigger>
            <TabsTrigger value="troubleshooting" className="data-[state=active]:bg-cyan-600">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Troubleshooting
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <TabsContent value="overview" className="mt-0 p-6 space-y-6">
              <Card className="bg-slate-900 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Use Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentSource.useCases.map((useCase, index) => (
                      <li key={index} className="flex items-center text-slate-300">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Limitations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentSource.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-center text-slate-300">
                        <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="credentials" className="mt-0 p-6">
              <Card className="bg-slate-900 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-cyan-400">{currentSource.credentialGuide.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium text-white mb-3">Setup Steps:</h4>
                    <ol className="space-y-2">
                      {currentSource.credentialGuide.steps.map((step, index) => (
                        <li key={index} className="flex text-slate-300">
                          <span className="bg-cyan-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {currentSource.credentialGuide.links.length > 0 && (
                    <div>
                      <h4 className="font-medium text-white mb-3">Helpful Links:</h4>
                      <div className="space-y-2">
                        {currentSource.credentialGuide.links.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {link.text}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="configuration" className="mt-0 p-6 space-y-6">
              <Card className="bg-slate-900 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Required Fields</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentSource.configuration.required.map((field, index) => (
                      <div key={index} className="bg-slate-800 p-3 rounded">
                        <div className="font-medium text-white">{field}</div>
                        {currentSource.configuration.examples[field] && (
                          <div className="text-sm text-slate-400 mt-1">
                            Example: <code className="bg-slate-700 px-2 py-1 rounded">
                              {currentSource.configuration.examples[field]}
                            </code>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {currentSource.configuration.optional.length > 0 && (
                <Card className="bg-slate-900 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-slate-400">Optional Fields</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentSource.configuration.optional.map((field, index) => (
                        <div key={index} className="bg-slate-800 p-3 rounded">
                          <div className="font-medium text-white">{field}</div>
                          {currentSource.configuration.examples[field] && (
                            <div className="text-sm text-slate-400 mt-1">
                              Example: <code className="bg-slate-700 px-2 py-1 rounded">
                                {currentSource.configuration.examples[field]}
                              </code>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="troubleshooting" className="mt-0 p-6">
              <Card className="bg-slate-900 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Common Issues & Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentSource.troubleshooting.map((item, index) => (
                      <div key={index} className="border border-slate-700 rounded-lg p-4">
                        <div className="font-medium text-red-400 mb-2 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Issue: {item.issue}
                        </div>
                        <div className="text-green-400 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Solution: {item.solution}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  );
};

export default DataSourceDocumentationContent;
