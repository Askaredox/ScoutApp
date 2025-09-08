import { Metadata } from '@/utils/interfaces';
import React from 'react';

type PaginationProps = {
    paginatedData: Metadata | null;
    update_event_url: (url: string) => void;
};

const Pagination: React.FC<PaginationProps> = ({ paginatedData, update_event_url }) => {
    if (!paginatedData || !paginatedData.metadata) {
        return null; // No data to display
    }
    return (
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400">
            {/* Info rango */}
            <div>
                Mostrando{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                    {((paginatedData.metadata.page - 1) * paginatedData.metadata.per_page) + 1}
                    -
                    {Math.min(paginatedData.metadata.page * paginatedData.metadata.per_page, paginatedData.metadata.total)}
                </span>{" "}
                de{" "}
                <span className="font-medium text-gray-900 dark:text-white">{paginatedData.metadata.total}</span>
            </div>

            {/* Controles */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => update_event_url(paginatedData.metadata.links.first)}
                    disabled={!paginatedData.metadata.links.first}
                    className="px-3 py-2 rounded-l-md border bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-40"
                >⏮</button>
                <button
                    onClick={() => update_event_url(paginatedData.metadata.links.previous)}
                    disabled={!paginatedData.metadata.links.previous}
                    className="px-3 py-2 border bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-40"
                >◀</button>
                <span className="px-4 py-2">
                    Página <strong>{paginatedData.metadata.page}</strong> de <strong>{paginatedData.metadata.total_pages}</strong>
                </span>
                <button
                    onClick={() => update_event_url(paginatedData.metadata.links.next)}
                    disabled={!paginatedData.metadata.links.next}
                    className="px-3 py-2 border bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-40"
                >▶</button>
                <button
                    onClick={() => update_event_url(paginatedData.metadata.links.last)}
                    disabled={!paginatedData.metadata.links.last}
                    className="px-3 py-2 rounded-r-md border bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-40"
                >⏭</button>
            </div>
        </div>
    );
};

export default Pagination;