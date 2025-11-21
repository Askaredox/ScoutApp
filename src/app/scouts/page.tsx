import { Metadata } from "next";
import Scouts from "./ScoutsClient";

export const metadata: Metadata = {
    title: "Scouts Admin",
    description: "Gestiona la información de los scouts en Guatemala a través de Scouteca.",
    keywords: ["scouts", "scouteca", "guatemala", "caminantes", "información scout", "gestión scout"],
};

export default function ScoutsPage() {
    return <Scouts />;
}