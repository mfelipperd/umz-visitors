"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, Users, Globe, Plus, Trash, Edit2, X, ShieldCheck, Menu 
} from "lucide-react";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function AdminContent({ token, onLogout }: { token: string; onLogout: () => void }) {
  const { lang, setLang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"analytics" | "members">("analytics");
  const [members, setMembers] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  const authHeaders = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

  const load = async () => {
    const res = await fetch("/api/admin/data", { headers: authHeaders, cache: "no-store" });
    if (res.status === 401) return onLogout();
    if (!res.ok) return;
    const d = await res.json();
    setVisits(d.visits);
    setMembers(d.members);
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Analytics Helpers
  const totalVisits = visits.length;
  const adventistCount = visits.filter(v => v.is_adventist).length;
  const otherCount = totalVisits - adventistCount;

  // Member CRUD Actions
  const handleSaveMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      age: parseInt(formData.get("age") as string),
      phone: formData.get("phone") as string,
      is_active: formData.get("is_active") === "on",
    };

    try {
      const res = await fetch(editingMember ? `/api/admin/members/${editingMember.id}` : "/api/admin/members", {
        method: editingMember ? "PUT" : "POST",
        headers: authHeaders,
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      await load();
      setIsModalOpen(false);
      setEditingMember(null);
    } catch (err) {
      alert("Error saving member");
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (confirm("Delete this member?")) {
      await fetch(`/api/admin/members/${id}`, { method: "DELETE", headers: authHeaders });
      await load();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white p-6 hidden md:flex flex-col gap-8 shadow-2xl">
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg">Admin View</span>
        </div>
        
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab("analytics")}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left w-full group",
              activeTab === "analytics" ? "bg-white/10 text-accent" : "hover:bg-white/5"
            )}
          >
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">{t("analytics")}</span>
          </button>
          <button 
            onClick={() => setActiveTab("members")}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left w-full group",
              activeTab === "members" ? "bg-white/10 text-accent" : "hover:bg-white/5"
            )}
          >
            <Users className="w-5 h-5" />
            <span className="font-medium">{t("members")}</span>
          </button>
        </nav>

        <div className="mt-auto border-t border-white/10 pt-6">
          <div className="flex items-center gap-3 px-4">
            <Globe className="w-5 h-5 text-blue-300" />
            <select 
              value={lang}
              onChange={(e) => setLang(e.target.value as "pt" | "en")}
              className="bg-transparent text-sm focus:outline-none cursor-pointer appearance-none"
            >
              <option value="pt" className="text-primary">Português</option>
              <option value="en" className="text-primary">English</option>
            </select>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        
        <header className="mb-12 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">
            {activeTab === "analytics" ? t("analytics") : t("members")}
          </h1>
        </header>

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">{t("totalVisits")}</span>
                <span className="text-4xl font-bold text-primary">{totalVisits}</span>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">{t("adventistVisitors")}</span>
                <span className="text-4xl font-bold text-blue-600">{adventistCount}</span>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-2">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-widest">{t("nonAdventistVisitors")}</span>
                <span className="text-4xl font-bold text-orange-500">{otherCount}</span>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-primary mb-6">Logs</h2>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {visits.length > 0 ? visits.map((v) => (
                  <div key={v.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div>
                      <p className="font-bold text-primary text-lg">{v.visitor_name}</p>
                      <p className="text-sm text-gray-500">{v.visitor_religion} • {v.visitor_age}y</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-400">
                        {v.created_at ? new Date(v.created_at).toLocaleString() : ""}
                      </p>
                    </div>
                  </div>
                )) : (
                  <p className="text-gray-400 italic text-center py-8">{t("noData")}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary">{t("members")}</h2>
              <button 
                onClick={() => { setEditingMember(null); setIsModalOpen(true); }}
                className="btn-accent py-2 flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{t("addMember")}</span>
              </button>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{t("memberName")}</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{t("memberAge")}</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{t("memberPhone")}</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{t("memberStatus")}</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-primary">{m.name}</td>
                      <td className="px-6 py-4 text-gray-600">{m.age}</td>
                      <td className="px-6 py-4 text-blue-600 font-mono text-sm">{m.phone}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] uppercase font-bold",
                          m.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                          {m.is_active ? t("active") : t("inactive")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button 
                          onClick={() => { setEditingMember(m); setIsModalOpen(true); }}
                          className="text-gray-300 hover:text-primary transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteMember(m.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {members.length === 0 && (
                <p className="text-gray-400 italic text-center py-12">{t("noData")}</p>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative">
            <button 
              onClick={() => { setIsModalOpen(false); setEditingMember(null); }}
              className="absolute top-6 right-6 text-gray-300 hover:text-gray-600 transition-colors"
            >
              <X />
            </button>
            
            <h2 className="text-2xl font-bold text-primary mb-8">
              {editingMember ? t("save") : t("addMember")}
            </h2>
            
            <form onSubmit={handleSaveMember} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 ml-1">{t("memberName")}</label>
                <input name="name" defaultValue={editingMember?.name} required className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 ml-1">{t("memberAge")}</label>
                  <input name="age" type="number" defaultValue={editingMember?.age} required className="input-field" />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-sm font-medium text-gray-500 ml-1">{t("memberStatus")}</label>
                  <div className="flex items-center gap-2 mt-3 ml-2">
                    <input name="is_active" type="checkbox" defaultChecked={editingMember?.is_active ?? true} className="w-6 h-6 accent-accent rounded-lg" />
                    <span className="text-sm text-gray-400">{t("active")}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 ml-1">{t("memberPhone")}</label>
                <input name="phone" defaultValue={editingMember?.phone} required className="input-field" placeholder="5511999999999" />
              </div>
              <button type="submit" className="btn-primary w-full py-4 mt-4 shadow-accent/20">
                {t("save")}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminGate() {
  const [token, setToken] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  const tryToken = async (value: string) => {
    const res = await fetch("/api/admin/data", { headers: { Authorization: `Bearer ${value}` }, cache: "no-store" });
    if (res.ok) {
      sessionStorage.setItem("admin_token", value);
      setToken(value);
      setError("");
    } else {
      sessionStorage.removeItem("admin_token");
      setToken(null);
      setError(res.status === 401 ? "Senha incorreta." : "Serviço indisponível. Tente novamente.");
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_token");
    (saved ? tryToken(saved) : Promise.resolve()).finally(() => setChecking(false));
  }, []);

  if (checking) return null;
  if (token) return <AdminContent token={token} onLogout={() => { sessionStorage.removeItem("admin_token"); setToken(null); }} />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <form
        onSubmit={(e) => { e.preventDefault(); tryToken(input); }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-4"
      >
        <div className="flex items-center gap-2 text-primary font-bold text-xl"><ShieldCheck className="w-6 h-6" /> Admin</div>
        <input type="password" value={input} onChange={(e) => setInput(e.target.value)} className="input-field" placeholder="Senha de administrador" autoFocus />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" className="btn-primary w-full">Entrar</button>
      </form>
    </div>
  );
}

export default function AdminPage() {
  return (
    <LanguageProvider>
      <AdminGate />
    </LanguageProvider>
  );
}
