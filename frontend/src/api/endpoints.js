import api from './client';

// Chat
export const sendChatMessage = (data) => api.post('/chat', data);

// Trips
export const createTrip = (data) => api.post('/trips', data);
export const getTrips = () => api.get('/trips');
export const getTrip = (id) => api.get(`/trips/${id}`);
export const replanTrip = (id, data) => api.post(`/trips/${id}/replan`, data);

// Itineraries
export const generateItinerary = (data) => api.post('/itineraries/generate', data);

// Offers
export const getFlightOffers = (params) => api.get('/offers/flights', { params });
export const getHotelOffers = (params) => api.get('/offers/hotels', { params });

// Bookings
export const createBooking = (data) => api.post('/bookings', data);
export const getBooking = (id) => api.get(`/bookings/${id}`);
export const cancelBooking = (id, data) => api.post(`/bookings/${id}/cancel`, data);
export const modifyBooking = (id, data) => api.post(`/bookings/${id}/modify`, data);

// Disruptions
export const simulateDisruption = (data) => api.post('/disruptions/simulate', data);
export const approveDisruption = (id, data) => api.post(`/disruptions/${id}/approve`, data);
