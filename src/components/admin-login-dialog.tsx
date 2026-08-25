import { useState, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const ADMIN_USER = "Elias";
const ADMIN_PASS = "Elias.123";

export function AdminLoginDialog({ trigger }: { trigger: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      window.localStorage.setItem("admin_bypass", "1");
      setOpen(false);
      setError(false);
      setUser("");
      setPass("");
      navigate({ to: "/admin" });
    } else {
      setError(true);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Acceso admin</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-user">Usuario</Label>
            <Input id="admin-user" value={user} onChange={(e) => setUser(e.target.value)} autoComplete="off" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-pass">Contraseña</Label>
            <Input id="admin-pass" type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="off" />
          </div>
          {error && <p className="text-sm text-destructive">Credenciales incorrectas</p>}
          <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
            Entrar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}