"use client";

import { COGNITO_CLIENT_ID, COGNITO_DOMAIN, COGNITO_REDIRECT_URI } from '@/utils/utils';
import { useEffect } from "react";


const Logout = () => {
    useEffect(() => {
        const loginUrl = `${COGNITO_DOMAIN}/logout?client_id=${COGNITO_CLIENT_ID}&logout_uri=${encodeURIComponent(COGNITO_REDIRECT_URI + '/login')}`;
        window.location.href = loginUrl;
    }, []);

    return <p>Redirecting to logout...</p>;
};

export default Logout;