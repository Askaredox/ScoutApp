'use client'

import MainNav from "@/app/_components/MainNav";
import { request_data } from "@/lib/request-utils";
import { useEffect, useState } from "react";


export default function Example() {
  const [message, setMessage] = useState('');
  const [version, setVersion] = useState('');
  function getMessage() {
    request_data('GET', '/', 'application/json', null, false).then((data) => {
      const body = data.data;
      setMessage(body.message);
      setVersion(body.version);
    });
  }

  useEffect(() => {
    getMessage();
  }, []);

  return (
    <div className="bg-gray-900 h-screen overflow-hidden">
      <MainNav />

      <section className="bg-center bg-cover bg-dark  bg-[url('/fondo1.jpeg')] bg-blend-overlay bg-scroll object-none h-full ">
        <div className="px-4 mx-auto max-w-screen text-center sm:py-36 md:py-48 py-36 backdrop-blur-xs backdrop-brightness-30 h-full">
          {message && (
            <div className="w-auto inline-flex items-center p-1 pe-2 mb-4 text-sm text-fg-brand-strong rounded-full bg-brand-softer border border-brand-subtle " role="alert">
              <span className="text-fg-brand-strong py-1 px-2 rounded-full border bg-gray-800 motion-safe:animate-bounce -rotate-20">Nuevo</span>
              <div className="mx-4 text-sm">
                {message}
              </div>
            </div>
          )}
          <h1 className="my-8 text-4xl font-bold tracking-tighter text-white md:text-5xl lg:text-6xl">Scouteca: La Biblioteca Digital Scout de Guatemala</h1>
          <p className="text-base font-normal text-white md:text-xl sm:px-16 lg:px-48 my-18">
            Scouteca es la plataforma digital que reúne los archivos, manuales, circulares, actividades y herramientas
            oficiales del escultismo en Guatemala. Todo organizado, accesible y listo para líderes y jóvenes.
          </p>
          <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center my-6 sm:space-y-0 md:space-x-4">

            <a type="button" href="/signup" className="text-white bg-gradient-to-br cursor-pointer from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-full text-lg px-5 py-2.5 text-center leading-8 ">Únete a Scouteca <span aria-hidden="true">&rarr;</span></a>
          </div>
        </div>
      </section>
      <footer className="absolute inset-x-0 bottom-0 rounded-base shadow-xs">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:pb-8">
          <span className="block text-sm text-body text-center">Made with ❤️ by <a href="https://github.com/Askaredox" target="_blank" className="hover:underline">Andrés Carvajal</a>.</span>
          <span className="block text-sm text-body text-center">Versión: {version}</span>
        </div>
      </footer>
    </div>
  )
}
