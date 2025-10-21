"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import type { QuestionWithDetails, QuestionData } from "@/types";

interface QuestionItemProps {
  question: QuestionWithDetails;
  onEdit: (question: QuestionWithDetails) => void;
  onDelete: (id: number) => void;
}

export default function QuestionItem({ question, onEdit, onDelete }: QuestionItemProps) {
  const questionData = JSON.parse(question.question_data) as QuestionData;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="outline">{question.type_name}</Badge>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {question.course_name} - {question.topic_name}
            </span>
            {question.time_limit && (
              <Badge variant="secondary">{question.time_limit}s</Badge>
            )}
          </div>
          
          <div className="prose dark:prose-invert max-w-none text-sm">
            <ReactMarkdown>{questionData.question}</ReactMarkdown>
          </div>

          {question.type_id === 0 && (
            <div className="mt-2 text-sm">
              <span className="font-medium">Respuesta correcta:</span>{" "}
              {(questionData as { correct_answer: boolean }).correct_answer ? "Verdadero" : "Falso"}
            </div>
          )}

          {question.type_id === 1 && (
            <div className="mt-2 space-y-1">
              <div className="text-sm font-medium">Opciones:</div>
              {(questionData as { options: string[] }).options.map((option, index) => (
                <div
                  key={index}
                  className={`text-sm pl-4 ${
                    index === (questionData as { correct_answer: number }).correct_answer
                      ? "font-medium text-green-600 dark:text-green-400"
                      : ""
                  }`}
                >
                  {index + 1}. {option}
                </div>
              ))}
            </div>
          )}

          {(questionData as { explanation?: string }).explanation && (
            <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
              <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">Explicación:</div>
              <div className="prose dark:prose-invert prose-sm max-w-none">
                <ReactMarkdown>{(questionData as { explanation: string }).explanation}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-2 ml-4">
          <Button size="sm" variant="outline" onClick={() => onEdit(question)}>
            Editar
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(question.id)}>
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
}
