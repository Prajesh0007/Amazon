import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Users, ShoppingBag, DollarSign, Package, TrendingUp, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import useProductStore from '../store/useProductStore';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Admin = () => {
  const { products, fetchProducts } = useProductStore();
  const [stats, setStats] = useState({
    totalSales: 1245000,
    totalOrders: 145,
    activeUsers: 890,
    inventoryValue: 0
  });

  useEffect(() => {
    fetchProducts('', 1);
  }, [fetchProducts]);

  useEffect(() => {
    const value = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
    setStats(prev => ({ ...prev, inventoryValue: value }));
  }, [products]);

  const data = [
    { name: 'Mon', sales: 4000, orders: 24 },
    { name: 'Tue', sales: 3000, orders: 18 },
    { name: 'Wed', sales: 5000, orders: 32 },
    { name: 'Thu', sales: 2780, orders: 15 },
    { name: 'Fri', sales: 1890, orders: 10 },
    { name: 'Sat', sales: 6390, orders: 48 },
    { name: 'Sun', sales: 4490, orders: 35 },
  ];

  const StatCard = ({ icon, label, value, color, trend }) => (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
          <div className={`${color.replace('bg-', 'text-')}`}>{icon}</div>
        </div>
        {trend && (
          <div className={`flex items-center text-xs font-bold ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <h3 className="text-2xl font-black mt-1">
          {typeof value === 'number' && label.includes('Value') ? `₹${value.toLocaleString()}` : value}
        </h3>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 lg:p-12 pb-24">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[var(--secondary)]">
              <LayoutDashboard size={18} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Platform Metrics</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter">ADMIN COMMAND CENTER</h1>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
             <Clock size={16} className="text-gray-400" />
             <span className="text-xs font-bold text-gray-500">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={<DollarSign />} label="Total Sales" value={`₹${stats.totalSales.toLocaleString()}`} color="bg-green-500" trend={12} />
          <StatCard icon={<ShoppingBag />} label="Total Orders" value={stats.totalOrders} color="bg-blue-500" trend={8} />
          <StatCard icon={<Users />} label="Active Users" value={stats.activeUsers} color="bg-purple-500" trend={-2} />
          <StatCard icon={<Package />} label="Inventory Value" value={stats.inventoryValue} color="bg-orange-500" />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                <TrendingUp size={24} className="text-green-500" /> SALES VELOCITY
              </h3>
              <div className="flex gap-2">
                {['7D', '1M', '1Y'].map(t => (
                  <button key={t} className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors ${t === '7D' ? 'bg-[var(--secondary)] text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[300px] w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
               {/* <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f3a847" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f3a847" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="sales" stroke="#f3a847" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer> */}
              <div className="text-center space-y-2">
                <TrendingUp size={48} className="text-gray-300 mx-auto" />
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">Analytics Visualization Ready</p>
              </div>
            </div>
          </div>

          <div className="bg-[#131921] h-full p-8 rounded-[2.5rem] text-white space-y-8 flex flex-col justify-between overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -mr-32 -mt-32" />
            <div className="relative z-10 space-y-2">
              <h3 className="text-2xl font-black leading-tight tracking-tight">AI INVENTORY<br/>INSIGHTS</h3>
              <p className="text-gray-400 text-sm font-medium">Mega-Seed dataset of {products.length} products is now optimized for search.</p>
            </div>
            
            <div className="relative z-10 space-y-4">
              {[
                { label: 'Demand Surge', value: 'Computing (Laptop)', color: 'text-orange-400' },
                { label: 'Top Performer', value: 'Sony WH-1000XM5', color: 'text-blue-400' },
                { label: 'Ollama Status', value: 'Ready/Online', color: 'text-green-400' }
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{item.label}</p>
                  <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>

            <button className="relative z-10 w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-xs font-black uppercase tracking-widest border border-white/10 transition-colors">
              Request Full Report
            </button>
          </div>
        </div>

        {/* Inventory List (Brief) */}
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-xl font-black">LATEST INVENTORY ADDS</h3>
            <span className="text-xs font-bold text-gray-400">{products.length} Items Total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 dark:border-gray-800">
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {products.slice(0, 5).map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-8 py-4 text-sm font-bold">{p.name}</td>
                    <td className="px-8 py-4">
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-[10px] font-black uppercase tracking-widest">{p.category}</span>
                    </td>
                    <td className="px-8 py-4 text-sm font-bold">₹{p.price.toLocaleString()}</td>
                    <td className="px-8 py-4 text-sm font-bold text-orange-500">{p.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
