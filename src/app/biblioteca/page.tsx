import { Metadata } from "next";
import BibliotecaClient from "./BibliotecaClient";

export const metadata: Metadata = {
  title: "Biblioteca",
  description: "Biblioteca scout con todos los documentos de Guatemala en Scouteca.",
  keywords: ["scouts", "scouteca", "guatemala", "caminantes", "documentos scout", "información scout"],
};

export default function BibliotecaPage() {
  return <BibliotecaClient />;
}