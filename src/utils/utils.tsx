'use client';

import '@ungap/with-resolvers';
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs'; /* webpackIgnore: true */

GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
export const COGNITO_CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;
export const COGNITO_REDIRECT_URI = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI;
export const COGNITO_RESPONSE_TYPE = process.env.NEXT_PUBLIC_COGNITO_RESPONSE_TYPE;

export async function initializeDOMMatrix() {
    if (typeof window !== "undefined") {
        const { default: DOMMatrix } = await import('@thednp/dommatrix');
        globalThis.DOMMatrix = DOMMatrix as unknown as typeof globalThis.DOMMatrix;
    }
}

export const request = async (
    method: string = 'GET',
    path: string,
    content_type: string = 'application/json',
    token: string | null = null,
    body?: string | null
) => {
    let response = null;
    try {
        const headers: { 'Content-Type': string; 'Authorization'?: string; } = {
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
    } catch (err) {
        console.error("Token decoding error:", err);
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

async function getFirstPageAsImageFile(pdfFile: File): Promise<File | null> {
    try {
        initializeDOMMatrix();
        const pdfData = await pdfFile.arrayBuffer(); // Convert the file to ArrayBuffer
        const pdf = await getDocument({ data: pdfData }).promise;
        const page = await pdf.getPage(1); // Get the first page

        // Create a canvas to render the page
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const viewport = page.getViewport({ scale: 1.5 }); // Adjust scale as needed

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
            const renderContext = {
                canvasContext: context,
                viewport: viewport,
            };
            await page.render(renderContext).promise;
        }

        // Convert the canvas to a Blob
        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob((blob) => resolve(blob), "image/png")
        );

        if (!blob) return null;

        // Convert the Blob to a File
        const imageFile = new File([blob], `${pdfFile.name}-page1.png`, {
            type: "image/png",
        });

        return imageFile;
    } catch (error) {
        console.error("Error extracting first page as image:", error);
        return null;
    }
}

async function getVideoThumbnail(videoFile: File): Promise<File | null> {
    return new Promise((resolve, reject) => {
        const video = document.createElement("video");
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
            reject("Canvas context is not available");
            return;
        }

        // Load the video file
        video.src = URL.createObjectURL(videoFile);
        video.crossOrigin = "anonymous";

        // Wait for the video to load metadata
        video.onloadedmetadata = () => {
            // Set the canvas size to match the video dimensions
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Seek to the first frame (or any desired time)
            video.currentTime = 0.1; // 0.1 seconds to avoid black frames
        };

        // Capture the frame once the video is ready
        video.onseeked = () => {
            try {
                // Draw the video frame onto the canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert the canvas to a Blob
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            // Convert the Blob to a File
                            const thumbnailFile = new File([blob], `${videoFile.name}-thumbnail.png`, {
                                type: "image/png",
                            });
                            resolve(thumbnailFile);
                        } else {
                            reject("Failed to create thumbnail");
                        }
                    },
                    "image/png",
                    0.8 // Quality (0.0 to 1.0)
                );
            } catch (error) {
                reject(error);
            }
        };

        // Handle errors
        video.onerror = (error) => {
            reject(error);
        };
    });
}

export async function create_thumbnail(file: File): Promise<File | null> {
    if (file.type.startsWith("video/")) {
        return await getVideoThumbnail(file);
    }
    else if (file.type.startsWith("application/pdf")) {
        return await getFirstPageAsImageFile(file);
    }
    else if (file.type.startsWith("image/")) {
        // For images, we can just return the file itself or create a thumbnail if needed
        return new File([file], file.name, { type: file.type });
    }
    else {
        console.error("Unsupported file type for thumbnail generation:", file.type);
        return null;
    }
}