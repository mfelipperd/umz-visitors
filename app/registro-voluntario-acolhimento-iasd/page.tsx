"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { collection, addDoc, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus, ShieldCheck, Users, User } from "lucide-react";
import { motion } from "framer-motion";
import { GENDERS } from "@/lib/constants";
import BairroSelect from "@/components/BairroSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Host {
  id: string;
  name: string;
}

export default function HostRegistration() {
  const [loading, setLoading] = useState(false);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [success, setSuccess] = useState(false);
  const [phone, setPhone] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 10) {
      value = `${value.slice(0, 10)}-${value.slice(10)}`;
    }
    setPhone(value);
  };

  // Fetch active hosts (only name is stored in state for privacy)
  useEffect(() => {
    const q = query(
      collection(db, "members"),
      where("is_active", "==", true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activeHosts = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      
      // Sort in memory to avoid requiring a composite index
      activeHosts.sort((a, b) => a.name.localeCompare(b.name));
      
      setHosts(activeHosts);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const age = parseInt(formData.get("age") as string);
    const phone = formData.get("phone") as string;
    const gender = formData.get("gender") as string;
    const neighborhood = formData.get("neighborhood") as string;
    const lgpdConsent = formData.get("lgpdConsent") === "on";

    if (!gender || !neighborhood) {
      alert("Por favor, preencha o sexo e o bairro.");
      setLoading(false);
      return;
    }

    if (!lgpdConsent) {
      alert("Você precisa aceitar os termos da LGPD para continuar.");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "members"), {
        name: fullName,
        age: age,
        gender: gender,
        neighborhood: neighborhood,
        phone: phone, // Assuming DDI+DDD+Phone format if Brazilian
        is_active: true, // Default to active
        created_at: new Date(),
        lgpd_consent: true,
      });

      setSuccess(true);
      setPhone("");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Error registering host:", error);
      alert("Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <UserPlus className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary">
            Cadastro de Anfitrião Voluntário
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Faça parte da equipe de acolhimento local. Seu número será usado apenas para que os visitantes entrem em contato com você via WhatsApp na primeira visita.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Registration Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
               Seus Dados
            </h2>

            {success && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm font-medium border border-green-200">
                Cadastro realizado com sucesso! Que Deus te use neste ministério.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Primeiro Nome</Label>
                  <Input id="firstName" name="firstName" required placeholder="Ex: João" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Último Nome</Label>
                  <Input id="lastName" name="lastName" required placeholder="Ex: Silva" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp (Apenas DDD e Número)</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel" 
                  required 
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Ex: (11) 99999-9999" 
                  maxLength={15}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Sua Idade</Label>
                  <Input 
                    id="age" 
                    name="age" 
                    type="number" 
                    min="16" 
                    max="99" 
                    required 
                    placeholder="Ex: 30" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Sexo</Label>
                  <Select name="gender" required>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDERS.map((g) => (
                        <SelectItem key={g.value} value={g.value}>
                          <div className="flex items-center gap-2">
                            <User className={cn("w-4 h-4", g.value === "Masculino" ? "text-blue-500" : "text-pink-500")} />
                            {g.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Seu Bairro (Belém)</Label>
                <BairroSelect onSelect={() => {}} placeholder="Pesquise seu bairro..." />
                <p className="text-[10px] text-gray-400">
                  O bairro e o sexo são usados para o <strong>Match Perfeito</strong>, conectando você a visitantes próximos e do mesmo gênero.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                  <input 
                    type="checkbox" 
                    id="lgpdConsent" 
                    name="lgpdConsent" 
                    required
                    className="mt-1 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <Label htmlFor="lgpdConsent" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                    <span className="font-bold flex items-center gap-1 text-primary mb-1">
                      <ShieldCheck className="w-3 h-3" /> Termos de Privacidade (LGPD)
                    </span>
                    Concordo em fornecer meu nome, telefone e idade para o <strong>Espaço Novo Tempo Umarizal</strong>. Entendo que meu contato será repassado a novos visitantes com o objetivo exclusivo de acolhimento na igreja.
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-md" disabled={loading}>
                {loading ? "Registrando..." : "Quero ser Anfitrião"}
              </Button>
            </form>
          </motion.div>

          {/* Roster (Public List) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-primary text-white p-8 rounded-3xl shadow-lg relative overflow-hidden h-full">
              {/* Decorative absolute background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
                    <Users className="w-6 h-6 text-accent" />
                    Anfitriões Ativos
                  </h2>
                  <p className="text-blue-100/70 text-sm">
                    Estes são os irmãos e irmãs que já estão cadastrados e prontos para receber nossos visitantes. Junte-se a eles!
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 min-h-[300px] max-h-[500px] overflow-y-auto custom-scrollbar">
                  {hosts.length === 0 ? (
                    <p className="text-blue-100/50 text-center italic text-sm mt-8">
                      Nenhum anfitrião ativo no momento. Seja o primeiro!
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {hosts.map((host, i) => (
                        <li key={host.id} className="flex items-center gap-3 text-white/90">
                          <div className="w-8 h-8 flex items-center justify-center bg-accent/20 text-accent rounded-full text-xs font-bold">
                            {i + 1}
                          </div>
                          <span className="font-medium tracking-wide">{host.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
