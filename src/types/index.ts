// User types
export interface User {
  id: number;
  email: string | null;
  name: string | null;
  profile_picture_url: string | null;
  password: string;
}

// Course types
export interface Course {
  id: number;
  name: string;
}

// Topic types
export interface Topic {
  id: number;
  number: number;
  name: string;
  course_id: number;
}

export interface TopicWithCourse extends Topic {
  course_name: string;
}

// Question types
export enum QuestionTypeEnum {
  TRUE_FALSE = 0,
  MULTIPLE_CHOICE = 1,
}

export interface QuestionType {
  id: QuestionTypeEnum;
  name: string;
}

// Question data structures
export interface TrueFalseQuestionData {
  question: string;
  correct_answer: boolean;
  explanation?: string;
}

export interface MultipleChoiceQuestionData {
  question: string;
  options: string[];
  correct_answer: number; // index of correct option
  explanation?: string;
}

export type QuestionData = TrueFalseQuestionData | MultipleChoiceQuestionData;

export interface Question {
  id: number;
  topic_id: number;
  type_id: QuestionTypeEnum;
  question_data: string; // JSON string
  time_limit: number | null;
}

export interface QuestionWithDetails extends Question {
  topic_name: string;
  course_name: string;
  type_name: string;
}

// Answer types
export interface TrueFalseAnswerData {
  answer: boolean;
}

export interface MultipleChoiceAnswerData {
  answer: number; // index of selected option
}

export type AnswerData = TrueFalseAnswerData | MultipleChoiceAnswerData;

export interface Answer {
  id: number;
  user_id: number;
  type_id: QuestionTypeEnum;
  question_id: number;
  answer_data: string; // JSON string
  submitted_at: string;
}

// Exam types
export interface ExamConfig {
  course_ids: number[];
  topic_ids: number[];
  question_count?: number;
  global_time_limit?: number; // in seconds, overrides individual question time limits
  use_individual_time_limits: boolean;
}

export interface ExamQuestion {
  question: Question;
  question_data: QuestionData;
  time_limit: number | null;
}

export interface ExamResult {
  question_id: number;
  user_answer: AnswerData;
  correct_answer: boolean | number;
  is_correct: boolean;
  explanation?: string;
}

// JSON import structure
export interface QuestionImport {
  course: string;
  topic: string;
  type: "True or False" | "Multiple Choice";
  question: string;
  options?: string[];
  correct_answer: boolean | number;
  explanation?: string;
  time_limit?: number;
}
