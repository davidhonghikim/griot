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

export default StatusBar; 