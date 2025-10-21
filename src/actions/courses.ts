"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { createCourseSchema, updateCourseSchema } from "@/lib/schemas";
import type { Course } from "@/types";
import { revalidatePath } from "next/cache";

export async function getCourses(): Promise<Course[]> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const result = await db.execute("SELECT * FROM course ORDER BY name");
  return result.rows as unknown as Course[];
}

export async function getCourseById(id: number): Promise<Course | null> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const result = await db.execute({
    sql: "SELECT * FROM course WHERE id = ?",
    args: [id],
  });

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0] as unknown as Course;
}

export async function createCourse(data: unknown): Promise<Course> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const validated = createCourseSchema.parse(data);

  const result = await db.execute({
    sql: "INSERT INTO course (name) VALUES (?) RETURNING *",
    args: [validated.name],
  });

  revalidatePath("/dashboard");
  return result.rows[0] as unknown as Course;
}

export async function updateCourse(data: unknown): Promise<Course> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const validated = updateCourseSchema.parse(data);

  const result = await db.execute({
    sql: "UPDATE course SET name = ? WHERE id = ? RETURNING *",
    args: [validated.name, validated.id],
  });

  revalidatePath("/dashboard");
  return result.rows[0] as unknown as Course;
}

export async function deleteCourse(id: number): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  await db.execute({
    sql: "DELETE FROM course WHERE id = ?",
    args: [id],
  });

  revalidatePath("/dashboard");
}
