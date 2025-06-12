
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CheckCircle, AlertTriangle, ExternalLink, Key, Settings, GitBranch } from 'lucide-react';
import { DataSourceDoc } from '../dataSource/DataSourceDocumentationData';
import WorkflowDiagram from './WorkflowDiagram';

interface DataSourceDocumentationSectionProps {
  dataSource: DataSourceDoc;
}

const DataSourceDocumentationSection: React.FC<DataSourceDocumentationSectionProps> = ({ dataSource }) => {
  return (
    <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg">
            {typeof dataSource.icon === 'string' ? (
              <span className="text-2xl">{dataSource.icon}</span>
            ) : (
              <div className="scale-110">{dataSource.icon}</div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{dataSource.name}</h2>
            <Badge variant="outline" className="border-blue-500 text-blue-600 bg-blue-50">
              {dataSource.category}
            </Badge>
          </div>
        </div>
        <p className="text-gray-700 text-lg">{dataSource.description}</p>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="px-6 pt-4">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="workflow" className="data-[state=active]:bg-white">
              <GitBranch className="w-4 h-4 mr-2" />
              Workflow
            </TabsTrigger>
            <TabsTrigger value="credentials" className="data-[state=active]:bg-white">
              <Key className="w-4 h-4 mr-2" />
              Setup
            </TabsTrigger>
            <TabsTrigger value="configuration" className="data-[state=active]:bg-white">
              <Settings className="w-4 h-4 mr-2" />
              Config
            </TabsTrigger>
            <TabsTrigger value="troubleshooting" className="data-[state=active]:bg-white">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Help
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6">
          <TabsContent value="overview" className="mt-0 space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-blue-600">Use Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {dataSource.useCases.map((useCase, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      {useCase}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-amber-600">Limitations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {dataSource.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <AlertTriangle className="w-5 h-5 text-amber-500 mr-3 flex-shrink-0" />
                      {limitation}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflow" className="mt-0">
            <WorkflowDiagram dataSource={dataSource} />
          </TabsContent>

          <TabsContent value="credentials" className="mt-0">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-blue-600">{dataSource.credentialGuide.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Setup Steps:</h4>
                  <ol className="space-y-3">
                    {dataSource.credentialGuide.steps.map((step, index) => (
                      <li key={index} className="flex text-gray-700">
                        <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-4 mt-1 flex-shrink-0 font-semibold">
                          {index + 1}
                        </span>
                        <span className="pt-1">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {dataSource.credentialGuide.links.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-4">Helpful Resources:</h4>
                    <div className="space-y-2">
                      {dataSource.credentialGuide.links.map((link, index) => (
                        <a
                          key={index}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
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

          <TabsContent value="configuration" className="mt-0 space-y-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-blue-600">Required Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dataSource.configuration.required.map((field, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-semibold text-gray-900 mb-2">{field}</div>
                      {dataSource.configuration.examples[field] && (
                        <div className="text-sm text-gray-600">
                          Example: <code className="bg-white px-2 py-1 rounded border">
                            {dataSource.configuration.examples[field]}
                          </code>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {dataSource.configuration.optional.length > 0 && (
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-600">Optional Configuration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dataSource.configuration.optional.map((field, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="font-semibold text-gray-900 mb-2">{field}</div>
                        {dataSource.configuration.examples[field] && (
                          <div className="text-sm text-gray-600">
                            Example: <code className="bg-white px-2 py-1 rounded border">
                              {dataSource.configuration.examples[field]}
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

          <TabsContent value="troubleshooting" className="mt-0">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-blue-600">Common Issues & Solutions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {dataSource.troubleshooting.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="font-semibold text-red-600 mb-3 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Issue: {item.issue}
                      </div>
                      <div className="text-green-700 flex items-start">
                        <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Solution:</strong> {item.solution}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default DataSourceDocumentationSection;
