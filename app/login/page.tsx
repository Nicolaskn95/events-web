"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await fetch("http://localhost:3001/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.errors[0].msg || "Credenciais inválidas");
        }

        // Salvar o token JWT nos cookies
        Cookies.set("token", data.token, {
          expires: 7, // Expira em 7 dias
          secure: process.env.NODE_ENV === "production", // Apenas HTTPS em produção
          sameSite: "strict", // Proteção contra CSRF
        });

        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo de volta!",
        });

        router.push("/");
        router.refresh(); // Força a atualização da página para aplicar o token
      } else {
        if (password !== confirmPassword) {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "As senhas não coincidem",
          });
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:3001/api/users/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.errors[0].msg || "Erro ao criar conta");
        }

        toast({
          title: "Conta criada com sucesso",
          description: "Você já pode fazer login!",
        });
        setIsLogin(true);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description:
          error instanceof Error ? error.message : "Ocorreu um erro inesperado",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? "Entrar" : "Criar Conta"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin
              ? "Digite seu email e senha para acessar sua conta"
              : "Preencha os dados abaixo para criar sua conta"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? isLogin
                  ? "Entrando..."
                  : "Criando conta..."
                : isLogin
                ? "Entrar"
                : "Criar conta"}
            </Button>
            <div className="text-center text-sm">
              {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setName("");
                  setEmail("");
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="text-primary hover:underline"
              >
                {isLogin ? "Registre-se" : "Faça login"}
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
