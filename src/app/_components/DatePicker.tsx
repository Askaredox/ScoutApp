import React, { useState } from 'react';
type DatePickerProps = {
    title: string;
};

const DatePicker: React.FC<DatePickerProps> = ({ title }) => {
    const [currentDate] = useState<Date>(new Date());
    const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
    const [selectedDay, setSelectedDay] = useState<number>(currentDate.getDate());
    const weekdays = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
    const months = [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Junio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
    ];
    const startDayOfMonth = new Date(selectedYear, selectedMonth - 1, 1).getDay(); // 0 (Sun) to 6 (Sat)
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    console.log(selectedYear, selectedMonth, selectedDay, startDayOfMonth, daysInMonth);

    function priorMonth() {
        console.log(selectedMonth);
        if (selectedMonth === 1) {
            setSelectedMonth(12);
            setSelectedYear(selectedYear - 1);
        } else {
            setSelectedMonth(selectedMonth - 1);
        }
    }
    function nextMonth() {
        if (selectedMonth === 12) {
            setSelectedMonth(1);
            setSelectedYear(selectedYear + 1);
        } else {
            setSelectedMonth(selectedMonth + 1);
        }
    }


    return (
        <div className="w-full max-w-[330px] px-6 py-7 border border-gray-300 rounded-2xl dark:border-gray-600 dark:bg-gray-800">
            <div className="flex flex-col items-center gap-2 mb-2 text-gray-900 dark:text-white w-full">
                <div
                    className="flex items-center gap-8 border border-gray-300 w-full justify-between rounded-xl py-0.5 px-0.5 text-sm font-medium text-gray-900 dark:text-white">
                    <button
                        type='button'
                        onClick={() => setSelectedYear(selectedYear - 1)}
                        className="text-gray-900 p-2 rounded-lg transition-all duration-500 hover:bg-indigo-100 hover:text-indigo-600 dark:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                            fill="none">
                            <path d="M10.0002 11.9999L6 7.99978L10.0025 3.99725" stroke="currentcolor"
                                stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                    {selectedYear}
                    <button
                        type='button'
                        onClick={() => setSelectedYear(selectedYear + 1)}
                        className="text-gray-900 p-2 rounded-lg transition-all duration-500 hover:bg-indigo-100 hover:text-indigo-600 dark:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                            fill="none">
                            <path d="M6.00236 3.99707L10.0025 7.99723L6 11.9998" stroke="currentcolor"
                                stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                </div>
                <div
                    className="flex items-center gap-8 border border-gray-300 w-full justify-between rounded-xl py-0.5 px-0.5 text-sm font-medium text-gray-900 dark:text-white">
                    <button
                        type='button'
                        onClick={() => priorMonth()}
                        className="text-gray-900 p-2 rounded-lg transition-all duration-500 hover:bg-indigo-100 hover:text-indigo-600 dark:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                            fill="none">
                            <path d="M10.0002 11.9999L6 7.99978L10.0025 3.99725" stroke="currentcolor"
                                stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                    {months[selectedMonth - 1]}
                    <button
                        type='button'
                        onClick={() => nextMonth()}
                        className="text-gray-900 p-2 rounded-lg transition-all duration-500 hover:bg-indigo-100 hover:text-indigo-600 dark:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                            fill="none">
                            <path d="M6.00236 3.99707L10.0025 7.99723L6 11.9998" stroke="currentcolor"
                                stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>
                </div>

            </div>
            <table className="pb-3 ">
                <thead className="mb-2">
                    <tr className="flex">
                        {weekdays.map((day, index) => (
                            <td key={index} className="flex items-center justify-center w-10 h-10">
                                <p
                                    className="text-sm font-medium text-white rounded-full flex items-center justify-center w-full h-full transition-all duration-300 hover:bg-indigo-100 hover:text-indigo-600">
                                    {day}</p>
                            </td>
                        ))}

                    </tr>
                </thead>
                <tbody>
                    <tr className="flex">
                        {Array.from({ length: (startDayOfMonth + 7) % 7 }).map((_, index) => (
                            <td key={index} className="flex items-center justify-center w-10 h-10">
                                <p
                                    className="text-sm font-medium text-gray-300 rounded-full flex items-center justify-center w-full h-full transition-all duration-300 hover:bg-indigo-100 hover:text-indigo-600">
                                    {' '}</p>
                            </td>
                        ))}
                        {Array.from({ length: Math.min(7 - ((startDayOfMonth + 7) % 7), daysInMonth) }).map((_, index) => {
                            const day = index + 1;
                            return (
                                <td key={index} className="flex items-center justify-center w-10 h-10">
                                    <p
                                        className={`text-sm font-medium ${day === selectedDay ? 'text-white bg-indigo-600' : 'text-gray-900'} rounded-full flex items-center justify-center w-full h-full transition-all duration-300 hover:bg-indigo-100 hover:text-indigo-600 dark:text-white`}>
                                        {day}</p>
                                </td>
                            );
                        })}
                    </tr>
                    {Array.from({ length: 3 }).map((_, week_index) => (
                        <tr key={week_index} className="flex">
                            {Array.from({ length: 7 }).map((_, index) => {
                                const day = week_index * 7 + index + 1 + (7 - ((startDayOfMonth + 7) % 7));
                                return (
                                    <td key={index} className="flex items-center justify-center w-10 h-10">
                                        <p
                                            className={"text-sm font-medium text-gray-300 rounded-full flex items-center justify-center w-full h-full transition-all duration-300 hover:bg-indigo-100 hover:text-indigo-600 " + (day === selectedDay ? 'bg-indigo-600 text-white' : '')}>
                                            {day}</p>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    {Array.from({ length: 2 }).map((_, week_index) => (
                        <tr key={week_index} className="flex">
                            {Array.from({ length: 7 }).map((_, index) => {
                                const day = week_index * 7 + index + 1 + (28 - ((startDayOfMonth + 7) % 7));
                                if (day > daysInMonth) {
                                    return (
                                        <td key={index} className="flex items-center justify-center w-10 h-10">
                                            <p
                                                className="text-sm font-medium text-gray-300 rounded-full flex items-center justify-center w-full h-full transition-all duration-300 hover:bg-indigo-100 hover:text-indigo-600">
                                                {' '}</p>
                                        </td>
                                    );
                                }
                                return (
                                    <td key={index} className="flex items-center justify-center w-10 h-10">
                                        <p
                                            className={"text-sm font-medium text-gray-300 rounded-full flex items-center justify-center w-full h-full transition-all duration-300 hover:bg-indigo-100 hover:text-indigo-600 " + (day === selectedDay ? 'bg-indigo-600 text-white' : '')}>
                                            {day}</p>
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DatePicker;