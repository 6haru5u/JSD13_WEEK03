import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function Hero({ onExploreClick }) {
  return (
    <section className="glass-panel" style={{
      margin: '0 24px 40px 24px',
      padding: '80px 40px',
      borderRadius: '24px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Background Cyber Mesh Grid Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Floating Radial Glows */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)',
        top: '-10%',
        left: '20%',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
        bottom: '-15%',
        right: '15%',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Hero Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 14px',
        borderRadius: '9999px',
        background: 'rgba(139, 92, 246, 0.08)',
        border: '1px solid rgba(139, 92, 246, 0.25)',
        color: '#c084fc',
        fontSize: '0.8rem',
        fontWeight: 600,
        marginBottom: '24px',
        position: 'relative',
        zIndex: 1,
        textTransform: 'uppercase',
        letterSpacing: '0.08em'
      }}>
        <Sparkles size={14} />
        Hyper-Aesthetic Workspace Gear
      </div>

      {/* Hero Title */}
      <h1 style={{
        fontSize: '3.8rem',
        lineHeight: 1.1,
        marginBottom: '20px',
        maxWidth: '850px',
        position: 'relative',
        zIndex: 1,
        fontFamily: 'var(--font-display)',
        fontWeight: 850
      }}>
        Experience the Future of{' '}
        <span className="gradient-text glow-text" style={{
          background: 'linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent-primary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Digital Command Centers
        </span>
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: '1.2rem',
        color: 'var(--text-secondary)',
        maxWidth: '620px',
        marginBottom: '40px',
        position: 'relative',
        zIndex: 1,
        fontWeight: 400
      }}>
        Meticulously engineered peripherals, custom-curated audio, and glowing QD-OLED smart displays designed to elevate your cognitive workflow.
      </p>

      {/* CTA Buttons */}
      <div style={{
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <button 
          onClick={onExploreClick}
          className="btn btn-primary btn-glow"
          style={{ padding: '14px 28px' }}
        >
          Explore Collection
          <ArrowRight size={18} />
        </button>
        <button 
          onClick={onExploreClick}
          className="btn btn-secondary"
          style={{ padding: '14px 28px' }}
        >
          View Featured
        </button>
      </div>

      {/* Features Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '40px',
        marginTop: '60px',
        paddingTop: '30px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        width: '80%',
        maxWidth: '700px',
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={16} color="var(--accent-secondary)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Instant Local Sync
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="var(--accent-primary)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Secured Checkout
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={16} color="#fbbf24" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Premium Materials
          </span>
        </div>
      </div>
    </section>
  );
}
