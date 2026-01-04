import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import newsData from '../../data/news.json';
import type { NewsArticle } from '../../types';
import SearchBar from './SearchBar';
import { useAuth } from '../../contexts/AuthContext';
import { formatNewsTimestamp } from '../../utils/date';

const NewsFeed: React.FC = () => {
    const [articles] = useState<NewsArticle[]>(newsData);
    const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>(newsData);
    const [searchTerm, setSearchTerm] = useState('');
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleSearch = (term: string) => {
        setSearchTerm(term);

        if (!term) {
            setFilteredArticles(articles);
            return;
        }

        const filtered = articles.filter(
            (article) =>
                article.title.toLowerCase().includes(term.toLowerCase()) ||
                article.description.toLowerCase().includes(term.toLowerCase()) ||
                article.category.toLowerCase().includes(term.toLowerCase())
        );

        setFilteredArticles(filtered);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            Technology: 'bg-blue-100 text-blue-800',
            Business: 'bg-green-100 text-green-800',
            Sports: 'bg-orange-100 text-orange-800',
            World: 'bg-purple-100 text-purple-800',
            Health: 'bg-red-100 text-red-800',
            Environment: 'bg-teal-100 text-teal-800',
            Culture: 'bg-pink-100 text-pink-800',
            Education: 'bg-indigo-100 text-indigo-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-gray-800">News Today</h1>
                        <button
                            onClick={handleLogout}
                            className="text-sm text-gray-600 hover:text-gray-800 transition"
                        >
                            Sign Out
                        </button>
                    </div>
                    <SearchBar onSearch={handleSearch} />
                </div>
            </header>

            {/* News Feed */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                {searchTerm && filteredArticles.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <svg
                                className="w-16 h-16 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No news found</h3>
                        <p className="text-gray-500">Try searching with different keywords</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArticles.map((article) => (
                            <article
                                key={article.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                                            article.category
                                        )}`}
                                    >
                                        {article.category}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {formatNewsTimestamp(article.timestamp)}
                                    </span>
                                </div>
                                <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                                    {article.title}
                                </h2>
                                <p className="text-gray-600 text-sm line-clamp-3">{article.description}</p>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default NewsFeed;
