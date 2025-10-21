"use server";

import { 
  createUser, 
  getUserByPassword, 
  setSession, 
  clearSession, 
  getCurrentUser,
  updateUser as updateUserInDb,
  verifyPassword
} from "@/lib/auth";
import { loginSchema, updateUserSchema } from "@/lib/schemas";
import { redirect } from "next/navigation";

export async function login(data: unknown) {
  const validated = loginSchema.parse(data);

  let user = await getUserByPassword(validated.password);

  if (!user) {
    // Create new user with this password
    user = await createUser(validated.password);
  }

  await setSession(user.id);
  redirect("/dashboard");
}

export async function logout() {
  await clearSession();
  redirect("/");
}

export async function getUser() {
  return getCurrentUser();
}

export async function updateUserProfile(data: unknown) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const validated = updateUserSchema.parse(data);

  // Verify current password
  const isValidPassword = await verifyPassword(validated.current_password, user.password);
  if (!isValidPassword) {
    throw new Error("Contraseña actual incorrecta");
  }

  // Update user
  await updateUserInDb(user.id, {
    name: validated.name,
    email: validated.email,
    password: validated.new_password,
  });
}
