const { useState, useEffect } = React;

// API Client
const api = {
  baseURL: '/api/vault',
  
  async getSecrets() {
    const response = await axios.get(`${this.baseURL}/secrets`);
    return response.data;
  },
  
  async setSecret(key, value, encrypted = true) {
    const response = await axios.post(`${this.baseURL}/secrets`, { key, value, encrypted });
    return response.data;
  },
  
  async deleteSecret(key) {
    const response = await axios.delete(`${this.baseURL}/secrets/${key}`);
    return response.data;
  },
  
  async importEnv(envContent) {
    const response = await axios.post(`${this.baseURL}/import`, { envContent });
    return response.data;
  },
  
  async exportEnv() {
    const response = await axios.get(`${this.baseURL}/export`, { responseType: 'blob' });
    return response.data;
  },
  
  async getStatus() {
    const response = await axios.get(`${this.baseURL}/status`);
    return response.data;
  }
};

// Toast notification system
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type} slide-in`}>
      {message}
    </div>
  );
};

// Icon Button Component (reused from kai-cd)
const IconButton = ({ icon: Icon, onClick, title, variant = 'ghost', size = 'md', disabled = false, className = '' }) => {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const variantClasses = {
    primary: 'text-cyan-400 hover:bg-cyan-700 hover:text-white focus:ring-cyan-500',
    secondary: 'text-slate-400 hover:bg-slate-700 hover:text-white focus:ring-slate-500',
    danger: 'text-red-500 hover:bg-red-700 hover:text-white focus:ring-red-500',
    warning: 'text-amber-500 hover:bg-amber-700 hover:text-white focus:ring-amber-500',
    success: 'text-green-500 hover:bg-green-700 hover:text-white focus:ring-green-500',
    ghost: 'text-slate-400 hover:bg-slate-800 hover:text-white focus:ring-slate-500'
  };

  const baseClasses = 'rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900';
  const disabledClasses = 'opacity-50 cursor-not-allowed hover:bg-transparent';

  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${disabled ? disabledClasses : variantClasses[variant]}
        ${className}
      `.trim()}
    >
      <Icon className={iconSizeClasses[size]} />
    </button>
  );
};

// Secret Card Component
const SecretCard = ({ secret, onEdit, onDelete, onCopy }) => {
  const [showValue, setShowValue] = useState(false);
  
  return (
    <div className="card p-6 hover-lift">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{secret.key}</h3>
          <p className="text-sm text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex space-x-2">
          <IconButton
            icon={showValue ? EyeSlashIcon : EyeIcon}
            onClick={() => setShowValue(!showValue)}
            title={showValue ? 'Hide value' : 'Show value'}
            variant="secondary"
            size="sm"
          />
          <IconButton
            icon={ClipboardIcon}
            onClick={() => onCopy(secret.value, secret.key)}
            title="Copy to clipboard"
            variant="secondary"
            size="sm"
          />
          <IconButton
            icon={PencilIcon}
            onClick={() => onEdit(secret)}
            title="Edit secret"
            variant="primary"
            size="sm"
          />
          <IconButton
            icon={TrashIcon}
            onClick={() => onDelete(secret.key)}
            title="Delete secret"
            variant="danger"
            size="sm"
          />
        </div>
      </div>
      
      <div className="bg-slate-800 rounded-lg p-3 font-mono text-sm">
        {showValue ? secret.value : secret.masked}
      </div>
    </div>
  );
};

