import { z } from "zod";

// Auth schemas
export const loginSchema = z.object({
  password: z.string().min(1, "La contraseña es requerida"),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  new_password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional(),
  current_password: z.string().min(1, "La contraseña actual es requerida"),
});

// Course schemas
export const createCourseSchema = z.object({
  name: z.string().min(1, "El nombre del curso es requerido"),
});

export const updateCourseSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "El nombre del curso es requerido"),
});

// Topic schemas
export const createTopicSchema = z.object({
  course_id: z.number(),
  name: z.string().min(1, "El nombre del tema es requerido"),
  number: z.number().min(1),
});

export const updateTopicSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "El nombre del tema es requerido"),
  number: z.number().min(1),
});

// Question schemas
export const trueFalseQuestionDataSchema = z.object({
  question: z.string().min(1, "La pregunta es requerida"),
  correct_answer: z.boolean(),
  explanation: z.string().optional(),
});

export const multipleChoiceQuestionDataSchema = z.object({
  question: z.string().min(1, "La pregunta es requerida"),
  options: z.array(z.string()).min(2, "Debe haber al menos 2 opciones"),
  correct_answer: z.number().min(0),
  explanation: z.string().optional(),
});

export const createQuestionSchema = z.object({
  topic_id: z.number(),
  type_id: z.number().min(0).max(1),
  question_data: z.union([trueFalseQuestionDataSchema, multipleChoiceQuestionDataSchema]),
  time_limit: z.number().min(1).optional().nullable(),
});

export const updateQuestionSchema = z.object({
  id: z.number(),
  topic_id: z.number(),
  type_id: z.number().min(0).max(1),
  question_data: z.union([trueFalseQuestionDataSchema, multipleChoiceQuestionDataSchema]),
  time_limit: z.number().min(1).optional().nullable(),
});

// Answer schemas
export const trueFalseAnswerDataSchema = z.object({
  answer: z.boolean(),
});

export const multipleChoiceAnswerDataSchema = z.object({
  answer: z.number().min(0),
});

export const submitAnswerSchema = z.object({
  question_id: z.number(),
  type_id: z.number().min(0).max(1),
  answer_data: z.union([trueFalseAnswerDataSchema, multipleChoiceAnswerDataSchema]),
});

// Exam schemas
export const createExamSchema = z.object({
  course_ids: z.array(z.number()).min(1, "Debe seleccionar al menos un curso"),
  topic_ids: z.array(z.number()).optional(),
  question_count: z.number().min(1).optional(),
  global_time_limit: z.number().min(1).optional(),
  use_individual_time_limits: z.boolean().default(true),
});

// Import schemas
export const questionImportSchema = z.object({
  course: z.string().min(1),
  topic: z.string().min(1),
  type: z.enum(["True or False", "Multiple Choice"]),
  question: z.string().min(1),
  options: z.array(z.string()).optional(),
  correct_answer: z.union([z.boolean(), z.number()]),
  explanation: z.string().optional(),
  time_limit: z.number().min(1).optional(),
});

export const questionsImportSchema = z.array(questionImportSchema);
