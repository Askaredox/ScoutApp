"use client";

import Loader from '@/app/_components/Loader';

import { COGNITO_CLIENT_ID, COGNITO_DOMAIN, COGNITO_REDIRECT_URI, COGNITO_RESPONSE_TYPE } from '@/lib/utils';
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function LoginPage() {
    const searchParams = useSearchParams();
    const state = searchParams.get('state');

    useEffect(() => {
        const loginUrl = `${COGNITO_DOMAIN}/login` +
            `?client_id=${COGNITO_CLIENT_ID}` +
            `&response_type=${COGNITO_RESPONSE_TYPE}` +
            `&redirect_uri=${encodeURIComponent(COGNITO_REDIRECT_URI + '/auth')}` +
            (state ? `&state=${state}` : '') +
            `&lang=es`;
        window.location.href = loginUrl;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Loader />;
}

export default function Login() {
    return (<Suspense fallback={<Loader />}>
        <LoginPage />
    </Suspense>
    );
};
