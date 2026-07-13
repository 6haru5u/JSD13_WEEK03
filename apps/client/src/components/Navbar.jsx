import React from 'react';
import { ShoppingBag, User, Search, LogOut, ClipboardList, Compass } from 'lucide-react';

export default function Navbar({
  cartCount,
  onOpenCart,
  currentUser,
  onLogout,
  searchQuery,
  onSearchChange,
  activePage,
  onNavigate
}) {
  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: '20px',
      margin: '0 24px 30px 24px',
      zIndex: 1000,
      borderRadius: '20px',
      padding: '16px 30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Logo */}
      <div 
        onClick={() => onNavigate('home')} 
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <span style={{
          fontSize: '1.8rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #06b6d4 0%, #ec4899 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontFamily: 'var(--font-display)',
          letterSpacing: '0.05em'
        }}>
          AURA
        </span>
        <div style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-primary)',
          boxShadow: '0 0 10px var(--accent-primary)'
        }} />
      </div>

      {/* Search Input (only shown on Home page) */}
      {activePage === 'home' && (
        <div style={{
          position: 'relative',
          width: '35%',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Search 
            size={18} 
            color="var(--text-muted)" 
            style={{ position: 'absolute', left: '16px' }}
          />
          <input
            type="text"
            placeholder="Search concerts, venues, or artists..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              color: 'var(--text-primary)',
              outline: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              transition: 'var(--transition-smooth)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--accent-primary)';
              e.target.style.boxShadow = '0 0 15px rgba(236, 72, 153, 0.15)';
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.06)';
              e.target.style.boxShadow = 'none';
              e.target.style.background = 'rgba(255, 255, 255, 0.03)';
            }}
          />
        </div>
      )}

      {/* Nav Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Shows Link */}
        <span 
          onClick={() => onNavigate('home')} 
          style={{
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 500,
            color: activePage === 'home' ? 'var(--text-primary)' : 'var(--text-secondary)',
            transition: 'var(--transition-smooth)',
            position: 'relative',
            paddingBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
          className="nav-link"
        >
          <Compass size={16} />
          Concerts
          {activePage === 'home' && (
            <span style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '2px',
              background: 'linear-gradient(90deg, var(--accent-secondary), var(--accent-primary))',
              borderRadius: '2px'
            }} />
          )}
        </span>

        {/* Bookings Link (authenticated only) */}
        {currentUser && (
          <span 
            onClick={() => onNavigate('orders')} 
            style={{
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: activePage === 'orders' ? 'var(--text-primary)' : 'var(--text-secondary)',
              transition: 'var(--transition-smooth)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              position: 'relative',
              paddingBottom: '4px'
            }}
            className="nav-link"
          >
            <ClipboardList size={16} />
            My Tickets
            {activePage === 'orders' && (
              <span style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '2px',
                background: 'linear-gradient(90deg, var(--accent-secondary), var(--accent-primary))',
                borderRadius: '2px'
              }} />
            )}
          </span>
        )}

        {/* Auth / Account */}
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent-primary) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: 'white',
                boxShadow: '0 0 10px rgba(6, 182, 212, 0.4)'
              }}>
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                {currentUser.name.split(' ')[0]}
              </span>
            </div>
            <button 
              onClick={onLogout}
              title="Logout"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-error)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button 
            className="btn btn-secondary" 
            onClick={() => onNavigate('auth')}
            style={{
              padding: '8px 16px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem'
            }}
          >
            <User size={14} />
            Sign In
          </button>
        )}

        {/* Cart Icon & Count */}
        <button 
          onClick={onOpenCart}
          style={{
            background: 'none',
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-primary)',
            padding: '8px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            transition: 'var(--transition-smooth)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
          }}
        >
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: 'linear-gradient(135deg, var(--accent-primary) 0%, #db2777 100%)',
              color: 'white',
              fontSize: '0.7rem',
              fontWeight: 800,
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(236, 72, 153, 0.5)',
              animation: 'pulse 1.8s infinite'
            }}>
              {cartCount}
            </span>
          )}
        </button>
      </div>

      <style>{`
        .nav-link:hover {
          color: var(--text-primary) !important;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); box-shadow: 0 0 12px rgba(236, 72, 153, 0.7); }
          100% { transform: scale(1); }
        }
      `}</style>
    </nav>
  );
}
