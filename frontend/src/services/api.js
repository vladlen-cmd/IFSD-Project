import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Donation API functions
export const donationAPI = {
  // Create a new donation
  createDonation: (donationData) => api.post('/donations', donationData),
  
  // Get user's donation history
  getUserDonations: (page = 1, limit = 10) => 
    api.get(`/donations/my-donations?page=${page}&limit=${limit}`),
  
  // Get user's donation statistics
  getDonationStats: () => api.get('/donations/stats'),
  
  // Get all donations (admin)
  getAllDonations: (page = 1, limit = 20) => 
    api.get(`/donations/all?page=${page}&limit=${limit}`)
};

export default api;
