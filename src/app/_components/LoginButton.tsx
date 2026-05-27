"use client";

import { useRouter } from "next/navigation";
import React from "react";

const LoginButton = () => {
  const router = useRouter();

  function login(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    router.replace("/login");
  }

  return (
    <button
      type="button"
      onClick={login}
      className="text-white bg-gradient-to-br from-purple-600 to-blue-500 cursor-pointer rounded-xl hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium text-sm px-4 py-2.5 text-center leading-5"
    >
      Ingresa
    </button>
  );
};

export default LoginButton;
