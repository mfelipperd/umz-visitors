"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";

type State = "loading" | "unsupported" | "ios-install" | "denied" | "off" | "on" | "busy";

const VAPID = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function keyToBytes(b64: string) {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

export default function PushSubscribe() {
  const [state, setState] = useState<State>("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
      if (!VAPID) return setState("unsupported");
      if (!supported) {
        const ios = /iPhone|iPad|iPod/.test(navigator.userAgent);
        return setState(ios ? "ios-install" : "unsupported");
      }
      if (Notification.permission === "denied") return setState("denied");
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        const sub = await reg.pushManager.getSubscription();
        setState(sub ? "on" : "off");
      } catch {
        setState("unsupported");
      }
    })();
  }, []);

  async function enable() {
    setError("");
    setState("busy");
    try {
      if ((await Notification.requestPermission()) !== "granted") return setState("denied");
      const reg = await navigator.serviceWorker.ready;
      const sub =
        (await reg.pushManager.getSubscription()) ??
        (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyToBytes(VAPID!) }));
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      if (!res.ok) throw new Error();
      setState("on");
    } catch {
      setError("Não foi possível ativar agora. Tente novamente.");
      setState("off");
    }
  }

  async function disable() {
    setState("busy");
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
    } finally {
      setState("off");
    }
  }

  if (state === "loading" || state === "unsupported") return null;

  return (
    <div className="rounded-3xl bg-white border border-gray-100 shadow-lg shadow-primary/5 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="w-12 h-12 shrink-0 bg-accent/10 rounded-xl flex items-center justify-center">
        {state === "on" ? <BellRing className="w-6 h-6 text-accent" /> : state === "denied" ? <BellOff className="w-6 h-6 text-accent" /> : <Bell className="w-6 h-6 text-accent" />}
      </div>
      <div className="flex-1 text-sm text-gray-500">
        {state === "ios-install" && "No iPhone: toque em Compartilhar › “Adicionar à Tela de Início” e abra o site por lá para ativar os avisos."}
        {state === "denied" && "As notificações estão bloqueadas neste navegador. Libere nas configurações do site para receber os avisos."}
        {(state === "off" || state === "busy") && "Receba um aviso no celular sempre que houver um novo evento."}
        {state === "on" && "Avisos de novos eventos ativados neste aparelho."}
        {error && <span className="block text-red-500 mt-1">{error}</span>}
      </div>
      {state === "off" && <Button variant="accent" className="rounded-2xl font-bold" onClick={enable}>Ativar avisos</Button>}
      {state === "busy" && <Button variant="accent" className="rounded-2xl" disabled>Aguarde…</Button>}
      {state === "on" && <Button variant="outline" className="rounded-2xl" onClick={disable}>Desativar</Button>}
    </div>
  );
}
