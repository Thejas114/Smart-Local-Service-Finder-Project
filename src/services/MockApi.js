const mockProviders = [
  {
    id: 'p1',
    name: 'Rahul Sharma',
    category: 'Plumber',
    rating: 4.8,
    reviews: 124,
    distance: '1.2 km', // initial fallback
    lat: 12.9716,
    lng: 77.5946,
    image: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&h=150&fit=crop',
    price: '₹500/hr',
    isOnline: true,
    availability: ['10:00 AM', '02:00 PM', '04:00 PM'],
    about: 'Professional plumber with 10 years of experience fixing leaks and pipelines in Bangalore.'
  },
  {
    id: 'p2',
    name: 'Vidyut Electricals',
    category: 'Electrician',
    rating: 4.6,
    reviews: 89,
    distance: '0.8 km',
    lat: 12.9660,
    lng: 77.6000,
    image: 'https://images.unsplash.com/photo-1555963966-b7ae5404b6ed?w=150&h=150&fit=crop',
    price: '₹400/hr',
    isOnline: true,
    availability: ['11:00 AM', '01:00 PM', '05:00 PM'],
    about: 'Expert in residential and commercial electrical wiring and repairs.'
  },
  {
    id: 'p3',
    name: 'Neha Cleaners',
    category: 'Cleaning',
    rating: 4.9,
    reviews: 210,
    distance: '2.5 km',
    lat: 12.9750,
    lng: 77.5850,
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop',
    price: '₹300/hr',
    isOnline: false,
    availability: ['09:00 AM', '12:00 PM'],
    about: 'Top-rated deep cleaning service for apartments and independent houses.'
  },
  {
    id: 'p4',
    name: 'Amit Appliances',
    category: 'Repairs',
    rating: 4.5,
    reviews: 56,
    distance: '3.1 km',
    lat: 12.9600,
    lng: 77.5900,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    price: '₹600/hr',
    isOnline: true,
    availability: ['03:00 PM', '06:00 PM'],
    about: 'AC, Refrigerator, and Washing machine repair specialized service.'
  }
];

let mockUsers = [
  { id: 'u1', name: 'Test User', email: 'user@test.com', password: 'password', role: 'user' }
];

let mockBookings = [
  { id: 'b_old1', userId: 'u1', providerId: 'p2', timeSlot: '11:00 AM', date: new Date().toISOString(), status: 'Completed' }
];

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Calculate distance roughly (Haversine formula simplification for UI demo purposes)
const calculateDistanceParams = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1) return null;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(1);
};

export const MockApi = {
  // --- Auth Methods ---
  login: async (email, password, role) => {
    await delay(500);
    // Providers use mockProviders, Users use mockUsers
    if (role === 'provider') {
      const p = mockProviders.find(p => p.name.toLowerCase().includes(email.toLowerCase().split('@')[0]));
      if (!p) throw new Error("Invalid provider credentials");
      return { id: p.id, name: p.name, email, role: 'provider' };
    } else {
      const u = mockUsers.find(u => u.email === email && u.password === password);
      if (!u) throw new Error("Invalid user credentials");
      return { id: u.id, name: u.name, email: u.email, role: 'user' };
    }
  },

  signup: async (name, email, password, role) => {
    await delay(600);
    if (role === 'user') {
      const newUser = { id: `u${Date.now()}`, name, email, password, role };
      mockUsers.push(newUser);
      return { id: newUser.id, name, email, role };
    } else {
      throw new Error("Provider signup via UI not supported in this demo");
    }
  },

  // --- Provider Methods ---
  getProviders: async (category = 'All', userLat = null, userLng = null) => {
    await delay(600);
    let filtered = category === 'All' ? [...mockProviders] : mockProviders.filter(p => p.category === category);
    
    // Sort and update distance if coordinates provided
    if (userLat && userLng) {
      filtered = filtered.map(p => {
        const dist = calculateDistanceParams(userLat, userLng, p.lat, p.lng);
        return { ...p, distance: dist ? `${dist} km` : p.distance, rawDist: dist || 999 };
      }).sort((a, b) => a.rawDist - b.rawDist);
    }
    return filtered;
  },

  getProviderById: async (id) => {
    await delay(400);
    return mockProviders.find(p => p.id === id);
  },

  // --- Booking Methods ---
  createBooking: async (userId, providerId, timeSlot, date) => {
    await delay(800);
    const newBooking = {
      id: `b${Date.now()}`,
      userId,
      providerId,
      timeSlot,
      date,
      status: 'Pending'
    };
    mockBookings.push(newBooking);
    return newBooking;
  },

  getUserBookings: async (userId) => {
    await delay(500);
    // Join provider details
    return mockBookings
      .filter(b => b.userId === userId)
      .map(b => {
        const provider = mockProviders.find(p => p.id === b.providerId);
        return { ...b, providerName: provider?.name || 'Unknown', providerImage: provider?.image };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  cancelBooking: async (bookingId) => {
    await delay(500);
    const index = mockBookings.findIndex(b => b.id === bookingId);
    if (index === -1) throw new Error("Booking not found");
    mockBookings[index].status = 'Cancelled';
    return mockBookings[index];
  },
  
  // --- New Provider Functions ---
  getProviderBookings: async (providerId) => {
    await delay(500);
    return mockBookings
      .filter(b => b.providerId === providerId)
      .map(b => {
        const user = mockUsers.find(u => u.id === b.userId);
        return { ...b, userName: user?.name || 'Unknown User' };
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  updateBookingStatus: async (bookingId, newStatus) => {
    await delay(400);
    const index = mockBookings.findIndex(b => b.id === bookingId);
    if (index === -1) throw new Error("Booking not found");
    mockBookings[index].status = newStatus;
    return mockBookings[index];
  },

  toggleProviderStatus: async (providerId, isOnline) => {
    await delay(300);
    const index = mockProviders.findIndex(p => p.id === providerId);
    if (index !== -1) {
      mockProviders[index].isOnline = isOnline;
    }
    return mockProviders[index];
  },
  
  // --- Chat ---
  getChatHistory: async (providerId) => {
    await delay(300);
    return [
      { sender: 'provider', text: 'Hello! I received your booking. How can I help you?', time: '10:00 AM' }
    ];
  }
};
