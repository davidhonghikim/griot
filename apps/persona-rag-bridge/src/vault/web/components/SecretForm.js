const SecretForm = ({ secret, onSave, onCancel }) => {
  const [formData, setFormData] = React.useState({
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

export default SecretForm; 