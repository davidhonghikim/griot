const { useState, useEffect } = React;

// Main App Component
const App = () => {
  const [activeTab, setActiveTab] = useState('vault');
  const [services, setServices] = useState([]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'vault':
        return <VaultManager />;
      case 'services':
        return <ServiceStatus services={services} onRefresh={() => {}} />;
      case 'api':
        return <ApiTester />;
      case 'config':
        return <ServiceConfig />;
      default:
        return <VaultManager />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            PersonaRAG Vault Manager
          </h1>
          <p className="text-slate-400">
            Secure secret management and service orchestration
          </p>
        </header>

        <nav className="mb-6">
          <div className="flex space-x-1 bg-slate-800 p-1 rounded-lg">
            {[
              { id: 'vault', label: 'Vault', icon: '🔐' },
              { id: 'services', label: 'Services', icon: '⚙️' },
              { id: 'api', label: 'API Test', icon: '🧪' },
              { id: 'config', label: 'Config', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-cyan-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <main>
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.render(<App />, root);
  }
});
