'use client';

import { Announcement } from "@/utils/interfaces";
import { getGroup, isAuthenticated, refreshAuthToken, request } from "@/utils/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Admin() {
    const { push } = useRouter();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [sidenav, setSidenav] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            push("/login");
        }
        else {
            refreshAuthToken();
            get_group();
        }
    }, []);

    async function get_group() {
        let user = await getGroup();
        if (user.groups == 'Scout') {
            push("/");
        }
        else if (user.groups == 'Admin') {
            push("/admin");
            update_announcements();
        }
    }

    function update_announcements() {
        let token = Cookies.get('idToken');
        if (token)
            request('GET', '/announcement', 'application/json', token, null)
                .then((announcement_data) => {
                    console.log(announcement_data);
                    let announcements: Announcement[] = [];
                    announcement_data.forEach((data: any) => {
                        let a_data = {
                            id_announcement: data.PK,
                            title: data.title,
                            description: data.description,
                            post: data.post,
                            information: data.information,
                            created: data.created,
                            expire_date: data.expire_date
                        }
                        announcements.push(a_data);
                    });
                    setAnnouncements(announcements);
                })
                .catch((err) => console.log(err))
    }

    function logout() {
        Cookies.remove("accessToken");
        Cookies.remove("idToken");
        Cookies.remove("refreshToken");

        push("/logout");
    }
    return (
        <main>
            <button data-drawer-target="default-sidebar" onClick={() => setSidenav(true)} data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" className={"inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden"}>
                <span className="sr-only">Abrir barra</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>

            <aside id="default-sidebar" className={"fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full" + (sidenav ? " " : "sm:translate-x-0")} aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <a href="/admin/biblioteca" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>

                                <span className="ms-3">Biblioteca Virtual</span>
                            </a>
                        </li>
                        <li>
                            <a href="/admin/scouts" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="h-8 w-8 text-gray-400" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" />
                                    <rect x="4" y="3" width="8" height="14" rx="4" />
                                    <rect x="12" y="7" width="8" height="10" rx="3" />
                                    <line x1="8" y1="21" x2="8" y2="13" />
                                    <line x1="16" y1="21" x2="16" y2="14" />
                                </svg>

                                <span className="ms-3">Scouts</span>
                            </a>
                        </li>

                        <li>
                            <a href="/admin/anuncios" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg className="w-8 h-8 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M5 3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11.5c.07 0 .14-.007.207-.021.095.014.193.021.293.021h2a2 2 0 0 0 2-2V7a1 1 0 0 0-1-1h-1a1 1 0 1 0 0 2v11h-2V5a2 2 0 0 0-2-2H5Zm7 4a1 1 0 0 1 1-1h.5a1 1 0 1 1 0 2H13a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h.5a1 1 0 1 1 0 2H13a1 1 0 0 1-1-1Zm-6 4a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1Zm0 3a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1ZM7 6a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H7Zm1 3V8h1v1H8Z" clipRule="evenodd" />
                                </svg>
                                <span className="ms-3">Anuncios</span>
                            </a>
                        </li>

                        <li>
                            <hr className="my-4 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
                        </li>
                        <li>
                            <a href="/admin/perfil" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
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

            <div className="p-4 sm:ml-64 grid grid-cols-1 sm:grid-cols-2 gap-6 justify-center-safe">
                {
                    announcements.map((announcement) => (
                        <div key={announcement.id_announcement} className="max-w-sm mb-5 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                            <a href={announcement.post}>
                                <img className="rounded-t-lg" src={announcement.post} alt="" />
                            </a>
                            <div className="p-5">
                                <a href={announcement.information}>
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{announcement.title}</h5>
                                </a>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{announcement.description}</p>
                                {
                                    //announcement.information
                                }
                                <a href={announcement.information} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Read more
                                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                    ))
                }

            </div>
        </main>
    );


/**
 * <a key={announcement.id_announcement} href="#" className="flex flex-auto items-center bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                                    <img className="object-cover w-full rounded-t-lg h-100 md:w-72 md:rounded-none md:rounded-s-lg" src={announcement.post} alt=""></img>
                                    <div className="flex flex-col justify-between p-4 leading-normal">
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{announcement.title}</h5>
                                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{announcement.description}</p>
                                    </div>
                                </a>
                                
                                */}
