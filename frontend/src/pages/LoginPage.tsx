import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { user, login } = useAuth();
  const [email, setEmail] = useState('admin@agroshop.com');
  const [password, setPassword] = useState('Agro@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
      setError('Unable to sign in. Please confirm your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="brand text-center">
          <img src="/datc-logo.jpg" alt="DATC AgroShop" className="brand-logo large" />
          <p className="brand-title">DATC AgroShop Admin</p>
          <p className="brand-subtitle">Deepak Agriculture &amp; Trading Company</p>
        </div>

        <label className="form-field">
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>

        <label className="form-field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Signing in...' : 'Access Admin Panel'}
        </button>
        <p className="helper-text">
          Default admin: admin@agroshop.com / Agro@123
        </p>
      </form>
    </div>
  );
};

export default LoginPage;

