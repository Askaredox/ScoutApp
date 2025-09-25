'use client';
import Header from '@/app/_components/Header';
import Pagination from '@/app/_components/Pagination';
import SearchBar from '@/app/_components/SearchBar';
import DataTable from '@/app/_components/Table';
import { Event, Event_response, Metadata } from '@/utils/interfaces';
import { formatDateToYYYYMMDD, getGroup, isAuthenticated, refreshAuthToken, request } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Cookies from 'js-cookie';
import Image from 'next/image';


export default function AdminScout() {
    const [event_data, setEvent_data] = useState<Metadata | null>(null);
    const [filteredEvents, setFilteredEvents] = useState(event_data?.data || []);
    const [searchTerm, setSearchTerm] = useState("");

    const [updateEventModal, setUpdateEventModal] = useState<boolean>(false);
    const [ready, setReady] = useState<boolean>(false);
    const [updateEventid, setUpdateEventid] = useState<string>('');
    const [updateEventsubject, setUpdateEventsubject] = useState<string>('');
    const [updateEventshort_description, setUpdateEventshort_description] = useState<string>('');
    const [updateEventexpire, setUpdateEventexpire] = useState<string>('');

    const [eventEditData, seteventEditData] = useState<boolean[]>([]);

    const [deleteEventModal, setDeleteEventModal] = useState<boolean>(false);
    const [deleteEventId, setDeleteEventId] = useState<string>('');

    const { replace } = useRouter();

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
            //update_event();
        }
        else {
            replace("/anuncios");
        }
    }

    function update_event_url(url: string) {
        const token = Cookies.get('idToken');
        request('GET', url, "application/json", token, null)
            .then((event_data_res) => {
                const count = event_data_res.metadata.total;
                seteventEditData(new Array(count).fill(false));
                const events: Event[] = [];
                const event_meta: Metadata = {
                    metadata: event_data_res.metadata,
                    data: []
                };

                event_data_res.data.forEach((data: Event_response) => {
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
                event_meta.data = events;
                setEvent_data(event_meta);
                setFilteredEvents(event_meta.data);
            })
        update_users();
    }

    function update_users(page: number = 1, per_page: number = 10) {
        const token = Cookies.get('idToken');
        setReady(false);
        request('GET', '/event_meta?page=' + page + '&per_page=' + per_page, "application/json", token, null)
            .then((event_data_res) => {
                const count = event_data_res.metadata.total;
                seteventEditData(new Array(count).fill(false));
                const events: Event[] = [];
                const event_meta: Metadata = {
                    metadata: event_data_res.metadata,
                    data: []
                };

                event_data_res.data.forEach((data: Event_response) => {
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
                event_meta.data = events;
                setEvent_data(event_meta);
                setFilteredEvents(event_meta.data);
                setReady(true);
            })
    }

    function openUpdateEventModal(id: string, subject: string, short_description: string, expire: string) {
        console.log(id, subject, short_description, expire);
        setUpdateEventModal(true);
        setUpdateEventid(id);
        setUpdateEventsubject(subject);
        setUpdateEventshort_description(short_description);
        setUpdateEventexpire(expire);
    }

    function openDeleteEventModal(id: string) {
        setDeleteEventModal(true);
        setDeleteEventId(id);
    }

    async function updateEvent(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const event_id = updateEventid.split('#')[1];

        const data = {
            title: updateEventsubject,
            description: updateEventshort_description,
            expire_date: formatDateToYYYYMMDD(new Date(Number(updateEventexpire) * 1000))
        };

        const token = Cookies.get('idToken');
        request('PUT', '/event?id_event=' + event_id, "application/json", token, JSON.stringify(data))
            .then(async (event) => {
                console.log(event);
                alert("Archivo subido correctamente");
                //update_event()
                setUpdateEventModal(false)
            }).catch((err) => console.error(err))
    }


    function deleteEvent(e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        const token = Cookies.get('idToken');
        const event_id = deleteEventId.split('#')[1];
        request('DELETE', '/event?id_event=' + event_id, "application/json", token, null)
            .then(() => {
                //update_event()
                setDeleteEventModal(false)
            })
    }


    function toggleDropdown(i: number, activate: boolean | null = null): void {
        setTimeout(() => {
            if (activate !== null) {
                seteventEditData(prevState => {
                    const newState = [...prevState];
                    newState[i] = activate;
                    return newState;
                });
                return;
            }
            seteventEditData(prevState => {
                const newState = [...prevState];
                newState[i] = !newState[i];
                return newState;
            });
        }, 150); // Delay to allow the click event to register before toggling the state

    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const filtered = event_data ? event_data.data.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [];
        setFilteredEvents(filtered);
    };
    return (
        <div className="size-full">
            <section className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <Header title="Administrador de Usuarios **en construcción**" />

                </div>
            </section>
        </div>
    );

    return (
        <div className="size-full">
            <section className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <Header title="Administrador de Usuarios" />

                    {/* Actions */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        {/* Buscador */}
                        <SearchBar
                            handleSubmit={handleSubmit}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            placeholder="Buscar usuario..."
                        />

                    </div>

                    {/* Tabla de Anuncios */}
                    <DataTable
                        ready={ready}
                        headerRows={
                            <tr>
                                <th className="px-4 py-3 text-left">Id</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Verificado</th>
                                <th className="px-4 py-3 text-left">Tipo</th>
                            </tr>
                        }
                        dataRows={
                            filteredEvents.map((a, i) => (
                                <tr key={a.id_event} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 font-medium">{a.title}</td>
                                    <td className="px-4 py-3 truncate max-w-sm">{a.description}</td>
                                    <td className="px-4 py-3">{new Date(Number(a.expire_date) * 1000).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">{new Date(Number(a.created) * 1000).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <Image src={a.post} width={60} height={0} alt="Banner" className="h-10 w-auto rounded-md object-cover" />
                                    </td>
                                    <td className="px-4 py-3">
                                        <a href={a.information} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            Ver PDF
                                        </a>
                                    </td>
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
                                </tr>
                            ))
                        }
                    />

                    <Pagination paginatedData={event_data} update_event_url={update_event_url} />
                </div>
            </section>

            <div id="updateEventModal" tabIndex={-1} aria-hidden="true" className={"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 " + (updateEventModal ? "" : "hidden")}>
                <div className="relative w-full max-w-2xl mx-auto p-4">
                    <div className="relative rounded-2xl bg-white shadow-xl dark:bg-gray-900 px-6 py-8">
                        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Nuevo Anuncio</h3>
                            <button type="button" onClick={() => setUpdateEventModal(false)} className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition" aria-label="Cerrar">
                                <svg className="w-6 h-6 text-gray-600 dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={updateEvent} className="space-y-6">
                            <div className="grid gap-5 sm:grid-cols-2">
                                {/* ID (readonly) */}
                                <div>
                                    <label htmlFor="eventid" className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                                        ID
                                    </label>
                                    <input
                                        readOnly
                                        type="text"
                                        value={updateEventid}
                                        name="eventid"
                                        id="eventid"
                                        className="w-full p-3 text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                                        placeholder="ID del anuncio"
                                    />
                                </div>

                                {/* Título */}
                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        value={updateEventsubject}
                                        onChange={(e) => setUpdateEventsubject(e.target.value)}
                                        name="subject"
                                        id="subject"
                                        className="w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Título del anuncio"
                                        required
                                    />
                                </div>

                                {/* Descripción */}
                                <div>
                                    <label
                                        htmlFor="descr"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Descripción
                                    </label>
                                    <input
                                        type="text"
                                        value={updateEventshort_description}
                                        onChange={(e) => setUpdateEventshort_description(e.target.value)}
                                        name="descr"
                                        id="descr"
                                        className="w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        placeholder="Descripción breve"
                                        required
                                    />
                                </div>

                                {/* Expiración */}
                                <div>
                                    <label
                                        htmlFor="expire"
                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                    >
                                        Expiración
                                    </label>
                                    <input
                                        type="date"
                                        value={formatDateToYYYYMMDD(new Date(Number(updateEventexpire) * 1000))}
                                        onChange={(e) => setUpdateEventexpire(e.target.value)}
                                        name="expire"
                                        id="expire"
                                        className="w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 transition"
                            >
                                <svg
                                    className="w-6 h-6 mr-2 -ml-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                Editar Anuncio
                            </button>
                        </form>
                    </div>
                </div>
            </div>


            <div id="deleteEventModal" tabIndex={-1} aria-hidden="true" className={"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 " + (deleteEventModal ? "" : "hidden")}>
                <div className="relative w-full max-w-2xl mx-auto p-4">
                    <div className="relative rounded-2xl bg-white shadow-xl dark:bg-gray-900 px-6 py-8">
                        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Nuevo Anuncio</h3>
                            <button type="button" onClick={() => setDeleteEventModal(false)} className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition" aria-label="Cerrar">
                                <svg className="w-6 h-6 text-gray-600 dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <svg className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="mb-4 text-gray-500 dark:text-gray-300">¿Seguro que desea eliminar este Anuncio?</p>
                        <div className="flex justify-center items-center space-x-4">
                            <button onClick={() => setDeleteEventModal(false)} data-modal-toggle="deleteModal" type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancelar</button>
                            <button onClick={(e) => deleteEvent(e)} type="submit" className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">Yes, seguro</button>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
}