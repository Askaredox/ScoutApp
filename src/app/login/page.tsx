"use client";

import { COGNITO_CLIENT_ID, COGNITO_DOMAIN, COGNITO_REDIRECT_URI, COGNITO_RESPONSE_TYPE } from '@/utils/utils';
import { useEffect } from "react";
import Loader from '../_components/Loader';


const Login = () => {
    useEffect(() => {
        const loginUrl = `${COGNITO_DOMAIN}/login?client_id=${COGNITO_CLIENT_ID}&response_type=${COGNITO_RESPONSE_TYPE}&redirect_uri=${encodeURIComponent(COGNITO_REDIRECT_URI + '/auth')}&lang=es`;
        window.location.href = loginUrl;
    }, []);

    return <Loader />;
};

export default Login;