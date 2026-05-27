import axios, { AxiosError, AxiosRequestConfig, Method } from "axios";

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

type RequestBody =
  | Record<string, unknown>
  | string
  | URLSearchParams
  | null;

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

export const request = async (
  method: Method,
  path: string,
  contentType: string = "application/json",
  body: RequestBody = null,
  auth: boolean = true,
) => {
  try {
    const response = await request_data(method, path, contentType, body);
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

    const shouldRefresh = auth && (status === 401 || status === 403);

    if (!shouldRefresh) {
      throw error;
    }

    const refreshed = await refreshAuthToken();

    if (!refreshed) {
      window.location.href = "/logout";
      return;
    }

    const retryResponse = await request_data(method, path, contentType, body);
    return retryResponse.data;
  }
};

export const request_data = async (
  method: Method,
  path: string,
  contentType: string = "application/json",
  body: RequestBody = null,
) => {
  const headers: Record<string, string> = {};

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  const formattedBody = formatBody(method, contentType, body);

  const config: AxiosRequestConfig = {
    url: `${BACKEND_URL}${path}`,
    method,
    headers,
    data: method !== "GET" ? formattedBody : undefined,
    withCredentials: true,
  };

  return await axios(config);
};

export const refreshAuthToken = async (): Promise<boolean> => {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = axios({
    url: `${BACKEND_URL}/refresh`,
    method: "POST",
    withCredentials: true,
  })
    .then(() => true)
    .catch((error) => {
      console.error("Token refresh failed:", error);
      return false;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
};

const formatBody = (
  method: Method,
  contentType: string,
  body: RequestBody,
): string | URLSearchParams | undefined => {
  if (method === "GET" || !body) {
    return undefined;
  }

  if (contentType === "application/json") {
    return typeof body === "string" ? body : JSON.stringify(body);
  }

  if (contentType === "application/x-www-form-urlencoded") {
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