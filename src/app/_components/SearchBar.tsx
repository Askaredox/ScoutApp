import React from 'react';

type SearchBarProps = {
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    placeholder?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({ handleSubmit, searchTerm, setSearchTerm, placeholder }) => {

    return (
        <form onSubmit={handleSubmit} className="w-full md:w-1/2">
            <label htmlFor="search" className="sr-only">Buscar</label>
            <div className="relative">
                <input
                    id="search"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={placeholder || "Buscar..."}
                />
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.82 4.82a1 1 0 01-1.42 1.42l-4.82-4.82A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
        </form>
    );
};

export default SearchBar;