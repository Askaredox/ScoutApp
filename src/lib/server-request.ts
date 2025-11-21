const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function serverRequest<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${BACKEND_URL}${path}`, {
        ...options,
        // Metadata suele ser dinámica, para evitar cache raro:
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP Error: ${res.status} - ${text}`);
    }

    return res.json() as Promise<T>;
}