'use client';

import AddButton from '@/app/_components/AddButton';
import CreateModal from '@/app/_components/CreateModal';
import Header from '@/app/_components/Header';
import TableCrumbs from '@/app/_components/TableCrumbs';
import { AccessToken, getMe } from '@/utils/auth';
import { File_data, Folder_data } from "@/utils/interfaces";
import { request } from '@/utils/request-utils';
import { create_thumbnail, upload_presigned_url } from '@/utils/utils';

import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";


function get_breadcrumb(url: Array<{ path: string, id: string }>, setUrl: React.Dispatch<React.SetStateAction<{ path: string, id: string }[]>>) {
    const result = [];
    result.push((
        <li className="inline-flex items-center" key={0}>
            <button onClick={() => setUrl([{ 'path': '/', 'id': '0' }])} className="inline-flex items-center cursor-pointer font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-500 rounded-full px-2 dark:text-gray-400 dark:hover:text-white">
                <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                </svg>
                /
            </button>
        </li>
    ));
    for (let i = 1; i < url.length; i++) {
        if (i === url.length - 1) {
            result.push((
                <li className="inline-flex items-center" key={i}>
                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <button className="inline-flex items-center font-medium text-gray-500 hover:text-blue-600 cursor-pointer hover:bg-gray-500 rounded-full px-2 dark:text-gray-400 dark:hover:text-white">


                        <span className="ms-1 font-medium text-gray-500 md:ms-2 dark:text-gray-400">{url[i].path}</span>
                    </button>
                </li>
            ));
        }
        else {
            result.push((
                <li className="inline-flex items-center" key={i}>

                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <button onClick={() => setUrl(url.slice(0, i + 1))} className="inline-flex items-center cursor-pointer font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-500 rounded-full px-2 dark:text-gray-400 dark:hover:text-white">

                        <span className="ms-1 font-medium text-gray-500 md:ms-2 dark:text-gray-400">{url[i].path}</span>
                    </button>
                </li>
            ));
        }
    }
    return result;
}


