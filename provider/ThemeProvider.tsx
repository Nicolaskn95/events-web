"use client"; // Deve estar no topo!

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  // Sincroniza com localStorage e preferência do sistema
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDark(savedTheme ? savedTheme === "dark" : systemPrefersDark);
  }, []);

  // Aplica a classe e salva no localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <>
      <div className="flex items-center space-x-2 content-center justify-center">
        <Switch
          id="theme-toggle"
          checked={isDark}
          onCheckedChange={setIsDark}
        />
        <Label htmlFor="theme-toggle">
          {isDark ? "Tema Escuro" : "Tema Claro"}
        </Label>
      </div>
      {children} {/* Renderiza os children! */}
    </>
  );
}
