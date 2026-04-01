import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('userInfo')) || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
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
      const { data } = await axios.post(`${API_URL}/auth/register`, { name, email, password });
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
