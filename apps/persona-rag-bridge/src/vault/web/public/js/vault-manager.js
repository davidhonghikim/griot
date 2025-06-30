// Vault Manager Component
const VaultManager = () => {
  const [secrets, setSecrets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSecret, setEditingSecret] = useState(null);

  const loadSecrets = async () => {
    try {
      setLoading(true);
      const data = await api.getSecrets();
      setSecrets(data.secrets || []);
    } catch (error) {
      toast('Failed to load secrets', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addSecret = async () => {
    setShowForm(true);
    setEditingSecret(null);
  };

  const updateSecret = async (id, updates) => {
    try {
      await api.setSecret(updates.key, updates.value, updates.encrypted);
      toast('Secret updated successfully', 'success');
      setShowForm(false);
      setEditingSecret(null);
      loadSecrets();
    } catch (error) {
      toast('Failed to update secret', 'error');
    }
  };

  const deleteSecret = async (id) => {
    if (confirm('Are you sure you want to delete this secret?')) {
      try {
        await api.deleteSecret(id);
        toast('Secret deleted successfully', 'success');
        loadSecrets();
      } catch (error) {
        toast('Failed to delete secret', 'error');
      }
    }
  };

  const exportSecrets = () => {
    api.exportEnv().then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vault-secrets.env';
      a.click();
      window.URL.revokeObjectURL(url);
    }).catch(error => {
      toast('Failed to export secrets', 'error');
    });
  };

  const importSecrets = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          await api.importEnv(e.target.result);
          toast('Secrets imported successfully', 'success');
          loadSecrets();
        } catch (error) {
          toast('Failed to import secrets', 'error');
        }
      };
      reader.readAsText(file);
    }
  };

  const copyToClipboard = (value, key) => {
    navigator.clipboard.writeText(value).then(() => {
      toast(`${key} copied to clipboard`, 'success');
    }).catch(() => {
      toast('Failed to copy to clipboard', 'error');
    });
  };

  useEffect(() => {
    loadSecrets();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">Loading secrets...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-100">Vault Secrets</h2>
        <div className="flex space-x-3">
          <button onClick={addSecret} className="btn btn-primary">
            Add Secret
          </button>
          <button onClick={exportSecrets} className="btn btn-secondary">
            Export
          </button>
          <label className="btn btn-secondary cursor-pointer">
            Import
            <input
              type="file"
              accept=".env"
              onChange={importSecrets}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {showForm && (
        <SecretForm
          secret={editingSecret}
          onSave={updateSecret}
          onCancel={() => {
            setShowForm(false);
            setEditingSecret(null);
          }}
        />
      )}

      <div className="grid gap-4">
        {secrets.map((secret) => (
          <SecretCard
            key={secret.key}
            secret={secret}
            onEdit={(secret) => {
              setEditingSecret(secret);
              setShowForm(true);
            }}
            onDelete={deleteSecret}
            onCopy={copyToClipboard}
          />
        ))}
      </div>
    </div>
  );
};
