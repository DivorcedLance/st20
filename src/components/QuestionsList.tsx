"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createQuestion, updateQuestion, deleteQuestion, importQuestions } from "@/actions/questions";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuestionFormDialog from "@/components/QuestionFormDialog";
import QuestionImportDialog from "@/components/QuestionImportDialog";
import QuestionItem from "@/components/QuestionItem";
import type { QuestionWithDetails, Course, TopicWithCourse } from "@/types";

interface QuestionsListProps {
  initialQuestions: QuestionWithDetails[];
  courses: Course[];
  topics: TopicWithCourse[];
}

export default function QuestionsList({ initialQuestions, courses, topics }: QuestionsListProps) {
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState(initialQuestions);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(searchParams.get("import") === "true");
  const [editingQuestion, setEditingQuestion] = useState<QuestionWithDetails | null>(null);

  const handleCreate = async (data: unknown) => {
    await createQuestion(data);
    // Reload to get full details
    window.location.reload();
  };

  const handleUpdate = async (data: unknown) => {
    await updateQuestion(data);
    window.location.reload();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta pregunta?")) {
      return;
    }

    try {
      await deleteQuestion(id);
      setQuestions(questions.filter((q) => q.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleImport = async (jsonData: string) => {
    const result = await importQuestions(jsonData);
    if (result.errors.length > 0) {
      alert(`Importadas: ${result.imported}\nErrores:\n${result.errors.join("\n")}`);
    } else {
      alert(`Se importaron ${result.imported} preguntas exitosamente`);
    }
    window.location.reload();
  };

  const handleEdit = (question: QuestionWithDetails) => {
    setEditingQuestion(question);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Button onClick={() => setIsFormOpen(true)} disabled={topics.length === 0}>
          Crear Pregunta
        </Button>
        <Button variant="outline" onClick={() => setIsImportOpen(true)}>
          Importar JSON
        </Button>
      </div>

      <QuestionFormDialog
        open={isFormOpen}
        onOpenChange={(open: boolean) => {
          setIsFormOpen(open);
          if (!open) setEditingQuestion(null);
        }}
        onSubmit={editingQuestion ? handleUpdate : handleCreate}
        editingQuestion={editingQuestion}
        courses={courses}
        topics={topics}
      />

      <QuestionImportDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImport={handleImport}
      />

      {topics.length === 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Debes crear al menos un tema antes de crear preguntas
        </div>
      )}

      {questions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No hay preguntas creadas aún</p>
      ) : (
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">Todas ({questions.length})</TabsTrigger>
            <TabsTrigger value="tf">
              Verdadero/Falso ({questions.filter((q) => q.type_id === 0).length})
            </TabsTrigger>
            <TabsTrigger value="mc">
              Opción Múltiple ({questions.filter((q) => q.type_id === 1).length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-2 mt-4">
            {questions.map((question) => (
              <QuestionItem
                key={question.id}
                question={question}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="tf" className="space-y-2 mt-4">
            {questions
              .filter((q) => q.type_id === 0)
              .map((question) => (
                <QuestionItem
                  key={question.id}
                  question={question}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
          </TabsContent>
          
          <TabsContent value="mc" className="space-y-2 mt-4">
            {questions
              .filter((q) => q.type_id === 1)
              .map((question) => (
                <QuestionItem
                  key={question.id}
                  question={question}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
