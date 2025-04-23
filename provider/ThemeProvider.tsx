"use client" // Deve estar no topo!

import { useState, useEffect } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false)

  // Sincroniza com localStorage e preferência do sistema
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
    setIsDark(savedTheme ? savedTheme === "dark" : systemPrefersDark)
  }, [])

  // Aplica a classe e salva no localStorage
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
    localStorage.setItem("theme", isDark ? "dark" : "light")
  }, [isDark])

  return (
    <>
      <div className="flex content-center justify-center">
        <button
          onClick={() => setIsDark(!isDark)}
          className="flex justify-self-center self-center bottom-4 right-4 p-3 rounded-full bg-gray-700 dark:bg-gray-200 shadow-md"
          aria-label={
            isDark ? "Mudar para tema claro" : "Mudar para tema escuro"
          }
        >
          {isDark ? (
            <span className="text-yellow-400 text-xl">☀️</span>
          ) : (
            <span className="text-blue-400 text-xl">🌙</span>
          )}
        </button>
      </div>
      {children} {/* Renderiza os children! */}
    </>
  )
}
