import { Search, Loader2, HelpCircle } from 'lucide-react';
import { useState } from 'react';

const QuestionSection = ({ questions = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = questions.filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 text-amber-500">
                <HelpCircle size={100} />
            </div>

            <h3 className="text-2xl font-black tracking-tight dark:text-white">Customer Questions & Answers</h3>
            
            <div className="relative group">
                <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-orange-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Have a question? Search for answers" 
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl py-4 pl-16 pr-6 text-sm font-bold focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="space-y-8 pt-4">
                {filtered.length > 0 ? (
                    filtered.map((q, i) => (
                        <div key={i} className="flex gap-6 group">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">Votes</span>
                                <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">{q.upvotes || 0}</span>
                            </div>
                            <div className="flex-1 space-y-3">
                                <div className="flex gap-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Question:</span>
                                    <p className="text-sm font-extrabold dark:text-white group-hover:text-blue-500 transition-colors">{q.question}</p>
                                </div>
                                <div className="flex gap-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Answer:</span>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 leading-relaxed italic">
                                        "{q.answer || 'This question has not been answered yet.'}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest italic">No matching questions found</p>
                        <button className="mt-2 text-xs font-black text-orange-500 hover:scale-105 active:scale-95 transition-all">Ask a New Question</button>
                    </div>
                )}
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                <button className="text-xs font-black text-blue-500 hover:underline uppercase tracking-[0.2em]">View all {questions.length} answered questions</button>
            </div>
        </div>
    );
};

export default QuestionSection;
