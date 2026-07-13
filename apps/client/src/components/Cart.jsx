import React from 'react';
import { X, Trash2, Armchair, ArrowRight, ShieldCheck, Ticket, Calendar, MapPin } from 'lucide-react';

export default function Cart({
  isOpen,
  onClose,
  cartItems, // in this context: selected seats
  onRemove,
  onCheckout,
  currentUser,
  currentConcert // details of the concert currently being booked
}) {
  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 1500,
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(3, 3, 7, 0.8)',
          backdropFilter: 'blur(10px)',
          animation: 'fadeIn 0.3s forwards'
        }}
      />

      {/* Cart Drawer Container */}
      <div 
        className="glass-panel"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderLeft: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1,
          animation: 'slideLeft 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem' }}>
            <Armchair size={22} color="var(--accent-primary)" />
            Seat Registry
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.02)',
              transition: 'var(--transition-smooth)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {cartItems.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80%',
              textAlign: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(236, 72, 153, 0.08)',
                border: '1px solid rgba(236, 72, 153, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px',
                color: 'var(--accent-primary)',
                boxShadow: '0 0 20px rgba(236, 72, 153, 0.1)'
              }}>
                <Ticket size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>No seats reserved</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '280px' }}>
                Browse our concerts, choose an arena layout, and pick your favorite seats.
              </p>
              <button 
                onClick={onClose} 
                className="btn btn-primary"
                style={{ padding: '10px 20px', borderRadius: '30px', marginTop: '10px' }}
              >
                Find Concerts
              </button>
            </div>
          ) : (
            <>
              {/* Show details */}
              {currentConcert && (
                <div style={{
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.04)',
                  display: 'flex',
                  gap: '14px'
                }}>
                  <img
                    src={currentConcert.image}
                    alt={currentConcert.title}
                    style={{
                      width: '70px',
                      height: '70px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.3 }}>{currentConcert.title}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>{currentConcert.artist.name}</span>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '2px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {currentConcert.concert_date}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {currentConcert.venue.venue_name}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Reserved Seats List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  RESERVED SEATS
                </span>

                {cartItems.map((seat) => (
                  <div 
                    key={seat.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid rgba(255,255,255,0.03)',
                      borderRadius: '10px',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        background: seat.zone === 'VIP' ? 'rgba(251,191,36,0.1)' : seat.zone === 'Zone A' ? 'rgba(6,182,212,0.1)' : 'rgba(255,255,255,0.02)',
                        border: '1px solid',
                        borderColor: seat.zone === 'VIP' ? 'var(--accent-vip)' : seat.zone === 'Zone A' ? 'var(--accent-secondary)' : 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.8rem',
                        color: seat.zone === 'VIP' ? 'var(--accent-vip)' : seat.zone === 'Zone A' ? 'var(--accent-secondary)' : 'var(--text-primary)'
                      }}>
                        {seat.seat_number}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{seat.zone} Ticket</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Row {seat.seat_number[0]}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        ฿{seat.price.toLocaleString()}
                      </span>
                      <button
                        onClick={() => onRemove(seat.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'var(--transition-smooth)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-error)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                        title="Remove Seat Selection"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer Billing & Checkout */}
        {cartItems.length > 0 && (
          <div style={{
            padding: '24px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            backgroundColor: 'rgba(3, 3, 7, 0.4)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            {/* Subtotal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Ticket Subtotal</span>
              <span style={{
                fontSize: '1.6rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-display)'
              }}>
                ฿{totalAmount.toLocaleString()}
              </span>
            </div>

            {/* Delivery Alert banner */}
            <div style={{
              padding: '12px 16px',
              borderRadius: '10px',
              background: 'rgba(6, 182, 212, 0.05)',
              border: '1px solid rgba(6, 182, 212, 0.15)',
              fontSize: '0.8rem',
              color: 'var(--accent-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              🚀 <strong>Instant E-Ticket Delivery:</strong> Tickets are generated instantly with entry QR codes after payment verification.
            </div>

            {/* Checkout CTA */}
            {currentUser ? (
              <button 
                onClick={onCheckout}
                className="btn btn-primary btn-glow"
                style={{ width: '100%', padding: '14px' }}
              >
                Confirm Seating & Pay
                <ArrowRight size={18} />
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--accent-error)', textAlign: 'center', fontWeight: 600 }}>
                  Authentication is required to place booking!
                </p>
                <button 
                  onClick={onCheckout} /* Will navigate to auth */
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px' }}
                >
                  Log In to Book Tickets
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
