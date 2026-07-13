import React, { useState } from 'react';
import SeatSelector from '../components/SeatSelector';
import { Calendar, MapPin, Search, Star, Clock, X, BadgeInfo, Music, Shield } from 'lucide-react';

export default function Home({
  products, // In this context: concerts list
  onAddToCart, // In this context: reserves selected seats
  searchQuery,
  onExploreClick,
  productsRef,
  currentUser
}) {
  const [selectedConcert, setSelectedConcert] = useState(null);

  // Filter concerts based on title, artist, or venue
  const filteredConcerts = products.filter(concert => {
    const query = searchQuery.toLowerCase();
    return (
      concert.title.toLowerCase().includes(query) ||
      concert.artist.name.toLowerCase().includes(query) ||
      concert.venue.venue_name.toLowerCase().includes(query)
    );
  });

  return (
    <div style={{ paddingBottom: '100px' }}>
      
      {/* Premium Concert Lights Hero Banner */}
      <section className="glass-panel" style={{
        margin: '0 24px 40px 24px',
        padding: '90px 40px',
        borderRadius: '24px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.04)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Stage Grid mesh layout background */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.01) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.01) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        {/* Ambient colored lighting glows */}
        <div style={{
          position: 'absolute', width: '500px', height: '300px',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 80%)',
          top: '-20%', left: '15%', zIndex: 0, filter: 'blur(50px)'
        }} />
        <div style={{
          position: 'absolute', width: '500px', height: '300px',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 80%)',
          bottom: '-30%', right: '15%', zIndex: 0, filter: 'blur(50px)'
        }} />

        {/* Tagline */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '9999px',
          background: 'rgba(236, 72, 153, 0.08)',
          border: '1px solid rgba(236, 72, 153, 0.25)',
          color: '#f472b6',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '24px',
          position: 'relative',
          zIndex: 1,
          textTransform: 'uppercase',
          letterSpacing: '0.08em'
        }}>
          <Music size={14} />
          Premium Ticketing Arena
        </div>

        {/* Hero title */}
        <h1 style={{
          fontSize: '3.6rem',
          lineHeight: 1.1,
          marginBottom: '20px',
          maxWidth: '850px',
          position: 'relative',
          zIndex: 1,
          fontFamily: 'var(--font-display)',
          fontWeight: 800
        }}>
          Secure Your Portal To{' '}
          <span className="gradient-text glow-text" style={{
            background: 'linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent-primary) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Live Audio Frequencies
          </span>
        </h1>

        {/* Hero description */}
        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-secondary)',
          maxWidth: '600px',
          marginBottom: '35px',
          position: 'relative',
          zIndex: 1,
          lineHeight: 1.6
        }}>
          Real-time interactive seat layouts, digital e-ticket encryption, and secure entry booking logs. Handled by next-gen e-commerce frameworks.
        </p>

        {/* CTA */}
        <button 
          onClick={onExploreClick}
          className="btn btn-primary btn-glow"
          style={{ padding: '14px 28px', position: 'relative', zIndex: 1 }}
        >
          Book Live Tickets Now
        </button>
      </section>

      {/* Catalog Container */}
      <div ref={productsRef} className="container" style={{ marginTop: '50px' }}>
        <div style={{ marginBottom: '35px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Available Live Performances</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Select a show below to inspect venue seats and complete reservations.</p>
        </div>

        {/* Concert listings */}
        {filteredConcerts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '80px 0',
            background: 'var(--bg-secondary)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.04)'
          }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '8px' }}>No matches found</h3>
            <p style={{ color: 'var(--text-secondary)' }}>Try refining your query search parameters (e.g. search "Tokyo").</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
            gap: '30px'
          }}>
            {filteredConcerts.map((concert) => (
              <div 
                key={concert.id}
                className="glass-card"
                onClick={() => setSelectedConcert(concert)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '100%'
                }}
              >
                {/* Banner Image */}
                <div style={{
                  width: '100%',
                  height: '200px',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'rgba(0,0,0,0.2)'
                }}>
                  <img
                    src={concert.image}
                    alt={concert.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    className="concert-card-img"
                  />
                  <div style={{
                    position: 'absolute',
                    top: '12px', left: '12px', zIndex: 5
                  }}>
                    <span className="badge badge-new">{concert.artist.genre}</span>
                  </div>
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'linear-gradient(to bottom, transparent 50%, rgba(3,3,7,0.9) 100%)',
                    pointerEvents: 'none'
                  }} />
                </div>

                {/* Info details */}
                <div style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  flexGrow: 1,
                  gap: '12px'
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {concert.artist.name} ({concert.artist.country})
                  </span>

                  <h3 style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    lineHeight: 1.3,
                    color: 'var(--text-primary)',
                    minHeight: '52px'
                  }}>
                    {concert.title}
                  </h3>

                  {/* Date, Time, Venue lines */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <Calendar size={14} color="var(--accent-primary)" />
                      <span>{new Date(concert.concert_date).toLocaleDateString(undefined, {
                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                      })}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <Clock size={14} color="var(--accent-primary)" />
                      <span>{concert.start_time} - {concert.end_time} PM</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <MapPin size={14} color="var(--accent-primary)" />
                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {concert.venue.venue_name}
                      </span>
                    </div>
                  </div>

                  {/* Pricing and booking button footer */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: 'auto',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.04)'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>BASE PRICE</span>
                      <strong style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        ฿900+
                      </strong>
                    </div>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '0.82rem' }}
                    >
                      Book Seat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Concert details & Seating map MODAL */}
      {selectedConcert && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          {/* Backdrop */}
          <div 
            onClick={() => setSelectedConcert(null)}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(3, 3, 7, 0.85)',
              backdropFilter: 'blur(10px)',
              animation: 'fadeIn 0.25s forwards'
            }}
          />

          {/* Modal Box */}
          <div 
            className="glass-panel"
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '820px',
              maxHeight: '92vh',
              overflowY: 'auto',
              zIndex: 1,
              borderRadius: '24px',
              border: '1px solid var(--glass-border)',
              padding: '30px',
              animation: 'scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.2) forwards'
            }}
          >
            {/* Close */}
            <button
              onClick={() => setSelectedConcert(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-muted)',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)',
                zIndex: 10
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <X size={18} />
            </button>

            {/* Concert info summary inside modal */}
            <div style={{
              display: 'flex',
              gap: '24px',
              paddingBottom: '20px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}>
              <img
                src={selectedConcert.image}
                alt={selectedConcert.title}
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
                <span className="badge badge-featured" style={{ width: 'fit-content' }}>
                  {selectedConcert.artist.genre}
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.2 }}>{selectedConcert.title}</h2>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={13} color="var(--accent-primary)" /> {selectedConcert.concert_date}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={13} color="var(--accent-primary)" /> {selectedConcert.start_time} - {selectedConcert.end_time}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={13} color="var(--accent-primary)" /> {selectedConcert.venue.venue_name} ({selectedConcert.venue.address})</span>
                </div>
              </div>
            </div>

            {/* Embed the seat map layout component */}
            <SeatSelector
              concert={selectedConcert}
              currentUser={currentUser}
              onAddToCart={(seats) => {
                onAddToCart(seats, selectedConcert); // pass seats and show info back to App.jsx pipeline
                setSelectedConcert(null); // close details modal
              }}
              onClose={() => setSelectedConcert(null)}
            />

          </div>
        </div>
      )}

      {/* Hover visual rules for cards */}
      <style>{`
        .glass-card:hover .concert-card-img {
          transform: scale(1.06);
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
