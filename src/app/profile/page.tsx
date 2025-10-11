'use client';

import { AccessToken, getGroup } from '@/utils/auth';
import { request } from '@/utils/request-utils';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User_data {
    id_user: number;
    email: string;
    email_verified: string;
    name: string;
    groups: number;
}


export default function UserProfile() {
    const { back, replace } = useRouter();
    const [normaluser, setNormaluser] = useState<User_data>();


    useEffect(() => {
        if (!AccessToken.is_authenticated()) {
            replace("/login");
        }
        else {
            get_group();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function get_group() {
        const user = await getGroup();
        if (user.groups == 'Admin') {
            replace("/admin/profile");
        }
        else {
            update_user();
        }
    }

    function update_user() {
        request('GET', '/user_info', "application/json")
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

}
