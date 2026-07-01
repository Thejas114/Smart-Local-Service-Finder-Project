import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MockApi } from '../services/MockApi';
import { IndianRupee, Calendar as CalIcon, Clock, CheckCircle, XCircle } from 'lucide-react';
import './ProviderDashboard.css';

function ProviderDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [earnings, setEarnings] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      const bgs = await MockApi.getProviderBookings(user.id);
      setBookings(bgs);
      
      const providerInfo = await MockApi.getProviderById(user.id);
      if (providerInfo) {
        setIsOnline(providerInfo.isOnline);
        
        // Mock earnings: count completed bookings * price
        const priceNum = parseInt(providerInfo.price.replace(/[^0-9]/g, '')) || 500;
        const completedCount = bgs.filter(b => b.status === 'Completed').length;
        setEarnings(completedCount * priceNum);
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleToggleStatus = async () => {
    const newState = !isOnline;
    setIsOnline(newState);
    await MockApi.toggleProviderStatus(user.id, newState);
  };

  const updateBooking = async (id, status) => {
    await MockApi.updateBookingStatus(id, status);
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    
    // update earnings if completed
    if (status === 'Completed') {
      const providerInfo = await MockApi.getProviderById(user.id);
      const priceNum = parseInt(providerInfo.price.replace(/[^0-9]/g, '')) || 500;
      setEarnings(prev => prev + priceNum);
    }
  };

  if (loading) {
    return <div className="loading-state"><div className="spinner"></div></div>;
  }

  return (
    <div className="provider-dash animate-fade-in">
      <div className="dash-header mb-4">
        <h1>Provider Dashboard</h1>
        <div className="status-toggle-wrapper glass">
          <span className="text-muted text-sm">Status:</span>
          <button 
            className={`status-toggle ${isOnline ? 'online' : 'offline'}`}
            onClick={handleToggleStatus}
          >
            {isOnline ? 'Online' : 'Offline'}
          </button>
        </div>
      </div>

      <div className="stats-grid mb-4">
        <div className="stat-card glass-panel">
          <div className="stat-icon"><IndianRupee size={24} /></div>
          <div>
            <p className="text-muted text-sm">Total Earnings</p>
            <h3>₹{earnings}</h3>
          </div>
        </div>
        <div className="stat-card glass-panel">
          <div className="stat-icon" style={{color: '#10b981', background: 'rgba(16,185,129,0.1)'}}>
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-muted text-sm">Completed Jobs</p>
            <h3>{bookings.filter(b => b.status === 'Completed').length}</h3>
          </div>
        </div>
      </div>

      <h2>Incoming Requests</h2>
      {bookings.length === 0 ? (
        <div className="empty-state glass">No incoming bookings yet.</div>
      ) : (
        <div className="requests-list mt-2">
          {bookings.map(booking => (
            <div key={booking.id} className="request-card glass">
              <div className="flex justify-between items-start">
                <div>
                  <h3 style={{margin: 0}}>{booking.userName}</h3>
                  <div className="text-sm text-muted mt-2 flex items-center gap-4">
                    <span className="flex items-center gap-1"><CalIcon size={14}/> {new Date(booking.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock size={14}/> {booking.timeSlot}</span>
                  </div>
                </div>
                <div className={`status-badge min status-${booking.status.toLowerCase()}`}>
                  {booking.status}
                </div>
              </div>
              
              {booking.status === 'Pending' && (
                <div className="request-actions mt-4">
                  <button className="btn-primary" onClick={() => updateBooking(booking.id, 'Confirmed')}>
                    Accept
                  </button>
                  <button className="btn-secondary text-danger" onClick={() => updateBooking(booking.id, 'Rejected')}>
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              )}
              
              {booking.status === 'Confirmed' && (
                <div className="request-actions mt-4">
                  <button className="btn-primary" onClick={() => updateBooking(booking.id, 'Completed')}>
                    Mark as Completed
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProviderDashboard;
