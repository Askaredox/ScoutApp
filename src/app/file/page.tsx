'use client';

import { request } from '@/utils/request-utils';
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Loader from "../_components/Loader";

function File() {
    const [url, setUrl] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const id_file = searchParams.get('id_file');

    useEffect(() => {
        request('GET', `/file?id_file=${id_file}`, 'application/json', null, false)
            .then((data) => {
                if (data && data.url) {
                    setUrl(data.url);
                } else {
                    console.error("No URL found in response");
                }
            })
            .catch((error) => {
                console.error("Error fetching file URL:", error);
            });

    }, [id_file]);

    if (!url) return <Loader />;

    return (
        <div className="w-full h-screen">
            <iframe
                src={url}
                title="Documento PDF"
                width={0}
                height={0}
                style={{ border: "none", width: '100%', height: '100%' }}
            />

        </div>
    );
}

export default function FileViewer() {
    return (
        <Suspense fallback={<Loader />}>
            <File />
        </Suspense>
    );
}