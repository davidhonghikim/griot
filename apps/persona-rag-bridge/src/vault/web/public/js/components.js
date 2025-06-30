// Icon definitions
const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeSlashIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

const ClipboardIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const PencilIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

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
            Encrypt this secret
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

// Status Bar Component
const StatusBar = ({ status }) => {
  return (
    <div className="bg-slate-800 border-t border-slate-700 px-4 py-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-slate-400">Status:</span>
          <span className={`status-indicator status-${status.type}`}></span>
          <span className="text-slate-300">{status.message}</span>
        </div>
        <div className="text-slate-400">
          {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};
