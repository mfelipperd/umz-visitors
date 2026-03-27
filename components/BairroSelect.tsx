"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BAIRROS_BELEM } from "@/lib/constants";

interface BairroSelectProps {
  onSelect: (value: string) => void;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
}

export default function BairroSelect({ onSelect, value: controlledValue, defaultValue, placeholder = "Selecione o bairro..." }: BairroSelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue || controlledValue || "");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredBairros = BAIRROS_BELEM.filter((bairro) =>
    bairro.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (bairro: string) => {
    setValue(bairro);
    onSelect(bairro);
    setOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full h-14 justify-between bg-gray-50 border-gray-100 hover:bg-gray-100 text-left font-normal rounded-2xl transition-all"
        onClick={() => setOpen(!open)}
      >
        {value ? value : <span className="text-gray-400">{placeholder}</span>}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-100 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center border-b px-3 py-2">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400"
              placeholder="Pesquisar bairro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
            {filteredBairros.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500">Nenhum bairro encontrado.</div>
            ) : (
              filteredBairros.map((bairro) => (
                <div
                  key={bairro}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2.5 text-sm outline-none transition-colors hover:bg-primary/5 hover:text-primary",
                    value === bairro ? "bg-primary/10 text-primary font-medium" : "text-gray-700"
                  )}
                  onClick={() => handleSelect(bairro)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === bairro ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {bairro}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <input type="hidden" name="neighborhood" value={value} required />
    </div>
  );
}
