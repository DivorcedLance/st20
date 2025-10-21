"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { QuestionWithDetails, Course, TopicWithCourse, QuestionData } from "@/types";

interface QuestionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: unknown) => Promise<void>;
  editingQuestion: QuestionWithDetails | null;
  courses: Course[];
  topics: TopicWithCourse[];
}

export default function QuestionFormDialog({
  open,
  onOpenChange,
  onSubmit,
  editingQuestion,
  courses,
  topics,
}: QuestionFormDialogProps) {
  const [topicId, setTopicId] = useState<string>("");
  const [courseId, setCourseId] = useState<string>("");
  const [typeId, setTypeId] = useState<string>("0");
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("0");
  const [explanation, setExplanation] = useState("");
  const [timeLimit, setTimeLimit] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const availableTopics = courseId
    ? topics.filter((t) => t.course_id === parseInt(courseId))
    : [];

  useEffect(() => {
    if (editingQuestion) {
      setTopicId(editingQuestion.topic_id.toString());
      const topic = topics.find((t) => t.id === editingQuestion.topic_id);
      if (topic) {
        setCourseId(topic.course_id.toString());
      }
      setTypeId(editingQuestion.type_id.toString());
      setTimeLimit(editingQuestion.time_limit?.toString() || "");

      const data = JSON.parse(editingQuestion.question_data) as QuestionData;
      setQuestionText(data.question);
      setExplanation((data as { explanation?: string }).explanation || "");

      if (editingQuestion.type_id === 0) {
        setCorrectAnswer((data as { correct_answer: boolean }).correct_answer ? "true" : "false");
      } else {
        const mcData = data as { options: string[]; correct_answer: number };
        setOptions(mcData.options);
        setCorrectAnswer(mcData.correct_answer.toString());
      }
    }
  }, [editingQuestion, topics]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let questionData;

      if (typeId === "0") {
        // True/False
        questionData = {
          question: questionText,
          correct_answer: correctAnswer === "true",
          explanation: explanation || undefined,
        };
      } else {
        // Multiple Choice
        const filteredOptions = options.filter((o) => o.trim() !== "");
        if (filteredOptions.length < 2) {
          throw new Error("Debe haber al menos 2 opciones");
        }

        questionData = {
          question: questionText,
          options: filteredOptions,
          correct_answer: parseInt(correctAnswer),
          explanation: explanation || undefined,
        };
      }

      const data = {
        ...(editingQuestion && { id: editingQuestion.id }),
        topic_id: parseInt(topicId),
        type_id: parseInt(typeId),
        question_data: questionData,
        time_limit: timeLimit ? parseInt(timeLimit) : null,
      };

      await onSubmit(data);
      resetForm();
      onOpenChange(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTopicId("");
    setCourseId("");
    setTypeId("0");
    setQuestionText("");
    setOptions(["", ""]);
    setCorrectAnswer("0");
    setExplanation("");
    setTimeLimit("");
    setError("");
  };

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open);
    if (!open && !editingQuestion) {
      resetForm();
    }
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    if (parseInt(correctAnswer) >= newOptions.length) {
      setCorrectAnswer("0");
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingQuestion ? "Editar Pregunta" : "Crear Pregunta"}</DialogTitle>
          <DialogDescription>
            Completa el formulario o pega el JSON de la pregunta
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="form">Formulario</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Curso</Label>
                  <Select value={courseId} onValueChange={setCourseId} disabled={loading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un curso" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topic">Tema</Label>
                  <Select value={topicId} onValueChange={setTopicId} disabled={loading || !courseId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tema" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTopics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id.toString()}>
                          {topic.number}. {topic.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Pregunta</Label>
                  <Select value={typeId} onValueChange={setTypeId} disabled={loading || !!editingQuestion}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Verdadero/Falso</SelectItem>
                      <SelectItem value="1">Opción Múltiple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeLimit">
                    Tiempo Límite (segundos){" "}
                    <span className="text-gray-500 font-normal">(opcional)</span>
                  </Label>
                  <Input
                    id="timeLimit"
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                    placeholder="60"
                    min="1"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="question">Pregunta (Markdown)</Label>
                <Textarea
                  id="question"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Escribe la pregunta aquí (puedes usar Markdown)..."
                  className="min-h-[100px]"
                  required
                  disabled={loading}
                />
              </div>

              {typeId === "0" ? (
                <div className="space-y-2">
                  <Label>Respuesta Correcta</Label>
                  <RadioGroup value={correctAnswer} onValueChange={setCorrectAnswer}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id="true" />
                      <Label htmlFor="true" className="font-normal cursor-pointer">
                        Verdadero
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id="false" />
                      <Label htmlFor="false" className="font-normal cursor-pointer">
                        Falso
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Opciones</Label>
                    <Button type="button" size="sm" variant="outline" onClick={addOption}>
                      + Agregar Opción
                    </Button>
                  </div>
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`option-${index}`}
                        checked={correctAnswer === index.toString()}
                        onCheckedChange={(checked) => {
                          if (checked) setCorrectAnswer(index.toString());
                        }}
                      />
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Opción ${index + 1}`}
                        className="flex-1"
                        disabled={loading}
                      />
                      {options.length > 2 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => removeOption(index)}
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="explanation">
                  Explicación (Markdown){" "}
                  <span className="text-gray-500 font-normal">(opcional)</span>
                </Label>
                <Textarea
                  id="explanation"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Explica la respuesta correcta..."
                  className="min-h-[80px]"
                  disabled={loading}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : editingQuestion ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="json">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <p className="mb-2">Funcionalidad JSON disponible en la opción de importación masiva</p>
              <Button variant="outline" onClick={() => handleOpenChange(false)}>
                Cerrar
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
