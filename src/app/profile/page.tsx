'use client';

import NavBar from '@/app/_components/NavBar';
import { getMe } from '@/utils/auth';
import { User } from '@/utils/interfaces';
import { request } from '@/utils/request-utils';
import { upload_presigned_url } from '@/utils/utils';
import { useRef, useState } from "react";
import CreateModal from '../_components/CreateModal';

export default function UserProfile() {
  const [normaluser, setNormaluser] = useState<User>();
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const newFileDRef = useRef(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  async function changeAvatar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(avatarFile);
    if (avatarFile == null) {
      alert("No se ha seleccionado ningun archivo");
      return;
    }
    const data = {
      name: avatarFile.name,
      file_data: avatarFile
    }

    request('POST', '/user/me/avatar', 'application/json', JSON.stringify(data))
      .then(async (avatar_data) => {
        console.log(avatar_data);
        await upload_presigned_url(avatarFile, avatar_data.avatar_data.url);
        alert("Archivo subido correctamente");
        await get_me();
      }).catch((err) => console.log(err));
  }


  function get_avatar(avatar: string, user_sub: string) {
    if (avatar == null || avatar == "NONE") {
      console.log('Generating avatar for user_sub:', user_sub.replace(/\D/g, "").slice(0, 8));
      return 'https://avatars.githubusercontent.com/u/' + user_sub.replace(/\D/g, "").slice(0, 8);
    }
    else {
      return avatar;
    }
  }

  async function get_me() {
    const user = await getMe();
    setNormaluser({ sub: user.sub, email: user.email, email_verified: user.email_verified, name: user.name, groups: user.groups, avatar: user.avatar, section: user.section });
    setAvatar(get_avatar(user.avatar, user.sub));
  }


  function onFileDrag(event: React.DragEvent<HTMLInputElement>) {
    event.preventDefault();
  }
  function onFileDrop(event: React.DragEvent<HTMLDivElement> | React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    let files = 'dataTransfer' in event ? event.dataTransfer.files : event.target.files;
    if (files === null) {
      return;
    }
    if (files[0].size > 25 * 1000 * 1000) {
      alert("El archivo es demasiado grande");
      return;
    }
    if (files[0].type != "image/jpeg" && files[0].type != "image/png") {
      console.log(files[0].type);
      alert("El archivo debe ser un jpg, jpeg, png");
      return;
    }
    setAvatarFile(files[0]);
  }

  return (
    <main>
      <NavBar callback={get_me} />
      <div className="md:ml-56 mt-16 md:mt-14">
        <div className="min-h-screen size-full dark:bg-gray-900 bg-gray-50 flex justify-center">
          <section className="size-full bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased ">
            <div className="mx-auto max-w-screen-xl px-2">
              <div className="max-w p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

                <h4 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Información Personal</h4>
                <hr className="my-4 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent  dark:via-neutral-400" />

                <div className="flex justify-center mb-4">
                  {
                    avatar == undefined ? (
                      <div className="w-32 h-32 rounded-full shadow-lg bg-gray-300 animate-pulse"></div>
                    ) : (
                      <figure className="relative w-32 h-32 rounded-full transition-all duration-300 filter">
                        <img className="w-32 h-32 rounded-full shadow-lg object-cover" src={avatar} alt="Avatar" />
                        <span className="bg-blue-200 text-s font-medium text-blue-800 text-center p-0.5 leading-none rounded-full cursor-pointer px-2 dark:bg-blue-900 dark:text-blue-200 absolute translate-y-1/2 translate-x-1/2  left-auto bottom-4 right-4" onClick={() => setCreateModalOpen(true)}>
                          <svg className="w-8 h-8 text-gray-800 dark:text-white " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                          </svg>
                        </span>
                      </figure>

                    )
                  }

                </div>

                <h6 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">Sección</h6>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{normaluser?.section}</p>
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
      <CreateModal title="Cambiar avatar" toggleModal={createModalOpen} onClose={() => { setCreateModalOpen(false) }} onSubmit={changeAvatar}>
        <div>
          <div className="w-full mb-4">
            <label htmlFor="information" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subir foto</label>
            <div className="flex items-center justify-center w-full" onDragOver={onFileDrag} onDrop={onFileDrop} >
              <label htmlFor="dropzone-file-info" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                {avatarFile === null ? (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click para subir</span> o arrastra el archivo</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">.jpg .jpeg .png (MAX. 25MB).</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m8.032 12 1.984 1.984 4.96-4.96m4.55 5.272.893-.893a1.984 1.984 0 0 0 0-2.806l-.893-.893a1.984 1.984 0 0 1-.581-1.403V7.04a1.984 1.984 0 0 0-1.984-1.984h-1.262a1.983 1.983 0 0 1-1.403-.581l-.893-.893a1.984 1.984 0 0 0-2.806 0l-.893.893a1.984 1.984 0 0 1-1.403.581H7.04A1.984 1.984 0 0 0 5.055 7.04v1.262c0 .527-.209 1.031-.581 1.403l-.893.893a1.984 1.984 0 0 0 0 2.806l.893.893c.372.372.581.876.581 1.403v1.262a1.984 1.984 0 0 0 1.984 1.984h1.262c.527 0 1.031.209 1.403.581l.893.893a1.984 1.984 0 0 0 2.806 0l.893-.893a1.985 1.985 0 0 1 1.403-.581h1.262a1.984 1.984 0 0 0 1.984-1.984V15.7c0-.527.209-1.031.581-1.403Z" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">{avatarFile?.name}</span></p>
                  </div>
                )}

                <input id="dropzone-file-info" type="file" className="hidden" onChange={onFileDrop} />
              </label>
            </div>
          </div>
        </div>
      </CreateModal>
    </main>

  );

}
