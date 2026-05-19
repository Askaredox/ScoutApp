import { AccessToken, refreshAuthToken } from "@/lib/auth";
import axios, { AxiosError, Method } from "axios";
import Cookies from "js-cookie";

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type RequestBody =
    | Record<string, unknown>
    | string
    | URLSearchParams
    | null;

export const request = async (
    method: Method,
    path: string,
    content_type: string = "application/json",
    body: RequestBody = null,
    auth: boolean = true,
) => {
    try {
        const response = await request_data(
            method,
            path,
            content_type,
            body,
            auth,
        );

        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;

        const status = axiosError.response?.status;
        console.log("Request failed:", {
            path,
            method,
            auth,
            status,
            message: axiosError.message,
            hasResponse: Boolean(axiosError.response),
            responseData: axiosError.response?.data,
        });


        const shouldRefresh =
            auth &&
            status === 401;

        if (!shouldRefresh) {
            throw error;
        }

        const refreshed = await refreshAuthToken();

        if (!refreshed) {
            AccessToken.clearToken();

            Cookies.remove("access_token");
            Cookies.remove("avatar");

            window.location.href = "/logout";
            return;
        }

        const retryResponse = await request_data(
            method,
            path,
            content_type,
            body,
            auth,
        );

        return retryResponse.data;
    }
};

export const request_data = async (
    method: Method,
    path: string,
    content_type: string = "application/json",
    body: RequestBody = null,
    auth: boolean = true,
) => {
    const headers: Record<string, string> = {
        "Content-Type": content_type,
    };

    if (auth) {
        const token = AccessToken.getToken();

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }

    const formattedBody = formatBody(method, content_type, body);

    return await axios({
        url: `${BACKEND_URL}${path}`,
        method,
        headers,
        data: method !== "GET" ? formattedBody : undefined,
        withCredentials: true,
    });
};

const formatBody = (
    method: Method,
    content_type: string,
    body: RequestBody,
): string | URLSearchParams | undefined => {
    if (method === "GET" || !body) {
        return undefined;
    }

    if (content_type === "application/json") {
        return typeof body === "string"
            ? body
            : JSON.stringify(body);
    }

    if (content_type === "application/x-www-form-urlencoded") {
        if (body instanceof URLSearchParams) {
            return body;
        }

        if (typeof body === "string") {
            return body;
        }

        return new URLSearchParams(
            body as Record<string, string>,
        ).toString();
    }

    return body as string;
};