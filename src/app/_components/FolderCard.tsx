import React from "react";

type FolderCardProps = {
    title: string;
    onClick: () => void;
    onDelete: () => void;
    is_admin: boolean
};

const FolderCard: React.FC<FolderCardProps> = ({ title, onClick, onDelete, is_admin }) => {
    return (
        <div tabIndex={0} className="focus:outline-2 focus:outline-offset-2 focus:outline-blue-400 focus:outline-dashed rounded-lg cursor-pointer" onDoubleClick={onClick}>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="m-2 flex justify-between">
                    <div className="flex justify-center items-center">

                        <svg className="h-8 w-8 text-gray-400 " width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
                        </svg>
                        <p className="h-6 text-md font-bold tracking-tight text-gray-900 dark:text-white overflow-hidden text-ellipsis word-break text-wrap line-clamp-1 break-all">{title}</p>
                    </div>
                    {is_admin && (
                        <button type="button" className="focus:outline-none cursor-pointer hover:bg-gray-700 rounded-full" onClick={onDelete}>
                            <svg className="w-5 h-5 text-red-600 dark:text-red-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                            </svg>


                        </button>

                    )}


                </div>
            </div>

        </div>
    );
};

export default FolderCard;

/** options icon
 * <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M12 6h.01M12 12h.01M12 18h.01" />
                        </svg>
 */