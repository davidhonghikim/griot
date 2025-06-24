import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setU] = useState('');
  const [password, setP] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-80 space-y-4">
        <h1 className="text-xl font-bold text-center">Griot Node Login</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <input className="border p-2 w-full" placeholder="Username" value={username} onChange={(e)=>setU(e.target.value)} />
        <input className="border p-2 w-full" type="password" placeholder="Password" value={password} onChange={(e)=>setP(e.target.value)} />
        <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded">Login</button>
      </form>
    </div>
  );
} 