export default function AdminBiblioteca() {
    const [url, setUrl] = useState([{ 'path': '/', 'id': '0' }]);
    const [folders, setFolders] = useState<Folder_data[]>([]);
    const [files, setFiles] = useState<File_data[]>([]);
    const [newFolderModal, setNewFolderModal] = useState<boolean>(false);
    const [newFolderName, setNewFolderName] = useState<string>('');
    const [newFolderCanView, setNewFolderCanView] = useState<boolean>(true);
    const [newFolderCanDownload, setNewFolderCanDownload] = useState<boolean>(true);
    const [newFileModal, setNewFileModal] = useState<boolean>(false);
    const [newFileName, setNewFileName] = useState<string>('');
    const [newFileCanView, setNewFileCanView] = useState<boolean>(true);
    const [newFileCanDownload, setNewFileCanDownload] = useState<boolean>(true);
    const [newFileDescription, setNewFileDescription] = useState<string>('');
    const [newFileD, setNewFileD] = useState<File | null>(null);
    const newFileDRef = useRef(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteFileModal, setDeleteFileModal] = useState<boolean>(false);
    const [deleteFolderModal, setDeleteFolderModal] = useState<boolean>(false);
    const [ready, setReady] = useState(false);
    const { replace, push } = useRouter();

    const resetFileDRef = () => {
        if (newFileDRef.current) {
            (newFileDRef.current as HTMLInputElement).value = "";
            setNewFileD(null);
        }
    };

    useEffect(() => {
        if (!AccessToken.is_authenticated()) {
            replace("/login");
        }
        else {
            get_group();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    async function get_group() {
        const user = await getMe();
        if (user.groups == 'Admin') {
            update_folders();
        }
        else {
            replace("/biblioteca");
        }
    }

    function update_folders() {
        setReady(false)
        request('GET', '/folder?folder=' + url[url.length - 1].id, 'application/json')
            .then((folder_data) => {
                const folders: Folder_data[] = [];
                const files: File_data[] = [];
                folder_data.forEach((data: Folder_data | File_data) => {
                    if (data.type === 'FOLDER') {
                        folders.push(data as Folder_data);
                    } else if (data.type === 'FILE') {
                        files.push(data as File_data);
                    }
                });
                setReady(true);
                setFolders(folders);
                setFiles(files);
            })
            .catch((err) => console.log(err))
    }

    function closeCreateFolderModal() {
        setNewFolderModal(false);
        setNewFolderName('');
        setNewFolderCanView(true);
        setNewFolderCanDownload(true);
        resetFileDRef();
    }

    function closeCreateFileModal() {
        setNewFileModal(false);
        setNewFileName('');
        setNewFileCanView(true);
        setNewFileCanDownload(true);
        setNewFileDescription('');
        resetFileDRef();
    }


    async function newFolder(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const parent_id = url[url.length - 1].id
        request('POST', '/folder', 'application/json', JSON.stringify({ 'id_parent_folder': 'FOLDER#' + parent_id, 'name': newFolderName, 'can_download': newFolderCanDownload, 'can_view': newFolderCanView }))
            .then(() => {
                update_folders();
                setNewFolderModal(false);
                setNewFolderName('');
            })
    }

    async function newFile(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const parent_id = 'FOLDER#' + url[url.length - 1].id;
        const folder_name = newFileName;
        //let file_base64 = await getBase64(newFilePdf!);
        if (newFileD == null) {
            alert("No se ha seleccionado un archivo");
            return;
        }
        const thumbnail = await create_thumbnail(newFileD);
        if (thumbnail == null) {
            alert("No se ha podido crear la miniatura del archivo");
            return;
        }

        const data = {
            'id_parent_folder': parent_id,
            'name': folder_name,
            'can_download': newFolderCanDownload,
            'can_view': newFolderCanView,
            'description': newFileDescription,
        };
        request('POST', '/file', 'application/json', JSON.stringify(data))
            .then(async (folder_data) => {
                await upload_presigned_url(newFileD, folder_data.file_data.url);
                await upload_thumbnail(thumbnail, folder_data.thumbnail_data.url);
                alert("Archivo subido correctamente");
                update_folders();
                setNewFileModal(false);
                resetFileDRef();
                setNewFileName('');
                setNewFileDescription('');
                setNewFileCanView(true);
                setNewFileCanDownload(true);
            }).catch((err) => console.log(err));
    }
    async function upload_thumbnail(file: File, url: string) {
        if (file.type == "image/jpeg" || file.type == "image/png") {
            await upload_presigned_url(file, url)
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files === null) {
            alert("No se ha seleccionado ningun archivo");
            return;
        }
        if (e.target.files[0].size > 25 * 1000 * 1000) {
            alert("El archivo es demasiado grande");
            return;
        }
        if (e.target.files[0].type != "application/pdf" && e.target.files[0].type != "image/jpeg" && e.target.files[0].type != "image/png" && e.target.files[0].type != "video/mp4") {
            console.log(e.target.files[0].type);
            alert("El archivo debe ser un pdf, jpg, jpeg, png o mp4");
            return;
        }
        setNewFileName(e.target.files[0].name);
        setNewFileD(e.target.files[0]);
    }

    async function view_file(file_data: File_data) {
        push('/file?id_file=' + file_data.id.split('#')[1]);
        //const data = await request('GET', '/file?id_file=' + file_data.id.split('#')[1], 'application/json', Cookies.get('idToken'), null);
        //const file_url = data.url;
        //window.open(file_url, '_blank');
    }

    function delete_folder(id: string) {
        setDeleteId(id);
        setDeleteFolderModal(true);
    }

    async function deleteFolder(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (deleteId == null) {
            alert("No se ha seleccionado ningun folder");
            return;
        }
        request('DELETE', '/folder?id_folder=' + deleteId.split('#')[1], 'application/json'
        ).then(() => {
            alert("Folder eliminado correctamente");
            update_folders();
            setDeleteFolderModal(false);
        })
    }

    function delete_file(id: string) {
        setDeleteId(id);
        setDeleteFileModal(true);
    }

    async function deleteFile(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (deleteId == null) {
            alert("No se ha seleccionado ningun documento");
            return;
        }
        request('DELETE', '/file?id_file=' + deleteId.split('#')[1], 'application/json'
        ).then(() => {
            alert("Documento eliminado correctamente");
            update_folders();
            setDeleteFileModal(false);
        })
    }

    return (
        <div className="size-full">
            <div className="min-h-screen size-full dark:bg-gray-900 bg-gray-50 flex  justify-center">
                <section className="size-full bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased ">
                    <div className="px-2 lg:px-12 ">

                        <Header title="Administrador de Biblioteca Scout" />
                        <div className="flex flex-col md:flex-row md:justify-end justify-between gap-4 mb-4">

                            {/* Buscador 
                            <SearchBar
                                handleSubmit={handleSubmit}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                placeholder="Buscar anuncios..."
                            />
                            */}
                            {/* Botón añadir */}
                            <AddButton
                                text="Añadir Folder"
                                onClick={() => setNewFolderModal(true)}
                            />
                            <AddButton
                                text="Añadir Archivo"
                                onClick={() => setNewFileModal(true)}
                            />

                        </div>

                        <TableCrumbs
                            ready={ready}
                            getCrumbs={() => get_breadcrumb(url, setUrl)}
                            headerRows={
                                <tr>
                                    <th scope="col" className="w-1/6 px-2 py-2" align="center">
                                        Tipo
                                    </th>
                                    <th scope="col" className="w-2/3 px-2 py-2">
                                        Nombre
                                    </th>
                                    {/**
                                                <th scope="col" className="px-2 py-2">
                                                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>

                                                </th>
                                                <th scope="col" className="px-2 py-2">
                                                    <svg className="h-8 w-8 text-gray-400" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />
                                                        <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                                                        <polyline points="7 11 12 16 17 11" />
                                                        <line x1="12" y1="4" x2="12" y2="16" />
                                                    </svg>
                                                </th>
                                                 */}
                                    <th scope="col" className="w-2/3 px-2 py-2">
                                        Fecha
                                    </th>
                                    <th scope="col" className="w-2/3 px-2 py-2">
                                        Acciones
                                    </th>
                                </tr>
                            }
                            dataRowsFolders={
                                folders.map((folder, i) => (
                                    <tr key={i + 1} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-700">
                                        <td className="px-2 py-2 cursor-pointer" align="center" onClick={() => setUrl(url.concat({ 'path': folder.name, 'id': folder.id.split('#')[1] }))}>
                                            <svg className="h-5 w-5 text-gray-400 " width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
                                            </svg>

                                        </td>
                                        <td scope="row" className="w-2/3 px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer" onClick={() => setUrl(url.concat({ 'path': folder.name, 'id': folder.id.split('#')[1] }))}>

                                            {folder.name}
                                        </td>
                                        <td scope="row" className="w-2/3 px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">

                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="relative inline-block text-left">
                                                { /*
                                                <button
                                                    onClick={() => console.log(folder.id)}
                                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-400 bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-lg"
                                                    disabled
                                                >
                                                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                                    </svg>
                                                    Editar
                                                </button>
                                                */}
                                                <button
                                                    onClick={() => delete_folder(folder.id)}
                                                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:hover:bg-gray-700 cursor-pointer rounded-lg"

                                                ><svg className="w-4 h-4 mr-2" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                        <path fillRule="evenodd" clipRule="evenodd" fill="currentColor" d="M6.09922 0.300781C5.93212 0.30087 5.76835 0.347476 5.62625 0.435378C5.48414 0.523281 5.36931 0.649009 5.29462 0.798481L4.64302 2.10078H1.59922C1.36052 2.10078 1.13161 2.1956 0.962823 2.36439C0.79404 2.53317 0.699219 2.76209 0.699219 3.00078C0.699219 3.23948 0.79404 3.46839 0.962823 3.63718C1.13161 3.80596 1.36052 3.90078 1.59922 3.90078V12.9008C1.59922 13.3782 1.78886 13.836 2.12643 14.1736C2.46399 14.5111 2.92183 14.7008 3.39922 14.7008H10.5992C11.0766 14.7008 11.5344 14.5111 11.872 14.1736C12.2096 13.836 12.3992 13.3782 12.3992 12.9008V3.90078C12.6379 3.90078 12.8668 3.80596 13.0356 3.63718C13.2044 3.46839 13.2992 3.23948 13.2992 3.00078C13.2992 2.76209 13.2044 2.53317 13.0356 2.36439C12.8668 2.1956 12.6379 2.10078 12.3992 2.10078H9.35542L8.70382 0.798481C8.62913 0.649009 8.5143 0.523281 8.37219 0.435378C8.23009 0.347476 8.06631 0.30087 7.89922 0.300781H6.09922ZM4.29922 5.70078C4.29922 5.46209 4.39404 5.23317 4.56282 5.06439C4.73161 4.8956 4.96052 4.80078 5.19922 4.80078C5.43791 4.80078 5.66683 4.8956 5.83561 5.06439C6.0044 5.23317 6.09922 5.46209 6.09922 5.70078V11.1008C6.09922 11.3395 6.0044 11.5684 5.83561 11.7372C5.66683 11.906 5.43791 12.0008 5.19922 12.0008C4.96052 12.0008 4.73161 11.906 4.56282 11.7372C4.39404 11.5684 4.29922 11.3395 4.29922 11.1008V5.70078ZM8.79922 4.80078C8.56052 4.80078 8.33161 4.8956 8.16282 5.06439C7.99404 5.23317 7.89922 5.46209 7.89922 5.70078V11.1008C7.89922 11.3395 7.99404 11.5684 8.16282 11.7372C8.33161 11.906 8.56052 12.0008 8.79922 12.0008C9.03791 12.0008 9.26683 11.906 9.43561 11.7372C9.6044 11.5684 9.69922 11.3395 9.69922 11.1008V5.70078C9.69922 5.46209 9.6044 5.23317 9.43561 5.06439C9.26683 4.8956 9.03791 4.80078 8.79922 4.80078Z" />
                                                    </svg>
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                            dataRowsFiles=
                            {
                                files.map((file, i) => (
                                    <tr key={i + 1} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-700">
                                        <td className="px-2 py-2 cursor-pointer" align="center" onClick={async () => await view_file(file)}>
                                            <div className="relative w-[60px] h-auto">
                                                <Image src={file.thumbnail} width={60} height={0} alt="X" layout="intrinsic" />
                                            </div>
                                        </td>
                                        <td scope="row" className="w-4/5 px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer" onClick={async () => await view_file(file)}>

                                            {file.name}
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            {new Date(file.created * 1000).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="relative inline-block text-left">
                                                { /*
                                                <button
                                                    onClick={() => console.log(file.id)}
                                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-400 bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-lg"
                                                    disabled
                                                >
                                                    <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                                    </svg>
                                                    Editar
                                                </button>
                                                */}
                                                <button
                                                    onClick={() => delete_file(file.id)}
                                                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:hover:bg-gray-700 cursor-pointer rounded-lg"

                                                ><svg className="w-4 h-4 mr-2" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                        <path fillRule="evenodd" clipRule="evenodd" fill="currentColor" d="M6.09922 0.300781C5.93212 0.30087 5.76835 0.347476 5.62625 0.435378C5.48414 0.523281 5.36931 0.649009 5.29462 0.798481L4.64302 2.10078H1.59922C1.36052 2.10078 1.13161 2.1956 0.962823 2.36439C0.79404 2.53317 0.699219 2.76209 0.699219 3.00078C0.699219 3.23948 0.79404 3.46839 0.962823 3.63718C1.13161 3.80596 1.36052 3.90078 1.59922 3.90078V12.9008C1.59922 13.3782 1.78886 13.836 2.12643 14.1736C2.46399 14.5111 2.92183 14.7008 3.39922 14.7008H10.5992C11.0766 14.7008 11.5344 14.5111 11.872 14.1736C12.2096 13.836 12.3992 13.3782 12.3992 12.9008V3.90078C12.6379 3.90078 12.8668 3.80596 13.0356 3.63718C13.2044 3.46839 13.2992 3.23948 13.2992 3.00078C13.2992 2.76209 13.2044 2.53317 13.0356 2.36439C12.8668 2.1956 12.6379 2.10078 12.3992 2.10078H9.35542L8.70382 0.798481C8.62913 0.649009 8.5143 0.523281 8.37219 0.435378C8.23009 0.347476 8.06631 0.30087 7.89922 0.300781H6.09922ZM4.29922 5.70078C4.29922 5.46209 4.39404 5.23317 4.56282 5.06439C4.73161 4.8956 4.96052 4.80078 5.19922 4.80078C5.43791 4.80078 5.66683 4.8956 5.83561 5.06439C6.0044 5.23317 6.09922 5.46209 6.09922 5.70078V11.1008C6.09922 11.3395 6.0044 11.5684 5.83561 11.7372C5.66683 11.906 5.43791 12.0008 5.19922 12.0008C4.96052 12.0008 4.73161 11.906 4.56282 11.7372C4.39404 11.5684 4.29922 11.3395 4.29922 11.1008V5.70078ZM8.79922 4.80078C8.56052 4.80078 8.33161 4.8956 8.16282 5.06439C7.99404 5.23317 7.89922 5.46209 7.89922 5.70078V11.1008C7.89922 11.3395 7.99404 11.5684 8.16282 11.7372C8.33161 11.906 8.56052 12.0008 8.79922 12.0008C9.03791 12.0008 9.26683 11.906 9.43561 11.7372C9.6044 11.5684 9.69922 11.3395 9.69922 11.1008V5.70078C9.69922 5.46209 9.6044 5.23317 9.43561 5.06439C9.26683 4.8956 9.03791 4.80078 8.79922 4.80078Z" />
                                                    </svg>
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        />


                    </div>
                </section>

            </div>

            <CreateModal
                title="Crear nuevo Folder"
                toggleModal={newFolderModal}
                onClose={closeCreateFolderModal}
                onSubmit={newFolder}
            >
                <div>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre del folder</label>
                        <input value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Folder sin nombre" required={true}>
                        </input>
                    </div>
                    <div className="mb-6">
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" onChange={() => { setNewFolderCanView(!newFolderCanView) }} className="sr-only peer" checked={newFolderCanView}></input>
                            <div className="relative w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Visible</span>
                        </label>
                    </div>
                    <div className="mb-6">
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" onChange={() => { setNewFolderCanDownload(!newFolderCanDownload) }} className="sr-only peer" checked={newFolderCanDownload}></input>
                            <div className="relative w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Descargable</span>
                        </label>
                    </div>
                </div>
            </CreateModal>

            <CreateModal
                title="Subir nuevo Archivo"
                toggleModal={newFileModal}
                onClose={closeCreateFileModal}
                onSubmit={newFile}
            >
                <div>
                    <div className="w-full mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Subir archivo</label>
                        <input type="file" onChange={handleFileChange} ref={newFileDRef} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input"></input>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">.pdf .jpg .jpeg .png .mp4 (MAX. 25MB).</p>
                    </div>
                    <div className="my-4">
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" onChange={() => { setNewFileCanView(!newFileCanView) }} className="sr-only peer" checked={newFileCanView}></input>
                            <div className="relative w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Visible</span>
                        </label>
                    </div>
                    <div className="my-4">
                        <label className="inline-flex items-center cursor-pointer">
                            <input type="checkbox" onChange={() => { setNewFileCanDownload(!newFileCanDownload) }} className="sr-only peer" checked={newFileCanDownload}></input>
                            <div className="relative w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Descargable</span>
                        </label>
                    </div>
                    <div className="ma-4">
                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción</label>
                        <textarea onChange={(e) => { setNewFileDescription(e.target.value) }} value={newFileDescription} id="message" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Descripción del archivo..."></textarea>
                    </div>
                </div>
            </CreateModal>

            <div id="deleteFolderModal" tabIndex={-1} aria-hidden="true" className={"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 " + (deleteFolderModal ? "" : "hidden")}>
                <div className="relative w-full max-w-2xl mx-auto p-4">
                    <div className="relative rounded-2xl bg-white shadow-xl dark:bg-gray-900 px-6 py-8">
                        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Eliminar Folder</h3>
                            <button type="button" onClick={() => setDeleteFolderModal(false)} className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition" aria-label="Cerrar">
                                <svg className="w-6 h-6 text-gray-600 dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <svg className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="mb-4 text-gray-500 dark:text-gray-300">¿Seguro que desea eliminar este Folder?</p>
                        <div className="flex justify-center items-center space-x-4">
                            <button onClick={() => setDeleteFolderModal(false)} data-modal-toggle="deleteModal" type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancelar</button>
                            <button onClick={(e) => deleteFolder(e)} type="submit" className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">Yes, seguro</button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="deleteFileModal" tabIndex={-1} aria-hidden="true" className={"fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 " + (deleteFileModal ? "" : "hidden")}>
                <div className="relative w-full max-w-2xl mx-auto p-4">
                    <div className="relative rounded-2xl bg-white shadow-xl dark:bg-gray-900 px-6 py-8">
                        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Eliminar documento</h3>
                            <button type="button" onClick={() => setDeleteFileModal(false)} className="rounded-full p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition" aria-label="Cerrar">
                                <svg className="w-6 h-6 text-gray-600 dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <svg className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="mb-4 text-gray-500 dark:text-gray-300">¿Seguro que desea eliminar este Documento?</p>
                        <div className="flex justify-center items-center space-x-4">
                            <button onClick={() => setDeleteFileModal(false)} data-modal-toggle="deleteModal" type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancelar</button>
                            <button onClick={(e) => deleteFile(e)} type="submit" className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">Yes, seguro</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
/**
 *  // cambio de vista de folders y archivos
 * <ul className="items-center text-sm font-small text-gray-900 bg-white border border-gray-200 rounded-full flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <li className="border-gray-200 border-r dark:border-gray-600">
                        <div className="flex items-center ps-3">
                          <input id="horizontal-list-radio-license" type="radio" value="0" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                          </input>
                          <label className="w-full m-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                            <svg className="h-4 w-4 text-gray-400" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" />

                              <line x1="4" y1="6" x2="20" y2="6" />
                              <line x1="4" y1="12" x2="20" y2="12" />
                              <line x1="4" y1="18" x2="20" y2="18" />
                            </svg>
                          </label>
                        </div>
                      </li>
                      <li className="border-gray-200 dark:border-gray-600">
                        <div className="flex items-center ps-3">
                          <input id="horizontal-list-radio-id" type="radio" value="1" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500">
                          </input>
                          <label className="w-full m-2 text-sm text-gray-900 dark:text-gray-300">
                            <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="7" height="7" />
                              <rect x="14" y="3" width="7" height="7" />
                              <rect x="14" y="14" width="7" height="7" />
                              <rect x="3" y="14" width="7" height="7" />
                            </svg>
                          </label>
                        </div>
                      </li>
                    </ul>




                    <svg className="h-5 w-5 text-gray-400" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                                                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                                            </svg>
 */