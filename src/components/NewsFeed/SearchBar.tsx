import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
    onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const secretKeyword = import.meta.env.VITE_SECRET_KEYWORD || 'quantum2026';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if the search term matches the secret keyword
        if (searchTerm.trim() === secretKeyword) {
            // Navigate to chat without any visual indication
            navigate('/chat');
            setSearchTerm('');
            return;
        }

        // Normal search behavior
        onSearch(searchTerm);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        // If user clears the search, show all articles
        if (!value) {
            onSearch('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <input
                type="text"
                value={searchTerm}
                onChange={handleChange}
                placeholder="Search news..."
                className="w-full px-4 py-3 pl-12 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-white placeholder-gray-400"
            />
            <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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
        </form>
    );
};

export default SearchBar;
