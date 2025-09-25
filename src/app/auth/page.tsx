"use client";

import { getGroup, request } from "@/utils/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "../_components/Loader";

const Auth = () => {
    const { push } = useRouter();

    useEffect(() => {
        const exchangeCodeForToken = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");

            if (!code) {
                push("/login");
                return;
            }

            try {
                const response = await request('POST', "/token", 'application/json', null, JSON.stringify({ 'code': code, 'redirect_uri': `${window.location.origin}/auth` }));
                if (response.error) { push("/login"); return; }
                // Store tokens securely
                Cookies.set("accessToken", response.access_token, { secure: true });
                Cookies.set("idToken", response.id_token, { secure: true });
                Cookies.set("refreshToken", response.refresh_token, { secure: true });
                const user = await getGroup();
                if (user.groups == 'Admin') push("/admin");
                else push("/");
            } catch (error) {
                console.error("Token exchange failed", error);
                push("/login");
            }
        };

        exchangeCodeForToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Loader />;
};

export default Auth;