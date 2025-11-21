import { serverRequest } from "@/lib/server-request";
import type { Metadata } from "next";
import FileClient from "./FileClient";

type FilePageProps = {
    searchParams: Promise<{ id_file?: string }>;
};

// Opcional si todo es dinámico
export const dynamic = "force-dynamic";

export async function generateMetadata(
    { searchParams }: FilePageProps
): Promise<Metadata> {
    const { id_file } = await searchParams;
    const siteUrl = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI || 'http://localhost:3000'

    if (!id_file) {
        return {
            title: "File Viewer",
            description: "Viewing file",
            alternates: {
                canonical: `${siteUrl}/file`,
            },
        };
    }

    try {
        const data = await serverRequest<{
            title?: string;
            description?: string;
        }>(`/file?id_file=${id_file}`, {
            method: "GET",
        });

        const title = data?.title ?? "File Viewer";
        const description = data?.description ?? "Viewing file";

        const canonicalUrl = `${siteUrl}/file?id_file=${id_file}`;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                url: canonicalUrl,
            },
            twitter: {
                title,
                description,
            },
            alternates: {
                canonical: canonicalUrl,
            },
        };
    } catch (error) {
        console.error("Error fetching metadata for file:", error);
        return {
            title: "File Viewer",
            description: "Viewing file",
        };
    }
}

export default function FilePage() {
    return <FileClient />;
}