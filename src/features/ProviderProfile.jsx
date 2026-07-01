import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MockApi } from '../services/MockApi';
import { Star, MapPin, ArrowLeft, CheckCircle, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ChatModal from './ChatModal';
import './ProviderProfile.css';

function ProviderProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Booking state
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  
  // Chat state
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const fetchProvider = async () => {
      setLoading(true);
      const data = await MockApi.getProviderById(id);
      setProvider(data);
      setLoading(false);
    };
    fetchProvider();
  }, [id]);

  const handleBooking = async () => {
    if (!selectedSlot) return;
    if (!user) {
      alert("Please login first to book an appointment.");
      return;
    }
    setBookingLoading(true);
    await MockApi.createBooking(user.id, provider.id, selectedSlot, new Date().toISOString());
    setBookingLoading(false);
    setBookingConfirmed(true);
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!provider) {
    return <div className="text-center mt-4">Provider not found</div>;
  }

  return (
    <div className="profile-container animate-fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} /> Back
      </button>

      <div className="profile-hero glass-panel">
        <div className="profile-hero-content">
          <div className="profile-avatar">
            <img src={provider.image} alt={provider.name} />
          </div>
          <div className="profile-hero-info">
            <div className="chip">{provider.category}</div>
            <h1>{provider.name}</h1>
            <div className="flex gap-4 items-center">
              <div className="provider-rating text-muted">
                <Star size={16} fill="#fbbf24" color="#fbbf24" />
                <span>{provider.rating}</span>
                <span>({provider.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2 text-muted">
                <MapPin size={16} />
                <span>{provider.distance}</span>
              </div>
            </div>
          </div>
          <div className="profile-price">
            <div className="price-tag">{provider.price}</div>
          </div>
        </div>
        
        <div className="profile-about mt-4">
          <h3>About</h3>
          <p className="text-muted">{provider.about}</p>
        </div>
      </div>

      <div className="booking-section mt-4">
        {bookingConfirmed ? (
          <div className="success-state glass-panel animate-fade-in">
            <CheckCircle size={48} className="text-accent mb-2" />
            <h2>Booking Confirmed!</h2>
            <p className="text-muted text-center max-w-md">
              Your appointment with {provider.name} for {selectedSlot} has been confirmed.
            </p>
            <div className="flex gap-4 mt-4 w-full justify-center">
              <button className="btn-secondary" onClick={() => navigate('/')}>
                Back to Home
              </button>
              <button className="btn-primary" onClick={() => setChatOpen(true)}>
                <MessageSquare size={18} /> Chat Now
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-panel availability-panel">
            <h3>Availabilities Today</h3>
            <div className="slots-grid mt-4">
              {provider.availability.map(slot => (
                <button
                  key={slot}
                  className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
            <button 
              className="btn-primary w-full mt-6" 
              disabled={!selectedSlot || bookingLoading}
              onClick={handleBooking}
            >
              {bookingLoading ? 'Confirming...' : 'Book Appointment'}
            </button>
          </div>
        )}
      </div>

      {chatOpen && (
        <ChatModal 
          provider={provider} 
          onClose={() => setChatOpen(false)} 
        />
      )}
    </div>
  );
}

export default ProviderProfile;
