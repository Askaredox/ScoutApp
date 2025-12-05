'use client';

import MainNav from "@/app/_components/MainNav";


export default function About() {


    return (
        <div className="bg-[url('/fondo1.jpeg')] bg-cover bg-fixed h-screen object-none bg-no-repeat ">
            <MainNav />
            <section className="">
                <div className="px-4 max-w-screen text-center pt-24 pb-12 backdrop-blur-xs backdrop-brightness-30 h-full">
                    <div className='md:flex justify-center mb-4 md:bg-linear-to-r md:from-gray-800 md:to-orange-100'>
                        <div className='flex flex-col md:w-1/2 my-auto text-center'>
                            <h1 className="mt-16 text-2xl font-bold tracking-tighter text-white md:text-3xl lg:text-5xl mx-16">
                                La plataforma que organiza y centraliza los documentos scout de Guatemala
                            </h1>
                            <p className="text-base font-normal text-white md:text-xl sm:px-16 lg:px-24 my-16 text-left">
                                La historia de Scouteca nace de una necesidad real dentro del escultismo: tener a mano información actualizada,
                                confiable y organizada. Durante años, quienes servimos en el movimiento hemos tenido que buscar circulares,
                                manuales, instructivos, formatos y recursos en múltiples carpetas, chats o documentos dispersos. Esa experiencia
                                repetida, sumada al deseo profundo de aportar algo significativo a la comunidad scout, dio vida a esta plataforma.
                            </p>
                        </div>
                        <div className="bg-center bg-cover bg-dark  bg-[url('/fondo3.jpeg')] bg-blend-overlay object-none object-top md:w-1/2 h-150 shadow-lg ml-4 rounded-bl-[32rem]"></div>
                    </div>
                    <div className="flex justify-center mb-4 bg-blue-400 rounded-full w-18 h-18 items-center mx-auto shadow-md mt-24">
                        <svg className="w-12 h-12 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19V5m0 14-4-4m4 4 4-4" />
                        </svg>

                    </div>
                </div>
                <div className="pb-12 bg-gray-200 ">
                    <div className="grid md:grid-cols-2 px-4 mx-auto max-w-screen text-center my-8 gap-8 justify-center px-24">
                        <h2 className="row-span-1 my-16 text-3xl font-semibold tracking-tight text-gray-900 text-heading">¿Por qué nace Scouteca?</h2>
                        <div className="row-span-5 h-100 my-auto bg-center bg-center bg-contain bg-no-repeat bg-dark bg-[url('/23.png')] bg-blend-overlay"></div>
                        <p className="row-span-1 text-base font-normal text-gray-800 md:text-lg sm:px-16 md:px-2 mb-8 text-left font-semibold">
                            Durante años, muchos scouters, dirigentes y jóvenes han enfrentado el mismo reto: encontrar el documento correcto
                            en el momento correcto. Los manuales cambian, las circulares se actualizan, los programas evolucionan, y no siempre
                            es sencillo tener la versión adecuada o localizarla entre múltiples fuentes. Esa fragmentación causa retrasos,
                            confusiones y dificulta el trabajo de quienes están comprometidos con formar mejores ciudadanos.
                        </p>
                        <p className="row-span-1 text-base font-normal text-gray-800 md:text-lg sm:px-16 md:px-2 mb-8 text-left font-semibold">
                            Fue en medio de ese desafío que surgió la visión de Scouteca: una plataforma centralizada, clara y accesible donde
                            todos puedan encontrar los documentos Scout de Guatemala sin perder tiempo, sin depender de múltiples enlaces y
                            sin preocuparse por versiones desactualizadas. El objetivo es simple: que la información esté al servicio del
                            movimiento, no al revés.
                        </p>
                    </div>

                    <div className="grid px-4 mx-auto max-w-screen text-center mb-12 gap-8 justify-center  md:grid-cols-2  px-24">
                        <div className="row-span-5 h-100 my-auto bg-center bg-center bg-contain bg-no-repeat bg-dark bg-[url('/34.png')] bg-blend-overlay"></div>
                        <h2 className="row-span-1 my-16 text-3xl font-semibold tracking-tight text-gray-900 text-heading">Una solución creada desde la experiencia</h2>
                        <p className="row-span-1 text-base font-normal text-gray-800 md:text-lg sm:px-16 md:px-2 mb-8 text-left font-semibold">
                            Como beneficiario del escultismo, viví de primera mano la importancia de la información bien organizada. Sé lo que
                            significa preparar actividades con poco tiempo, buscar recursos educativos, revisar normas, consultar reglamentos o
                            preparar eventos. También sé lo frustrante que puede ser no encontrar lo necesario en el momento justo.
                        </p>
                        <p className="row-span-1 text-base font-normal text-gray-800 md:text-lg sm:px-16 md:px-2 mb-8 text-left font-semibold">
                            Por eso Scouteca fue diseñada desde la experiencia y el entendimiento profundo del día a día en los grupos scouts.
                            No es una plataforma genérica; está hecha pensando en la estructura, cultura y necesidades reales del Movimiento
                            Scout en Guatemala. Aquí, los documentos Scout de Guatemala se presentan de manera clara, clasificados y siempre
                            actualizados, permitiendo que scouters, jóvenes y equipos administrativos trabajen de forma más simple, ágil y organizada.
                        </p>
                    </div>
                </div>
                <div className="pb-12 bg-gradient-to-b from-gray-200 to-violet-900">
                    <div className="flex flex-col px-4 mx-auto max-w-screen text-center mb-12 gap-8 justify-center px-24">
                        <h2 className="my-16 text-3xl font-semibold tracking-tight text-gray-900 text-heading">¿Qué encontrarás dentro de Scouteca?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 flex-row px-4 mx-auto max-w-screen text-center mb-12 gap-8 justify-center">

                            <div className="relative bg-teal-50 py-8 rounded-lg block max-w-md rounded-base shadow-xl z-10 mb-8 hover:scale-105 transition-transform">

                                <div className="p-2 text-center text-gray-900 mx-16">
                                    <div>
                                        <h2 className="mt-3 mb-6 text-3xl font-semibold tracking-tight text-gray-900 text-heading">Documentación</h2>
                                    </div>
                                    <p className="inline-flex items-center bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-lg px-4 py-2.5 focus:outline-none">
                                        Manuales, reglamentos y guías de proyectos scouts oficiales de Guatemala.
                                    </p>
                                </div>
                            </div>
                            <div className="relative bg-teal-50 py-8 rounded-lg block max-w-md rounded-base shadow-xl z-10 mb-8 hover:scale-105 transition-transform">

                                <div className="p-2 text-center text-gray-900 mx-16">
                                    <div>
                                        <h2 className="mt-3 mb-6 text-3xl font-semibold tracking-tight text-gray-900 text-heading">Material educativo</h2>
                                    </div>
                                    <p className="inline-flex items-center bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-lg px-4 py-2.5 focus:outline-none">
                                        Material educativo para distintas ramas y programas scouts.
                                    </p>
                                </div>
                            </div>
                            <div className="relative bg-teal-50 py-8 rounded-lg block max-w-md rounded-base shadow-xl z-10 mb-8 hover:scale-105 transition-transform">

                                <div className="p-2 text-center text-gray-900 mx-16">
                                    <div>
                                        <h2 className="mt-3 mb-6 text-3xl font-semibold tracking-tight text-gray-900 text-heading">Guías</h2>
                                    </div>
                                    <p className="inline-flex items-center bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-lg px-4 py-2.5 focus:outline-none">
                                        Guías para líderes y jóvenes sobre actividades, campamentos y eventos.
                                    </p>
                                </div>
                            </div>
                            <div className="relative bg-teal-50 py-8 rounded-lg block max-w-md rounded-base shadow-xl z-10 mb-8 hover:scale-105 transition-transform">

                                <div className="p-2 text-center text-gray-900 mx-16">
                                    <div>
                                        <h2 className="mt-3 mb-6 text-3xl font-semibold tracking-tight text-gray-900 text-heading">Eventos</h2>
                                    </div>
                                    <p className="inline-flex items-center bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-lg px-4 py-2.5 focus:outline-none">
                                        Próximos eventos, campamentos y actividades oficiales.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="pb-12 bg-gray-200 ">
                    <div className="flex flex-col px-4 mx-40 max-w-screen text-center mb-12 gap-8 justify-center px-24 -mt-16">
                        <h2 className="my-16 text-3xl font-semibold tracking-tight text-gray-900 text-heading">Un proyecto que sigue creciendo</h2>
                        <div className="row-span-5 h-100 my-auto bg-center bg-center bg-contain bg-no-repeat bg-dark bg-[url('/31.png')] bg-blend-overlay"></div>
                        <p className="text-base font-normal text-gray-800 md:text-lg sm:px-16 md:px-2 mb-8 text-center font-semibold">
                            Scouteca no es un archivo estático. Es un proyecto vivo que evoluciona con las necesidades del movimiento. Hoy facilita el
                            acceso a los documentos Scout de Guatemala; mañana será una herramienta integral que acompañará a scouters y jóvenes en su
                            proceso formativo.
                        </p>
                        <p className="text-base font-normal text-gray-800 md:text-lg sm:px-16 md:px-2 mb-8 text-center italic">
                            El escultismo nos enseñó a dejar el mundo en mejores condiciones de como lo encontramos. Esta plataforma es mi manera de
                            aportar a esa misión: ofreciendo una herramienta que ahorra tiempo, reduce errores, agiliza procesos y fortalece a cada
                            persona que desea servir mejor.
                        </p>
                    </div>
                </div>
            </section >

        </div >
    )
}
