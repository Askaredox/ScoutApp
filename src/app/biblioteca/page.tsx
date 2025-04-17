'use client';

import { File_data, Folder_data } from "@/utils/interfaces";
import { getGroup, isAuthenticated, refreshAuthToken, request } from "@/utils/utils";
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
    const { replace, back } = useRouter();


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
            function_callback();
        }
        else if (user.groups == 'Admin') {
            replace("/admin/biblioteca");
        }
    }

    function update_folders() {
        let token = Cookies.get('idToken');
        console.log(url)
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
                                                            {new Date(file.created).toLocaleDateString()}
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