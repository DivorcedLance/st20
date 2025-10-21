"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { createTopicSchema, updateTopicSchema } from "@/lib/schemas";
import type { Topic, TopicWithCourse } from "@/types";
import { revalidatePath } from "next/cache";

export async function getTopics(): Promise<TopicWithCourse[]> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const result = await db.execute(`
    SELECT t.*, c.name as course_name
    FROM topic t
    JOIN course c ON t.course_id = c.id
    ORDER BY c.name, t.number
  `);

  return result.rows as unknown as TopicWithCourse[];
}

export async function getTopicsByCourse(courseId: number): Promise<Topic[]> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const result = await db.execute({
    sql: "SELECT * FROM topic WHERE course_id = ? ORDER BY number",
    args: [courseId],
  });

  return result.rows as unknown as Topic[];
}

export async function getTopicById(id: number): Promise<Topic | null> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const result = await db.execute({
    sql: "SELECT * FROM topic WHERE id = ?",
    args: [id],
  });

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0] as unknown as Topic;
}

export async function createTopic(data: unknown): Promise<Topic> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const validated = createTopicSchema.parse(data);

  const result = await db.execute({
    sql: "INSERT INTO topic (course_id, name, number) VALUES (?, ?, ?) RETURNING *",
    args: [validated.course_id, validated.name, validated.number],
  });

  revalidatePath("/dashboard");
  return result.rows[0] as unknown as Topic;
}

export async function updateTopic(data: unknown): Promise<Topic> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const validated = updateTopicSchema.parse(data);

  const result = await db.execute({
    sql: "UPDATE topic SET name = ?, number = ? WHERE id = ? RETURNING *",
    args: [validated.name, validated.number, validated.id],
  });

  revalidatePath("/dashboard");
  return result.rows[0] as unknown as Topic;
}

export async function deleteTopic(id: number): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  await db.execute({
    sql: "DELETE FROM topic WHERE id = ?",
    args: [id],
  });

  revalidatePath("/dashboard");
}

export async function getNextTopicNumber(courseId: number): Promise<number> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const result = await db.execute({
    sql: "SELECT MAX(number) as max_number FROM topic WHERE course_id = ?",
    args: [courseId],
  });

  const maxNumber = result.rows[0]?.max_number as number | null;
  return (maxNumber || 0) + 1;
}
