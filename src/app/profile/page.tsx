import { Metadata } from "next";
import Profile from "./ProfileClient";

export const metadata: Metadata = {
  title: "Mi Perfil",
  description: "Información personal de Scouteca.",
  keywords: ["scouts", "scouteca", "guatemala", "caminantes", "documentos scout", "información scout"],
};

export default function ProfilePage() {
  return <Profile />;
}