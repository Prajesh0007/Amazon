import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Search from './pages/Search';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Admin from './pages/Admin';
import SellerDashboard from './pages/SellerDashboard';
import Wishlist from './pages/Wishlist';
import ConsumerHub from './pages/ConsumerHub';
import FoodHub from './pages/FoodHub';
import GroceryHub from './pages/GroceryHub';
import HealthHub from './pages/HealthHub';
import ShopBotChat from './components/ShopBotChat';
import useAuthStore from './store/useAuthStore';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          className: 'glass-card dark:text-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl font-bold text-sm',
          duration: 4000,
        }}
      />
      
      <Routes>
        {/* Auth Page - No Layout */}
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />

        {/* Pages with Global Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="search" element={<Search />} />
          <Route path="cart" element={<Cart />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="consumer-hub" element={<ConsumerHub />} />
          <Route path="food-hub" element={<FoodHub />} />
          <Route path="grocery-hub" element={<GroceryHub />} />
          <Route path="health-hub" element={<HealthHub />} />
          
          <Route 
            path="checkout" 
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="orders" 
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <Admin />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="seller" 
            element={
              <ProtectedRoute>
                <SellerDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="profile" element={
            <ProtectedRoute>
              <div className="py-20 text-center font-bold text-2xl">User Profile Page (Coming Soon)</div>
            </ProtectedRoute>
          } />
        </Route>

        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global AI Chatbot */}
      <ShopBotChat />
    </Router>
  );
}

export default App;
