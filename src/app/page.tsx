'use client';

import { Event, Event_response } from "@/utils/interfaces";
import { getGroup, isAuthenticated, refreshAuthToken, request } from "@/utils/utils";
import Cookies from "js-cookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function User() {
  const { replace, push } = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [sidenav, setSidenav] = useState(false);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      replace("/login");
    }
    else {
      refreshAuthToken();
      get_group();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function get_group() {
    const user = await getGroup();
    if (user.groups == 'Admin') {
      replace("/admin");
    }
    else {
      update_events();
    }
  }

  function update_events() {
    const token = Cookies.get('idToken');
    if (token) {
      setReady(false);
      request('GET', '/event', 'application/json', token, null)
        .then((event_data) => {
          const events: Event[] = [];
          event_data.forEach((data: Event_response) => {
            const a_data = {
              id_event: data.PK,
              title: data.title,
              description: data.description,
              post: data.post,
              information: data.information,
              created: data.created,
              expire_date: data.expire_date
            }
            events.push(a_data);
          });
          setEvents(events);
          setReady(true);
        })
        .catch((err) => console.log(err))
    }
  }

  function logout() {
    Cookies.remove("accessToken");
    Cookies.remove("idToken");
    Cookies.remove("refreshToken");

    push("/logout");
  }
  return (
    <main>
      {/* Botón hamburguesa visible solo en móviles */}
      <button
        onClick={() => setSidenav(true)}
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden"
      >
        <span className="sr-only">Abrir barra</span>
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
        </svg>
      </button>

      {/* Fondo oscuro cuando el menú móvil está abierto */}
      {sidenav && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
          onClick={() => setSidenav(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        id="default-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-gray-50 dark:bg-gray-800 transition-transform duration-300 
    ${sidenav ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            <li>
              <a href="/biblioteca" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>

                <span className="ms-3">Biblioteca Virtual</span>
              </a>
            </li>
            <li>
              <hr className="my-4 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
            </li>
            <li>
              <a href="/profile" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">Cuenta</span>
              </a>
            </li>
            <li>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSdoF-wmhPf4EhrVk3qHe8o8NSLuuYYoyhU_nItCbcd1_tnroA/viewform?usp=sharing&ouid=110963328688090878258" target="_blank" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg className="h-8 w-8 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z" />
                </svg>


                <span className="flex-1 ms-3 whitespace-nowrap">Comentarios</span>
              </a>
            </li>
            <li>
              <a onClick={logout} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer">
                <svg className="h-8 w-8 text-gray-400" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                  <path d="M7 12h14l-3 -3m0 6l3 -3" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Cerrar sesión</span>
              </a>
            </li>
          </ul>
        </div>

        <footer className="bg-white rounded-lg shadow-sm m-4 dark:bg-gray-800">
          <div className="w-full fixed bottom-0 left-0  mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">© 2025 <a href="https://github.com/Askaredox" target="_blank" className="hover:underline">Andrés Carvajal</a>. All Rights Reserved.
            </span>
          </div>
        </footer>
      </aside>


      <div className="fixed top-0 left-0 sm:left-64 right-0 z-30 bg-white dark:bg-gray-900 px-4 sm:px-6 py-4 shadow-md border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          {/* Botón hamburguesa solo visible en móvil */}
          <button
            onClick={() => setSidenav(true)}
            type="button"
            className="inline-flex items-center p-2 text-sm text-gray-500 mr-3 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden"
          >
            <span className="sr-only">Abrir barra</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" />
            </svg>
          </button>

          {/* Título */}
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-white">
            Eventos
          </h1>
        </div>
      </div>

      <div className="p-6 sm:ml-64 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {!ready && (
          <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
        {events.map((event) => (
          <div
            key={event.id_event}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 transition-shadow hover:shadow-lg"
          >
            <a href={event.information} target="_blank" rel="noopener noreferrer">
              <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-2xl">
                <Image
                  src={event.post}
                  alt={event.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            </a>
            <div className="p-5 flex flex-col justify-between h-full">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  📅{new Date(Number(event.expire_date) * 1000).toLocaleDateString()}

                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {event.description}
                </p>
                <a
                  href={event.information}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Ficha del evento
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </a>
              </div>

            </div>
          </div>
        ))}
      </div>

    </main>
  );
}
