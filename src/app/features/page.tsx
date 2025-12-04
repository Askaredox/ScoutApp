'use client'

import MainNav from "@/app/_components/MainNav";

const features = [
    {
        title: "Biblioteca digital Scout de Guatemala",
        description: "Accede a documentos, manuales, circulares y recursos oficiales en un solo lugar. Todo organizado y siempre actualizado para facilitar tu labor como scouter o joven en progresión.",
        badge: (<div className="absolute inline-flex items-center justify-center w-24 h-12 text-xl font-bold text-white bg-green-700 border-green-800 border-2 border-buffer rounded-full -top-2 -end-6 z-50 rotate-12">Nuevo</div>),
        icon: (
            <svg className="w-16 h-16 text-white " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.2857 7V5.78571c0-.43393-.3482-.78571-.7778-.78571H6.06345c-.42955 0-.77777.35178-.77777.78571V16m0 0h-1c-.55229 0-1 .4477-1 1v1c0 .5523.44771 1 1 1h5m-4-3h4m7.00002-6v3c0 .5523-.4477 1-1 1h-3m8-3v8c0 .5523-.4477 1-1 1h-6c-.5523 0-1-.4477-1-1v-5.397c0-.2536.0963-.4977.2696-.683l2.434-2.603c.189-.2022.4535-.317.7304-.317h3.566c.5523 0 1 .4477 1 1Z" />
            </svg>
        )

    },
    {
        title: "Eventos y actividades scouts",
        description: "Consulta actividades, eventos nacionales y fechas importantes desde un panel centralizado. Mantente informado y organiza mejor tu participación en el movimiento scout.",
        badge: <div className="absolute inline-flex items-center justify-center w-24 h-12 text-xl font-bold text-white bg-green-700 border-green-800 border-2 border-buffer rounded-full -top-2 -end-6 z-50 rotate-12">Nuevo</div>,
        icon: (
            <svg className="w-16 h-16 text-white " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 14v7M5 4.971v9.541c5.6-5.538 8.4 2.64 14-.086v-9.54C13.4 7.61 10.6-.568 5 4.97Z" />
            </svg>
        )
    },
    {
        title: "Seguimiento de progresión (próximamente)",
        description: "Muy pronto podrás gestionar la progresión de jóvenes, insignias y rutas formativas desde la plataforma. Una herramienta diseñada para apoyar a scouters y jóvenes en su crecimiento continuo.",
        badge: <div className="absolute inline-flex items-center justify-center w-36 h-12 text-xl font-bold text-white bg-indigo-700 border-indigo-800 border-2 border-buffer rounded-full -top-2 -end-12 z-50 rotate-12">Muy pronto</div>,
        icon: (
            <svg className="w-16 h-16 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.6144 7.19994c.3479.48981.5999 1.15357.5999 1.80006 0 1.6569-1.3432 3-3 3-1.6569 0-3.00004-1.3431-3.00004-3 0-.67539.22319-1.29865.59983-1.80006M6.21426 6v4m0-4 6.00004-3 6 3-6 2-2.40021-.80006M6.21426 6l3.59983 1.19994M6.21426 19.8013v-2.1525c0-1.6825 1.27251-3.3075 2.95093-3.6488l3.04911 2.9345 3-2.9441c1.7026.3193 3 1.9596 3 3.6584v2.1525c0 .6312-.5373 1.1429-1.2 1.1429H7.41426c-.66274 0-1.2-.5117-1.2-1.1429Z" />
            </svg>
        )
    }
];

export default function Features() {


    return (
        <div className="bg-gray-300  h-screen">
            <MainNav />
            <section className="bg-center bg-cover bg-dark  bg-[url('/fondo1.jpeg')] bg-blend-overlay bg-scroll object-none ">
                <div className="px-4 mx-auto max-w-screen text-center py-24 backdrop-blur-xs backdrop-brightness-30">
                    <h1 className="my-8 text-4xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl mx-24 text-center">Características de la biblioteca digital Scout de Guatemala</h1>
                    <p className="text-base font-normal text-white md:text-xl sm:px-16 lg:px-48 my-16">
                        La biblioteca digital Scout de Guatemala reúne en un solo espacio las herramientas, documentos y recursos que líderes y jóvenes necesitan para
                        vivir el escultismo de forma más organizada, accesible y actualizada. A continuación encontrarás las características que hacen de Scouteca una
                        plataforma esencial para la comunidad scout del país.
                    </p>
                </div>
                <div className="bg-gray-200 pb-12">
                    <div className="flex px-4 mx-auto max-w-screen text-center mb-24 gap-8 justify-center flex-wrap">
                        {features.map((feature) => (

                            <div key={feature.title} className="relative bg-teal-50 py-8 rounded-lg block max-w-sm rounded-base shadow-xl z-10 -mt-16 mb-16 hover:scale-105 transition-transform">
                                <div className="flex justify-center mb-4 bg-blue-400 rounded-full w-24 h-24 items-center mx-auto shadow-md">
                                    {feature.icon}
                                </div>
                                <div className="p-2 text-center text-gray-900">
                                    <div>
                                        <h2 className="mt-3 mb-6 text-2xl font-semibold tracking-tight text-gray-900 text-heading">{feature.title}</h2>
                                    </div>
                                    <p className="inline-flex items-center bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                                        {feature.description}
                                    </p>
                                </div>
                                <span className="sr-only">badge</span>
                                {feature.badge}
                            </div>
                        ))}
                    </div>
                    <div>
                        <p className="text-base font-normal text-gray-800 md:text-lg sm:px-16 lg:px-48 my-16 text-center font-semibold">
                            Estas características están diseñadas para apoyar a la comunidad Scout de Guatemala en su misión de formar jóvenes comprometidos,
                            organizados y preparados para liderar con valores. Scouteca es más que una biblioteca digital scout, es una herramienta para el crecimiento
                            e información en el movimiento scout del país.
                        </p>
                        <p className="text-base font-normal text-gray-800 md:text-lg sm:px-16 lg:px-48 my-16 text-center font-semibold">
                            Si tienes sugerencias o ideas para mejorar la plataforma, no dudes en contactarnos. Juntos podemos hacer de Scouteca una herramienta aún más valiosa para
                            todos los Scouts de Guatemala.
                        </p>
                        <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center my-6 sm:space-y-0 md:space-x-4">

                            <a type="button" href="https://docs.google.com/forms/d/e/1FAIpQLSdoF-wmhPf4EhrVk3qHe8o8NSLuuYYoyhU_nItCbcd1_tnroA/viewform?usp=sharing&ouid=110963328688090878258" target="_blank" className="text-white bg-gradient-to-br cursor-pointer from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-lg px-5 py-2.5 text-center leading-8 ">Deja tus comentarios <span aria-hidden="true">&rarr;</span></a>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}
{/*https://docs.google.com/forms/d/e/1FAIpQLSdoF-wmhPf4EhrVk3qHe8o8NSLuuYYoyhU_nItCbcd1_tnroA/viewform?usp=sharing&ouid=110963328688090878258*/ }