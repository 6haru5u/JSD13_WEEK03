import React, { useState } from 'react';
import { User, Mail, Lock, Phone, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Auth({ onAuthSuccess, onNavigate }) {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin 
      ? { email, password } 
      : { firstName, lastName, email, phone, password };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication process failed.');
      }

      onAuthSuccess(data.user);
      onNavigate('home');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px 100px 24px',
      minHeight: '75vh'
    }}>
      <div 
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '40px',
          border: '1px solid var(--glass-border)'
        }}
      >
        {/* Toggle Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          marginBottom: '30px'
        }}>
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            style={{
              flex: 1,
              paddingBottom: '14px',
              background: 'none',
              border: 'none',
              color: isLogin ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 650,
              fontSize: '1rem',
              cursor: 'pointer',
              position: 'relative',
              transition: 'var(--transition-smooth)'
            }}
          >
            Log In
            {isLogin && (
              <span style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, var(--accent-secondary), var(--accent-primary))'
              }} />
            )}
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            style={{
              flex: 1,
              paddingBottom: '14px',
              background: 'none',
              border: 'none',
              color: !isLogin ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: 650,
              fontSize: '1rem',
              cursor: 'pointer',
              position: 'relative',
              transition: 'var(--transition-smooth)'
            }}
          >
            Register
            {!isLogin && (
              <span style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, var(--accent-secondary), var(--accent-primary))'
              }} />
            )}
          </button>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {isLogin ? 'Welcome Back Commander' : 'Create Booking Account'}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {isLogin ? 'Access your orders & seat selections.' : 'Sign up to reserve concert tickets.'}
          </p>
        </div>

        {/* Errors */}
        {error && (
          <div style={{
            padding: '12px 16px',
            borderRadius: '10px',
            backgroundColor: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: 'var(--accent-error)',
            fontSize: '0.85rem',
            marginBottom: '20px',
            fontWeight: 500
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit}>
          {/* First/Last Name (Register only) */}
          {!isLogin && (
            <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="reg-first">First Name</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '14px' }} />
                  <input
                    id="reg-first"
                    type="text"
                    placeholder="John"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="reg-last">Last Name</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '14px' }} />
                  <input
                    id="reg-last"
                    type="text"
                    placeholder="Doe"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '40px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Email Address */}
          <div className="form-group">
            <label htmlFor="reg-email">Email Address</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '14px' }} />
              <input
                id="reg-email"
                type="email"
                placeholder="john.doe@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          {/* Phone Field (Register only) */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="reg-phone">Phone Number</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Phone size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '14px' }} />
                <input
                  id="reg-phone"
                  type="tel"
                  placeholder="0812345678"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                />
              </div>
            </div>
          )}

          {/* Password Field */}
          <div className="form-group" style={{ marginBottom: '28px' }}>
            <label htmlFor="reg-pass">Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '14px' }} />
              <input
                id="reg-pass"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            className="btn btn-primary btn-glow"
            style={{ width: '100%', padding: '14px' }}
            disabled={loading}
          >
            {loading ? 'Establishing Authentication...' : isLogin ? 'Access Command Portal' : 'Create Identity'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* Security Footer */}
        <div style={{
          marginTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <ShieldCheck size={14} color="var(--accent-secondary)" />
          Protected by Secure Auth Encryption
        </div>
      </div>
    </div>
  );
}
