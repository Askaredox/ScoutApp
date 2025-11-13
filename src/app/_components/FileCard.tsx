import React from "react";

type FileCardProps = {
    title: string;
    image: string;
    onClick: () => void;
    onDelete?: () => void;
    is_admin: boolean
};

const FileCard: React.FC<FileCardProps> = ({ title, image, onClick, onDelete = () => { }, is_admin }) => {
    return (
        <div tabIndex={0} className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 focus:outline-2 focus:outline-offset-2 focus:outline-blue-400 cursor-pointer" onDoubleClick={onClick}>
            <div className="m-2 flex justify-between">


                <div className="m-1">
                    <p className="h-4 text-xs font-bold tracking-tight text-gray-900 dark:text-white overflow-hidden text-ellipsis word-break text-wrap line-clamp-1 break-all">{title}</p>

                </div>
                {is_admin && (
                    <button type="button" className="w-8 h-8 focus:outline-none cursor-pointer hover:bg-gray-700 rounded-full flex items-center justify-center" onClick={onDelete}>
                        <svg className="w-6 h-6 text-red-600 dark:text-red-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                        </svg>


                    </button>

                )}
            </div>
            <img className="rounded-t-lg h-48 w-full object-contain" src={image} alt="" />
        </div>
    );
};

export default FileCard;