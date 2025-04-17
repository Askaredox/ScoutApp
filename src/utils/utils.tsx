import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
export const COGNITO_CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
export const COGNITO_REDIRECT_URI = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI;
export const COGNITO_RESPONSE_TYPE = process.env.NEXT_PUBLIC_COGNITO_RESPONSE_TYPE;


export const request = async (
    method: string = 'GET',
    path: string,
    content_type: string = 'application/json',
    token: string | null = null,
    body?: any | string
) => {
    let response = null;
    try {
        let headers: { 'Content-Type': string; 'Authorization'?: string; } = {
            'Content-Type': content_type,
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        // Format the body correctly
        let formattedBody = body;
        if (content_type === "application/json" && body && typeof body !== "string") {
            formattedBody = JSON.stringify(body);
        } else if (content_type === "application/x-www-form-urlencoded" && body && typeof body !== "string") {
            formattedBody = new URLSearchParams(body).toString();
        }
        response = await fetch(`${BACKEND_URL}${path}`, {
            method: method,
            headers: headers,
            body: method !== "GET" ? formattedBody : undefined, // GET requests shouldn't have a body
        });

        // Check if response is ok
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
        }

        // Try to parse response as JSON
        const data = await response.json().catch(() => null); // Handle empty response cases
        return data;

    } catch (e) {
        console.error("Request failed:", e);
        return { error: "Request failed", details: e };
    }
};

export const upload_presigned_url = async (file: File, path: string) => {
    const upload_response = await fetch(path, {
        method: "PUT",
        headers: {
            'Content-Type': file.type,
        },
        body: file,
    });
    if (!upload_response.ok) {
        const errorText = await upload_response.text();
        throw new Error(`HTTP Error: ${upload_response.status} - ${errorText}`);
    }
}

export const refreshAuthToken = async () => {
    const refreshToken = Cookies.get("refreshToken"); // Store securely!

    const response = await fetch(`${BACKEND_URL}/refresh_token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await response.json();

    if (data.body.access_token) {
        Cookies.set("accessToken", data.body.access_token, { secure: true, httpOnly: false });
        Cookies.set("idToken", data.body.id_token, { secure: true, httpOnly: false });
    } else {
        console.error("Failed to refresh token:", data);
    }
};


export const getToken = () => {
    return Cookies.get("accessToken") || null;
};

export const isAuthenticated = () => {
    const token = getToken();

    if (!token || token === undefined) return false; // No token, not authenticated

    try {
        const decoded = jwtDecode(token);
        if (!decoded.exp) return false; // Invalid token
        return decoded.exp * 1000 > Date.now(); // Check if token is expired
    } catch (error) {
        return false; // Invalid token
    }
};

export const getGroup = async () => {
    const token = Cookies.get('idToken');
    return await request('GET', '/user_info', "application/json", token, null);
}

export const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};