import Image from "next/image";
import React from "react";

type FileCardProps = {
    title: string;
    image: string;
    onClick: () => void;
    onDelete?: () => void;
    is_admin: boolean
};

const FileCard: React.FC<FileCardProps> = ({ title, image, onClick, onDelete = () => { }, is_admin }) => {
    function getIconByExtension(filename: string) {
        const extension = filename.split('.').pop()?.toLowerCase();
        switch (extension) {
            case 'pdf':
                return (
                    <svg className="w-6 h-6 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 17v-5h1.5a1.5 1.5 0 1 1 0 3H5m12 2v-5h2m-2 3h2M5 10V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v6M5 19v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1M10 3v4a1 1 0 0 1-1 1H5m6 4v5h1.375A1.627 1.627 0 0 0 14 15.375v-1.75A1.627 1.627 0 0 0 12.375 12H11Z" />
                    </svg>
                );
            case 'jpg':
            case 'jpeg':
            case 'png':
                return (
                    <svg className="w-6 h-6 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m3 16 5-7 6 6.5m6.5 2.5L16 13l-4.286 6M14 10h.01M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
                    </svg>

                )
            case 'mp4':
                return (
                    <svg className="w-6 h-6 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 6H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 11-6-2V9l6-2v10Z" />
                    </svg>
                )
        }
    }

    return (
        <div tabIndex={0} className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 focus:outline-2 focus:outline-offset-2 focus:outline-blue-400 cursor-pointer" onDoubleClick={onClick}>
            <div className="m-2 flex justify-between">
                <div className="flex justify-center items-center">
                    {getIconByExtension(title)}
                    <p className="h-4 text-xs font-bold tracking-tight text-gray-900 dark:text-white overflow-hidden text-ellipsis word-break text-wrap line-clamp-1 break-all mx-3">{title}</p>

                </div>
                {is_admin && (
                    <button type="button" className="w-8 h-8 focus:outline-none cursor-pointer hover:bg-gray-700 rounded-full flex items-center justify-center" onClick={onDelete}>
                        <svg className="w-6 h-6 text-red-600 dark:text-red-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                        </svg>


                    </button>

                )}
            </div>
            <div className="relative h-48 w-full mb-2">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="rounded-t-lg object-contain"
                />
            </div>
        </div>
    );
};

export default FileCard;