import { redirect } from "next/navigation";

// Mantém válido o link /evento já divulgado.
export default function EventoRedirect() {
  redirect("/eventos/tarde-de-louvor-e-esperanca");
}
