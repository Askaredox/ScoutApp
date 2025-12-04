'use client'

import MainNav from "@/app/_components/MainNav";
import Image from "next/image";


export default function Features() {


    return (
        <div className="bg-gray-300  h-screen">
            <MainNav />
            <section className="bg-center bg-cover bg-dark  bg-[url('/fondo1.jpeg')] bg-blend-overlay bg-scroll object-none ">
                <div className="px-4 mx-auto max-w-screen text-center py-24 backdrop-blur-xs backdrop-brightness-30">
                    <h1 className="my-8 text-4xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl mx-24 text-center">Contáctame — Desarrollador Full Stack de Scouteca</h1>
                    <p className="text-base font-normal text-white md:text-xl sm:px-16 lg:px-48 my-16">
                        Soy el desarrollador full stack detrás de Scouteca, una plataforma creada con el propósito de centralizar
                        y organizar la información del escultismo en Guatemala. Construyo esta aplicación utilizando tecnologías
                        modernas para garantizar una experiencia rápida, segura y accesible para toda la comunidad. Si necesitas
                        soporte, deseas proponer mejoras o quieres explorar futuras integraciones, estaré encantada de estar en contacto.
                    </p>
                </div>
                <div className="bg-gray-200 pb-12">
                    <div className='grid grid-cols-1 md:grid-cols-2 mx-8'>
                        <div className="flex mx-auto max-w-screen mb-24 gap-2 justify-center mx-16">
                            <Image src="/AndresC.jpg" alt="Foto de Andres" className="rounded-full my-12 mx-auto w-full   object-cover" width={200} height={200} />

                        </div>
                        <div>
                            <p className="text-base font-normal text-gray-800 md:text-lg sm:px-16 lg:px-24 my-16 text-center font-semibold">
                                Como desarrollador full stack, me encargo del diseño, la arquitectura y la implementación de cada una de las
                                funciones de la plataforma. Desde el backend que gestiona los documentos y eventos, hasta el frontend que
                                interactúa con los usuarios, mi trabajo busca que todo sea intuitivo, estable y fácil de usar para scouters,
                                dirigentes y jóvenes.
                            </p>
                            <p className="text-base font-normal text-gray-800 md:text-lg sm:px-16 lg:px-24 my-16 text-center font-semibold">
                                Si tienes dudas, comentarios, solicitudes o ideas para mejorar Scouteca, puedes ponerte en contacto conmigo.
                                También puedes escribirme si quieres saber más sobre cómo fue desarrollada la plataforma, si deseas colaborar
                                o si tienes interés en implementar soluciones similares en tu propio grupo o proyecto.
                            </p>
                            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center my-6 sm:space-y-0 md:space-x-4">

                                <a type="button" href="mailto:andyecarvajal@gmail.com" target="_blank" className="text-white bg-gradient-to-br cursor-pointer from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-lg px-5 py-2.5 text-center leading-8 ">Envíame un correo <span aria-hidden="true">&rarr;</span></a>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    )
}
{/*https://docs.google.com/forms/d/e/1FAIpQLSdoF-wmhPf4EhrVk3qHe8o8NSLuuYYoyhU_nItCbcd1_tnroA/viewform?usp=sharing&ouid=110963328688090878258*/ }