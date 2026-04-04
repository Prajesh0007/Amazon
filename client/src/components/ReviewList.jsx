import { Star, ThumbsUp, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ReviewList = ({ reviews = [] }) => {
    if (reviews.length === 0) {
        return (
            <div className="py-12 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
                <p className="text-gray-500 italic font-medium">No reviews yet. Be the first to share your thoughts!</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-black tracking-tight dark:text-white">Top reviews from India</h3>
            <div className="space-y-6">
                {reviews.map((review, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center font-black text-gray-400">
                                {review.name?.charAt(0) || 'U'}
                            </div>
                            <span className="font-bold text-sm dark:text-white">{review.name || 'Amazon Customer'}</span>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                             <div className="flex">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star 
                                        key={s} 
                                        size={14} 
                                        className={s <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} 
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-black dark:text-white">Verified Purchase</span>
                            {review.isVerified && <CheckCircle2 size={14} className="text-orange-500" />}
                        </div>

                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                            {review.comment}
                        </p>

                        <div className="flex items-center gap-6">
                            <button className="flex items-center gap-2 px-6 py-2 border border-gray-200 dark:border-gray-700 rounded-full text-xs font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
                                <ThumbsUp size={14} /> Helpful
                            </button>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest cursor-pointer hover:underline">Report</span>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            <button className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl text-sm font-black text-gray-400 hover:border-orange-500 hover:text-orange-500 transition-all uppercase tracking-[0.2em]">
                Load More Reviews
            </button>
        </div>
    );
};

export default ReviewList;
