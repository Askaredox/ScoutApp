import { useRouter } from 'next/navigation';
import React from 'react';

type HeaderProps = {
    title: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => {

    const { back } = useRouter();
    return (
        <div className="flex items-center justify-between mb-6">
            <button
                onClick={() => back()}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Volver
            </button>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                {title}
            </h1>
        </div>
    );
};

export default Header;