"use client";

import { AccessToken, getMe } from "@/lib/auth";
import { request } from "@/lib/request-utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "../_components/Loader";

const Auth = () => {
    const { push } = useRouter();

    useEffect(() => {
        const exchangeCodeForToken = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get("code");
            const state = urlParams.get("state");
            if (!code) {
                push("/login");
                return;
            }

            try {
                const response = await request('POST', "/token", 'application/json', JSON.stringify({ 'code': code, 'redirect_uri': `${window.location.origin}/auth` }), false);
                AccessToken.setToken(response.idToken);
                const me = await getMe();
                AccessToken.setAttrs(me.avatar, me.name);

                if (state)
                    push(decodeURIComponent(state));
                else
                    push("/");
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