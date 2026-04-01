import { Star } from 'lucide-react';

const RatingBreakdown = ({ rating, numReviews }) => {
    // Simulated distribution for UI purposes
    const distribution = [
        { stars: 5, percentage: 75 },
        { stars: 4, percentage: 15 },
        { stars: 3, percentage: 5 },
        { stars: 2, percentage: 3 },
        { stars: 1, percentage: 2 },
    ];

    return (
        <div className="space-y-3 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-lg dark:text-white">Customer Reviews</h3>
            <div className="flex items-center gap-3">
                <div className="flex">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                            key={s} 
                            size={18} 
                            className={s <= Math.floor(rating) ? "fill-[var(--accent)] text-[var(--accent)]" : "text-gray-300 dark:text-gray-700"} 
                        />
                    ))}
                </div>
                <span className="font-bold text-lg dark:text-white">{rating} out of 5</span>
            </div>
            <p className="text-sm text-gray-500 mb-4">{numReviews.toLocaleString()} global ratings</p>

            <div className="space-y-2">
                {distribution.map((item) => (
                    <div key={item.stars} className="flex items-center gap-4 text-sm group">
                        <button className="text-blue-600 dark:text-blue-400 hover:underline min-w-[50px] text-left">
                            {item.stars} star
                        </button>
                        <div className="flex-1 h-5 bg-gray-100 dark:bg-gray-800 rounded-sm overflow-hidden">
                            <div 
                                className="h-full bg-[var(--accent)] transition-all duration-500" 
                                style={{ width: `${item.percentage}%` }}
                            />
                        </div>
                        <span className="text-gray-500 min-w-[35px] text-right">{item.percentage}%</span>
                    </div>
                ))}
            </div>
            
            <button className="w-full text-center text-blue-600 dark:text-blue-400 text-sm font-bold mt-4 hover:underline">
                How customer reviews and ratings work
            </button>
        </div>
    );
};

export default RatingBreakdown;
