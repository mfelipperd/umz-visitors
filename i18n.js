const translations = {
  pt: {
    dashboardTitle: "Painel Administrativo",
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
    noData: "Nenhum dado encontrado."
  },
  en: {
    dashboardTitle: "Admin Dashboard",
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
    noData: "No data found."
  }
};

export function getTranslation(lang, key) {
  return translations[lang]?.[key] || key;
}

export function initI18n(onLangChange) {
  const currentLang = localStorage.getItem('appLang') || 'pt';
  
  const updateElements = (lang) => {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.innerText = getTranslation(lang, key);
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = getTranslation(lang, key);
    });
  };

  const setLang = (lang) => {
    localStorage.setItem('appLang', lang);
    updateElements(lang);
    if (onLangChange) onLangChange(lang);
  };

  // Initial update
  updateElements(currentLang);

  return { currentLang, setLang };
}
