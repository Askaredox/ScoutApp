"use client";

import Loader from "@/app/_components/Loader";
import LoginBar from "@/app/_components/LoginBar";
import { request } from "@/lib/request-utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface FileData {
  url: string;
  title?: string;
  description?: string;
}

export default function FileViewClient() {
  const [data, setData] = useState<FileData | null>(null);
  const params = useParams();
  const id_file = params.id_file;

  useEffect(() => {
    if (!id_file) return;

    request("GET", `/file?id_file=${id_file}`, "application/json", null, false)
      .then((data) => {
        if (data && data.url) {
          setData(data);
        } else {
          console.error("No URL found in response");
        }
      })
      .catch((error) => {
        console.error("Error fetching file URL:", error);
      });
  }, [id_file]);

  if (!data) return <Loader />;

  return (
    <div className="mt-14">
      <LoginBar />

      <div className="flex w-full h-[calc(100vh-3.5rem)] flex-col sm:flex-row overflow-hidden">
        <aside
          className="lg:basis-1/5 h-full bg-white dark:bg-gray-800 lg:block hidden"
          aria-label="Sidebar"
        >
          <div className="p-6 h-full flex flex-col min-h-0 overflow-y-auto">
            <h1 className="text-xl font-bold mb-6 shrink-0">{data.title}</h1>

            <div className="min-h-0 ">
              <p className="whitespace-pre-wrap break-words pb-6">
                {data.description || "No description available."}
              </p>
            </div>
            <div>
              <a
                href={`/file/${id_file}/view`}
                type="button"
                className="inline-flex items-center justify-center rounded-xl text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 shadow-xs w-12 h-12 focus:outline-none"
              >
                <svg
                  className="w-6 h-6 text-gray-800 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 4H4m0 0v4m0-4 5 5m7-5h4m0 0v4m0-4-5 5M8 20H4m0 0v-4m0 4 5-5m7 5h4m0 0v-4m0 4-5-5"
                  />
                </svg>

                <span className="sr-only">Expand</span>
              </a>
            </div>
          </div>
        </aside>

        <div className="lg:basis-4/5 h-full w-full overflow-hidden">
          <iframe
            src={data.url}
            title="Documento PDF"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
