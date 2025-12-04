"use client";

import Loader from '@/app/_components/Loader';

import { COGNITO_CLIENT_ID, COGNITO_DOMAIN, COGNITO_REDIRECT_URI } from '@/lib/utils';
import { useEffect } from "react";


const Logout = () => {
    useEffect(() => {
        const logoutUrl = `${COGNITO_DOMAIN}/logout?client_id=${COGNITO_CLIENT_ID}&logout_uri=${encodeURIComponent(COGNITO_REDIRECT_URI + '/login')}`;
        window.location.href = logoutUrl;
    }, []);

    return <Loader />;
};

export default Logout;