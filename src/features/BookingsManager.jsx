import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, XCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MockApi } from '../services/MockApi';
import './BookingsManager.css';

function BookingsManager() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    
    const fetchBookings = async () => {
      setLoading(true);
      const data = await MockApi.getUserBookings(user.id);
      setBookings(data);
      setLoading(false);
    };
    fetchBookings();
  }, [user, navigate]);

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      await MockApi.cancelBooking(bookingId);
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b));
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Confirmed': return 'status-confirmed';
      case 'Pending': return 'status-pending';
      case 'Completed': return 'status-completed';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="bookings-container animate-fade-in">
      <h1 className="mb-4">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="empty-state text-muted glass-panel">
          You have no bookings yet. 
          <br /><br />
          <button className="btn-primary" onClick={() => navigate('/')}>Find Services</button>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking.id} className="booking-card glass">
              <div className="booking-header">
                <div className="flex items-center gap-3">
                  {booking.providerImage ? (
                    <img src={booking.providerImage} alt={booking.providerName} className="booking-avatar" />
                  ) : (
                    <div className="booking-avatar fallback"></div>
                  )}
                  <div>
                    <h3 style={{ margin: 0 }}>{booking.providerName}</h3>
                    <span className={`status-badge ${getStatusClass(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
                {['Pending', 'Confirmed'].includes(booking.status) && (
                  <button 
                    className="cancel-btn"
                    onClick={() => handleCancel(booking.id)}
                    title="Cancel Booking"
                  >
                    <XCircle size={20} />
                  </button>
                )}
              </div>
              <div className="booking-details text-muted">
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>{new Date(booking.date).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <Clock size={16} />
                  <span>{booking.timeSlot}</span>
                </div>
                <div className="detail-item">
                  <MapPin size={16} />
                  <span>At your location</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingsManager;
