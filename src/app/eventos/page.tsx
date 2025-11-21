import { Metadata } from "next";
import Eventos from "./EventosClient";

export const metadata: Metadata = {
  title: "Eventos Admin",
  description: "Mantente al día con los eventos scouts en Guatemala a través de Scouteca.",
  keywords: ["scouts", "scouteca", "guatemala", "caminantes", "eventos scout", "información scout"],
};

export default function EventosPage() {
  return <Eventos />;
}