import { useState } from 'react';
import { Brain, Loader2, Scale, Check, X, Sparkles } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const AICompare = ({ currentProduct }) => {
    const [loading, setLoading] = useState(false);
    const [comparison, setComparison] = useState(null);
    const [error, setError] = useState(null);

    const handleCompare = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch a similar product (same category, different brand if possible)
            const searchRes = await axios.get(`http://localhost:5000/api/products?category=${currentProduct.category}&limit=5`);
            const similar = searchRes.data.products.find(p => p._id !== currentProduct._id) || searchRes.data.products[0];

            if (!similar || similar._id === currentProduct._id) {
                setError("No similar products found to compare.");
                return;
            }

            // 2. Ask Qwen to compare
            const compareRes = await axios.post(`http://localhost:5000/api/ai/compare`, {
                productA: currentProduct,
                productB: similar
            });
            
            if (!compareRes.data || !compareRes.data.comparisons) {
                throw new Error("Invalid comparison data received");
            }
            
            setComparison({
                ...compareRes.data,
                productB: similar
            });

        } catch (err) {
            console.error("AI Compare error:", err);
            setError("AI analysis failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-12">
            <button 
                onClick={handleCompare}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
            >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Scale size={20} />}
                AI Comparison Analysis
            </button>

            <AnimatePresence>
                {comparison && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="mt-6 bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-900/30 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Brain size={120} />
                        </div>

                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400">
                                <Sparkles size={24} className="animate-pulse" />
                                <h3 className="text-xl font-black uppercase tracking-tighter">Qwen AI Analysis vs {comparison.productB.name}</h3>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-800">
                                            <th className="py-4 font-black uppercase tracking-widest text-gray-400">Feature</th>
                                            <th className="py-4 font-black uppercase tracking-widest text-blue-600 truncate max-w-[120px]">
                                                {currentProduct?.name?.split(' ')[0] || 'Original'}
                                            </th>
                                            <th className="py-4 font-black uppercase tracking-widest text-gray-500 truncate max-w-[120px]">
                                                {comparison?.productB?.name?.split(' ')[0] || 'Compare'}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                                        {comparison.comparisons.map((c, i) => (
                                            <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="py-4 font-bold dark:text-white">{c.feature}</td>
                                                <td className={`py-4 font-medium ${c.winner === 'A' ? 'text-green-600 font-bold' : 'text-gray-500'}`}>
                                                    {c.productA} {c.winner === 'A' && <Check size={14} className="inline ml-1" />}
                                                </td>
                                                <td className={`py-4 font-medium ${c.winner === 'B' ? 'text-green-600 font-bold' : 'text-gray-500'}`}>
                                                    {c.productB} {c.winner === 'B' && <Check size={14} className="inline ml-1" />}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <div className="space-y-2">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">The Verdict</h4>
                                    <p className="text-sm font-medium dark:text-gray-200 leading-relaxed italic">"{comparison.verdict}"</p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Best For</h4>
                                    <div className="inline-block px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl font-bold text-xs border border-blue-100 dark:border-blue-800">
                                        {comparison.targetUser}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold border border-red-100 dark:border-red-900/30">
                    <X size={16} className="inline mr-2" /> {error}
                </div>
            )}
        </div>
    );
};

export default AICompare;
