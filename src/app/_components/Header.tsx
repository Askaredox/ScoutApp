import React from 'react';

type HeaderProps = {
    title: string;
};

const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            {title}
        </h1>
    );
};

export default Header;