'use client';
import Header from '@/app/_components/Header';
import Pagination from '@/app/_components/Pagination';
import SearchBar from '@/app/_components/SearchBar';
import DataTable from '@/app/_components/Table';
import { Metadata, User } from '@/utils/interfaces';
import { request } from '@/utils/request-utils';
import { useState } from 'react';

import Image from 'next/image';
import NavBar from '../_components/NavBar';


export default function AdminScout() {
    const [user_data, setUser_data] = useState<Metadata<User> | null>(null);
    const [filteredUser, setFilteredUser] = useState<Array<User>>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [ready, setReady] = useState<boolean>(false);

    function update_users(page: number = 1, per_page: number = 10) {
        setReady(false);
        request('GET', '/user?page=' + page + '&per_page=' + per_page, "application/json")
            .then((user_data_res) => {
                setUser_data(user_data_res);
                setFilteredUser(user_data_res.data);
                setReady(true);
            })
    }


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const filtered = user_data ? user_data.data.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [];
        setFilteredUser(filtered);
    };

    return (
        <main>
            <NavBar callback={update_users} />
            <div className="sm:ml-56 mt-16 sm:mt-14">
                <section className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
                    <div className="max-w-7xl mx-auto">
                        <Header title="Administrador de Usuarios" />

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">

                            <SearchBar
                                handleSubmit={handleSubmit}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                placeholder="Buscar usuario..."
                            />

                        </div>


                        <DataTable
                            ready={ready}
                            headerRows={
                                <tr>
                                    <th className="px-4 py-3 text-left">Avatar</th>
                                    <th className="px-4 py-3 text-left">Email</th>
                                    <th className="px-4 py-3 text-left">Nombre</th>
                                    <th className="px-4 py-3 text-left">Verificado</th>
                                    <th className="px-4 py-3 text-left">Tipo</th>
                                </tr>
                            }
                            dataRows={
                                filteredUser.map((a, i) => (
                                    <tr key={i} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-4 py-3">
                                            <Image src={a.avatar} width={60} height={0} alt="Banner" className="h-10 w-auto rounded-md object-cover" />
                                        </td>
                                        <td className="px-4 py-3 font-medium">{a.email}</td>
                                        <td className="px-4 py-3 font-medium">{a.name}</td>
                                        <td className="px-4 py-3 font-medium">{a.email_verified}</td>
                                        <td className="px-4 py-3 font-medium">{a.groups}</td>
                                        {/* 
                                        <td className="px-4 py-3 text-right">
                                            <div className="relative inline-block text-left">
                                                <button
                                                    onClick={() => toggleDropdown(i)} // lógica personalizada
                                                    onBlur={() => toggleDropdown(i, false)}
                                                    type="button"
                                                    className="inline-flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
                                                    aria-haspopup="true"
                                                    aria-expanded={eventEditData[i] ? "true" : "false"}
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </button>

                                                {eventEditData[i] && (
                                                    <div
                                                        className="absolute right-0 z-50 mt-2 w-40 origin-bottom-right rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none transition transform scale-95"
                                                    >
                                                        <div className="py-1">
                                                            <button
                                                                onClick={() => openUpdateEventModal(a.id_event, a.title, a.description, a.expire_date)}
                                                                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            >
                                                                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                                                </svg>
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() => openDeleteEventModal(a.id_event)}
                                                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700"
                                                            ><svg className="w-4 h-4 mr-2" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                                    <path fillRule="evenodd" clipRule="evenodd" fill="currentColor" d="M6.09922 0.300781C5.93212 0.30087 5.76835 0.347476 5.62625 0.435378C5.48414 0.523281 5.36931 0.649009 5.29462 0.798481L4.64302 2.10078H1.59922C1.36052 2.10078 1.13161 2.1956 0.962823 2.36439C0.79404 2.53317 0.699219 2.76209 0.699219 3.00078C0.699219 3.23948 0.79404 3.46839 0.962823 3.63718C1.13161 3.80596 1.36052 3.90078 1.59922 3.90078V12.9008C1.59922 13.3782 1.78886 13.836 2.12643 14.1736C2.46399 14.5111 2.92183 14.7008 3.39922 14.7008H10.5992C11.0766 14.7008 11.5344 14.5111 11.872 14.1736C12.2096 13.836 12.3992 13.3782 12.3992 12.9008V3.90078C12.6379 3.90078 12.8668 3.80596 13.0356 3.63718C13.2044 3.46839 13.2992 3.23948 13.2992 3.00078C13.2992 2.76209 13.2044 2.53317 13.0356 2.36439C12.8668 2.1956 12.6379 2.10078 12.3992 2.10078H9.35542L8.70382 0.798481C8.62913 0.649009 8.5143 0.523281 8.37219 0.435378C8.23009 0.347476 8.06631 0.30087 7.89922 0.300781H6.09922ZM4.29922 5.70078C4.29922 5.46209 4.39404 5.23317 4.56282 5.06439C4.73161 4.8956 4.96052 4.80078 5.19922 4.80078C5.43791 4.80078 5.66683 4.8956 5.83561 5.06439C6.0044 5.23317 6.09922 5.46209 6.09922 5.70078V11.1008C6.09922 11.3395 6.0044 11.5684 5.83561 11.7372C5.66683 11.906 5.43791 12.0008 5.19922 12.0008C4.96052 12.0008 4.73161 11.906 4.56282 11.7372C4.39404 11.5684 4.29922 11.3395 4.29922 11.1008V5.70078ZM8.79922 4.80078C8.56052 4.80078 8.33161 4.8956 8.16282 5.06439C7.99404 5.23317 7.89922 5.46209 7.89922 5.70078V11.1008C7.89922 11.3395 7.99404 11.5684 8.16282 11.7372C8.33161 11.906 8.56052 12.0008 8.79922 12.0008C9.03791 12.0008 9.26683 11.906 9.43561 11.7372C9.6044 11.5684 9.69922 11.3395 9.69922 11.1008V5.70078C9.69922 5.46209 9.6044 5.23317 9.43561 5.06439C9.26683 4.8956 9.03791 4.80078 8.79922 4.80078Z" />
                                                                </svg>
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        */}
                                    </tr>
                                ))
                            }
                        />

                        <Pagination paginatedData={user_data} update_event_url={() => console.log('actualizaaaaaa')} />
                    </div>
                </section>

            </div>

        </main>
    );
}