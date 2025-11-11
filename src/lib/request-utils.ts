import { AccessToken, refreshAuthToken } from "@/lib/auth";
import axios from "axios";
import Cookies from "js-cookie";

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


export const request = async (
    method: string,
    path: string,
    content_type: string = 'application/json',
    body: string | null = null,
    auth: boolean = true,
) => {
    const response = await request_data(method, path, content_type, body, auth)
        .catch(async (e) => {
            console.log(e)
            if (await refreshAuthToken()) {
                return await request_data(method, path, content_type, body, auth);
            }
            else {
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                Cookies.remove("avatar");
                window.location.href = "/logout";
            }
        });

    if (!response) return;

    // Check if response is ok
    if (response.status < 200 || response.status >= 300) {
        const errorText = await response.data;
        throw new Error(`HTTP Error: ${response?.status} - ${errorText}`);
    }

    // Try to parse response as JSON
    return await response.data; // Handle empty response cases

};

const request_data = async (
    method: string,
    path: string,
    content_type: string = 'application/json',
    body: string | null = null,
    auth: boolean = true,
) => {
    const token = auth ? AccessToken.getToken() : '';

    const headers: { 'Content-Type': string; 'Authorization'?: string; } = {
        'Content-Type': content_type,
        'Authorization': auth ? `Bearer ${token}` : undefined,
    };

    // Format the body correctly
    let formattedBody = body;
    if (content_type === "application/json" && body && typeof body !== "string") {
        formattedBody = JSON.stringify(body);
    } else if (content_type === "application/x-www-form-urlencoded" && body && typeof body !== "string") {
        formattedBody = new URLSearchParams(body).toString();
    }

    const response = await axios({
        url: `${BACKEND_URL}${path}`,
        method: method,
        headers: headers,
        data: method !== "GET" ? formattedBody : undefined, // GET requests shouldn't have a body
        withCredentials: true, // Include cookies in requests
    });
    // console.log(`Request to ${path} returned status ${response?.status}`);

    return response;
}