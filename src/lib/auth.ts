import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import type { User } from "@/types";

const SESSION_COOKIE_NAME = "st20_session";
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createUser(password: string): Promise<User> {
  const hashedPassword = await hashPassword(password);
  
  const result = await db.execute({
    sql: "INSERT INTO user (password) VALUES (?) RETURNING *",
    args: [hashedPassword],
  });

  return result.rows[0] as unknown as User;
}

export async function getUserByPassword(password: string): Promise<User | null> {
  const result = await db.execute("SELECT * FROM user");
  
  for (const row of result.rows) {
    const user = row as unknown as User;
    const isValid = await verifyPassword(password, user.password);
    if (isValid) {
      return user;
    }
  }
  
  return null;
}

export async function getUserById(id: number): Promise<User | null> {
  const result = await db.execute({
    sql: "SELECT * FROM user WHERE id = ?",
    args: [id],
  });

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0] as unknown as User;
}

export async function setSession(userId: number): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, userId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION / 1000,
    path: "/",
  });
}

export async function getSession(): Promise<number | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  
  if (!session) {
    return null;
  }

  return parseInt(session.value, 10);
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<User | null> {
  const userId = await getSession();
  
  if (!userId) {
    return null;
  }

  return getUserById(userId);
}

export async function updateUser(
  userId: number,
  data: {
    name?: string;
    email?: string;
    password?: string;
  }
): Promise<void> {
  const updates: string[] = [];
  const args: (string | number)[] = [];

  if (data.name !== undefined) {
    updates.push("name = ?");
    args.push(data.name);
  }

  if (data.email !== undefined) {
    updates.push("email = ?");
    args.push(data.email);
  }

  if (data.password !== undefined) {
    const hashedPassword = await hashPassword(data.password);
    updates.push("password = ?");
    args.push(hashedPassword);
  }

  if (updates.length === 0) {
    return;
  }

  args.push(userId);

  await db.execute({
    sql: `UPDATE user SET ${updates.join(", ")} WHERE id = ?`,
    args,
  });
}
