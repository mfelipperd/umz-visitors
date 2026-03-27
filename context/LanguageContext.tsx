"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "pt" | "en";

const translations = {
  pt: {
    heroTitle: "Sinta-se em casa",
    heroSubtitle: "Queremos que sua primeira visita seja inesquecível. Deixe seu contato e encontraremos um irmão ou irmã para te receber.",
    nameLabel: "Seu Nome",
    namePlaceholder: "Como podemos te chamar?",
    ageLabel: "Sua Idade",
    agePlaceholder: "Ex: 25",
    religionLabel: "Sua Religião (Opcional)",
    noReligion: "Sem Religião",
    adventist: "Adventista",
    catholic: "Católico",
    evangelical: "Evangélico",
    spiritist: "Espírita",
    other: "Outra",
    ctaButton: "Falar com um Amigo no WhatsApp",
    footerTitle: "Igreja Adventista do Sétimo Dia",
    footerText: "Acolhendo você como parte de nossa família em todos os passos da sua jornada.",
    adminTitle: "Painel Administrativo",
    analytics: "Análise de Visitas",
    members: "Gestão de Membros",
    totalVisits: "Total de Visitas",
    adventistVisitors: "Visitantes Adventistas",
    nonAdventistVisitors: "Outras Religiões",
    memberName: "Nome do Membro",
    memberAge: "Idade",
    memberPhone: "WhatsApp (DDI+DDD+Número)",
    memberStatus: "Ativo?",
    addMember: "Adicionar Novo Membro",
    save: "Salvar",
    delete: "Excluir",
    active: "Ativo",
    inactive: "Inativo",
    language: "Idioma",
    noData: "Nenhum dado encontrado.",
    errorMatching: "Desculpe, não conseguimos encontrar um guia no momento.",
    waitBible: "Buscando palavra de vida..."
  },
  en: {
    heroTitle: "Feel at home",
    heroSubtitle: "We want your first visit to be unforgettable. Leave your contact and we will find a brother or sister to welcome you.",
    nameLabel: "Your Name",
    namePlaceholder: "What can we call you?",
    ageLabel: "Your Age",
    agePlaceholder: "Ex: 25",
    religionLabel: "Your Religion (Optional)",
    noReligion: "No Religion",
    adventist: "Adventist",
    catholic: "Catholic",
    evangelical: "Evangelical",
    spiritist: "Spiritist",
    other: "Other",
    ctaButton: "Talk to a Friend on WhatsApp",
    footerTitle: "Seventh-day Adventist Church",
    footerText: "Welcoming you as part of our family every step of your journey.",
    adminTitle: "Admin Dashboard",
    analytics: "Visit Analytics",
    members: "Member Management",
    totalVisits: "Total Visits",
    adventistVisitors: "Adventist Visitors",
    nonAdventistVisitors: "Other Religions",
    memberName: "Member Name",
    memberAge: "Age",
    memberPhone: "WhatsApp (Country+Area+Number)",
    memberStatus: "Active?",
    addMember: "Add New Member",
    save: "Save",
    delete: "Delete",
    active: "Active",
    inactive: "Inactive",
    language: "Language",
    noData: "No data found.",
    errorMatching: "Sorry, we couldn't find a guide right now.",
    waitBible: "Searching for word of life..."
  }
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("pt");

  useEffect(() => {
    const saved = localStorage.getItem("appLang") as Language;
    if (saved) setLang(saved);
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem("appLang", newLang);
  };

  const t = (key: string) => {
    return (translations[lang] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
