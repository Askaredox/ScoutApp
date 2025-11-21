"use client";

import Loader from "@/app/_components/Loader";
import { request } from "@/lib/request-utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FileClient() {
    const [url, setUrl] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const id_file = searchParams.get("id_file");

    useEffect(() => {
        if (!id_file) return;

        request("GET", `/file?id_file=${id_file}`, "application/json", null, false)
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
                height={0}
                width={0}
                style={{ border: "none", width: "100%", height: "100%" }}
            />
        </div>
    );
}