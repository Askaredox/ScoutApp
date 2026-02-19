"use client";

import Loader from "@/app/_components/Loader";
import LoginBar from "@/app/_components/LoginBar";
import { request } from "@/lib/request-utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function FileView() {
  const [url, setUrl] = useState<string | null>(null);
  const pathname = usePathname();

  const id_file = pathname.split("/").at(-2);

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
    <div className="mt-14">
      <LoginBar />
      <div className="w-full h-[calc(100vh-3.5rem)]">
        <iframe
          src={url}
          title="Documento PDF"
          height={0}
          width={0}
          style={{ border: "none", width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}
