"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import type { ExamQuestion } from "@/types";

interface StudyViewerProps {
  studyQuestions: ExamQuestion[];
}

export default function StudyViewer({ studyQuestions }: StudyViewerProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));

  const markVisited = (index: number) => {
    if (!visitedQuestions.has(index)) {
      setVisitedQuestions((prev) => new Set(prev).add(index));
    }
    setCurrentIndex(index);
  };

  const current = studyQuestions[currentIndex];
  const data = current.question_data;

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Pregunta {currentIndex + 1} de {studyQuestions.length}
        </h1>
      </div>

      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-1 px-1">
        {current.course_name} &mdash; {current.topic_name}
      </div>

      <Card>
        <CardHeader>
          <Badge variant="outline" className="self-start">
            {current.question.type_id === 0 ? "Verdadero/Falso" : "Opción Múltiple"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="prose dark:prose-invert max-w-none text-sm md:text-base">
            <ReactMarkdown>{data.question}</ReactMarkdown>
          </div>

          {current.question.type_id === 0 ? (
            <div className="space-y-2">
              <div className={`p-3 rounded-lg border-2 flex items-center gap-2 ${
                (data as { correct_answer: boolean }).correct_answer
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}>
                <span className={`text-base ${
                  (data as { correct_answer: boolean }).correct_answer
                    ? "font-bold"
                    : "font-normal"
                }`}>Verdadero</span>
                {(data as { correct_answer: boolean }).correct_answer && (
                  <Badge variant="default" className="ml-auto">Correcta</Badge>
                )}
              </div>
              <div className={`p-3 rounded-lg border-2 flex items-center gap-2 ${
                !(data as { correct_answer: boolean }).correct_answer
                  ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                  : "border-gray-200 dark:border-gray-700"
              }`}>
                <span className={`text-base ${
                  !(data as { correct_answer: boolean }).correct_answer
                    ? "font-bold"
                    : "font-normal"
                }`}>Falso</span>
                {!(data as { correct_answer: boolean }).correct_answer && (
                  <Badge variant="default" className="ml-auto">Correcta</Badge>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {(data as { options: string[]; correct_answer: number }).options.map((option, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 flex items-center gap-2 ${
                    index === (data as { correct_answer: number }).correct_answer
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <span className={`text-base ${
                    index === (data as { correct_answer: number }).correct_answer
                      ? "font-bold"
                      : "font-normal"
                  }`}>{option}</span>
                  {index === (data as { correct_answer: number }).correct_answer && (
                    <Badge variant="default" className="ml-auto">Correcta</Badge>
                  )}
                </div>
              ))}
            </div>
          )}

          {(data as { explanation?: string }).explanation && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
              <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">Explicación:</div>
              <div className="prose dark:prose-invert prose-sm max-w-none">
                <ReactMarkdown>{(data as { explanation: string }).explanation}</ReactMarkdown>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => markVisited(currentIndex - 1)}
          disabled={currentIndex === 0}
        >
          ← Anterior
        </Button>

        <div className="flex items-center gap-1 overflow-x-auto max-w-[40vw] md:max-w-md">
          {(() => {
            const total = studyQuestions.length;
            const pages: (number | "ellipsis")[] = [];

            if (total <= 7) {
              for (let i = 0; i < total; i++) pages.push(i);
            } else {
              pages.push(0);
              if (currentIndex > 2) pages.push("ellipsis");
              const start = Math.max(1, currentIndex - 1);
              const end = Math.min(total - 2, currentIndex + 1);
              for (let i = start; i <= end; i++) pages.push(i);
              if (currentIndex < total - 3) pages.push("ellipsis");
              pages.push(total - 1);
            }

            return pages.map((page, i) =>
              page === "ellipsis" ? (
                <span key={`e-${i}`} className="px-0.5 text-gray-400 text-sm">...</span>
              ) : (
                <button
                  key={page}
                  onClick={() => markVisited(page)}
                  className={`w-8 h-8 rounded-full border-2 text-sm transition-colors flex-shrink-0 ${
                    page === currentIndex
                      ? "bg-blue-600 text-white border-blue-600"
                      : visitedQuestions.has(page)
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {page + 1}
                </button>
              )
            );
          })()}
          {studyQuestions.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
              <span>vista</span>
              <span className="w-2.5 h-2.5 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 inline-block ml-0.5" />
              <span>pendiente</span>
            </div>
          )}
        </div>

        {currentIndex === studyQuestions.length - 1 ? (
          <Button onClick={() => router.push("/dashboard/study")} className="whitespace-nowrap">
            Nuevo Estudio
          </Button>
        ) : (
          <Button onClick={() => markVisited(currentIndex + 1)}>
            Siguiente →
          </Button>
        )}
      </div>
    </div>
  );
}
