import { getMe } from "@/lib/auth";
import { User } from "@/lib/interfaces";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import LoginButton from "./LoginButton";

const LoginBar = () => {
  const hasProccessedAuth = React.useRef(false);
  const [user, setUser] = React.useState<User | undefined>(undefined);

  useEffect(() => {
    if (!hasProccessedAuth.current)
      getMe().then((me) => {
        setUser(me || undefined);
      });
    hasProccessedAuth.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                Scouteca
              </span>
            </Link>
          </div>

          <div className="flex items-center">
            <div className="flex items-center ms-3">
              {!user ? <LoginButton /> : null}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LoginBar;
