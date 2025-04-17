'use client';

import { File_data, Folder_data } from "@/utils/interfaces";
import { getGroup, isAuthenticated, refreshAuthToken, request, upload_presigned_url } from "@/utils/utils";
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";


function get_breadcrumb(url: any, setUrl: any) {
    let result = [];
    result.push((
        <li className="inline-flex items-center" key={0}>
            <button onClick={() => setUrl([{ 'path': '/', 'id': 0 }])} className="inline-flex items-center font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-500 rounded-full px-2 dark:text-gray-400 dark:hover:text-white">
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
                    <button className="inline-flex items-center font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-500 rounded-full px-2 dark:text-gray-400 dark:hover:text-white">

                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                        </svg>
                        <span className="ms-1 font-medium text-gray-500 md:ms-2 dark:text-gray-400">{url[i].path}</span>
                    </button>
                </li>
            ));
        }
        else {
            result.push((
                <li className="inline-flex items-center" key={i}>
                    <button onClick={() => setUrl(url.slice(0, i + 1))} className="inline-flex items-center font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-500 rounded-full px-2 dark:text-gray-400 dark:hover:text-white">

                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                        </svg>
                        <span className="ms-1 font-medium text-gray-500 md:ms-2 dark:text-gray-400">{url[i].path}</span>
                    </button>
                </li>
            ));
        }
    }
    return result;
}


