'use client';

import Loader from '@/app/_components/Loader';
import NavBar from '@/app/_components/NavBar';
import Image from "next/image";

import { Event, Event_response } from "@/lib/interfaces";
import { request } from '@/lib/request-utils';
import { useState } from "react";

export default function Dashboard() {
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
                    <Loader />
                )}
                {events.map((Event) => (
                    <div
                        key={Event.id_event}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 transition-shadow hover:shadow-lg"
                    >
                        <a href={Event.post} target="_blank" rel="noopener noreferrer">
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
                                {
                                    (Event.information === "NONE" ? (
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

                                    ) : null)
                                }
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
