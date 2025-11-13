import Loader from '@/app/_components/Loader';
import React, { useState } from 'react';

type TableCrumbsProps = {
    ready: boolean;
    headerRows?: React.ReactNode;
    dataRowsFolders?: React.ReactNode[];
    dataRowsFiles?: React.ReactNode[];
    cardFolders?: React.ReactNode[];
    cardFiles?: React.ReactNode[];
    getCrumbs: () => React.ReactNode[];
};

const TableCrumbs: React.FC<TableCrumbsProps> = ({ ready, getCrumbs, headerRows, dataRowsFolders, dataRowsFiles, cardFolders, cardFiles }) => {
    const [cardList, setCardList] = useState<boolean>(true);
    if (!ready) {
        return (
            <Loader />
        )
    }
    return (
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-y-scroll">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 ">
                <div className='size-full'>
                    <div className="mb-4">
                        <nav className="flex ml-4 justify-between" aria-label="Breadcrumb">
                            <ol>
                                {getCrumbs()}
                            </ol>
                            <ol>
                                <label className="inline-flex items-center cursor-pointer">
                                    <span className="mr-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        <svg className="w-8 h-8 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5" />
                                        </svg>
                                    </span>
                                    <input type="checkbox" onChange={() => setCardList(!cardList)} checked={cardList} className="sr-only peer" />
                                    <div tabIndex={0} className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                                    <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.143 4H4.857A.857.857 0 0 0 4 4.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 10 9.143V4.857A.857.857 0 0 0 9.143 4Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286A.857.857 0 0 0 20 9.143V4.857A.857.857 0 0 0 19.143 4Zm-10 10H4.857a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286A.857.857 0 0 0 9.143 14Zm10 0h-4.286a.857.857 0 0 0-.857.857v4.286c0 .473.384.857.857.857h4.286a.857.857 0 0 0 .857-.857v-4.286a.857.857 0 0 0-.857-.857Z" />
                                        </svg>

                                    </span>
                                </label>
                            </ol>
                        </nav>

                    </div>
                    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                        {(!cardList) &&
                            <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
                                <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                    {headerRows}
                                </thead>
                                <tbody>
                                    {dataRowsFolders}
                                    {dataRowsFiles}
                                </tbody>
                            </table>
                        }
                        {(cardList) &&
                            <div>

                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {cardFolders}
                                </div>
                                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {cardFiles}
                                </div>
                            </div>

                        }

                    </div>
                </div>
            </div>
        </div>
    );


};

export default TableCrumbs;