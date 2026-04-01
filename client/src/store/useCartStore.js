import { create } from 'zustand';
import axios from 'axios';

const useCartStore = create((set, get) => ({
  cart: { items: [] },
  loading: false,

  addToCart: (product, qty) => {
    const { cart } = get();
    const existItem = cart.items.find((x) => x.product._id === product._id);

    if (existItem) {
      set({
        cart: {
          ...cart,
          items: cart.items.map((x) =>
            x.product._id === product._id ? { ...x, qty: x.qty + qty } : x
          ),
        },
      });
    } else {
      set({
        cart: {
          ...cart,
          items: [...cart.items, { product, qty }],
        },
      });
    }
    get().syncCart();
  },

  removeFromCart: (id) => {
    const { cart } = get();
    set({
      cart: {
        ...cart,
        items: cart.items.filter((x) => x.product._id !== id),
      },
    });
    get().syncCart();
  },

  updateQty: (id, qty) => {
    const { cart } = get();
    set({
      cart: {
        ...cart,
        items: cart.items.map((x) =>
          x.product._id === id ? { ...x, qty } : x
        ),
      },
    });
    get().syncCart();
  },

  syncCart: async () => {
    const { cart } = get();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/cart`, {
          items: cart.items.map(i => ({ product: i.product._id, qty: i.qty }))
        }, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
      } catch (err) {
        console.error('Cart sync failed', err);
      }
    }
  },

  loadCart: async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo && userInfo.token) {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/cart`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        set({ cart: data });
      } catch (err) {
        console.error('Cart load failed', err);
      }
    }
  },

  clearCart: () => set({ cart: { items: [] } }),
}));

export default useCartStore;
