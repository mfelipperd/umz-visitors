import type { MetadataRoute } from "next";

// Necessário para receber notificações no iPhone (o site precisa estar na Tela de Início).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Espaço Novo Tempo Umarizal",
    short_name: "Novo Tempo",
    start_url: "/eventos",
    display: "standalone",
    background_color: "#f9fafb",
    theme_color: "#003058",
  };
}
