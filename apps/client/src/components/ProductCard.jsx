import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onProductClick }) {
  const { name, price, description, category, image, rating, reviews, featured } = product;

  return (
    <div 
      className="glass-card" 
      onClick={() => onProductClick(product)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {/* Featured Badge */}
      {featured && (
        <span 
          className="badge badge-featured" 
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            zIndex: 10
          }}
        >
          Featured
        </span>
      )}

      {/* Product Image Container */}
      <div style={{
        width: '100%',
        height: '220px',
        overflow: 'hidden',
        position: 'relative',
        background: 'rgba(0, 0, 0, 0.2)'
      }}>
        <img 
          src={image} 
          alt={name} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)'
          }}
          className="product-img"
        />
        {/* Hover overlay glow */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, transparent 60%, rgba(10, 10, 15, 0.8) 100%)',
          pointerEvents: 'none'
        }} />
      </div>

      {/* Details Area */}
      <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        gap: '12px'
      }}>
        {/* Category */}
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--accent-secondary)',
          textTransform: 'uppercase',
          fontWeight: 700,
          letterSpacing: '0.05em'
        }}>
          {category}
        </span>

        {/* Name */}
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 650,
          lineHeight: 1.3,
          color: 'var(--text-primary)',
          height: '52px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical'
        }}>
          {name}
        </h3>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div style={{ display: 'flex', color: '#fbbf24' }}>
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                fill={i < Math.floor(rating) ? '#fbbf24' : 'none'} 
                strokeWidth={1.5}
              />
            ))}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {rating} <span style={{ color: 'var(--text-muted)' }}>({reviews})</span>
          </span>
        </div>

        {/* Description Snippet */}
        <p style={{
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          height: '40px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          marginBottom: '8px'
        }}>
          {description}
        </p>

        {/* Footer: Price and Add-To-Cart */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.04)'
        }}>
          <span style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)'
          }}>
            ${price.toFixed(2)}
          </span>
          
          <button
            onClick={(e) => {
              e.stopPropagation(); // Avoid opening the product modal
              onAddToCart(product);
            }}
            className="btn btn-primary"
            style={{
              padding: '10px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Add to Cart"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .glass-card:hover .product-img {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
