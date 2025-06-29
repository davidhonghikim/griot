import IconButton from './IconButton.js';

const SecretCard = ({ secret, onEdit, onDelete, onCopy }) => {
  const [showValue, setShowValue] = React.useState(false);
  
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

export default SecretCard; 