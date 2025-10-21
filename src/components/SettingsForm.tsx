"use client";

import { useState } from "react";
import { updateUserProfile } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { User } from "@/types";

interface SettingsFormProps {
  user: User;
}

export default function SettingsForm({ user }: SettingsFormProps) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await updateUserProfile({
        name: name || undefined,
        email: email || undefined,
        new_password: newPassword || undefined,
        current_password: currentPassword,
      });

      setSuccess("Información actualizada exitosamente");
      setNewPassword("");
      setCurrentPassword("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre (opcional)</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email (opcional)</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            disabled={loading}
          />
        </div>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-4">Cambiar Contraseña</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña (opcional)</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Deja vacío si no quieres cambiar la contraseña
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña Actual *</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Contraseña actual"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Requerida para confirmar los cambios
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription className="text-green-600 dark:text-green-400">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar Cambios"}
      </Button>
    </form>
  );
}
