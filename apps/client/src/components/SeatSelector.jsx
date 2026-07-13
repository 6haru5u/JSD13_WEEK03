import React, { useState, useEffect } from 'react';
import { ShieldCheck, Armchair, Ticket } from 'lucide-react';

export default function SeatSelector({
  concert,
  onAddToCart, // passes selected seats to main reservation pipeline
  onClose,
  currentUser
}) {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch seats for this specific concert
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/concerts/${concert.id}/seats`);
        if (!response.ok) throw new Error('Failed to load seating map');
        const data = await response.json();
        setSeats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSeats();
  }, [concert.id]);

  const handleSeatClick = (seat) => {
    if (seat.status !== 'Available') return;

    const exists = selectedSeats.find(s => s.id === seat.id);
    if (exists) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const getSeatClass = (seat) => {
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    if (isSelected) return 'seat-box seat-selected';
    if (seat.status === 'Booked') return 'seat-box seat-booked';
    
    if (seat.zone === 'VIP') return 'seat-box seat-available-vip';
    if (seat.zone === 'Zone A') return 'seat-box seat-available-zonea';
    return 'seat-box seat-available-zoneb';
  };

  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div style={{ padding: '10px 0' }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Scanning arena seat configurations...</p>
        </div>
      ) : error ? (
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          background: 'rgba(239, 68, 68, 0.08)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: 'var(--accent-error)',
          fontSize: '0.85rem'
        }}>
          ⚠️ {error}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Legend indicator */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            fontSize: '0.8rem',
            flexWrap: 'wrap',
            padding: '12px',
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.03)',
            borderRadius: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: 'rgba(251,191,36,0.1)', border: '1px solid var(--accent-vip)' }} />
              <span style={{ color: 'var(--accent-vip)', fontWeight: 600 }}>VIP (฿3,000)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: 'rgba(6,182,212,0.1)', border: '1px solid var(--accent-secondary)' }} />
              <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>Zone A (฿1,800)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.3)' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Zone B (฿900)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: 'var(--accent-primary)', border: '1px solid var(--accent-primary)' }} />
              <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Selected</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.1)' }} />
              <span style={{ color: 'var(--text-muted)' }}>Booked</span>
            </div>
          </div>

          {/* Interactive Concert Seating Layout Map */}
          <div style={{
            padding: '24px',
            background: 'rgba(0,0,0,0.2)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.02)'
          }}>
            {/* Front Stage Screen */}
            <div className="stage-screen">
              <div className="stage-label">STAGE</div>
            </div>

            {/* Seating Grid map */}
            <div className="seating-grid" style={{ marginTop: '50px' }}>
              {seats.map((seat) => (
                <div
                  key={seat.id}
                  className={getSeatClass(seat)}
                  onClick={() => handleSeatClick(seat)}
                  title={`${seat.zone} Seat ${seat.seat_number} - ฿${seat.price}`}
                >
                  {seat.seat_number}
                </div>
              ))}
            </div>
          </div>

          {/* Selection details checkout display */}
          <div style={{
            padding: '20px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.04)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Ticket size={14} color="var(--accent-secondary)" />
                Selected Seats ({selectedSeats.length})
              </span>
              <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)', minHeight: '22px' }}>
                {selectedSeats.length > 0
                  ? selectedSeats.map(s => `${s.zone}-${s.seat_number}`).join(', ')
                  : 'No seats selected'
                }
              </strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '2px' }}>TOTAL PRICE</span>
                <span style={{
                  fontSize: '1.6rem',
                  fontWeight: 800,
                  color: 'var(--accent-primary)',
                  fontFamily: 'var(--font-display)'
                }}>
                  ฿{totalAmount.toLocaleString()}
                </span>
              </div>

              <button
                disabled={selectedSeats.length === 0}
                onClick={() => {
                  onAddToCart(selectedSeats);
                  setSelectedSeats([]);
                }}
                className="btn btn-primary btn-glow"
                style={{
                  padding: '12px 24px',
                  opacity: selectedSeats.length === 0 ? 0.5 : 1,
                  cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <ShieldCheck size={18} />
                Reserve Seats
              </button>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
