import Image from 'next/image';
import Link from 'next/link';

import { AccessToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import React from 'react';

type LoginBarProps = {
    callback?: () => void;
};

const LoginBar: React.FC<LoginBarProps> = () => {
    const { replace } = useRouter();

    function login(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();
        replace("/login");
    }

    return (
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start rtl:justify-end">
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

                            {!AccessToken.is_authenticated() ? (
                                <button type="button" onClick={login} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 cursor-pointer rounded-xl hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5">
                                    Ingresa
                                </button>
                            ) : (null)}

                        </div>
                    </div>
                </div>
            </div>
        </nav>

    );
};

export default LoginBar;