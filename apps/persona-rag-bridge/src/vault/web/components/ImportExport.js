const ImportExport = ({ onImport, onExport }) => {
  const [envContent, setEnvContent] = React.useState('');

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

export default ImportExport; 