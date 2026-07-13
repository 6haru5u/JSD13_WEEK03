import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Orders from './pages/Orders';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activePage, setActivePage] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Core Ticketing State
  const [products, setProducts] = useState([]); // Concerts list
  const [cartItems, setCartItems] = useState([]); // Currently selected seats
  const [currentConcert, setCurrentConcert] = useState(null); // Concert related to selected seats
  const [currentUser, setCurrentUser] = useState(null);

  // UX Toast Notification State
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  // Scroll Target Reference
  const productsRef = useRef(null);

  // 1. Restore session on mount & fetch shows
  useEffect(() => {
    const savedUser = localStorage.getItem('aura_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    fetchConcerts();
  }, []);

  // Sync session changes (e.g. if user logs out, clear selected seats)
  useEffect(() => {
    if (!currentUser) {
      setCartItems([]);
      setCurrentConcert(null);
    }
  }, [currentUser]);

  // Toast Helper
  const triggerToast = (message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // --- API CALLS ---

  const fetchConcerts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/concerts');
      if (!response.ok) throw new Error('Could not fetch concerts list.');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      triggerToast('Server offline. Verify your Express API is running.', 'error');
    }
  };

  // --- SEAT RESERVATION HANDLING ---

  const handleAddToCart = (selectedSeats, concert) => {
    // If selecting seats for a different concert, overwrite cart with new choice
    if (currentConcert && currentConcert.id !== concert.id) {
      setCartItems(selectedSeats);
      setCurrentConcert(concert);
      triggerToast(`Cleared previous selection. Reserved ${selectedSeats.length} seats for ${concert.title}.`);
    } else {
      // Add unique seats
      const newItems = [...cartItems];
      selectedSeats.forEach(seat => {
        if (!newItems.some(i => i.id === seat.id)) {
          newItems.push(seat);
        }
      });
      setCartItems(newItems);
      setCurrentConcert(concert);
      triggerToast(`Reserved ${selectedSeats.length} seats for ${concert.title}.`);
    }
    setCartOpen(true);
  };

  const handleRemoveFromCart = (seatId) => {
    const targetSeat = cartItems.find(item => item.id === seatId);
    const updated = cartItems.filter(item => item.id !== seatId);
    setCartItems(updated);
    
    if (updated.length === 0) {
      setCurrentConcert(null);
    }

    if (targetSeat) {
      triggerToast(`Released seat ${targetSeat.seat_number}.`, 'error');
    }
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      setCartOpen(false);
      setActivePage('auth');
      triggerToast('Authentication is required to complete seat bookings.', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({
          concertId: currentConcert.id,
          selectedSeats: cartItems,
          paymentMethod: 'CyberWallet'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Checkout booking request failed.');
      }

      // Success
      setCartItems([]);
      setCurrentConcert(null);
      setCartOpen(false);
      triggerToast('Booking confirmed! E-Tickets issued successfully.');
      setActivePage('orders');
    } catch (err) {
      triggerToast(err.message, 'error');
    }
  };

  // --- USER AUTHENTICATION ---

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('aura_user', JSON.stringify(user));
    triggerToast(`Authenticated as ${user.name}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('aura_user');
    setCartItems([]);
    setCurrentConcert(null);
    setActivePage('home');
    triggerToast('Logged out.', 'error');
  };

  // --- UX ACTIONS ---

  const handleExploreClick = () => {
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar navigation */}
      <Navbar
        cartCount={cartItems.length}
        onOpenCart={() => setCartOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activePage={activePage}
        onNavigate={setActivePage}
      />

      {/* Cart sidebar drawer overlay */}
      <Cart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
        currentUser={currentUser}
        currentConcert={currentConcert}
      />

      {/* Main Pages viewport router */}
      <main style={{ flexGrow: 1 }}>
        {activePage === 'home' && (
          <Home
            products={products}
            onAddToCart={handleAddToCart}
            searchQuery={searchQuery}
            onExploreClick={handleExploreClick}
            productsRef={productsRef}
            currentUser={currentUser}
          />
        )}
        {activePage === 'auth' && (
          <Auth
            onAuthSuccess={handleAuthSuccess}
            onNavigate={setActivePage}
          />
        )}
        {activePage === 'orders' && (
          <Orders
            currentUser={currentUser}
            onNavigate={setActivePage}
            triggerToast={triggerToast}
          />
        )}
      </main>

      {/* Futuristic footer */}
      <footer style={{
        padding: '30px 24px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        backgroundColor: 'rgba(3, 3, 7, 0.5)',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        marginTop: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>AURA Command Ticketing</span>
          <span>•</span>
          <span>MERN Concert Registry Showcase</span>
        </div>
        <p>© 2026 AURA Inc. Project compiled under Antigravity.</p>
      </footer>

      {/* Floating neon status toasts */}
      {toast && (
        <div 
          className="toast glass-panel"
          style={{
            borderLeft: `4px solid ${toast.type === 'error' ? 'var(--accent-error)' : 'var(--accent-success)'}`,
            backgroundColor: 'rgba(11, 11, 20, 0.95)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6)'
          }}
        >
          {toast.type === 'error' ? (
            <AlertCircle size={18} color="var(--accent-error)" />
          ) : (
            <CheckCircle2 size={18} color="var(--accent-success)" />
          )}
          <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            {toast.message}
          </span>
        </div>
      )}
    </div>
  );
}
