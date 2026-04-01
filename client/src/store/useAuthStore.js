import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set, get) => ({
  apiUrl: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
  user: JSON.parse(localStorage.getItem('userInfo')) || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { apiUrl } = get();
      const { data } = await axios.post(`${apiUrl}/auth/login`, { email, password });
      set({ user: data, loading: false });
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Login failed', 
        loading: false 
      });
    }
  },

  register: async (name, email, password) => {
    set({ loading: true, error: null });
    try {
      const { apiUrl } = get();
      const { data } = await axios.post(`${apiUrl}/auth/register`, { name, email, password });
      set({ user: data, loading: false });
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Registration failed', 
        loading: false 
      });
    }
  },

  logout: () => {
    localStorage.removeItem('userInfo');
    set({ user: null });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
