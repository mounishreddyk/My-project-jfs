import { useState } from 'react';
import { Package, Lock, User, LogIn, UserPlus } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';
import toast from 'react-hot-toast';

const AuthScreen = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error('Username and password are required');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const data = await loginUser(username, password);
        toast.success(`Welcome back, ${data.username}!`);
        onLoginSuccess(data);
      } else {
        const data = await registerUser(username, password);
        toast.success('Registration successful! Logging you in...');
        onLoginSuccess(data);
      }
    } catch (error) {
      let msg = isLogin ? 'Login failed. Check your credentials.' : 'Registration failed. The server might be offline.';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          msg = error.response.data;
        } else if (error.response.data.message) {
          msg = error.response.data.message;
        }
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Package size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 600 }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {isLogin ? 'Sign in to access your inventory' : 'Join to manage your stock efficiently'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Username</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginTop: '0.5rem', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? <><LogIn size={18} /> Sign In</> : <><UserPlus size={18} /> Register</>)}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button 
            className="btn-ghost" 
            style={{ padding: '0', display: 'inline', color: 'var(--primary)', background: 'transparent', border: 'none' }}
            onClick={() => { setIsLogin(!isLogin); setUsername(''); setPassword(''); }}
            disabled={loading}
          >
            {isLogin ? "Register now" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
