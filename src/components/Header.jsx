import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, LogOut, FileText, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../features/AuthModal';
import './Header.css';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="app-header glass">
        <div className="container header-content">
          <Link to="/" className="brand-logo">
            <span className="text-gradient">Servy</span>Local
          </Link>
          <div className="search-bar glass">
            <Search size={18} className="text-muted" />
            <input type="text" placeholder="Search for services..." className="search-input" />
          </div>
          <div className="header-actions">
            {!user ? (
              <button className="btn-primary" onClick={() => setIsAuthOpen(true)}>
                Login
              </button>
            ) : (
              <div className="user-menu-container">
                <button 
                  className="user-avatar-btn" 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <div className="user-avatar">
                    <UserIcon size={20} className="text-muted" />
                  </div>
                  <span className="user-name">{user.name.split(' ')[0]}</span>
                </button>
                
                {isMenuOpen && (
                  <div className="dropdown-menu glass">
                    <div className="dropdown-header">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-muted text-sm">{user.email}</p>
                      <span className="chip mt-2" style={{ display: 'inline-block', fontSize: '0.7rem' }}>
                        {user.role.toUpperCase()}
                      </span>
                    </div>
                    <div className="dropdown-divider"></div>
                    {user.role === 'user' && (
                      <Link to="/bookings" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                        <FileText size={16} /> My Bookings
                      </Link>
                    )}
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}

export default Header;
