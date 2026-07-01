import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './AuthModal.css';

function AuthModal({ isOpen, onClose }) {
  const { login, signup, loading, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('user'); // 'user' or 'provider'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password, role);
      } else {
        await signup(formData.name, formData.email, formData.password, role);
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-overlay animate-fade-in" onClick={onClose}>
      <div className="auth-modal glass-panel" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><X size={20} /></button>
        
        <h2 className="text-center">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
        <p className="text-muted text-center mb-4">
          {isLogin ? 'Login to access your bookings and chats' : 'Sign up to find the best local providers'}
        </p>

        <div className="role-toggle mb-4">
          <button 
            className={`role-btn ${role === 'user' ? 'active' : ''}`}
            onClick={() => setRole('user')}
          >
            Customer
          </button>
          <button 
            className={`role-btn ${role === 'provider' ? 'active' : ''}`}
            onClick={() => setRole('provider')}
          >
            Provider
          </button>
        </div>

        {error && <div className="error-alert mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="input-group">
              <UserIcon size={18} className="input-icon" />
              <input 
                type="text" 
                name="name" 
                placeholder="Full Name" 
                value={formData.name} 
                onChange={handleChange}
                required
              />
            </div>
          )}
          <div className="input-group">
            <Mail size={18} className="input-icon" />
            <input 
              type="email" 
              name="email" 
              placeholder="Email (Provider eg: rahul@test.com)" 
              value={formData.email} 
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <Lock size={18} className="input-icon" />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange}
              required={isLogin || role === 'user'}
            />
          </div>

          <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="auth-footer mt-4">
          {isLogin ? (
            <p>Don't have an account? <span onClick={() => setIsLogin(false)}>Sign up</span></p>
          ) : (
             <p>Already have an account? <span onClick={() => setIsLogin(true)}>Login</span></p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
