import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, saveTokens } from '../services/auth';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const tokens = await login(username, password);
      saveTokens(tokens);
      navigate('/');
    } catch {
      setError('Usuario o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Alpha<span style={styles.titleAccent}>P</span></h1>
          <h2 style={styles.subtitle}>Calculadora de Inversiones</h2>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder="Ingresa tu usuario"
              required
              autoFocus
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a2a4a 0%, #2d4a7a 100%)',
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: '48px 40px',
    width: '100%',
    maxWidth: 400,
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  header: {
    textAlign: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 800,
    color: '#1a2a4a',
    margin: 0,
    letterSpacing: -1,
  },
  titleAccent: {
    color: '#c8a84b',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    fontWeight: 400,
    margin: '4px 0 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    padding: '12px 16px',
    border: '1.5px solid #ddd',
    borderRadius: 8,
    fontSize: 15,
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  error: {
    color: '#e53e3e',
    fontSize: 13,
    textAlign: 'center',
    margin: 0,
    padding: '8px 12px',
    background: '#fff5f5',
    borderRadius: 6,
    border: '1px solid #fed7d7',
  },
  button: {
    padding: '14px',
    background: 'linear-gradient(135deg, #1a2a4a, #2d4a7a)',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 4,
  },
};

export default Login;
