
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import DocumentationHeader from '../components/documentation/DocumentationHeader';
import DataSourceDocumentationSection from '../components/documentation/DataSourceDocumentationSection';
import { dataSources } from '../components/dataSource/DataSourceDocumentationData';

const DocumentationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <DocumentationHeader />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Network Topology Documentation
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive guide to integrating and managing your network monitoring tools
          </p>
        </div>

        <div className="space-y-12">
          {dataSources.map((source) => (
            <DataSourceDocumentationSection 
              key={source.id} 
              dataSource={source} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
