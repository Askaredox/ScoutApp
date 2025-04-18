'use client';

import { getGroup, isAuthenticated, refreshAuthToken, request } from "@/utils/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User_data {
    id_user: number;
    email: string;
    email_verified: string;
    name: string;
    groups: number;
}


export default function Normaluser() {
    const { back, replace } = useRouter();
    const [normaluser, setNormaluser] = useState<User_data>();


    useEffect(() => {
        if (!isAuthenticated()) {
            replace("/login");
        }
        else {
            refreshAuthToken();
            get_group();
        }
    }, []);

    async function get_group() {
        const user = await getGroup();
        if (user.groups == 'Scout') {
            replace("/profile");
        }
        else if (user.groups == 'Admin') {
            replace("/admin/profile");
            update_user();
        }
    }

    function update_user() {
        const token = Cookies.get('idToken');
        request('GET', '/user_info', "application/json", token, null)
            .then((scout) => {
                setNormaluser({ id_user: scout.sub, email: scout.email, email_verified: scout.email_verified, name: scout.name, groups: scout.groups });
            })
    }

    return (
        <div className="size-full">
            <div className="min-h-screen size-full dark:bg-gray-900 bg-gray-50 flex justify-center">
                <section className="size-full bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased ">
                    <div className="mx-auto max-w-screen-xl px-2 lg:px-12">
                        <div className="flex">
                            <button type="button" onClick={() => back()} className="text-white p-5 mb-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
                                </svg>

                            </button>
                            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white mb-2">
                                Perfil
                            </h1>
                        </div>
                        <div className="max-w p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

                            <h4 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Información Personal</h4>
                            <hr className="my-4 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent  dark:via-neutral-400" />


                            <h6 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">Id scout</h6>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{normaluser?.id_user}</p>
                            <br />

                            <h6 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">Usuario</h6>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{normaluser?.name}</p>
                            <br />

                            <h6 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">Correo registrado</h6>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{normaluser?.email}</p>
                            <br />

                            <h6 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">Tipo usuario</h6>
                            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{normaluser?.groups}</p>
                            <br />

                        </div>
                    </div>
                </section>
            </div>
        </div>

    );
    /**
     * 
                            <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M5 8a4 4 0 1 1 7.796 1.263l-2.533 2.534A4 4 0 0 1 5 8Zm4.06 5H7a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h2.172a2.999 2.999 0 0 1-.114-1.588l.674-3.372a3 3 0 0 1 .82-1.533L9.06 13Zm9.032-5a2.907 2.907 0 0 0-2.056.852L9.967 14.92a1 1 0 0 0-.273.51l-.675 3.373a1 1 0 0 0 1.177 1.177l3.372-.675a1 1 0 0 0 .511-.273l6.07-6.07a2.91 2.91 0 0 0-.944-4.742A2.907 2.907 0 0 0 18.092 8Z" clipRule="evenodd" />
                                </svg>
                                &nbsp;Edit&nbsp;


                            </a>
     */
}
