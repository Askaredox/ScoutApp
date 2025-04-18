'use client';
import { Announcement, Announcement_metadata } from '@/utils/interfaces';
import { formatDateToYYYYMMDD, getGroup, isAuthenticated, refreshAuthToken, request, upload_presigned_url } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Cookies from 'js-cookie';



export default function AdminAnnouncement() {
    const [announcement_data, setAnnouncement_data] = useState<Announcement_metadata | null>(null);
    const [newAnnouncementModal, setNewAnnouncementModal] = useState<boolean>(false);
    const [announcementsubject, setannouncementsubject] = useState<string>('');
    const [announcementshort_description, setannouncementshort_description] = useState<string>('');
    const [announcementportrait, setannouncementportrait] = useState<File | null>(null);
    const [announcementinformation, setannouncementinformation] = useState<File | null>(null);
    const [announcementexpire, setannouncementexpire] = useState<string>('');

    const [updateAnnouncementModal, setUpdateAnnouncementModal] = useState<boolean>(false);
    const [updateAnnouncementid, setUpdateAnnouncementid] = useState<string>('');
    const [updateAnnouncementsubject, setUpdateAnnouncementsubject] = useState<string>('');
    const [updateAnnouncementshort_description, setUpdateAnnouncementshort_description] = useState<string>('');
    const [updateAnnouncementexpire, setUpdateAnnouncementexpire] = useState<string>('');
    const [updateAnnouncementportrait, setUpdateAnnouncementportrait] = useState<File | null>(null);
    const [updateAnnouncementinformation, setUpdateAnnouncementinformation] = useState<File | null>(null);

    const [announcementEditData, setannouncementEditData] = useState<boolean[]>([]);

    const [deleteAnnouncementModal, setDeleteAnnouncementModal] = useState<boolean>(false);
    const [deleteAnnouncementId, setDeleteAnnouncementId] = useState<string>('');

    const { replace, back } = useRouter();

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
        let user = await getGroup();
        if (user.groups == 'Scout') {
            replace("/");
        }
        else if (user.groups == 'Admin') {
            replace("/admin/anuncios");
            update_announcement();
        }
    }

    function update_announcement_url(url: string) {
        let token = Cookies.get('idToken');
        request('GET', url, "application/json", token, null)
            .then((announcement_data_res) => {
                let count = announcement_data_res.metadata.total;
                setannouncementEditData(new Array(count).fill(false));
                let announcements: Announcement[] = [];
                let announcement_meta: Announcement_metadata = {
                    metadata: announcement_data_res.metadata,
                    data: []
                };

                announcement_data_res.data.forEach((data: any) => {
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
                announcement_meta.data = announcements;
                setAnnouncement_data(announcement_meta);
            })
    }

    function update_announcement(page: number = 1, per_page: number = 10) {
        let token = Cookies.get('idToken');;
        request('GET', '/announcements_meta?page=' + page + '&per_page=' + per_page, "application/json", token, null)
            .then((announcement_data_res) => {
                let count = announcement_data_res.metadata.total;
                setannouncementEditData(new Array(count).fill(false));
                let announcements: Announcement[] = [];
                let announcement_meta: Announcement_metadata = {
                    metadata: announcement_data_res.metadata,
                    data: []
                };

                announcement_data_res.data.forEach((data: any) => {
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
                announcement_meta.data = announcements;
                setAnnouncement_data(announcement_meta);
            })
    }

    function openUpdateAnnouncementModal(id: string, subject: string, short_description: string, expire: string) {
        setUpdateAnnouncementModal(true);
        setUpdateAnnouncementid(id);
        setUpdateAnnouncementsubject(subject);
        setUpdateAnnouncementshort_description(short_description);
        setUpdateAnnouncementexpire(expire);
    }

    function openDeleteAnnouncementModal(id: string) {
        setDeleteAnnouncementModal(true);
        setDeleteAnnouncementId(id);
    }

    async function newAnnouncement(e: any) {
        e.preventDefault();
        let data = {
            title: announcementsubject,
            description: announcementshort_description,
            image_name: announcementportrait?.name,
            information_name: announcementinformation?.name,
            expire_date: announcementexpire
        };
        let token = Cookies.get('idToken');
        request('POST', '/announcement', "application/json", token, JSON.stringify(data))
            .then(async (announcement) => {
                console.log(announcement);
                if (announcementportrait) // check if the file is null
                    await upload_presigned_url(announcementportrait, announcement.post_data.url);
                if (announcementinformation) // check if the file is null
                    await upload_presigned_url(announcementinformation, announcement.information_data.url);
                alert("Archivo subido correctamente");
                update_announcement()
                setNewAnnouncementModal(false)
            }).catch((err) => console.error(err))
        //.finally(() => setNewFileSpinner(false));
    }
    async function updateAnnouncement(e: any) {
        e.preventDefault();
        let announcement_id = updateAnnouncementid.split('#')[1];

        let data = {
            title: updateAnnouncementsubject,
            description: updateAnnouncementshort_description,
            image_name: updateAnnouncementportrait?.name,
            information_name: updateAnnouncementinformation?.name,
            expire_date: formatDateToYYYYMMDD(new Date(Number(updateAnnouncementexpire) * 1000))
        };

        let token = Cookies.get('idToken');
        request('PUT', '/announcement?id_announcement=' + announcement_id, "application/json", token, JSON.stringify(data))
            .then(async (announcement) => {
                console.log(announcement);
                if (updateAnnouncementportrait) // check if the file is null
                    await upload_presigned_url(updateAnnouncementportrait, announcement.presigned_image_data.url);
                if (updateAnnouncementinformation) // check if the file is null
                    await upload_presigned_url(updateAnnouncementinformation, announcement.presigned_info_data.url);
                alert("Archivo subido correctamente");
                update_announcement()
                setUpdateAnnouncementModal(false)
            }).catch((err) => console.error(err))
    }


    function deleteAnnouncement(e: any) {
        e.preventDefault();
        let token = Cookies.get('idToken');
        let announcement_id = deleteAnnouncementId.split('#')[1];
        request('DELETE', '/announcement?id_announcement=' + announcement_id, "application/json", token, null)
            .then((announcement) => {
                update_announcement()
                setDeleteAnnouncementModal(false)
            })
    }

    function handleUpdateFileChange(e: any, type: string) {
        if (e.target.files[0].size > 20000000) {
            alert("El archivo es demasiado grande");
            return;
        }
        if (type == 'portrait')
            setUpdateAnnouncementportrait(e.target.files[0]);
        else if (type == 'information')
            setUpdateAnnouncementinformation(e.target.files[0]);
    }

    function handleFileChange(e: any, type: string) {
        if (e.target.files[0].size > 20000000) {
            alert("El archivo es demasiado grande");
            return;
        }
        //console.log(e.target.files[0]);
        if (type == 'portrait')
            setannouncementportrait(e.target.files[0]);
        else if (type == 'information')
            setannouncementinformation(e.target.files[0]);
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
                                Administrador de Anuncios
                            </h1>
                        </div>
                        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">

                            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                                <div className="w-full md:w-1/2">
                                    <form className="flex items-center">
                                        <label htmlFor="simple-search" className="sr-only">Buscar</label>
                                        <div className="relative w-full">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search"></input>
                                        </div>
                                    </form>
                                </div>
                                <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                                    <button type="button" onClick={() => setNewAnnouncementModal(true)} id="createProductModalButton" data-modal-target="createProductModal" data-modal-toggle="createProductModal" className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                                        <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                                        </svg>
                                        Añadir Anuncio
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th scope="col" className="px-3 py-4">Título</th>
                                            <th scope="col" className="px-4 py-3">Descripción</th>
                                            <th scope="col" className="px-4 py-3">Expira</th>
                                            <th scope="col" className="px-4 py-3">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {announcement_data && announcement_data.data.map((announcement, i) => (
                                            <tr className="border-b dark:border-gray-700" key={i}>
                                                <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{announcement.title}</th>
                                                <td className="px-4 py-3">{announcement.description}</td>
                                                <td className="px-4 py-3">{new Date(Number(announcement.expire_date) * 1000).toLocaleDateString()}</td>
                                                <td className="px-4 py-3 flex items-center justify-end">
                                                    <button id="apple-imac-27-dropdown-button" onClick={() => { setannouncementEditData(announcementEditData.map((data, index) => index === i ? !data : data)) }} data-dropdown-toggle="apple-imac-27-dropdown" className="inline-flex items-center text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 dark:hover-bg-gray-800 text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100" type="button">
                                                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        </svg>
                                                    </button>
                                                    <div id="apple-imac-27-dropdown" className={"z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600" + (announcementEditData[i] ? "" : " hidden")}>
                                                        <ul className="py-1 text-sm" aria-labelledby="apple-imac-27-dropdown-button">
                                                            <li>
                                                                <button type="button" onClick={() => openUpdateAnnouncementModal(announcement.id_announcement, announcement.title, announcement.description, announcement.expire_date)} data-modal-target="updateProductModal" data-modal-toggle="updateProductModal" className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200">
                                                                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                                        <path fillRule="evenodd" clipRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                                                    </svg>
                                                                    Edit
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button type="button" data-modal-target="readProductModal" data-modal-toggle="readProductModal" className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white text-gray-700 dark:text-gray-200">
                                                                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                        <path fillRule="evenodd" clipRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
                                                                    </svg>
                                                                    Preview
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button type="button" onClick={() => { openDeleteAnnouncementModal(announcement.id_announcement) }} data-modal-target="deleteModal" data-modal-toggle="deleteModal" className="flex w-full items-center py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 text-red-500 dark:hover:text-red-400">
                                                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                                        <path fillRule="evenodd" clipRule="evenodd" fill="currentColor" d="M6.09922 0.300781C5.93212 0.30087 5.76835 0.347476 5.62625 0.435378C5.48414 0.523281 5.36931 0.649009 5.29462 0.798481L4.64302 2.10078H1.59922C1.36052 2.10078 1.13161 2.1956 0.962823 2.36439C0.79404 2.53317 0.699219 2.76209 0.699219 3.00078C0.699219 3.23948 0.79404 3.46839 0.962823 3.63718C1.13161 3.80596 1.36052 3.90078 1.59922 3.90078V12.9008C1.59922 13.3782 1.78886 13.836 2.12643 14.1736C2.46399 14.5111 2.92183 14.7008 3.39922 14.7008H10.5992C11.0766 14.7008 11.5344 14.5111 11.872 14.1736C12.2096 13.836 12.3992 13.3782 12.3992 12.9008V3.90078C12.6379 3.90078 12.8668 3.80596 13.0356 3.63718C13.2044 3.46839 13.2992 3.23948 13.2992 3.00078C13.2992 2.76209 13.2044 2.53317 13.0356 2.36439C12.8668 2.1956 12.6379 2.10078 12.3992 2.10078H9.35542L8.70382 0.798481C8.62913 0.649009 8.5143 0.523281 8.37219 0.435378C8.23009 0.347476 8.06631 0.30087 7.89922 0.300781H6.09922ZM4.29922 5.70078C4.29922 5.46209 4.39404 5.23317 4.56282 5.06439C4.73161 4.8956 4.96052 4.80078 5.19922 4.80078C5.43791 4.80078 5.66683 4.8956 5.83561 5.06439C6.0044 5.23317 6.09922 5.46209 6.09922 5.70078V11.1008C6.09922 11.3395 6.0044 11.5684 5.83561 11.7372C5.66683 11.906 5.43791 12.0008 5.19922 12.0008C4.96052 12.0008 4.73161 11.906 4.56282 11.7372C4.39404 11.5684 4.29922 11.3395 4.29922 11.1008V5.70078ZM8.79922 4.80078C8.56052 4.80078 8.33161 4.8956 8.16282 5.06439C7.99404 5.23317 7.89922 5.46209 7.89922 5.70078V11.1008C7.89922 11.3395 7.99404 11.5684 8.16282 11.7372C8.33161 11.906 8.56052 12.0008 8.79922 12.0008C9.03791 12.0008 9.26683 11.906 9.43561 11.7372C9.6044 11.5684 9.69922 11.3395 9.69922 11.1008V5.70078C9.69922 5.46209 9.6044 5.23317 9.43561 5.06439C9.26683 4.8956 9.03791 4.80078 8.79922 4.80078Z" />
                                                                    </svg>
                                                                    Delete
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
                                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                                    Mostrando&nbsp;
                                    {announcement_data && announcement_data.metadata ? (
                                        <>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {((announcement_data.metadata.page - 1) * announcement_data.metadata.per_page) + 1}-
                                                {Math.min(
                                                    announcement_data.metadata.page * announcement_data.metadata.per_page,
                                                    announcement_data.metadata.total
                                                )}
                                            </span>
                                            &nbsp;de&nbsp;
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {announcement_data.metadata.total}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="font-semibold text-gray-900 dark:text-white">Cargando...</span>
                                    )}
                                </span>
                                <ul className="inline-flex items-stretch -space-x-px">
                                    {
                                        announcement_data && announcement_data.metadata.links.previous !== null ? (
                                            <li>
                                                <a onClick={() => update_announcement_url(announcement_data.metadata.links.previous)} className="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                                    <span className="sr-only">Previous</span>
                                                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </a>
                                            </li>
                                        ) :
                                            <li></li>
                                    }
                                    <li>
                                        <a href="#" className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</a>
                                    </li>
                                    <li>
                                        <a href="#" aria-current="page" className="flex items-center justify-center text-sm z-10 py-2 px-3 leading-tight text-primary-600 bg-primary-50 border border-primary-300 hover:bg-primary-100 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">{announcement_data && announcement_data.metadata.page}</a>
                                    </li>
                                    <li>
                                        <a href="#" className="flex items-center justify-center text-sm py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">...</a>
                                    </li>
                                    {
                                        announcement_data && announcement_data.metadata.links.next !== null ? (
                                            <li>
                                                <a onClick={() => update_announcement_url(announcement_data.metadata.links.next)} className="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                                    <span className="sr-only">Next</span>
                                                    <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </a>
                                            </li>
                                        ) :
                                            <li></li>
                                    }

                                </ul>
                            </nav>
                        </div>
                    </div>
                </section>

                <div id="createAnnouncementModal" tabIndex={-1} aria-hidden="true" className={"width-full overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full " + (newAnnouncementModal ? "" : "hidden")}>
                    <div className="relative p-4 w-full max-w-2xl max-h-full mx-auto">

                        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">

                            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Añadir Anuncio</h3>
                                <button type="button" onClick={() => setNewAnnouncementModal(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-target="createProductModal" data-modal-toggle="createProductModal">
                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>

                            <form onSubmit={newAnnouncement}>
                                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Título</label>
                                        <input type="text" value={announcementsubject} onChange={(e) => setannouncementsubject(e.target.value)} name="subject" id="subject" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Título" >
                                        </input>
                                    </div>
                                    <div>
                                        <label htmlFor="descr" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción</label>
                                        <input type="text" value={announcementshort_description} onChange={(e) => setannouncementshort_description(e.target.value)} name="descr" id="descr" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Descripción" >
                                        </input>
                                    </div>
                                    <div>
                                        <label htmlFor="expire" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Expiración</label>
                                        <input type="date" value={announcementexpire} onChange={(e) => setannouncementexpire(e.target.value)} name="expire" id="expire" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Expiración" >
                                        </input>
                                    </div>
                                    <div>
                                        <label htmlFor="portrait" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Portada</label>
                                        <input type="file" onChange={(e) => handleFileChange(e, 'portrait')} name="portrait" id="portrait" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Imagen" >
                                        </input>
                                    </div>
                                    <div>
                                        <label htmlFor="information" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ficha técnica o archivo de información</label>
                                        <input type="file" onChange={(e) => handleFileChange(e, 'information')} name="information" id="information" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Imagen" >
                                        </input>
                                    </div>


                                </div>
                                <button type="submit" className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Añadir Anuncio
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div id="updateUserModal" tabIndex={-1} aria-hidden="true" className={"width-full overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full " + (updateAnnouncementModal ? "" : "hidden")}>
                    <div className="relative p-4 w-full max-w-2xl max-h-full mx-auto">

                        <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">

                            <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Editar Anuncio</h3>
                                <button type="button" onClick={() => setUpdateAnnouncementModal(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-target="createProductModal" data-modal-toggle="createProductModal">
                                    <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                    <span className="sr-only">Close modal</span>
                                </button>
                            </div>

                            <form onSubmit={updateAnnouncement}>
                                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="announcementid" className="block mb-2 text-sm font-medium text-gray-200 dark:text-white">ID</label>
                                        <input readOnly type="text" value={updateAnnouncementid} name="announcementid" id="announcementid" className="bg-gray-50 border border-gray-300 text-gray-200 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-gray-500 dark:border-gray-600 dark:focus:border-gray-600" placeholder="Título" >
                                        </input>
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Título</label>
                                        <input type="text" value={updateAnnouncementsubject} onChange={(e) => setUpdateAnnouncementsubject(e.target.value)} name="subject" id="subject" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Título" >
                                        </input>
                                    </div>
                                    <div>
                                        <label htmlFor="descr" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción</label>
                                        <input type="text" value={updateAnnouncementshort_description} onChange={(e) => setUpdateAnnouncementshort_description(e.target.value)} name="descr" id="descr" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Descripción" >
                                        </input>
                                    </div>
                                    <div>
                                        <label htmlFor="expire" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Expiración</label>
                                        <input type="date" value={formatDateToYYYYMMDD(new Date(Number(updateAnnouncementexpire) * 1000))} onChange={(e) => setUpdateAnnouncementexpire(e.target.value)} name="expire" id="expire" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Expiración" >
                                        </input>
                                    </div>
                                    <div>
                                        <label htmlFor="update_portrait" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Portada</label>
                                        <input type="file" onChange={(e) => handleUpdateFileChange(e, 'portrait')} name="update_portrait" id="update_portrait" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Imagen" >
                                        </input>
                                    </div>
                                    <div>
                                        <label htmlFor="update_information" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ficha técnica o archivo de información</label>
                                        <input type="file" onChange={(e) => handleUpdateFileChange(e, 'information')} name="update_information" id="update_information" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Imagen" >
                                        </input>
                                    </div>

                                </div>
                                <button type="submit" className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                                    <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Editar Anuncio
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div id="deleteModal" tabIndex={-1} aria-hidden="true" className={"width-full overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full " + (deleteAnnouncementModal ? "" : "hidden")}>
                    <div className="relative p-4 w-full max-w-md max-h-full m-auto">
                        <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                            <button type="button" onClick={() => setDeleteAnnouncementModal(false)} className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="deleteModal">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                            <svg className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="mb-4 text-gray-500 dark:text-gray-300">¿Seguro que desea eliminar este Anuncio?</p>
                            <div className="flex justify-center items-center space-x-4">
                                <button onClick={() => setDeleteAnnouncementModal(false)} data-modal-toggle="deleteModal" type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancelar</button>
                                <button onClick={deleteAnnouncement} type="submit" className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">Yes, seguro</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}