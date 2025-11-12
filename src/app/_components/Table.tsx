import React from 'react';
import Loader from './Loader';

type TableProps = {
    ready: boolean; // Indica si los datos están listos para mostrar
    headerRows?: React.ReactNode; // Opcional, si necesitas headers personalizados
    dataRows?: React.ReactNode[]; // Opcional, si necesitas filas de datos personalizadas
};


const DataTable: React.FC<TableProps> = ({ ready, headerRows, dataRows }) => {
    if (!ready) {
        return (
            <Loader />
        )
    }
    else {
        return (
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                <table className="min-w-full text-sm text-gray-700 dark:text-gray-300">
                    <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                        {headerRows}
                    </thead>
                    <tbody>
                        {dataRows}
                    </tbody>
                </table>
            </div>
        );
    }

};


export default DataTable;
/**
 * 
 */