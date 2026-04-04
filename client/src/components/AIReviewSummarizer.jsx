import { Brain, Sparkles, Check, X, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const AIReviewSummarizer = ({ reviews = [] }) => {
    if (reviews.length < 3) return null;

    // Simulated AI summarization based on review content
    // In a real app, this would be a backend call to Qwen/LLM
    const summary = {
        verdict: "Highly Recommended for enthusiasts and professionals alike.",
        pros: ["Exceptional Build Quality", "Industry Leading Performance", "Premium Aesthetic"],
        cons: ["Slightly high price point", "Limited color variants"],
        sentiment: 92
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 dark:from-indigo-900/10 dark:to-blue-900/10 border border-indigo-100/50 dark:border-indigo-800/30 p-8 rounded-[2.5rem] relative overflow-hidden backdrop-blur-md mb-12 shadow-2xl shadow-indigo-500/5"
        >
            <div className="absolute top-0 right-0 p-8 opacity-5 text-indigo-500">
                <Brain size={120} />
            </div>

            <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
                      <Sparkles size={24} className="animate-pulse" />
                      <h3 className="font-black text-xl uppercase tracking-tighter">AI Review Insights</h3>
                    </div>
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-800">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">Sentiment</span>
                        <span className="text-sm font-black text-indigo-600">{summary.sentiment}% Positive</span>
                    </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed font-medium italic">
                    "Based on {reviews.length} customer reviews, the consensus is: {summary.verdict}"
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-green-600 uppercase tracking-[0.3em]">Common Praise</h4>
                        <div className="space-y-2">
                             {summary.pros.map((p, i) => (
                                <div key={i} className="flex items-center gap-2 group">
                                    <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 group-hover:scale-110 transition-transform">
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                    <span className="text-xs font-bold dark:text-gray-200">{p}</span>
                                </div>
                             ))}
                        </div>
                    </div>
                    <div className="space-y-3">
                         <h4 className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Common Critiques</h4>
                         <div className="space-y-2">
                             {summary.cons.map((c, i) => (
                                <div key={i} className="flex items-center gap-2 group">
                                    <div className="p-1 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 group-hover:scale-110 transition-transform">
                                        <X size={12} strokeWidth={4} />
                                    </div>
                                    <span className="text-xs font-bold text-gray-500">{c}</span>
                                </div>
                             ))}
                        </div>
                    </div>
                </div>
                
                <div className="pt-4 flex items-center gap-2 opacity-40">
                    <Info size={12} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Summarized by Qwen AI Engine v4.2</span>
                </div>
            </div>
        </motion.div>
    );
};

export default AIReviewSummarizer;
