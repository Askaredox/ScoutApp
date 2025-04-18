"use client";

import { getGroup, request } from "@/utils/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Callback = () => {
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
                const response = await request('POST', "/token", 'application/json', null, JSON.stringify({ 'code': code }));
                if (response.error) { push("/login"); return; }
                // Store tokens securely
                Cookies.set("accessToken", response.access_token, { secure: true, httpOnly: false });
                Cookies.set("idToken", response.id_token, { secure: true, httpOnly: false });
                Cookies.set("refreshToken", response.refresh_token, { secure: true, httpOnly: false });
                const user = await getGroup();
                if (user.groups == 'Scout') push("/");
                else if (user.groups == 'Admin') push("/admin");

            } catch (error) {
                console.error("Token exchange failed", error);
                push("/login");
            }
        };

        exchangeCodeForToken();
    }, []);

    return <p>Authenticating...</p>;
};

export default Callback;