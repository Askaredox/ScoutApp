"use client";

import { AccessToken, getGroup } from "@/utils/auth";
import { request } from "@/utils/request-utils";
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

                const user = await getGroup();

                if (state)
                    push(decodeURIComponent(state));
                else if (user.groups == 'Admin')
                    push("/admin");
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