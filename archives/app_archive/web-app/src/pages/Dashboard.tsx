import React, { useState, useEffect } from 'react';
import { api } from '../api/client';

interface NodeIdentity {
  class: string;
  version: string;
  nodeId: string;
}

interface ServiceSummary {
  total: number;
  active: number;
  types: string[];
}

interface JobSummary {
  total: number;
  running: number;
  completed: number;
  failed: number;
}

export const Dashboard: React.FC = () => {
  const [identity, setIdentity] = useState<NodeIdentity | null>(null);
  const [serviceSummary, setServiceSummary] = useState<ServiceSummary>({ total: 0, active: 0, types: [] });
  const [jobSummary, setJobSummary] = useState<JobSummary>({ total: 0, running: 0, completed: 0, failed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load node identity
        const identityResponse = await api.getIdentity();
        setIdentity(identityResponse);

        // Load services summary
        const servicesResponse = await api.services.list();
        const services = Array.isArray(servicesResponse) ? servicesResponse : servicesResponse.data || [];
        const serviceTypes = [...new Set(services.map((s) => s.type))];
        setServiceSummary({
          total: services.length,
          active: services.filter((s) => (s as unknown as { status?: string }).status === 'active').length,
          types: serviceTypes
        });

        // Load jobs summary
        const jobsResponse = await api.jobs.list();
        const jobs = Array.isArray(jobsResponse) ? jobsResponse : jobsResponse.data || [];
        setJobSummary({
          total: jobs.length,
          running: jobs.filter((j) => j.status === 'running').length,
          completed: jobs.filter((j) => j.status === 'completed').length,
          failed: jobs.filter((j) => j.status === 'failed').length
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-fade-in-up">
            <div className="skeleton h-8 w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card p-6">
                  <div className="skeleton h-4 w-16 mb-2"></div>
                  <div className="skeleton h-8 w-24 mb-4"></div>
                  <div className="skeleton h-4 w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="animate-fade-in-up">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-lg text-gray-600">Monitor your Griot Node system status and activity</p>
          </div>

          {/* System Status */}
          <div className="card p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">System Status</h2>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse-slow"></div>
                <span className="text-sm font-medium text-green-600">Online</span>
              </div>
            </div>
            
            {identity && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <div className="text-sm font-medium text-gray-600 mb-1">Node Class</div>
                  <div className="text-2xl font-bold text-gradient">{identity.class}</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                  <div className="text-sm font-medium text-gray-600 mb-1">Version</div>
                  <div className="text-2xl font-bold text-purple-600">{identity.version}</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                  <div className="text-sm font-medium text-gray-600 mb-1">Node ID</div>
                  <div className="text-lg font-mono text-green-600">{identity.nodeId}</div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="card p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Services</p>
                  <p className="text-3xl font-bold text-blue-600">{serviceSummary.total}</p>
                  <p className="text-sm text-gray-500">{serviceSummary.active} active</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="card p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Jobs</p>
                  <p className="text-3xl font-bold text-green-600">{jobSummary.total}</p>
                  <p className="text-sm text-gray-500">{jobSummary.running} running</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="card p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Completed Jobs</p>
                  <p className="text-3xl font-bold text-purple-600">{jobSummary.completed}</p>
                  <p className="text-sm text-gray-500">Success rate: {jobSummary.total > 0 ? Math.round((jobSummary.completed / jobSummary.total) * 100) : 0}%</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="card p-6 border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">API Endpoints</p>
                  <p className="text-3xl font-bold text-orange-600">6</p>
                  <p className="text-sm text-gray-500">All operational</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* What Can You Do */}
          <div className="card p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What can you do with Griot Node?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect AI Services</h3>
                <p className="text-sm text-gray-600">Integrate with OpenAI, Anthropic, local models, and more AI providers</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Process Jobs</h3>
                <p className="text-sm text-gray-600">Queue and execute AI tasks like text generation, image creation, and analysis</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Proxy Requests</h3>
                <p className="text-sm text-gray-600">Route and manage API calls to different AI services seamlessly</p>
              </div>
            </div>
          </div>

          {/* Getting Started */}
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Getting Started</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Add Your First Service</h3>
                  <p className="text-gray-600">Go to Services and connect an AI provider like OpenAI or Anthropic</p>
                </div>
                <div className="ml-auto">
                  <span className="badge badge-primary">Next Step</span>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                <div>
                  <h3 className="font-semibold text-gray-700">Create Your First Job</h3>
                  <p className="text-gray-600">Test your service by running a simple AI task</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                <div>
                  <h3 className="font-semibold text-gray-700">Explore the API</h3>
                  <p className="text-gray-600">Use the proxy endpoints to integrate with your applications</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 