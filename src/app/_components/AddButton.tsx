import React from 'react';

type AddButtonProps = {
    text: string;
    onClick: (x: boolean) => void;

};

const AddButton: React.FC<AddButtonProps> = ({ text, onClick }) => {
    return (
        <div className="w-full md:w-auto flex justify-end">
            <button
                onClick={() => onClick(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-lg text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-400"
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" clipRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                {text}
            </button>
        </div>
    );
};

export default AddButton;
















