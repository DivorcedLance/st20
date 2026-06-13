"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitAnswer } from "@/actions/exams";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReactMarkdown from "react-markdown";
import type { ExamQuestion, ExamResult, AnswerData } from "@/types";

interface ExamTakerProps {
  examQuestions: ExamQuestion[];
}

interface QuestionFeedback {
  isCorrect: boolean;
  correctAnswer: boolean | number;
  explanation?: string;
}

export default function ExamTaker({ examQuestions }: ExamTakerProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<number, unknown>>(new Map());
  const [questionFeedback, setQuestionFeedback] = useState<Map<number, QuestionFeedback>>(new Map());
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<ExamResult[] | null>(null);

  const currentExamQuestion = examQuestions[currentQuestionIndex];
  const currentQuestion = currentExamQuestion.question;
  const currentData = currentExamQuestion.question_data;
  const currentFeedback = questionFeedback.get(currentQuestion.id);

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

  const evaluateAnswer = (questionId: number, answer: unknown): QuestionFeedback => {
    const eq = examQuestions.find((eq) => eq.question.id === questionId)!;
    const data = eq.question_data;

    if (eq.question.type_id === 0) {
      const tfData = data as { correct_answer: boolean; explanation?: string };
      const answerBool = answer as boolean;
      return {
        isCorrect: answerBool === tfData.correct_answer,
        correctAnswer: tfData.correct_answer,
        explanation: tfData.explanation,
      };
    } else {
      const mcData = data as { correct_answer: number; explanation?: string };
      const answerNum = answer as number;
      return {
        isCorrect: answerNum === mcData.correct_answer,
        correctAnswer: mcData.correct_answer,
        explanation: mcData.explanation,
      };
    }
  };

  const handleAnswer = (answer: unknown) => {
    if (currentFeedback) return;

    const newAnswers = new Map(answers);
    newAnswers.set(currentQuestion.id, answer);
    setAnswers(newAnswers);

    const feedback = evaluateAnswer(currentQuestion.id, answer);
    const newFeedback = new Map(questionFeedback);
    newFeedback.set(currentQuestion.id, feedback);
    setQuestionFeedback(newFeedback);
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

      const examResults: ExamResult[] = examQuestions.reduce<ExamResult[]>((acc, eq) => {
          const feedback = questionFeedback.get(eq.question.id);
          if (!feedback) return acc;

          const answer = answers.get(eq.question.id);
          const userAnswer: AnswerData = typeof answer === "boolean"
            ? { answer: answer }
            : { answer: answer as number };

          acc.push({
            question_id: eq.question.id,
            user_answer: userAnswer,
            correct_answer: feedback.correctAnswer,
            is_correct: feedback.isCorrect,
            explanation: feedback.explanation,
          });
          return acc;
        }, []);

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
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Resultados del Examen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400">
                {percentage.toFixed(1)}%
              </div>
              <div className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mt-2">
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
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <CardTitle className="text-sm md:text-base">Pregunta {index + 1}</CardTitle>
                        <Badge variant={result.is_correct ? "default" : "destructive"} className="self-start">
                          {result.is_correct ? "✓ Correcta" : "✗ Incorrecta"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="prose dark:prose-invert prose-sm max-w-none text-sm md:text-base">
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
              <Button onClick={() => router.push("/dashboard/exam")} className="w-full sm:w-auto">
                Generar Nuevo Examen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Pregunta {currentQuestionIndex + 1} de {examQuestions.length}
        </h1>
        {timeRemaining !== null && (
          <Badge variant={timeRemaining < 10 ? "destructive" : "default"} className="text-base md:text-lg px-3 md:px-4 py-1 md:py-2 self-start sm:self-auto">
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
        <CardContent className="space-y-4 md:space-y-6">
          <div className="prose dark:prose-invert max-w-none text-sm md:text-base">
            <ReactMarkdown>{currentData.question}</ReactMarkdown>
          </div>

          {currentQuestion.type_id === 0 ? (
            <RadioGroup
              value={answers.get(currentQuestion.id)?.toString() || ""}
              onValueChange={(value) => handleAnswer(value === "true")}
              disabled={!!currentFeedback}
            >
              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true" className="font-normal cursor-pointer text-base md:text-lg flex-1">
                  Verdadero
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false" className="font-normal cursor-pointer text-base md:text-lg flex-1">
                  Falso
                </Label>
              </div>
            </RadioGroup>
          ) : (
            <RadioGroup
              value={answers.get(currentQuestion.id)?.toString() || ""}
              onValueChange={(value) => handleAnswer(parseInt(value))}
              disabled={!!currentFeedback}
            >
              {(currentData as { options: string[] }).options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="font-normal cursor-pointer text-sm md:text-base flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentFeedback && (
            <div className={`p-4 rounded-lg border-2 ${
              currentFeedback.isCorrect
                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                : "border-red-500 bg-red-50 dark:bg-red-900/20"
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={currentFeedback.isCorrect ? "default" : "destructive"}>
                  {currentFeedback.isCorrect ? "✓ Correcta" : "✗ Incorrecta"}
                </Badge>
              </div>

              {!currentFeedback.isCorrect && (
                <div className="text-sm mb-2">
                  <span className="font-medium">Respuesta correcta:</span>{" "}
                  {currentQuestion.type_id === 0
                    ? (currentFeedback.correctAnswer ? "Verdadero" : "Falso")
                    : (currentData as { options: string[] }).options[currentFeedback.correctAnswer as number]
                  }
                </div>
              )}

              {currentFeedback.explanation && (
                <div className="text-sm">
                  <div className="font-medium mb-1">Explicación:</div>
                  <div className="prose dark:prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{currentFeedback.explanation}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="w-full sm:w-auto"
            >
              ← Anterior
            </Button>

            {answers.get(currentQuestion.id) === undefined && (
              <Alert className="sm:flex-1 sm:mx-4">
                <AlertDescription className="text-sm">Selecciona una respuesta</AlertDescription>
              </Alert>
            )}

            {currentQuestionIndex === examQuestions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={!answers.has(currentQuestion.id) || isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? "Enviando..." : "Finalizar Examen"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!answers.has(currentQuestion.id)}
                className="w-full sm:w-auto"
              >
                Siguiente →
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-wrap gap-2 justify-center">
          {examQuestions.map((_, index) => {
            const feedback = questionFeedback.get(examQuestions[index].question.id);
            return (
              <button
                key={index}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  setTimeRemaining(null);
                }}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-colors text-sm sm:text-base ${
                  index === currentQuestionIndex
                    ? "bg-blue-600 text-white border-blue-600"
                    : feedback
                    ? feedback.isCorrect
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-red-500 text-white border-red-500"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-center gap-3 text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            correcta
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            incorrecta
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 inline-block" />
            sin responder
          </span>
        </div>
      </div>
    </div>
  );
}
