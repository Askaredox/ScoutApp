'use client';

import axios from 'axios';

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
export const COGNITO_CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
export const COGNITO_REDIRECT_URI = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI;
export const COGNITO_RESPONSE_TYPE = process.env.NEXT_PUBLIC_COGNITO_RESPONSE_TYPE;


export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

export const upload_presigned_url = async (file: File, path: string) => {
    const upload_response = await axios(path, {
        method: "PUT",
        headers: {
            'Content-Type': file.type,
        },

        data: file,
    });
    if (!upload_response.status.toString().startsWith('2')) {
        const errorText = await upload_response.data();
        throw new Error(`HTTP Error: ${upload_response.status} - ${errorText}`);
    }
}

export const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
