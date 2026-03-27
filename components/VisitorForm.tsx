"use client";

import { useState, useEffect } from "react";
import { MessageSquare, User, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getBestMemberMatch } from "@/lib/matching";
import { GENDERS, BAIRROS_BELEM } from "@/lib/constants";
import BairroSelect from "@/components/BairroSelect";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function VisitorForm({ onStepChange }: { onStepChange?: (step: number) => void }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [gender, setGender] = useState<string>("");
  const [neighborhood, setNeighborhood] = useState<string>("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    religion: "No Religion"
  });

  useEffect(() => {
    if (onStepChange) onStepChange(step);
  }, [step, onStepChange]);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não suportada no seu navegador.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`);
        const data = await res.json();
        
        const foundBairro = data.address?.suburb || data.address?.neighbourhood || data.address?.city_district || "";
        
        if (foundBairro) {
          setNeighborhood(foundBairro);
        } else {
          alert("Não conseguimos identificar seu bairro automaticamente. Por favor, selecione na lista.");
        }
      } catch (e) {
        console.error("Error geocoding:", e);
        alert("Erro ao tentar obter sua localização.");
      } finally {
        setLocating(false);
      }
    }, () => {
      alert("Permissão de localização negada.");
      setLocating(false);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (e) e.preventDefault();
    if (step === 1) {
      if (!formData.name || !formData.age || !gender) {
        alert("Por favor, preencha todos os campos.");
        return;
      }
      setStep(2);
      return;
    }

    setLoading(true);
    const age = parseInt(formData.age);
    const religion = formData.religion;

    const matchedMember = await getBestMemberMatch(age, gender, neighborhood);

    if (!matchedMember) {
      alert(t("errorMatching"));
      setLoading(false);
      return;
    }

    let message = religion === "Adventist" 
      ? `Olá, meu nome é ${formData.name}. Vi o site da igreja e gostaria de fazer uma visita para passarmos o sábado juntos.`
      : `Olá, meu nome é ${formData.name}. Vi o site da igreja e gostaria de fazer uma visita para conhecer vocês.`;

    try {
      await addDoc(collection(db, "visits"), {
        visitor_name: formData.name,
        visitor_age: age,
        visitor_gender: gender,
        visitor_neighborhood: neighborhood,
        visitor_religion: religion,
        is_adventist: religion === "Adventist",
        member_id: matchedMember.id,
        created_at: new Date()
      });
    } catch (e) {
      console.error("Error logging visit:", e);
    }

    const encodedMsg = encodeURIComponent(message);
    let cleanPhone = matchedMember.phone.replace(/\D/g, "");
    if (cleanPhone.length === 10 || cleanPhone.length === 11) {
      cleanPhone = `55${cleanPhone}`;
    }

    setWhatsappUrl(`https://wa.me/${cleanPhone}?text=${encodedMsg}`);
    setLoading(false);
  };

  if (whatsappUrl) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-4 animate-in fade-in zoom-in-95">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
          <MessageSquare className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-center text-primary">Tudo certo!</h3>
        <p className="text-center text-gray-500 max-w-xs text-sm">
          Já encontramos o seu anfitrião. Clique abaixo para enviar a mensagem no WhatsApp.
        </p>
        <Button 
          onClick={() => { window.location.href = whatsappUrl; }}
          size="lg" 
          className="w-full h-14 text-lg bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-200"
        >
          Abrir o WhatsApp
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div 
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 text-left">
                <Label htmlFor="name" className="text-primary/60 font-medium text-xs">{t("nameLabel")}</Label>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required 
                  placeholder={t("namePlaceholder")} 
                  className="bg-gray-50 border-gray-100 h-12 rounded-xl focus:ring-accent/20 focus:border-accent"
                />
              </div>
              <div className="space-y-2 text-left">
                <Label htmlFor="age" className="text-primary/60 font-medium text-xs">{t("ageLabel")}</Label>
                <Input 
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  required 
                  placeholder={t("agePlaceholder")} 
                  className="bg-gray-50 border-gray-100 h-12 rounded-xl focus:ring-accent/20 focus:border-accent"
                />
              </div>
            </div>

            <div className="space-y-3 text-left">
              <Label className="text-primary/60 font-medium text-xs">Sexo</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                {GENDERS.map((g) => (
                  <label 
                    key={g.value}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 p-3 rounded-xl cursor-pointer border-2 transition-all active:scale-95",
                      gender === g.value 
                        ? "bg-primary border-primary text-white shadow-lg" 
                        : "bg-gray-50 border-gray-100 text-gray-400 hover:border-primary/20"
                    )}
                  >
                    <input 
                      type="radio" name="gender" value={g.value} required className="hidden"
                      onChange={(e) => setGender(e.target.value)}
                      checked={gender === g.value}
                    />
                    <User className="w-4 h-4" />
                    <span className="font-bold text-sm">{g.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button type="button" onClick={() => (formData.name && formData.age && gender) ? setStep(2) : alert("Preencha tudo!")} variant="accent" size="lg" className="w-full h-12 rounded-xl font-bold">
              Continuar
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 min-w-0"
          >
            <div className="space-y-2 text-left min-w-0">
              <div className="flex items-center justify-between gap-2">
                <Label className="text-primary/60 font-medium text-xs shrink-0">Seu Bairro</Label>
                <button 
                  type="button" onClick={handleLocate} disabled={locating}
                  className="text-[10px] text-accent font-bold hover:underline flex items-center gap-1 shrink-0"
                >
                  {locating ? <div className="w-2 h-2 border border-accent border-t-transparent rounded-full animate-spin" /> : <MapPin className="w-2 h-2" />}
                  Minha localização
                </button>
              </div>
              <input 
                list="bairros-list"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Digite ou selecione seu bairro..."
                className="flex h-12 w-full items-center rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
                required
              />
              <datalist id="bairros-list">
                {BAIRROS_BELEM.map((b) => (
                  <option key={b} value={b} />
                ))}
              </datalist>
              <input type="hidden" name="neighborhood" value={neighborhood} />
            </div>

            <div className="space-y-2 text-left">
              <Label htmlFor="religion" className="text-primary/60 font-medium text-xs">{t("religionLabel")}</Label>
              <select 
                id="religion"
                value={formData.religion} 
                onChange={(e) => setFormData({...formData, religion: e.target.value})}
                className="flex h-12 w-full items-center rounded-xl border border-gray-100 bg-gray-50 px-4 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all appearance-none cursor-pointer"
              >
                <option value="No Religion">{t("noReligion")}</option>
                <option value="Adventist">{t("adventist")}</option>
                <option value="Catholic">{t("catholic")}</option>
                <option value="Evangelical">{t("evangelical")}</option>
                <option value="Spiritist">{t("spiritist")}</option>
                <option value="Other">{t("other")}</option>
              </select>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button type="button" onClick={() => setStep(1)} variant="ghost" size="lg" className="sm:flex-1 h-12 rounded-xl font-bold">
                Voltar
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !neighborhood}
                variant="accent"
                size="lg"
                className="sm:flex-[2] h-12 gap-2 group rounded-xl min-w-0"
              >
                {loading ? <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : (
                  <>
                    <MessageSquare className="w-4 h-4 shrink-0" />
                    <span className="truncate">Falar no WhatsApp</span>
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
