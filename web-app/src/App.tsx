import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Services from './pages/Services';
import Jobs from './pages/Jobs';
import Navigation from './components/Navigation';
import { AuthProvider, useAuth } from './hooks/useAuth';

const qc = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  return token ? (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main>{children}</main>
    </div>
  ) : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={qc}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/services" element={<PrivateRoute><Services /></PrivateRoute>} />
            <Route path="/jobs" element={<PrivateRoute><Jobs /></PrivateRoute>} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  );
}
