import React, { SetStateAction } from 'react';

type GroupModalProps = {
    GroupModalState: boolean;
    handleGroupModalSelect: (url: string) => void;
    setShowGroupModal: (value: SetStateAction<boolean>) => void;
};

const GroupModal: React.FC<GroupModalProps> = ({ GroupModalState, handleGroupModalSelect, setShowGroupModal }) => {
    return (
        <div id="group-modal" tabIndex={-1} className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${GroupModalState ? '' : 'hidden'}`}>
            <div className="relative p-4 w-full max-w-md max-h-full mx-auto">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Selecciona tu tipo de usuario
                        </h3>
                        <button type="button" onClick={() => setShowGroupModal(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Cerrar</span>
                        </button>
                    </div>

                    <div className="p-4 md:p-5">
                        <div className="grid gap-4">
                            <button
                                onClick={() => handleGroupModalSelect('Scout')}
                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Soy Scout
                            </button>

                            <button
                                onClick={() => handleGroupModalSelect('Scouter')}
                                className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            >
                                Soy Scouter
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
};

export default GroupModal;