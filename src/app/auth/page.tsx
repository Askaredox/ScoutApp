"use client";

import Loader from "@/app/_components/Loader";
import { getMe } from "@/lib/auth";
import { request } from "@/lib/request-utils";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const Auth = () => {
  const router = useRouter();
  const hasProcessedAuth = useRef(false);

  useEffect(() => {
    if (hasProcessedAuth.current) return;

    hasProcessedAuth.current = true;
    exchangeCodeForSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exchangeCodeForSession = async () => {
    const urlParams = new URLSearchParams(window.location.search);

    const code = urlParams.get("code");
    const state = urlParams.get("state");

    if (!code) {
      router.replace("/login");
      return;
    }

    try {
      request(
        "POST",
        "/token",
        "application/json",
        JSON.stringify({
          code,
          redirect_uri: `${window.location.origin}/auth`,
        }),
        true,
      ).then(() => {
        const me = getMe().then((me) => {
          if (!me) {
            throw new Error("User session could not be verified");
          }

          const redirectTo = getSafeRedirectPath(state);

          router.replace(redirectTo);
        });
      });
    } catch (error) {
      console.error("Token exchange failed", error);
      router.replace("/login");
    }
  };

  return <Loader />;
};

export default Auth;

function getSafeRedirectPath(state: string | null): string {
  if (!state) {
    return "/dashboard";
  }

  try {
    const decodedState = decodeURIComponent(state);

    if (!decodedState.startsWith("/")) {
      return "/dashboard";
    }

    if (decodedState.startsWith("//")) {
      return "/dashboard";
    }

    return decodedState;
  } catch {
    return "/dashboard";
  }
}
