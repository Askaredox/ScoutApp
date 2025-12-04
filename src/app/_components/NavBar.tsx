import UserModal from '@/app/_components/UserModal';
import Cookies from "js-cookie";
import Image from 'next/image';
import Link from 'next/link';

import { AccessToken, getMe, refreshAuthToken } from '@/lib/auth';
import { User } from '@/lib/interfaces';
import { request } from '@/lib/request-utils';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

type NavBarProps = {
  callback?: () => void;
};

const NavBar: React.FC<NavBarProps> = ({ callback = () => console.log('ok') }) => {
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [user, setUser] = React.useState<User | undefined>(undefined);
  const [sidenav, setSidenav] = React.useState<boolean>(false);
  const { replace } = useRouter();
  const [showUserModal, setShowUserModal] = React.useState(false);

  useEffect(() => {
    if (!AccessToken.is_authenticated()) {
      replace("/login");
    }
    else {
      const me = AccessToken.get_user();
      setUser(me);
      if (me.name === null || me.name === undefined || me.name === "NONE") {
        setShowUserModal(true);
      }
      callback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  function get_avatar(user: User) {
    if (user.avatar === null || user.avatar === "NONE") {
      return 'https://avatars.githubusercontent.com/u/' + user.sub.replace(/\D/g, "").slice(0, 8);
    }
    else {
      return user.avatar;
    }
  }
  function open_user(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    setUserMenuOpen(!userMenuOpen);
  }

  function logout() {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    replace("/logout");
  }

  async function send_user_data(e: React.FormEvent<HTMLFormElement>, name: string, group: string, section: string) {
    e.preventDefault();

    const data = {
      name: name,
      user_type: group,
      section: section
    }

    await request('PUT', '/user/me', "application/json", JSON.stringify(data))
      .then(async () => {
        const me = await getMe();
        me.name = name;
        me.groups = group;
        me.section = section;

        setUser(me);
        await refreshAuthToken();
        setShowUserModal(false);
      })

  }

  return (
    <div>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button data-drawer-target="logo-sidebar" onClick={() => setSidenav(!sidenav)} data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h10" />
                </svg>

              </button>
              <Link href="/dashboard" className="flex ms-2 md:me-24">
                <Image
                  src="/logo.svg"
                  alt="Logo Scouteca"
                  width={32}
                  height={32}
                  className="h-8 me-3"
                />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Scouteca</span>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3" >
                <button type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 cursor-pointer" onClick={open_user} aria-haspopup="true">
                  <span className="sr-only">Open user menu</span>
                  {user && (
                    <div className="relative w-8 h-8">
                      <Image
                        src={get_avatar(user)}
                        alt="avatar"
                        fill
                        className="rounded-full shadow-lg object-cover"
                      />
                    </div>
                  )}
                  {!user && (
                    <div role="status" className="space-y-2.5 animate-pulse max-w-lg">
                      <div className="flex items-center w-full">
                        <div className="h-8 w-8 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                      </div>
                    </div>
                  )}
                </button>
                <div data-popover id="popover-user-profile" role="tooltip" className={"top-14 right-1 z-30 w-64 text-sm text-gray-500 transition-opacity absolute duration-300 bg-white border border-gray-200 rounded-lg shadow-xs dark:text-gray-400 dark:bg-gray-800 dark:border-gray-600" + (userMenuOpen ? " inline-block" : " hidden")}>
                  <div>
                    <ul className="py-1" role="none">
                      <li>
                        {!user && (
                          <div role="status" className="space-y-2.5 animate-pulse max-w-lg">
                            <div className="flex items-center w-full">
                              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                            </div>
                            <div className="flex items-center w-full">
                              <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                            </div>
                          </div>

                        )}
                        {user && (
                          <div className="px-4 py-3" role="none">
                            <p className="text-lg text-gray-900 dark:text-white" role="none">
                              {user.name}
                            </p>
                            <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                              {user.email}
                            </p>
                          </div>
                        )}
                      </li>
                      <li>
                        <hr className="my-1 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
                      </li>
                      <li>
                        <a href="/profile" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <aside id="logo-sidebar" className={`fixed top-0 left-0 z-40 w-56 h-screen pt-16 transition-transform ${sidenav ? "translate-x-0" : "-translate-x-full"} bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700`} aria-label="Sidebar">
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="font-medium">
            <li>
              <Link href="/dashboard" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" />
                </svg>
                <span className="ms-3">Inicio</span>
              </Link>
            </li>

            <li>
              <a href={"/biblioteca" + (user?.groups === 'Admin' ? "-editor" : "")} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>

                <span className="ms-3">Biblioteca Virtual</span>
              </a>
            </li>
            {user?.groups == 'Admin' && (
              <li>
                <a href="/scouts" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z" />
                  </svg>


                  <span className="ms-3">Scouts</span>
                </a>
              </li>
            )}
            {user?.groups == 'Admin' && (
              <li>
                <a href="/eventos" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7h1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h11.5M7 14h6m-6 3h6m0-10h.5m-.5 3h.5M7 7h3v3H7V7Z" />
                  </svg>

                  <span className="ms-3">Eventos</span>
                </a>
              </li>
            )}

            <li>
              <hr className="my-4 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
            </li>

            <li>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSdoF-wmhPf4EhrVk3qHe8o8NSLuuYYoyhU_nItCbcd1_tnroA/viewform?usp=sharing&ouid=110963328688090878258" target="_blank" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <svg className="h-8 w-8 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z" />
                </svg>


                <span className="flex-1 ms-3 whitespace-nowrap">Comentarios</span>
              </a>
            </li>
          </ul>
        </div>
        <footer className="bg-white rounded-lg shadow-sm m-4 dark:bg-gray-800">
          <div className="w-full fixed bottom-0 left-0  mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">© 2025 <a href="https://github.com/Askaredox" target="_blank" className="hover:underline">Andrés Carvajal</a>. All Rights Reserved.
            </span>
          </div>
        </footer>
      </aside>
      <UserModal show={showUserModal} setShow={setShowUserModal} send_data={send_user_data} />
    </div>

  );
};

export default NavBar;