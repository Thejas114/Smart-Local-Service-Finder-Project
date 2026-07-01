import React, { useState, useEffect } from 'react';
import { MockApi } from '../services/MockApi';
import ProviderCard from '../components/ProviderCard';
import { MapPin } from 'lucide-react';
import './Dashboard.css';

const categories = ['All', 'Plumber', 'Electrician', 'Cleaning', 'Repairs'];

function Dashboard() {
  const [providersState, setProvidersState] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Geolocation
  const [locationStatus, setLocationStatus] = useState('detecting'); // detecting, detected, denied
  const [coords, setCoords] = useState(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
          setLocationStatus('detected');
        },
        () => {
          setLocationStatus('denied');
        }
      );
    } else {
      setLocationStatus('denied');
    }
  }, []);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const data = await MockApi.getProviders(
          activeCategory, 
          coords?.lat, 
          coords?.lng
        );
        setProvidersState(data);
      } catch (error) {
        console.error("Failed to fetch providers", error);
      } finally {
        setLoading(false);
      }
    };

    if (locationStatus !== 'detecting') {
      fetchProviders();
    }
  }, [activeCategory, locationStatus, coords]);

  return (
    <div className="dashboard animate-fade-in">
      <div className="dashboard-header flex-col" style={{ alignItems: 'flex-start' }}>
        <h1 className="text-gradient">Near You</h1>
        <p className="text-muted mt-2">Find the best local professionals instantly.</p>
        
        <div className="location-banner mt-4 glass flex items-center gap-2" style={{ padding: '0.5rem 1rem', width: 'auto' }}>
          <MapPin size={16} className={locationStatus === 'detected' ? 'text-accent' : 'text-muted'} />
          <span className="text-sm text-muted">
            {locationStatus === 'detecting' && 'Detecting your location...'}
            {locationStatus === 'detected' && 'Showing providers nearest to your location'}
            {locationStatus === 'denied' && 'Location not available. Showing default providers.'}
          </span>
        </div>
      </div>

      <div className="categories-scroll">
        {categories.map(cat => (
          <button 
            key={cat} 
            className={`chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {(loading || locationStatus === 'detecting') ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>{locationStatus === 'detecting' ? 'Locating you...' : 'Finding providers...'}</p>
        </div>
      ) : (
        <div className="providers-grid">
          {providersState.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
          {providersState.length === 0 && (
            <div className="empty-state text-muted">
              No providers found for this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
