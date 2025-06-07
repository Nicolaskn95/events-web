"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import { User } from "lucide-react";
import { config } from "@/lib/config";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showEditButtons, setShowEditButtons] = useState(false);
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
          const response = await fetch(`${config.apiUrl}/api/users`, {
            headers: {
              access_token: token,
            },
          });

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
    if (!userData) return;

    const updatedUserData = {
      ...userData,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        userData.name
      )}&background=random`,
    };

    try {
      await handleUpdateUser(updatedUserData);
      setUserData(updatedUserData);
      setIsEditOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${config.apiUrl}/api/users`, {
        method: "DELETE",
        headers: {
          access_token: Cookies.get("token") || "",
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

  const handleEditClick = () => {
    setIsEditOpen(true);
    setShowEditButtons(false);
    setTimeout(() => {
      setShowEditButtons(true);
    }, 100);
  };

  const handleUpdateUser = async (data: UserData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/api/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          access_token: Cookies.get("token") || "",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar perfil");
      }

      toast({
        title: "Successo",
        description: "Perfil atualizado com sucesso!",
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao atualizar o perfil. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              {isLoading ? (
                <div className="h-8 w-8 flex items-center justify-center">
                  <span className="text-xs">Loading...</span>
                </div>
              ) : (
                <>
                  <AvatarImage src={userData?.avatar} alt={userData?.name} />
                  <AvatarFallback>{userData?.name?.charAt(0)}</AvatarFallback>
                </>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {userData?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {userData?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            Editar Perfil
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
            <DialogDescription>Faça alterações em seu perfil</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile}>
            <div className="flex flex-col gap-4 py-4">
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
              <div className="flex items-center gap-4">
                <Label htmlFor="name" className="w-1/4 text-right">
                  Nome
                </Label>
                <Input
                  id="name"
                  value={userData?.name}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                  className="w-3/4"
                />
              </div>
              <div className="flex items-center gap-4">
                <Label htmlFor="email" className="w-1/4 text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userData?.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  className="w-3/4"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar alterações"}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isLoading}
              >
                Excluir Conta
              </Button>
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
