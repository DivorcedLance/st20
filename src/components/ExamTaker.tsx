"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitAnswer, gradeExam } from "@/actions/exams";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReactMarkdown from "react-markdown";
import type { ExamQuestion, ExamResult } from "@/types";

interface ExamTakerProps {
  examQuestions: ExamQuestion[];
}

export default function ExamTaker({ examQuestions }: ExamTakerProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, unknown>>(new Map());
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<ExamResult[] | null>(null);

  const currentExamQuestion = examQuestions[currentQuestionIndex];
  const currentQuestion = currentExamQuestion.question;
  const currentData = currentExamQuestion.question_data;

  useEffect(() => {
    if (!currentExamQuestion.time_limit || results) return;

    setTimeRemaining(currentExamQuestion.time_limit);

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          // Auto-advance when time runs out
          if (currentQuestionIndex < examQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, results]);

  const handleAnswer = (answer: unknown) => {
    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.id, answer);
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeRemaining(null);
    } else {
      await handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setTimeRemaining(null);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Submit all answers
      for (const [questionId, answer] of answers.entries()) {
        const question = examQuestions.find((eq) => eq.question.id === questionId);
        if (!question) continue;

        let answerData;
        if (question.question.type_id === 0) {
          answerData = { answer: answer as boolean };
        } else {
          answerData = { answer: answer as number };
        }

        await submitAnswer({
          question_id: questionId,
          type_id: question.question.type_id,
          answer_data: answerData,
        });
      }

      // Grade exam
      const questionIds = examQuestions.map((eq) => eq.question.id);
      const examResults = await gradeExam(questionIds);
      setResults(examResults);
    } catch (error) {
      alert("Error al enviar el examen: " + (error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (results) {
    const correctCount = results.filter((r) => r.is_correct).length;
    const percentage = (correctCount / results.length) * 100;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Resultados del Examen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                {percentage.toFixed(1)}%
              </div>
              <div className="text-xl text-gray-600 dark:text-gray-400 mt-2">
                {correctCount} de {results.length} correctas
              </div>
            </div>

            <div className="space-y-4">
              {results.map((result, index) => {
                const examQuestion = examQuestions.find((eq) => eq.question.id === result.question_id);
                if (!examQuestion) return null;

                const questionData = examQuestion.question_data;

                return (
                  <Card key={result.question_id} className={result.is_correct ? "border-green-500" : "border-red-500"}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">Pregunta {index + 1}</CardTitle>
                        <Badge variant={result.is_correct ? "default" : "destructive"}>
                          {result.is_correct ? "✓ Correcta" : "✗ Incorrecta"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="prose dark:prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{questionData.question}</ReactMarkdown>
                      </div>

                      {examQuestion.question.type_id === 0 ? (
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="font-medium">Tu respuesta:</span>{" "}
                            {(result.user_answer as { answer: boolean }).answer ? "Verdadero" : "Falso"}
                          </div>
                          {!result.is_correct && (
                            <div className="text-green-600 dark:text-green-400">
                              <span className="font-medium">Respuesta correcta:</span>{" "}
                              {result.correct_answer ? "Verdadero" : "Falso"}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="font-medium">Tu respuesta:</span>{" "}
                            {(questionData as { options: string[] }).options[(result.user_answer as { answer: number }).answer]}
                          </div>
                          {!result.is_correct && (
                            <div className="text-green-600 dark:text-green-400">
                              <span className="font-medium">Respuesta correcta:</span>{" "}
                              {(questionData as { options: string[] }).options[result.correct_answer as number]}
                            </div>
                          )}
                        </div>
                      )}

                      {result.explanation && (
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                          <div className="font-medium text-blue-900 dark:text-blue-100 mb-1">Explicación:</div>
                          <div className="prose dark:prose-invert prose-sm max-w-none">
                            <ReactMarkdown>{result.explanation}</ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="flex justify-center mt-6">
              <Button onClick={() => router.push("/dashboard/exam")}>
                Generar Nuevo Examen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Pregunta {currentQuestionIndex + 1} de {examQuestions.length}
        </h1>
        {timeRemaining !== null && (
          <Badge variant={timeRemaining < 10 ? "destructive" : "default"} className="text-lg px-4 py-2">
            ⏱ {timeRemaining}s
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">{currentQuestion.type_id === 0 ? "Verdadero/Falso" : "Opción Múltiple"}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{currentData.question}</ReactMarkdown>
          </div>

          {currentQuestion.type_id === 0 ? (
            <RadioGroup
              value={answers.get(currentQuestion.id)?.toString() || ""}
              onValueChange={(value) => handleAnswer(value === "true")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true" className="font-normal cursor-pointer text-lg">
                  Verdadero
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false" className="font-normal cursor-pointer text-lg">
                  Falso
                </Label>
              </div>
            </RadioGroup>
          ) : (
            <RadioGroup
              value={answers.get(currentQuestion.id)?.toString() || ""}
              onValueChange={(value) => handleAnswer(parseInt(value))}
            >
              {(currentData as { options: string[] }).options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="font-normal cursor-pointer text-base">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              ← Anterior
            </Button>

            {answers.get(currentQuestion.id) === undefined && (
              <Alert className="flex-1 mx-4">
                <AlertDescription>Selecciona una respuesta</AlertDescription>
              </Alert>
            )}

            {currentQuestionIndex === examQuestions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={!answers.has(currentQuestion.id) || isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Finalizar Examen"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!answers.has(currentQuestion.id)}
              >
                Siguiente →
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <div className="flex flex-wrap gap-2">
          {examQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentQuestionIndex(index);
                setTimeRemaining(null);
              }}
              className={`w-10 h-10 rounded-full border-2 transition-colors ${
                index === currentQuestionIndex
                  ? "bg-blue-600 text-white border-blue-600"
                  : answers.has(examQuestions[index].question.id)
                  ? "bg-green-100 dark:bg-green-900 border-green-600"
                  : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
