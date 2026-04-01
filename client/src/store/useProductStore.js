import { create } from 'zustand';
import axios from 'axios';

const useProductStore = create((set, get) => ({
  // Fallback to relative /api for Vercel production environments
  apiUrl: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api'),
  products: [],
  product: null,
  loading: false,
  error: null,
  pages: 1,
  page: 1,

  fetchProducts: async (params = {}) => {
    set({ loading: true, error: null });
    const { keyword = '', pageNumber = 1, category = 'All', minPrice = '', maxPrice = '', sort = '' } = params;
    
    try {
      const { apiUrl } = get();
      const url = `${apiUrl}/products?keyword=${keyword}&page=${pageNumber}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}`;
      const { data } = await axios.get(url);
      
      set({ 
        products: pageNumber === 1 ? data.products : undefined, // Handled by page reset logic elsewhere if needed
        pages: data.pages, 
        page: data.page, 
        total: data.total,
        loading: false 
      });
      
      if (pageNumber === 1) {
        set({ products: data.products });
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Error fetching products', 
        loading: false 
      });
    }
  },

  fetchMoreProducts: async (params = {}) => {
    const { keyword = '', pageNumber = 1, category = 'All', minPrice = '', maxPrice = '', sort = '' } = params;
    try {
      const { apiUrl } = get();
      const url = `${apiUrl}/products?keyword=${keyword}&page=${pageNumber}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sort}`;
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
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Error fetching product', 
        loading: false 
      });
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
