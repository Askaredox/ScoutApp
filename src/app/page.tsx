'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Announcement {
  id_announcement: number;
  subject: string;
  short_description: string;
  portrait: string;
  expire: string;
}


export default function Home() {
  const { push } = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [sidenav, setSidenav] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {

  }, []);

  function update_announcements() {

  }

  function logout() {
  }
  return (
    <main>
      <button data-drawer-target="default-sidebar" onClick={() => setSidenav(true)} data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
        <span className="sr-only">Abrir barra</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
      </button>

      <aside id="default-sidebar" className={"fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full" + (sidenav ? " " : "sm:translate-x-0")} aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
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
              <a href="/perfil" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>

                <span className="flex-1 ms-3 whitespace-nowrap">Cuenta</span>
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
      </aside>

      <div className="p-4 sm:ml-64">
        <div className="p-2 rounded-lg dark:border-gray-700" onClick={() => setSidenav(false)}>
          <div className="flex h-60 mb-4 rounded bg-gray-50 dark:bg-gray-800">
            {
              announcements.map((announcement) => (

                <a key={announcement.id_announcement} href="#" className="flex flex-auto items-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                  <img className="object-cover w-full rounded-t-lg h-100 md:w-72 md:rounded-none md:rounded-s-lg" src={"data:image/jpeg;base64," + announcement.portrait} alt=""></img>
                  <div className="flex flex-col justify-between p-4 leading-normal">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{announcement.subject}</h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{announcement.short_description}</p>
                  </div>
                </a>
              ))
            }

          </div>

        </div>
      </div>
    </main>
  );
}
