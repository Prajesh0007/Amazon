import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, Minus, Maximize2, ShoppingCart, Search as SearchIcon, ClipboardList, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import axios from 'axios';
import toast from 'react-hot-toast';

const ShopBotChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm ShopBot, your AI shopping assistant. How can I help you find the perfect product today?" }
  ]);
  const [loading, setLoading] = useState(false);
  
  const { cart, addToCart } = useCartStore();
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          context: {
            page: window.location.pathname,
            cart: cart.items.map(i => ({ name: i.product.name, price: i.product.price }))
          }
        }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let fullResponse = '';
      
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.response) {
                fullResponse += parsed.response;
                
                // Filter out action tags from display
                assistantContent = fullResponse.replace(/\[ACTION:.*?\]/g, '').trim();
                
                setMessages((prev) => {
                  const last = prev[prev.length - 1];
                  if (!last) return prev;
                  return [...prev.slice(0, -1), { ...last, content: assistantContent }];
                });
              }
            } catch (e) {
                // Ignore partial JSON errors during streaming
            }
          }
        }
      }

      // Check for actions in the full response ONLY after stream is complete
      const actionMatch = fullResponse.match(/\[ACTION: (.*?)\]/);
      if (actionMatch) {
         const actionStr = actionMatch[1];
         if (actionStr.startsWith('SEARCH')) {
            const queryMatch = actionStr.match(/QUERY: "(.*?)"/);
            if (queryMatch) {
                const query = queryMatch[1];
                toast.success(`Searching for "${query}"...`, { icon: <SearchIcon size={16} /> });
                navigate(`/search?q=${query}`);
                setIsOpen(false);
            }
         } else if (actionStr.startsWith('ADD_TO_CART')) {
            const productMatch = actionStr.match(/PRODUCT: "(.*?)"/);
            if (productMatch) {
                const productName = productMatch[1];
                try {
                    const searchRes = await axios.get(`http://localhost:5000/api/products?keyword=${productName}&limit=1`);
                    if (searchRes.data.products && searchRes.data.products.length > 0) {
                        const product = searchRes.data.products[0];
                        addToCart(product, 1);
                        toast.success(`Elite Bot added ${product.name} to cart!`, {
                            icon: <ShoppingCart size={20} className="text-orange-500" />,
                            style: { background: '#131921', color: '#fff' }
                        });
                    }
                } catch (err) { console.error("Auto add-to-cart failed", err); }
            }
         } else if (actionStr === 'VIEW_ORDERS') {
            navigate('/orders');
            setIsOpen(false);
         } else if (actionStr === 'VIEW_CART') {
            navigate('/cart');
            setIsOpen(false);
         }
      }

    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now. Please try again later!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 45 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-[#131921] text-[var(--secondary)] rounded-full shadow-2xl flex items-center justify-center border-4 border-white dark:border-gray-800 hover:scale-110 transition-transform relative group"
          >
            <MessageSquare size={28} />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--accent)] rounded-full flex items-center justify-center animate-pulse">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="absolute right-full mr-4 bg-white dark:bg-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-100 dark:border-gray-700">
              Ask ShopBot AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ 
              y: 0, 
              opacity: 1, 
              scale: 1,
              height: isMinimized ? '60px' : '500px',
              width: isMinimized ? '200px' : '350px'
            }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] rounded-[2.5rem] border border-white/20 dark:border-white/5 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Bot size={22} className="text-slate-900" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight font-display">ShopBot AI</h3>
                  {!isMinimized && <p className="text-[9px] text-amber-500 font-black uppercase tracking-[0.2em] animate-pulse">Quantum Logic Active</p>}
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Chat Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                  {messages.length === 1 && (
                    <div className="grid grid-cols-1 gap-2 mb-4">
                      {[
                        { text: "Suggest a premium workspace setup", icon: <Sparkles size={14} /> },
                        { text: "Find the best deals in Computing", icon: <Zap size={14} /> },
                        { text: "Help me find a gift under ₹20,000", icon: <Bot size={14} /> }
                      ].map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setInput(prompt.text);
                            // We trigger handleSend manually or just set input
                            // For better UX, let's just set input so they can see it
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-left"
                        >
                          {prompt.icon}
                          {prompt.text}
                        </button>
                      ))}
                    </div>
                  )}
                  {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${m.role === 'user' ? 'bg-gray-200 dark:bg-gray-800' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                          {m.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-blue-600 dark:text-blue-400" />}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm font-medium shadow-sm leading-relaxed ${
                          m.role === 'user' 
                          ? 'bg-[var(--secondary)] text-white rounded-tr-none' 
                          : 'bg-gray-100 dark:bg-gray-800 dark:text-gray-200 rounded-tl-none'
                        }`}>
                          {m.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                       <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Loader2 size={16} className="text-blue-600 animate-spin" />
                       </div>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border-t border-white/10">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-5 pr-14 text-sm focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
                      placeholder="Ask me anything..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                    />
                    <button 
                      type="submit"
                      disabled={loading || !input.trim()}
                      className="absolute right-2 top-2 w-10 h-10 bg-amber-500 text-slate-900 rounded-xl flex items-center justify-center hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShopBotChat;
