import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import axios from 'axios';

const SearchSuggestions = ({ searchTerm, setSearchTerm, isVisible, setIsVisible }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchTerm.length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                // In a real app, this would be a dedicated suggestions endpoint
                const response = await axios.get(`http://localhost:5000/api/products?keyword=${searchTerm}&limit=6`);
                setSuggestions(response.data.products || []);
            } catch (error) {
                console.error("Suggestions fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    if (!isVisible || (searchTerm.length < 2 && !loading)) return null;

    return (
        <div className="absolute top-full left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl mt-2 rounded-3xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] border border-white/20 dark:border-white/5 z-[100] overflow-hidden max-h-[400px] overflow-y-auto">
            {loading ? (
                <div className="p-8 flex flex-col items-center justify-center text-slate-500 gap-3">
                    <Loader2 size={32} className="animate-spin text-amber-500" />
                    <span className="text-xs font-black uppercase tracking-[0.2em] font-heading">Consulting the Oracle...</span>
                </div>
            ) : (
                <div className="py-4">
                    {suggestions.length > 0 ? (
                        suggestions.map((item) => (
                            <button
                                key={item._id}
                                onClick={() => {
                                    setIsVisible(false);
                                    setSearchTerm('');
                                    navigate(`/product/${item._id}`);
                                }}
                                className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-amber-500/10 dark:hover:bg-amber-500/5 text-left transition-all duration-300 group border-b border-slate-50 dark:border-slate-800/50 last:border-none"
                            >
                                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                                    <Search size={16} className="text-slate-400 group-hover:text-slate-900" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-amber-500 transition-colors">{item.name}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{item.category}</p>
                                </div>
                                <div className="text-xs font-black text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    VIEW
                                </div>
                            </button>
                        ))
                    ) : (
                        <div className="p-8 text-center space-y-2">
                            <div className="text-slate-300 dark:text-slate-700 font-display text-4xl font-black italic">404</div>
                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">No Treasures Found</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchSuggestions;
