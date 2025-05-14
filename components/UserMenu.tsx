"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import { User } from "lucide-react";

interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
  });
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const response = await fetch("http://localhost:3001/api/users", {
            headers: {
              "access-token": token,
            },
          });
          console.log(response);
          if (response.ok) {
            const data = await response.json();
            setUserData(data.user);
          } else {
            throw new Error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Não foi possível carregar os dados do usuário",
          });
        }
      }
    };

    fetchUserData();
  }, [toast]);

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
    router.refresh();
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "access-token": Cookies.get("token") || "",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar perfil");
      }

      toast({
        title: "Sucesso",
        description: "Perfil atualizado com sucesso!",
      });
      setIsEditing(false);
      setIsOpen(false); // Fechar o modal após atualização bem-sucedida
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar seu perfil",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/users", {
        method: "DELETE",
        headers: {
          "access-token": Cookies.get("token") || "",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir conta");
      }

      Cookies.remove("token");
      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída com sucesso",
      });
      router.push("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir sua conta",
      });
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            size="icon"
            className="relative h-8 w-8"
            title="Configurações"
          >
            <User className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsOpen(true)}>
            Gerenciar conta
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600 focus:bg-red-100"
          >
            Excluir conta
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Gerenciar Conta</DialogTitle>
            <DialogDescription>Faça alterações em seu perfil</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile}>
            <div className="grid gap-4 py-4">
              <div className="flex justify-center mb-4">
                <div className="relative w-24 h-24 rounded-full overflow-hidden">
                  {userData?.avatar ? (
                    <Image
                      src={userData?.avatar}
                      alt={userData?.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="h-full w-full p-4" />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={userData?.name}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userData?.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  disabled={!isEditing}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col space-y-2">
              {isEditing ? (
                <>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar alterações"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsEditing(false)}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  className="w-full"
                  onClick={() => setIsEditing(true)}
                >
                  Editar perfil
                </Button>
              )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir Conta</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir sua conta? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isLoading}
            >
              {isLoading ? "Excluindo..." : "Excluir Conta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
