import React, { SetStateAction } from 'react';

type GroupModalProps = {
    show: boolean;
    setShow: (value: SetStateAction<boolean>) => void;
    send_data: (e: React.FormEvent<HTMLFormElement>, name: string, group: string, section: string) => void;
};

const UserModal: React.FC<GroupModalProps> = ({ show, setShow, send_data }) => {
    const [group, setGroup] = React.useState<string>('');
    const [section, setSection] = React.useState<string>('');
    const [name, setName] = React.useState<string>('');
    const [tooltipName, setTooltipName] = React.useState<boolean>(false);
    const [tooltipGroup, setTooltipGroup] = React.useState<boolean>(false);
    const [tooltipSection, setTooltipSection] = React.useState<boolean>(false);
    return (
        <div id="group-modal" tabIndex={-1} className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${show ? '' : 'hidden'}`}>
            <div className="relative p-4 w-full max-w-md max-h-full mx-auto">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Bienvenido, me gustaría saber de ti
                        </h3>
                        <button type="button" onClick={() => setShow(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Cerrar</span>
                        </button>
                    </div>
                    <form className="p-4 md:p-5 space-y-2" onSubmit={(e) => send_data(e, name, group, section)}>
                        <div className="flex align-start gap-2">
                            <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre</label>
                            <svg className="w-4 h-4 text-gray-200 dark:text-white-900 cursor-pointer" data-tooltip-target="tooltip-default" data-tooltip-trigger="hover" onClick={() => setTooltipName(!tooltipName)} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.441 2.441 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>

                            <div id="tooltip-default" role="tooltip" className={"absolute z-10 left-1/2 -translate-x-1/2 -translate-y-1/2 inline-block px-3 py-2  text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs  tooltip dark:bg-gray-700" + (tooltipName ? 'opacity-0' : ' invisible')}>
                                Coloca un nombre y un apellido, podrás cambiarlo más adelante.
                                <div className="tooltip-arrow" data-popper-arrow></div>
                            </div>
                        </div>
                        <div className="flex">
                            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 border-e-0 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                                </svg>
                            </span>

                            <input type="text" id="name-input " className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Coloca tu nombre' required onChange={(e) => setName(e.target.value)} />
                        </div>


                        <div className="flex align-start gap-2">
                            <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sección</label>
                            <svg className="w-4 h-4 text-gray-200 dark:text-white-900 cursor-pointer" data-tooltip-target="tooltip-default" data-tooltip-trigger="hover" onClick={() => setTooltipSection(!tooltipSection)} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.441 2.441 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <div id="tooltip-default" role="tooltip" className={"absolute z-10 left-1/2 -translate-x-1/2 -translate-y-1/2 inline-block px-3 py-2  text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs  tooltip dark:bg-gray-700" + (tooltipSection ? 'opacity-0' : ' invisible')}>
                                Cubil de Cachorros (4-7 años) <br />
                                Manada de Lobatos (7-11 años) <br />
                                Unidad Scout (11-15 años) <br />
                                Comunidad de Caminantes (15-18 años) <br />
                                Clan de Rovers (18-25 años) <br />
                                Antiguo Scout <br />
                                Ninguna Sección <br />
                                <div className="tooltip-arrow" data-popper-arrow></div>
                            </div>
                        </div>

                        <select id="role" required onChange={(e) => setSection(e.target.value)} value={section} className="bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="">Escoge tu sección</option>
                            <option value="Cubil">Cachorros</option>
                            <option value="Manada">Manada</option>
                            <option value="Unidad">Unidad</option>
                            <option value="Caminantes">Caminantes</option>
                            <option value="Clan">Clan</option>
                            <option value="Antiguo">Antiguo Scout</option>
                            <option value="NONE">Ninguna de las anteriores</option>
                        </select>


                        <div className="flex align-start gap-2">
                            <label htmlFor="countries" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Selecciona si eres Scout o Scouter</label>
                            <svg className="w-4 h-4 text-gray-200 dark:text-white-900 cursor-pointer" data-tooltip-target="tooltip-default" data-tooltip-trigger="hover" onClick={() => setTooltipGroup(!tooltipGroup)} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.441 2.441 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <div id="tooltip-default" role="tooltip" className={"absolute z-10 left-4/5 -translate-x-1/2 -translate-y-1/2 inline-block px-3 py-2  text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-xs  tooltip dark:bg-gray-700" + (tooltipGroup ? 'opacity-0' : ' invisible')}>
                                Dirigente o Scouter si eres quien imparte el programa scout y Scout si eres beneficiario del programa
                                <div className="tooltip-arrow" data-popper-arrow></div>
                            </div>
                        </div>

                        <select id="role" required onChange={(e) => setGroup(e.target.value)} value={group} className="bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="">Selecciona tu rol</option>
                            <option value="Scout">Scout</option>
                            <option value="Scouter">Scouter/Dirigente</option>
                        </select>

                        <div className="grid gap-4">
                            <button
                                type="submit"
                                className="w-full cursor-pointer text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                            >
                                Enviar
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
};

export default UserModal;