export default function AdminBiblioteca() {
    let [url, setUrl] = useState([{ 'path': '/', 'id': '0' }]);
    let [folders, setFolders] = useState<Folder_data[]>([]);
    let [files, setFiles] = useState<File_data[]>([]);
    let [newFolderModal, setNewFolderModal] = useState<boolean>(false);
    let [newFolderCanView, setNewFolderCanView] = useState<boolean>(true);
    let [newFolderCanDownload, setNewFolderCanDownload] = useState<boolean>(true);
    let [newFileModal, setNewFileModal] = useState<boolean>(false);
    let [newFileCanView, setNewFileCanView] = useState<boolean>(true);
    let [newFileName, setNewFileName] = useState<string>('');
    let [newFileCanDownload, setNewFileCanDownload] = useState<boolean>(true);
    let [newFileDescription, setNewFileDescription] = useState<string>('');
    let [newFileD, setNewFileD] = useState<File | null>(null);
    let [newFileSpinner, setNewFileSpinner] = useState<boolean>(false);
    const [speed_dial, setSpeed_dial] = useState(false);
    const { back, replace } = useRouter();


    useEffect(() => {
        if (!isAuthenticated()) {

            replace("/login");
        }
        else {
            refreshAuthToken();
            get_group(update_folders);
        }

    }, [url]);

    async function get_group(function_callback: any) {
        let user = await getGroup();
        if (user.groups == 'Scout') {
            replace("/biblioteca");
        }
        else if (user.groups == 'Admin') {
            replace("/admin/biblioteca");
            function_callback();
        }
    }

    function update_folders() {
        let token = Cookies.get('idToken');
        if (token)
            request('GET', '/folder?folder=' + url[url.length - 1].id, 'application/json', token, null)
                .then((folder_data) => {
                    let folders: Folder_data[] = [];
                    let files: File_data[] = [];
                    folder_data.body.forEach((data: any) => {
                        if (data.type === 'FOLDER') {
                            folders.push(data);
                        } else if (data.type === 'FILE') {
                            files.push(data);
                        }
                    });
                    setFolders(folders);
                    setFiles(files);
                })
                .catch((err) => console.log(err))
    }

    function newFolder(e: any) {
        e.preventDefault()
        let parent_id = url[url.length - 1].id
        let folder_name = e.target[0].value
        let token = Cookies.get('idToken');
        request('POST', '/folder', 'application/json', token, JSON.stringify({ 'id_parent_folder': 'FOLDER#' + parent_id, 'name': folder_name, 'can_download': newFolderCanDownload, 'can_view': newFolderCanView }))
            .then((folder_data) => {
                console.log(folder_data.body);
                update_folders();
                setNewFolderModal(false);
            })
    }

    async function newFile(e: any) {
        e.preventDefault()
        let parent_id = 'FOLDER#' + url[url.length - 1].id;
        let folder_name = newFileName;
        //let file_base64 = await getBase64(newFilePdf!);
        if (newFileD == null) {
            alert("No se ha seleccionado un archivo");
            return;
        }
        setNewFileSpinner(true)

        let token = Cookies.get('idToken');
        let data = {
            'id_parent_folder': parent_id,
            'name': folder_name,
            'can_download': newFolderCanDownload,
            'can_view': newFolderCanView,
            'description': newFileDescription,
        };
        console.log(data);
        request('POST', '/file', 'application/json', token, data)
            .then(async (folder_data) => {
                await upload_presigned_url(newFileD, folder_data.body.file_data.url);
                await upload_thumbnail(newFileD, folder_data.body.thumbnail_data.url);
                alert("Archivo subido correctamente");
                update_folders();
                setNewFileModal(false);
            }).catch((err) => console.log(err))
            .finally(() => setNewFileSpinner(false));
    }
    async function upload_thumbnail(file: File, url: string) {
        if (file.type == "image/jpeg" || file.type == "image/png") {
            await upload_presigned_url(file, url)
        }
    }

    function handleFileChange(e: any) {
        if (e.target.files[0].size > 20000000) {
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
        let data = await request('GET', '/file?id_file=' + file_data.id.split('#')[1], 'application/json', Cookies.get('idToken'), null);
        let file_url = data.body.url;
        window.open(file_url, '_blank');
    }

    return (
        <div className="size-full">
            <div className="min-h-screen size-full dark:bg-gray-900 bg-gray-50 flex  justify-center">
                <section className="size-full bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased ">
                    <div className="px-2 lg:px-12 ">
                        <div className="flex">
                            <button type="button" onClick={() => back()} className="text-white p-5 mb-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m15 19-7-7 7-7" />
                                </svg>

                            </button>
                            <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white mb-2">
                                Biblioteca
                            </h1>
                        </div>


                        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-y-scroll">
                            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4 ">
                                <div className="size-full ">
                                    <div className="flex mb-4">
                                        <nav className="flex flex-1 ml-4" aria-label="Breadcrumb">
                                            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                                {get_breadcrumb(url, setUrl)}
                                            </ol>
                                        </nav>

                                    </div>
                                    <table className="table-auto w-full h-1 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="w-1/6 px-2 py-2" align="center">
                                                    Tipo
                                                </th>
                                                <th scope="col" className="w-2/3 px-2 py-2">
                                                    Nombre
                                                </th>
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
                                                <th scope="col" className="w-2/3 px-2 py-2">
                                                    Fecha
                                                </th>
                                                <th scope="col" className="w-full px-2 py-2">
                                                    Descripción
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                folders.map((folder, i) => (
                                                    <tr key={i + 1} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:bg-gray-700" onClick={() => setUrl(url.concat({ 'path': folder.name, 'id': folder.id.split('#')[1] }))}>
                                                        <td className="px-2 py-2" align="center">
                                                            <svg className="h-5 w-5 text-gray-400 " width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                                <path stroke="none" d="M0 0h24v24H0z" />
                                                                <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2" />
                                                            </svg>

                                                        </td>
                                                        <td scope="row" className="w-2/3 px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">

                                                            {folder.name}


                                                        </td>
                                                        <td className="px-2 py-2 text-center">
                                                            {folder.can_view ? "Si" : "No"}
                                                        </td>
                                                        <td className="px-2 py-2 text-center">
                                                            {folder.can_download ? "Si" : "No"}
                                                        </td>
                                                        <td className="w-full px-2 py-2"></td>
                                                    </tr>
                                                ))
                                            }
                                            {
                                                files.map((file, i) => (
                                                    <tr key={i + 1} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:bg-gray-700" onClick={async () => await view_file(file)}>
                                                        <td className="px-2 py-2" align="center" >
                                                            <img src={file.thumbnail} alt='X' ></img>
                                                        </td>
                                                        <th scope="row" className="w-4/5 px-2 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">

                                                            {file.name}
                                                        </th>
                                                        <td className="px-2 py-2 text-center">
                                                            {file.can_view ? "Si" : "No"}
                                                        </td>
                                                        <td className="px-2 py-2 text-center">
                                                            {file.can_download ? "Si" : "No"}
                                                        </td>

                                                        <td className="px-2 py-2 text-center">
                                                            {new Date(file.created * 1000).toLocaleDateString()}
                                                        </td>
                                                        <td className="w-full px-2 py-2">
                                                            {file.description}
                                                        </td>
                                                    </tr>
                                                ))
                                            }

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div data-dial-init className="fixed end-6 bottom-6 group" onMouseOver={(_) => setSpeed_dial(true)} onMouseOut={(_) => setSpeed_dial(false)} >
                    <div id="speed-dial-menu-default" className={"flex flex-col items-center mb-4 space-y-2 " + (speed_dial ? "" : "hidden")}>
                        <button onClick={(_) => { setNewFolderModal(true) }} className="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200 dark:border-gray-600 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400">
                            <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            </svg>

                            <span className="sr-only">Añadir folder</span>
                        </button>
                        <div id="tooltip-share" role="tooltip" className="absolute z-10 invisible inline-block w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                            Añadir folder
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>
                        <button onClick={(_) => { setNewFileModal(true) }} className="flex justify-center items-center w-[52px] h-[52px] text-gray-500 hover:text-gray-900 bg-white rounded-full border border-gray-200 dark:border-gray-600 shadow-sm dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 focus:ring-4 focus:ring-gray-300 focus:outline-none dark:focus:ring-gray-400">
                            <svg className="h-8 w-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>

                            <span className="sr-only">Añadir archivo</span>
                        </button>
                        <div id="tooltip-print" role="tooltip" className="absolute z-10 invisible inline-block w-auto px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                            Añadir archivo
                            <div className="tooltip-arrow" data-popper-arrow></div>
                        </div>

                    </div>
                    <button type="button" aria-controls="speed-dial-menu-default" aria-expanded="false" className="flex items-center justify-center text-white bg-blue-700 rounded-full w-14 h-14 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800">
                        <svg className="w-5 h-5 transition-transform group-hover:rotate-45" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16" />
                        </svg>
                        <span className="sr-only">Open actions menu</span>
                    </button>
                </div>
            </div>


            <div id="crud-modal-folder" tabIndex={-1} className={"overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full " + (newFolderModal ? "" : "hidden")}>
                <div className="relative p-4 w-full max-w-md max-h-full mx-auto">

                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Folder Nuevo
                            </h3>
                            <button type="button" onClick={() => setNewFolderModal(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Cerrar</span>
                            </button>
                        </div>
                        <form className="p-4 md:p-5" onSubmit={newFolder} >
                            <div className="grid gap-4 mb-4 grid-cols-2">
                                <div className="col-span-2">
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre del folder</label>
                                    <input type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Folder sin nombre" required={true}>
                                    </input>
                                </div>
                                <div >
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" onChange={(_) => { setNewFolderCanView(!newFolderCanView) }} className="sr-only peer" checked={newFolderCanView}></input>
                                        <div className="relative w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Visible</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" onChange={(_) => { setNewFolderCanDownload(!newFolderCanDownload) }} className="sr-only peer" checked={newFolderCanDownload}></input>
                                        <div className="relative w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Descargable</span>
                                    </label>
                                </div>
                            </div>
                            <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                                Crear folder
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div id="crud-modal-file" tabIndex={-1} className={"overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full " + (newFileModal ? "" : "hidden")}>
                <div className="relative p-4 w-full max-w-md max-h-full mx-auto">

                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">

                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Subir un nuevo archivo
                            </h3>
                            <button type="button" onClick={() => setNewFileModal(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Cerrar</span>
                            </button>
                        </div>
                        <form className="p-4 md:p-5" onSubmit={newFile} >
                            <div className="flex flex-col mb-4">
                                <div className="w-full my-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Subir archivo</label>
                                    <input onChange={handleFileChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" type="file"></input>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">.pdf .jpg .jpeg .png .mp4 (MAX. 20MB).</p>
                                </div>
                                <div className="my-4">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" onChange={(_) => { setNewFileCanView(!newFileCanView) }} className="sr-only peer" checked={newFileCanView}></input>
                                        <div className="relative w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Visible</span>
                                    </label>
                                </div>
                                <div className="my-4">
                                    <label className="inline-flex items-center cursor-pointer">
                                        <input type="checkbox" onChange={(_) => { setNewFileCanDownload(!newFileCanDownload) }} className="sr-only peer" checked={newFileCanDownload}></input>
                                        <div className="relative w-11 h-6 bg-gray-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Descargable</span>
                                    </label>
                                </div>
                                <div className="my-4">
                                    <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Descripción</label>
                                    <textarea onChange={(e) => { setNewFileDescription(e.target.value) }} value={newFileDescription} id="message" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Descripción del archivo..."></textarea>
                                </div>
                            </div>
                            {
                                newFileSpinner ?
                                    (
                                        <div role="status" className="flex justify-center items-center">
                                            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                            </svg>
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    ) :
                                    (
                                        <button type="submit" className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                            <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path></svg>
                                            Subir archivo
                                        </button>
                                    )
                            }

                        </form>
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