'use client';

import NavBar from '@/app/_components/NavBar';
import { Event, Event_response } from "@/utils/interfaces";
import { request } from '@/utils/request-utils';
import Image from "next/image";
import { useState } from "react";

export default function Admin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [ready, setReady] = useState<boolean>(false);

  function update_events() {
    setReady(false);
    request('GET', '/event', 'application/json')
      .then((event_data) => {
        const events: Event[] = [];
        event_data.forEach((data: Event_response) => {
          const a_data = {
            id_event: data.PK,
            title: data.title,
            description: data.description,
            post: data.post,
            information: data.information,
            created: data.created,
            expire_date: data.expire_date
          }
          events.push(a_data);
        });
        setEvents(events);
        setReady(true);
      })
      .catch((err) => console.log(err))
  }


  return (
    <main>
      {/* Botón hamburguesa visible solo en móviles */}
      <NavBar callback={update_events} />

      <div className="p-6 pt-20 md:ml-56 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {!ready && (
          <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
        {events.map((Event) => (
          <div
            key={Event.id_event}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 transition-shadow hover:shadow-lg"
          >
            <a href={Event.information} target="_blank" rel="noopener noreferrer">
              <div className="relative w-full aspect-4/3 overflow-hidden rounded-t-2xl">
                <Image
                  src={Event.post}
                  alt={Event.title}
                  fill
                  className="object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>
            </a>
            <div className="p-5 flex flex-col justify-between h-full">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
                  {Event.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">

                  📅 {new Date(Number(Event.expire_date) * 1000).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {Event.description}
                </p>
                <a
                  href={Event.information}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Ficha del evento
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 5h12m0 0L9 1m4 4L9 9"
                    />
                  </svg>
                </a>
              </div>

            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
