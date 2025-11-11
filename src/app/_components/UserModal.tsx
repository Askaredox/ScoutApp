import React, { SetStateAction } from 'react';

type GroupModalProps = {
    show: boolean;
    setShow: (value: SetStateAction<boolean>) => void;
    send_data: (e: React.FormEvent<HTMLFormElement>, name: string, group: string, section: string) => Promise<void>;
};

const UserModal: React.FC<GroupModalProps> = ({ show, setShow, send_data }) => {
    const [group, setGroup] = React.useState<string>('');
    const [section, setSection] = React.useState<string>('');
    const [name, setName] = React.useState<string>('');
    const [tooltipName, setTooltipName] = React.useState<boolean>(false);
    const [tooltipGroup, setTooltipGroup] = React.useState<boolean>(false);
    const [tooltipSection, setTooltipSection] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);


    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        send_data(e, name, group, section).then(() => {
            setName('');
            setGroup('');
            setSection('');
            setShow(false);
            setLoading(false);
        });
    }
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
                    <form className="p-4 md:p-5 space-y-2" onSubmit={onSubmit}>
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

                            <input type="text" id="name-input " className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='Coloca tu nombre' required onChange={(e) => setName(e.target.value)} value={name} />
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
                            {!loading ? (
                                <button
                                    type="submit"
                                    className="w-full cursor-pointer text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                >
                                    Enviar
                                </button>
                            ) : (
                                <button disabled type="button" className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                                    </svg>
                                    Cargando...
                                </button>
                            )}
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
};

export default UserModal;