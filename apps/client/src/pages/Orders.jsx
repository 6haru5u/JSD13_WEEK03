import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, QrCode, ShieldAlert, ArrowLeft, RefreshCw, XCircle } from 'lucide-react';

export default function Orders({ currentUser, onNavigate, triggerToast }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/bookings', {
        headers: {
          'x-user-id': currentUser.id
        }
      });
      if (!response.ok) throw new Error('Failed to retrieve ticket registry.');
      const data = await response.json();
      
      // Sort bookings by booking_date descending
      const sorted = data.sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));
      setBookings(sorted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!currentUser) {
      onNavigate('auth');
      return;
    }
    fetchBookings();
  }, [currentUser, onNavigate]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking and release your seats? This action cannot be undone.")) {
      return;
    }

    setCancellingId(bookingId);
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'x-user-id': currentUser.id
        }
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Cancellation failed');

      triggerToast('Booking cancelled. Seats have been released.', 'error');
      
      // Refresh list
      fetchBookings();
    } catch (err) {
      triggerToast(err.message, 'error');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 0' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Decryptioning booking ledger...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '100px', marginTop: '20px' }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '40px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h2 style={{ fontSize: '2.0rem', fontWeight: 800 }}>My Tickets</h2>
          <p style={{ color: 'var(--text-secondary)' }}>View your active admissions and entry QR pass logs.</p>
        </div>
        <button 
          onClick={() => onNavigate('home')} 
          className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px' }}
        >
          <ArrowLeft size={16} />
          Back to Shows
        </button>
      </div>

      {error && (
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          color: 'var(--accent-error)',
          marginBottom: '30px'
        }}>
          ⚠️ {error}
        </div>
      )}

      {bookings.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 0',
          background: 'var(--bg-secondary)',
          border: '1px solid rgba(255,255,255,0.04)',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-secondary)'
          }}>
            <QrCode size={28} />
          </div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 600 }}>No tickets booked</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '320px' }}>
            You don't have any tickets active. Select a show, choose your seats, and complete payment.
          </p>
          <button 
            onClick={() => onNavigate('home')} 
            className="btn btn-primary btn-glow"
            style={{ padding: '10px 24px', borderRadius: '30px', marginTop: '10px' }}
          >
            Find Performances
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {bookings.map((booking) => (
            <div 
              key={booking.id} 
              className="glass-panel"
              style={{
                padding: '30px',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
                background: booking.status === 'Cancelled' ? 'rgba(3,3,7,0.3)' : 'var(--glass-bg)',
                opacity: booking.status === 'Cancelled' ? 0.6 : 1
              }}
            >
              {/* Booking meta row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255,255,255,0.04)'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 650 }}>BOOKING ID</span>
                  <span style={{
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.05em'
                  }}>
                    {booking.id}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={13} color="var(--accent-primary)" />
                    <span>Booked on: {new Date(booking.booking_date).toLocaleDateString()}</span>
                  </div>

                  {/* Status Badge */}
                  <span style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 750,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    backgroundColor: booking.status === 'Cancelled' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid',
                    borderColor: booking.status === 'Cancelled' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)',
                    color: booking.status === 'Cancelled' ? 'var(--accent-error)' : 'var(--accent-success)'
                  }}>
                    ● {booking.status}
                  </span>
                </div>
              </div>

              {/* Concert info sub banner */}
              {booking.concert && (
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <img
                    src={booking.concert.image}
                    alt={booking.concert.title}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{booking.concert.title}</h3>
                    <span style={{ fontSize: '0.85rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>{booking.concert.artist.name}</span>
                    <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={11} /> {booking.concert.concert_date}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={11} /> {booking.concert.venue.venue_name}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Digital E-Tickets layout display */}
              {booking.status !== 'Cancelled' && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  marginTop: '10px'
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Digital Admission Passes
                  </span>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '20px'
                  }}>
                    {booking.tickets.map((ticket, idx) => (
                      <div 
                        key={idx}
                        style={{
                          background: 'linear-gradient(135deg, rgba(25, 25, 45, 0.45) 0%, rgba(10, 10, 20, 0.45) 100%)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: '16px',
                          display: 'flex',
                          overflow: 'hidden',
                          position: 'relative'
                        }}
                      >
                        {/* E-Ticket Details (Left) */}
                        <div style={{
                          padding: '20px',
                          flexGrow: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 700 }}>ADMISSION TICKET</span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                              {ticket.zone}
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '20px' }}>
                            <div>
                              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block' }}>SEAT</span>
                              <strong style={{ fontSize: '1.1rem', color: 'var(--accent-secondary)' }}>{ticket.seat_no}</strong>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block' }}>ROW</span>
                              <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{ticket.seat_no[0]}</strong>
                            </div>
                            <div>
                              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', display: 'block' }}>PRICE</span>
                              <strong style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>฿{ticket.price.toLocaleString()}</strong>
                            </div>
                          </div>

                          <span style={{ 
                            fontSize: '0.6rem', 
                            color: 'var(--text-muted)', 
                            fontFamily: 'monospace',
                            marginTop: 'auto',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            maxWidth: '170px'
                          }}>
                            {ticket.qr_code.substr(0, 24)}...
                          </span>
                        </div>

                        {/* Ticket perforated tear lines indicator */}
                        <div style={{
                          width: '1px',
                          borderLeft: '2px dashed rgba(255, 255, 255, 0.08)',
                          position: 'relative',
                          margin: '10px 0'
                        }}>
                          {/* Inner dot notch (top) */}
                          <div style={{
                            position: 'absolute', top: '-18px', left: '-7px',
                            width: '12px', height: '12px', borderRadius: '50%',
                            backgroundColor: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.04)'
                          }} />
                          {/* Inner dot notch (bottom) */}
                          <div style={{
                            position: 'absolute', bottom: '-18px', left: '-7px',
                            width: '12px', height: '12px', borderRadius: '50%',
                            backgroundColor: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.04)'
                          }} />
                        </div>

                        {/* QR Code section (Right) */}
                        <div style={{
                          width: '110px',
                          background: 'rgba(255, 255, 255, 0.01)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          padding: '12px'
                        }}>
                          {/* Simulated High-tech QR Code Box */}
                          <div style={{
                            width: '74px',
                            height: '74px',
                            backgroundColor: 'white',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4px',
                            boxShadow: '0 0 10px rgba(255,255,255,0.08)'
                          }}>
                            <QrCode size={66} color="#000000" strokeWidth={1.5} />
                          </div>
                          <span style={{ fontSize: '0.6rem', color: 'var(--accent-success)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            ✓ ACTIVE PASS
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Order total & cancellation options */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255,255,255,0.04)',
                marginTop: '10px'
              }}>
                <div style={{ display: 'flex', gap: '30px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>BILLING</span>
                    <strong>{booking.payment?.payment_method || 'CyberWallet'}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>TRANSACTION</span>
                    <strong style={{ fontFamily: 'monospace' }}>{booking.payment?.transaction_id || 'N/A'}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>TOTAL PAID</span>
                    <span style={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      fontFamily: 'var(--font-display)'
                    }}>
                      ฿{booking.total_price.toLocaleString()}
                    </span>
                  </div>

                  {booking.status === 'Paid' && (
                    <button
                      disabled={cancellingId === booking.id}
                      onClick={() => handleCancelBooking(booking.id)}
                      className="btn btn-secondary"
                      style={{
                        padding: '10px 16px',
                        borderColor: 'rgba(239, 68, 68, 0.2)',
                        color: 'var(--accent-error)',
                        background: 'rgba(239, 68, 68, 0.02)',
                        fontSize: '0.82rem',
                        cursor: cancellingId === booking.id ? 'not-allowed' : 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.02)';
                        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                      }}
                    >
                      {cancellingId === booking.id ? (
                        <>
                          <RefreshCw size={14} className="spin" />
                          Cancelling...
                        </>
                      ) : (
                        <>
                          <XCircle size={14} />
                          Cancel Ticket
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
