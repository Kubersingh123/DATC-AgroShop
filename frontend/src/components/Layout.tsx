import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Role } from '../types';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  roles?: Role[];
}

const navItems: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/products', label: 'Products', icon: '🌾' },
  { to: '/inventory', label: 'Inventory', icon: '📦', roles: ['admin', 'manager'] },
  { to: '/sales', label: 'Sales & Billing', icon: '🧾' },
  { to: '/customers', label: 'Customers', icon: '👥' },
  { to: '/payments', label: 'Payments', icon: '💰', roles: ['admin', 'manager'] },
  { to: '/suppliers', label: 'Suppliers', icon: '🚚' },
  { to: '/reports', label: 'Reports', icon: '📈', roles: ['admin', 'manager'] }
];

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="app-shell">
      {/* Mobile Navbar */}
      <nav className="mobile-navbar">
        <div className="mobile-nav-header">
          <div className="mobile-brand">
            <img
              src="/datc-logo.jpg"
              alt="DATC AgroShop logo"
              className="brand-logo"
            />
            <div>
              <p className="brand-title">DATC AgroShop</p>
            </div>
          </div>
          <div className="mobile-nav-right">
            {user && (
              <div className="user-pill">
                <div className="avatar">{user.name.charAt(0)}</div>
                <div>
                  <p className="user-name">{user.name}</p>
                  <p className="user-role">{user.role.toUpperCase()}</p>
                </div>
              </div>
            )}
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="mobile-nav-menu">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? 'active' : ''}`
                }
                onClick={handleNavClick}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
            <div className="mobile-nav-footer">
              {user && (
                <div className="mobile-user-info">
                  <div className="avatar">{user.name.charAt(0)}</div>
                  <div>
                    <p className="user-name">{user.name}</p>
                    <p className="user-role">{user.role.toUpperCase()}</p>
                  </div>
                </div>
              )}
              <button type="button" className="btn-secondary small" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <img
            src="/datc-logo.jpg"
            alt="DATC AgroShop logo"
            className="brand-logo"
          />
          <div>
            <p className="brand-title">DATC AgroShop</p>
            <p className="brand-subtitle">Deepak Agriculture & Trading Co.</p>
          </div>
        </div>
        <nav className="sidebar-nav">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p className="footer-title">Need help?</p>
          <p className="footer-subtitle">DATC@AgroShop.com</p>
          <button type="button" className="btn-secondary small" onClick={logout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="top-bar">
          <div>
            <p className="page-title">DATC AgroShop</p>
            <p className="page-subtitle">
              Deepak Agriculture &amp; Trading Company
            </p>
          </div>
          {user && (
            <div className="user-pill">
              <div className="avatar">{user.name.charAt(0)}</div>
              <div>
                <p className="user-name">{user.name}</p>
                <p className="user-role">{user.role.toUpperCase()}</p>
              </div>
            </div>
          )}
        </header>
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;

