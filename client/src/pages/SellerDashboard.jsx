import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, DollarSign, TrendingUp, UserCheck } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';

const SellerDashboard = () => {
  const { user } = useAuthStore();
  const [isSeller, setIsSeller] = useState(user?.role === 'seller');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    brand: '',
    stock: '',
    manufacturer: ''
  });

  useEffect(() => {
    if (isSeller) {
      fetchSellerProducts();
    }
  }, [isSeller]);

  const handleRegisterSeller = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/seller/register', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      setIsSeller(true);
      toast.success('Successfully registered as a Seller!');
      // Update local storage/store ideally, mocked here.
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerProducts = async () => {
    try {
      const res = await fetch('/api/seller/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/seller/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newProduct)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add product');
      
      toast.success('Product Added Successfully!');
      setProducts([...products, data]);
      setNewProduct({ name: '', price: '', description: '', category: '', brand: '', stock: '', manufacturer: '' });
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!isSeller) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-6">
          <UserCheck size={48} />
        </div>
        <h1 className="text-4xl font-extrabold mb-4 dark:text-white">Become an Amazon Seller</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl text-lg">
          Reach millions of customers, grow your business, and start selling your products on India's most visited platform.
        </p>
        <button
          onClick={handleRegisterSeller}
          disabled={loading}
          className="amazon-button py-4 px-12 text-lg font-bold shadow-xl"
        >
          {loading ? 'Registering...' : 'Register as Seller Now'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold dark:text-white">Seller Dashboard</h1>
        <div className="text-sm bg-green-50 text-green-700 font-bold px-4 py-2 rounded-full border border-green-200">
          ● Active Account
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-2xl"><Package size={24} /></div>
          <div><p className="text-gray-500 font-bold text-sm">Active Listings</p><h2 className="text-3xl font-extrabold">{products.length}</h2></div>
        </div>
        <div className="glass-card bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/30 text-green-600 rounded-2xl"><DollarSign size={24} /></div>
          <div><p className="text-gray-500 font-bold text-sm">Total Revenue</p><h2 className="text-3xl font-extrabold">₹0.00</h2></div>
        </div>
        <div className="glass-card bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-2xl"><TrendingUp size={24} /></div>
          <div><p className="text-gray-500 font-bold text-sm">Profile Views</p><h2 className="text-3xl font-extrabold">0</h2></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <div className="glass-card bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 sticky top-24">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><Plus size={20} /> Add New Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <input required type="text" placeholder="Product Name" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="Price (₹)" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                <input required type="number" placeholder="Stock" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
              </div>
              <input required type="text" placeholder="Category" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
              <input type="text" placeholder="Brand" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} />
              <input type="text" placeholder="Manufacturer" className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border" value={newProduct.manufacturer} onChange={e => setNewProduct({...newProduct, manufacturer: e.target.value})} />
              <textarea required placeholder="Description" rows={3} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
              <button type="submit" className="w-full amazon-button py-3 font-bold shadow-lg">List Product</button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h3 className="font-bold text-xl mb-4">Your Inventory</h3>
          {products.length === 0 ? (
            <p className="text-gray-500">You haven't listed any products yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map(p => (
                <div key={p._id} className="p-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-4">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold line-clamp-1">{p.name}</h4>
                    <p className="text-sm font-bold text-gray-500 mt-1">₹{p.price}</p>
                    <p className="text-xs text-[var(--accent)] font-medium mt-2">{p.stock} in stock</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
