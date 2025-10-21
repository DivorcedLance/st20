"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { createExamSchema, submitAnswerSchema } from "@/lib/schemas";
import type { Question, ExamQuestion, QuestionData, AnswerData, ExamResult, Answer } from "@/types";

export async function generateExam(data: unknown): Promise<ExamQuestion[]> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const validated = createExamSchema.parse(data);

  // Build query to get questions
  let sql = `
    SELECT DISTINCT q.*
    FROM question q
    JOIN topic t ON q.topic_id = t.id
    WHERE t.course_id IN (${validated.course_ids.map(() => "?").join(", ")})
  `;
  
  const args: number[] = [...validated.course_ids];

  if (validated.topic_ids && validated.topic_ids.length > 0) {
    sql += ` AND q.topic_id IN (${validated.topic_ids.map(() => "?").join(", ")})`;
    args.push(...validated.topic_ids);
  }

  sql += " ORDER BY RANDOM()";

  if (validated.question_count) {
    sql += " LIMIT ?";
    args.push(validated.question_count);
  }

  const result = await db.execute({ sql, args });
  const questions = result.rows as unknown as Question[];

  // Build exam questions with time limits
  const examQuestions: ExamQuestion[] = questions.map((q) => ({
    question: q,
    question_data: JSON.parse(q.question_data) as QuestionData,
    time_limit: validated.use_individual_time_limits 
      ? q.time_limit 
      : validated.global_time_limit || null,
  }));

  return examQuestions;
}

export async function submitAnswer(data: unknown): Promise<void> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const validated = submitAnswerSchema.parse(data);

  await db.execute({
    sql: "INSERT INTO answer (user_id, type_id, question_id, answer_data) VALUES (?, ?, ?, ?)",
    args: [
      user.id,
      validated.type_id,
      validated.question_id,
      JSON.stringify(validated.answer_data),
    ],
  });
}

export async function gradeExam(questionIds: number[]): Promise<ExamResult[]> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const results: ExamResult[] = [];

  for (const questionId of questionIds) {
    // Get question
    const questionResult = await db.execute({
      sql: "SELECT * FROM question WHERE id = ?",
      args: [questionId],
    });

    if (questionResult.rows.length === 0) {
      continue;
    }

    const question = questionResult.rows[0] as unknown as Question;
    const questionData = JSON.parse(question.question_data) as QuestionData;

    // Get user's answer
    const answerResult = await db.execute({
      sql: "SELECT * FROM answer WHERE user_id = ? AND question_id = ? ORDER BY submitted_at DESC LIMIT 1",
      args: [user.id, questionId],
    });

    if (answerResult.rows.length === 0) {
      continue;
    }

    const answer = answerResult.rows[0] as unknown as Answer;
    const answerData = JSON.parse(answer.answer_data) as AnswerData;

    // Grade answer
    let isCorrect = false;
    let correctAnswer: boolean | number;
    let explanation: string | undefined;

    if ("answer" in answerData && typeof answerData.answer === "boolean") {
      // True/False question
      const tfData = questionData as { correct_answer: boolean; explanation?: string };
      isCorrect = answerData.answer === tfData.correct_answer;
      correctAnswer = tfData.correct_answer;
      explanation = tfData.explanation;
    } else if ("answer" in answerData && typeof answerData.answer === "number") {
      // Multiple choice question
      const mcData = questionData as { correct_answer: number; explanation?: string };
      isCorrect = answerData.answer === mcData.correct_answer;
      correctAnswer = mcData.correct_answer;
      explanation = mcData.explanation;
    } else {
      correctAnswer = false;
    }

    results.push({
      question_id: questionId,
      user_answer: answerData,
      correct_answer: correctAnswer,
      is_correct: isCorrect,
      explanation,
    });
  }

  return results;
}

export async function getAnswerHistory(questionId: number): Promise<Answer[]> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("No autenticado");
  }

  const result = await db.execute({
    sql: "SELECT * FROM answer WHERE user_id = ? AND question_id = ? ORDER BY submitted_at DESC",
    args: [user.id, questionId],
  });

  return result.rows as unknown as Answer[];
}
