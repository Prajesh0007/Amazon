import { create } from 'zustand';
import axios from 'axios';

const useProductStore = create((set, get) => ({
  // Fallback to relative /api for Vercel production environments
  apiUrl: import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api'),
  products: [],
  businesses: [],
  product: null,
  loading: false,
  error: null,
  page: 1,
  total: 0,
  activeService: 'Shopping',

  fetchBusinesses: async (params = {}) => {
    set({ loading: true, error: null });
    const { businessType = '' } = params;
    try {
      const { apiUrl } = get();
      const { data } = await axios.get(`${apiUrl}/products/businesses?businessType=${businessType}`);
      set({ businesses: data, loading: false });
    } catch (error) {
      set({ error: 'Error fetching businesses', loading: false });
    }
  },

  fetchProducts: async (params = {}) => {
    set({ loading: true, error: null });
    const { keyword = '', pageNumber = 1, category = 'All', minPrice = '', maxPrice = '', sort = '', serviceType = 'All' } = params;
    
    try {
      const { apiUrl } = get();
      const url = `${apiUrl}/products?keyword=${keyword}&page=${pageNumber}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}&serviceType=${serviceType}`;
      const { data } = await axios.get(url);
      
      set({ 
        products: pageNumber === 1 ? data.products : [...get().products, ...data.products],
        pages: data.pages, 
        page: data.page, 
        total: data.total,
        activeService: serviceType,
        loading: false 
      });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Error fetching products', 
        loading: false 
      });
    }
  },

  fetchMoreProducts: async (params = {}) => {
    const { keyword = '', pageNumber = 1, category = 'All', minPrice = '', maxPrice = '', sort = '', serviceType = 'All' } = params;
    try {
      const { apiUrl } = get();
      const url = `${apiUrl}/products?keyword=${keyword}&page=${pageNumber}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}&serviceType=${serviceType}`;
      const { data } = await axios.get(url);
      
      set((state) => ({ 
        products: [...state.products, ...data.products], 
        pages: data.pages, 
        page: data.page, 
        loading: false 
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Error fetching more products', 
        loading: false 
      });
    }
  },

  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { apiUrl } = get();
      const { data } = await axios.get(`${apiUrl}/products/${id}`);
      set({ product: data, loading: false });
      
      // Fetch reviews and questions in parallel
      get().fetchProductReviews(id);
      get().fetchProductQuestions(id);
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Error fetching product', 
        loading: false 
      });
    }
  },

  fetchProductReviews: async (id) => {
    try {
      const { apiUrl } = get();
      const { data } = await axios.get(`${apiUrl}/products/${id}/reviews`);
      set({ reviews: data });
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  },

  fetchProductQuestions: async (id) => {
    try {
      const { apiUrl } = get();
      const { data } = await axios.get(`${apiUrl}/products/${id}/questions`);
      set({ questions: data });
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  },

  createReview: async (id, reviewData, token) => {
     try {
       const { apiUrl } = get();
       await axios.post(`${apiUrl}/products/${id}/reviews`, reviewData, {
         headers: { Authorization: `Bearer ${token}` }
       });
       get().fetchProductReviews(id);
       return true;
     } catch (error) {
       return false;
     }
  },

  createQuestion: async (id, questionData, token) => {
    try {
      const { apiUrl } = get();
      await axios.post(`${apiUrl}/products/${id}/questions`, questionData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      get().fetchProductQuestions(id);
      return true;
    } catch (error) {
      return false;
    }
  },

  aiSearch: async (query) => {
    set({ loading: true, error: null });
    try {
      const { apiUrl } = get();
      const { data } = await axios.post(`${apiUrl}/ai/search`, { query });
      set({ 
        products: data.products, 
        loading: false 
      });
      return data.params;
    } catch (error) {
      set({ 
        error: 'AI Search failed', 
        loading: false 
      });
    }
  },
}));

export default useProductStore;
