import React from 'react';
import type { NewsArticle } from '../../types';
import { formatNewsTimestamp } from '../../utils/date';

interface NewsCardProps {
    article: NewsArticle;
    getCategoryColor: (category: string) => string;
}

const NewsCard: React.FC<NewsCardProps> = ({ article, getCategoryColor }) => {
    return (
        // The container creates the space in the grid
        <div className="relative min-h-[420px] bg-transparent group">
            {/* The actual card content - positioned absolutely to allow expansion without reflow */}
            <div className="absolute top-0 left-0 w-full bg-white rounded-xl shadow-md transition-all duration-300 ease-in-out group-hover:z-20 group-hover:shadow-2xl group-hover:scale-105 group-hover:h-auto min-h-full flex flex-col overflow-hidden ring-1 ring-gray-900/5">

                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden shrink-0">
                    <img
                        src={article.imageUrl || `https://source.unsplash.com/800x600/?${article.category}`}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                            // Fallback if image fails
                            (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=News';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span
                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-sm ${getCategoryColor(
                            article.category
                        )}`}
                    >
                        {article.category}
                    </span>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col grow bg-white">
                    <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
                        <span className="font-medium text-purple-600">
                            Latest
                        </span>
                        <span>•</span>
                        <time dateTime={article.timestamp}>
                            {formatNewsTimestamp(article.timestamp)}
                        </time>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-purple-700 transition-colors">
                        {article.title}
                    </h2>

                    {/* Description - normally clamped, expands on hover */}
                    <div className="mt-auto">
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                            {article.description}
                        </p>
                    </div>

                    {/* Read More Indicator (Optional, could just be the expansion) */}
                    <div className="mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center text-purple-600 font-medium text-sm">
                        <span>Read full story</span>
                        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsCard;
