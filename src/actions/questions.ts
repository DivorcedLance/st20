"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { createQuestionSchema, updateQuestionSchema, questionsImportSchema } from "@/lib/schemas";
import type { Question, QuestionWithDetails, QuestionImport, Course, Topic } from "@/types";
import { revalidatePath } from "next/cache";

export async function getQuestions(): Promise<QuestionWithDetails[]> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const result = await db.execute(`
    SELECT 
      q.*,
      t.name as topic_name,
      c.name as course_name,
      qt.name as type_name
    FROM question q
    JOIN topic t ON q.topic_id = t.id
    JOIN course c ON t.course_id = c.id
    JOIN question_type qt ON q.type_id = qt.id
    ORDER BY c.name, t.number, q.id
  `);

  return result.rows as unknown as QuestionWithDetails[];
}

export async function getQuestionsByTopic(topicId: number): Promise<Question[]> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const result = await db.execute({
    sql: "SELECT * FROM question WHERE topic_id = ? ORDER BY id",
    args: [topicId],
  });

  return result.rows as unknown as Question[];
}

export async function getQuestionById(id: number): Promise<Question | null> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const result = await db.execute({
    sql: "SELECT * FROM question WHERE id = ?",
    args: [id],
  });

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0] as unknown as Question;
}

export async function createQuestion(data: unknown): Promise<Question> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const validated = createQuestionSchema.parse(data);

  const result = await db.execute({
    sql: "INSERT INTO question (topic_id, type_id, question_data, time_limit) VALUES (?, ?, ?, ?) RETURNING *",
    args: [
      validated.topic_id,
      validated.type_id,
      JSON.stringify(validated.question_data),
      validated.time_limit || null,
    ],
  });

  revalidatePath("/dashboard");
  return result.rows[0] as unknown as Question;
}

export async function updateQuestion(data: unknown): Promise<Question> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const validated = updateQuestionSchema.parse(data);

  const result = await db.execute({
    sql: "UPDATE question SET topic_id = ?, type_id = ?, question_data = ?, time_limit = ? WHERE id = ? RETURNING *",
    args: [
      validated.topic_id,
      validated.type_id,
      JSON.stringify(validated.question_data),
      validated.time_limit || null,
      validated.id,
    ],
  });

  revalidatePath("/dashboard");
  return result.rows[0] as unknown as Question;
}

export async function deleteQuestion(id: number): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  await db.execute({
    sql: "DELETE FROM question WHERE id = ?",
    args: [id],
  });

  revalidatePath("/dashboard");
}

export async function importQuestions(jsonData: string): Promise<{ imported: number; errors: string[] }> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  let questionsData: QuestionImport[];
  try {
    questionsData = questionsImportSchema.parse(JSON.parse(jsonData));
  } catch (error) {
    throw new Error("JSON inválido: " + (error as Error).message);
  }

  const errors: string[] = [];
  let imported = 0;

  for (let i = 0; i < questionsData.length; i++) {
    try {
      const questionImport = questionsData[i];

      // Get or create course
      let courseResult = await db.execute({
        sql: "SELECT * FROM course WHERE name = ?",
        args: [questionImport.course],
      });

      let course: Course;
      if (courseResult.rows.length === 0) {
        courseResult = await db.execute({
          sql: "INSERT INTO course (name) VALUES (?) RETURNING *",
          args: [questionImport.course],
        });
        course = courseResult.rows[0] as unknown as Course;
      } else {
        course = courseResult.rows[0] as unknown as Course;
      }

      // Get or create topic
      let topicResult = await db.execute({
        sql: "SELECT * FROM topic WHERE course_id = ? AND name = ?",
        args: [course.id, questionImport.topic],
      });

      let topic: Topic;
      if (topicResult.rows.length === 0) {
        // Get next topic number
        const maxNumberResult = await db.execute({
          sql: "SELECT MAX(number) as max_number FROM topic WHERE course_id = ?",
          args: [course.id],
        });
        const maxNumber = maxNumberResult.rows[0]?.max_number as number | null;
        const nextNumber = (maxNumber || 0) + 1;

        topicResult = await db.execute({
          sql: "INSERT INTO topic (course_id, name, number) VALUES (?, ?, ?) RETURNING *",
          args: [course.id, questionImport.topic, nextNumber],
        });
        topic = topicResult.rows[0] as unknown as Topic;
      } else {
        topic = topicResult.rows[0] as unknown as Topic;
      }

      // Determine question type
      const typeId = questionImport.type === "True or False" ? 0 : 1;

      // Build question data
      const questionData =
        typeId === 0
          ? {
              question: questionImport.question,
              correct_answer: questionImport.correct_answer as boolean,
              explanation: questionImport.explanation,
            }
          : {
              question: questionImport.question,
              options: questionImport.options || [],
              correct_answer: questionImport.correct_answer as number,
              explanation: questionImport.explanation,
            };

      // Create question
      await db.execute({
        sql: "INSERT INTO question (topic_id, type_id, question_data, time_limit) VALUES (?, ?, ?, ?)",
        args: [topic.id, typeId, JSON.stringify(questionData), questionImport.time_limit || null],
      });

      imported++;
    } catch (error) {
      errors.push(`Pregunta ${i + 1}: ${(error as Error).message}`);
    }
  }

  revalidatePath("/dashboard");
  return { imported, errors };
}
