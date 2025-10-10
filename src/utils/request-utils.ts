import { AccessToken, refreshAuthToken } from "@/utils/auth";


export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


export const request = async (
    method: string,
    path: string,
    content_type: string = 'application/json',
    body: string | null = null,
    auth: boolean = true,
) => {
    try {
        const response = await request_data(method, path, content_type, body, auth);

        if (response.status === 401) {
            if (await refreshAuthToken()) {
                return await request_data(method, path, content_type, body, auth);
            }
            else {
                throw new Error("Unauthorized");
            }
        }
        // Check if response is ok
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP Error: ${response.status} - ${errorText}`);
        }

        // Try to parse response as JSON
        return await response.json().catch(() => null); // Handle empty response cases

    } catch (e) {
        console.error("Request failed:", e);
        return { error: "Request failed", details: e };
    }
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

    const response = await fetch(`${BACKEND_URL}${path}`, {
        method: method,
        headers: headers,
        body: method !== "GET" ? formattedBody : undefined, // GET requests shouldn't have a body
        credentials: 'include', // Include cookies in requests
    });

    return response;
}