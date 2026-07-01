import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import './ProviderCard.css';

function ProviderCard({ provider }) {
  return (
    <div className="provider-card glass animate-fade-in">
      <div className="provider-image">
        <img src={provider.image} alt={provider.name} />
        <div className="provider-category">{provider.category}</div>
        <div className={`provider-status-badge ${provider.isOnline ? 'online' : 'offline'}`}>
          {provider.isOnline ? 'Online' : 'Offline'}
        </div>
      </div>
      <div className="provider-info">
        <div className="flex justify-between items-center">
          <h3 className="provider-name">{provider.name}</h3>
          <div className="provider-rating">
            <Star size={14} className="star-icon" fill="currentColor" />
            <span>{provider.rating}</span>
            <span className="text-muted">({provider.reviews})</span>
          </div>
        </div>
        
        <div className="provider-details text-muted mt-2">
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span>{provider.distance} away</span>
          </div>
          <div className="provider-price">{provider.price}</div>
        </div>

        <Link to={`/provider/${provider.id}`} className="btn-primary w-full mt-4" style={{ textDecoration: 'none' }}>
          View Profile
        </Link>
      </div>
    </div>
  );
}

export default ProviderCard;
