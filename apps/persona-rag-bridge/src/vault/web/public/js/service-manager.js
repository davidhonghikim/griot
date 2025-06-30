// Service Status Component
const ServiceStatus = ({ services, onRefresh }) => {
  const checkServiceStatus = async (service) => {
    try {
      const response = await axios.get(`/api/services/${service.id}/status`);
      return response.data.status;
    } catch (error) {
      return 'error';
    }
  };

  const refreshAllStatuses = async () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'offline': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return '🟢';
      case 'offline': return '🔴';
      case 'warning': return '🟡';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-100">Service Status</h3>
        <button onClick={refreshAllStatuses} className="btn btn-secondary">
          Refresh
        </button>
      </div>
      
      <div className="grid gap-4">
        {services.map((service) => (
          <div key={service.id} className="card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getStatusIcon(service.status)}</span>
                <div>
                  <h4 className="font-medium text-slate-100">{service.name}</h4>
                  <p className="text-sm text-slate-400">{service.url}</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                {service.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// API Tester Component
const ApiTester = () => {
  const [results, setResults] = useState({});

  const testEndpoint = async (endpoint) => {
    try {
      const response = await axios.get(endpoint);
      setResults(prev => ({
        ...prev,
        [endpoint]: { status: 'success', data: response.data }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [endpoint]: { status: 'error', error: error.message }
      }));
    }
  };

  const endpoints = [
    '/api/vault/status',
    '/api/services',
    '/api/vault/secrets'
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-100">API Tester</h3>
      <div className="grid gap-4">
        {endpoints.map((endpoint) => (
          <div key={endpoint} className="card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm text-slate-300">{endpoint}</span>
              <button
                onClick={() => testEndpoint(endpoint)}
                className="btn btn-primary text-sm"
              >
                Test
              </button>
            </div>
            {results[endpoint] && (
              <div className={`text-sm p-2 rounded ${
                results[endpoint].status === 'success' 
                  ? 'bg-green-900 text-green-100' 
                  : 'bg-red-900 text-red-100'
              }`}>
                {results[endpoint].status === 'success' 
                  ? JSON.stringify(results[endpoint].data, null, 2)
                  : results[endpoint].error
                }
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Service Config Component
const ServiceConfig = () => {
  const [config, setConfig] = useState({
    openai: { apiKey: '', baseUrl: 'https://api.openai.com/v1' },
    anthropic: { apiKey: '', baseUrl: 'https://api.anthropic.com' },
    ollama: { baseUrl: 'http://localhost:11434' }
  });

  const saveConfig = async () => {
    try {
      await axios.post('/api/services/config', config);
      toast('Configuration saved successfully', 'success');
    } catch (error) {
      toast('Failed to save configuration', 'error');
    }
  };

  const testConnection = async (serviceName) => {
    try {
      await axios.post(`/api/services/${serviceName}/test`, config[serviceName]);
      toast(`${serviceName} connection successful`, 'success');
    } catch (error) {
      toast(`${serviceName} connection failed`, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-100">Service Configuration</h3>
      
      {Object.entries(config).map(([service, settings]) => (
        <div key={service} className="card p-6">
          <h4 className="text-md font-medium text-slate-100 mb-4 capitalize">{service}</h4>
          <div className="space-y-4">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-300 mb-2 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type={key.includes('Key') ? 'password' : 'text'}
                  value={value}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    [service]: { ...prev[service], [key]: e.target.value }
                  }))}
                  className="input"
                  placeholder={`Enter ${key}`}
                />
              </div>
            ))}
            <button
              onClick={() => testConnection(service)}
              className="btn btn-secondary"
            >
              Test Connection
            </button>
          </div>
        </div>
      ))}
      
      <button onClick={saveConfig} className="btn btn-primary">
        Save Configuration
      </button>
    </div>
  );
};