// Add/Edit Secret Form
const SecretForm = ({ secret, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    key: secret?.key || '',
    value: secret?.value || '',
    encrypted: secret?.encrypted !== false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="card p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">
        {secret ? 'Edit Secret' : 'Add New Secret'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Secret Key
          </label>
          <input
            type="text"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            className="input"
            placeholder="e.g., OPENWEBUI_API_KEY"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Secret Value
          </label>
          <input
            type="password"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            className="input"
            placeholder="Enter your secret value"
            required
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="encrypted"
            checked={formData.encrypted}
            onChange={(e) => setFormData({ ...formData, encrypted: e.target.checked })}
            className="mr-2"
          />
          <label htmlFor="encrypted" className="text-sm text-slate-300">
            Encrypt this secret (recommended)
          </label>
        </div>
        
        <div className="flex space-x-3">
          <button type="submit" className="btn btn-primary">
            {secret ? 'Update Secret' : 'Add Secret'}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Import/Export Component
const ImportExport = ({ onImport, onExport }) => {
  const [envContent, setEnvContent] = useState('');

  const handleImport = () => {
    if (envContent.trim()) {
      onImport(envContent);
      setEnvContent('');
    }
  };

  const handleExport = async () => {
    try {
      const blob = await onExport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'persona-rag.env';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-4">Import/Export</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Import from .env file
          </label>
          <textarea
            value={envContent}
            onChange={(e) => setEnvContent(e.target.value)}
            className="input h-32 resize-none"
            placeholder="# Paste your .env file content here&#10;OPENWEBUI_API_KEY=your_key_here&#10;OPENAI_API_KEY=your_openai_key_here"
          />
          <button onClick={handleImport} className="btn btn-primary mt-3">
            Import Secrets
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Export to .env file
          </label>
          <p className="text-sm text-slate-400 mb-3">
            Download all secrets as a .env file for backup or migration.
          </p>
          <button onClick={handleExport} className="btn btn-secondary">
            Download .env
          </button>
        </div>
      </div>
    </div>
  );
};

// Status Bar Component
const StatusBar = ({ status }) => {
  if (!status) return null;

  return (
    <div className="card p-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className={`status-indicator ${status.securityValid ? 'status-success' : 'status-warning'}`}></div>
          <span className="text-sm font-medium">
            {status.securityValid ? 'Vault Secure' : 'Security Issues'}
          </span>
          <span className="text-sm text-slate-400">
            {status.secretCount} secrets
          </span>
        </div>
        
        <div className="text-sm text-slate-400">
          Vault: {status.vaultPath}
        </div>
      </div>
      
      {!status.securityValid && status.issues && status.issues.length > 0 && (
        <div className="mt-3 p-3 bg-amber-900/20 border border-amber-500/30 rounded-lg">
          <p className="text-sm text-amber-200 font-medium mb-2">Security Issues:</p>
          <ul className="text-sm text-amber-300 space-y-1">
            {status.issues.map((issue, index) => (
              <li key={index}>• {issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Main App Component
const VaultManager = () => {
  const [secrets, setSecrets] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSecret, setEditingSecret] = useState(null);
  const [activeTab, setActiveTab] = useState('secrets');
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const loadSecrets = async () => {
    try {
      const response = await api.getSecrets();
      if (response.success) {
        setSecrets(response.secrets);
      }
    } catch (error) {
      addToast('Failed to load secrets', 'error');
    }
  };

  const loadStatus = async () => {
    try {
      const response = await api.getStatus();
      if (response.success) {
        setStatus(response.status);
      }
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await Promise.all([loadSecrets(), loadStatus()]);
      setLoading(false);
    };
    initialize();
  }, []);

  const handleSaveSecret = async (formData) => {
    try {
      await api.setSecret(formData.key, formData.value, formData.encrypted);
      addToast('Secret saved successfully');
      setShowForm(false);
      setEditingSecret(null);
      loadSecrets();
    } catch (error) {
      addToast('Failed to save secret', 'error');
    }
  };

  const handleDeleteSecret = async (key) => {
    if (window.confirm(`Are you sure you want to delete "${key}"?`)) {
      try {
        await api.deleteSecret(key);
        addToast('Secret deleted successfully');
        loadSecrets();
      } catch (error) {
        addToast('Failed to delete secret', 'error');
      }
    }
  };

  const handleEditSecret = (secret) => {
    setEditingSecret(secret);
    setShowForm(true);
  };

  const handleCopySecret = async (value, key) => {
    try {
      await navigator.clipboard.writeText(value);
      addToast(`${key} copied to clipboard`);
    } catch (error) {
      addToast('Failed to copy to clipboard', 'error');
    }
  };

  const handleImport = async (envContent) => {
    try {
      const response = await api.importEnv(envContent);
      addToast(response.message);
      loadSecrets();
    } catch (error) {
      addToast('Failed to import secrets', 'error');
    }
  };

  const handleExport = async () => {
    return await api.exportEnv();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-100 mb-2">
            🔐 PersonaRAG Vault Manager
          </h1>
          <p className="text-slate-400">
            Secure credential management for your AI bridge
          </p>
        </div>

        {/* Status Bar */}
        <StatusBar status={status} />

        {/* Tabs */}
        <div className="flex border-b border-slate-700 mb-6">
          <button
            onClick={() => setActiveTab('secrets')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'secrets'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Secrets
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'import'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Import/Export
          </button>
        </div>

        {/* Content */}
        {activeTab === 'secrets' && (
          <div>
            {showForm && (
              <SecretForm
                secret={editingSecret}
                onSave={handleSaveSecret}
                onCancel={() => {
                  setShowForm(false);
                  setEditingSecret(null);
                }}
              />
            )}

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-100">
                {showForm ? (editingSecret ? 'Edit Secret' : 'Add Secret') : 'Secrets'}
              </h2>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Secret
                </button>
              )}
            </div>

            {!showForm && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {secrets.map((secret) => (
                  <SecretCard
                    key={secret.key}
                    secret={secret}
                    onEdit={handleEditSecret}
                    onDelete={handleDeleteSecret}
                    onCopy={handleCopySecret}
                  />
                ))}
              </div>
            )}

            {!showForm && secrets.length === 0 && (
              <div className="text-center py-12">
                <KeyIcon className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No secrets found</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="btn btn-primary"
                >
                  Add your first secret
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'import' && (
          <ImportExport onImport={handleImport} onExport={handleExport} />
        )}
      </div>

      {/* Toast notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// Render the app
ReactDOM.render(<VaultManager />, document.getElementById('root')); 