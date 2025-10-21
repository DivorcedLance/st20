"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateExam } from "@/actions/exams";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Course, TopicWithCourse } from "@/types";

interface ExamConfigFormProps {
  courses: Course[];
  topics: TopicWithCourse[];
}

export default function ExamConfigForm({ courses, topics }: ExamConfigFormProps) {
  const router = useRouter();
  const [selectedCourseIds, setSelectedCourseIds] = useState<number[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<number[]>([]);
  const [questionCount, setQuestionCount] = useState<string>("");
  const [globalTimeLimit, setGlobalTimeLimit] = useState<string>("");
  const [useIndividualTimeLimits, setUseIndividualTimeLimits] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCourseToggle = (courseId: number) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const handleTopicToggle = (topicId: number) => {
    setSelectedTopicIds((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const filteredTopics = topics.filter((t) => selectedCourseIds.includes(t.course_id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (selectedCourseIds.length === 0) {
        throw new Error("Debes seleccionar al menos un curso");
      }

      const examQuestions = await generateExam({
        course_ids: selectedCourseIds,
        topic_ids: selectedTopicIds.length > 0 ? selectedTopicIds : undefined,
        question_count: questionCount ? parseInt(questionCount) : undefined,
        global_time_limit: globalTimeLimit ? parseInt(globalTimeLimit) : undefined,
        use_individual_time_limits: useIndividualTimeLimits,
      });

      if (examQuestions.length === 0) {
        throw new Error("No se encontraron preguntas con los criterios seleccionados");
      }

      // Store exam in session storage and navigate to take exam page
      sessionStorage.setItem("currentExam", JSON.stringify(examQuestions));
      router.push("/dashboard/exam/take");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="text-base font-semibold">Cursos *</Label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Selecciona los cursos de los que quieres incluir preguntas
          </p>
          <div className="space-y-2">
            {courses.map((course) => (
              <div key={course.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`course-${course.id}`}
                  checked={selectedCourseIds.includes(course.id)}
                  onCheckedChange={() => handleCourseToggle(course.id)}
                />
                <Label htmlFor={`course-${course.id}`} className="font-normal cursor-pointer">
                  {course.name}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {filteredTopics.length > 0 && (
          <div>
            <Label className="text-base font-semibold">
              Temas (opcional)
            </Label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Si no seleccionas ninguno, se incluirán todos los temas de los cursos seleccionados
            </p>
            <div className="space-y-2 max-h-48 overflow-y-auto p-2 border rounded">
              {filteredTopics.map((topic) => (
                <div key={topic.id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`topic-${topic.id}`}
                    checked={selectedTopicIds.includes(topic.id)}
                    onCheckedChange={() => handleTopicToggle(topic.id)}
                    className="mt-1"
                  />
                  <Label htmlFor={`topic-${topic.id}`} className="font-normal cursor-pointer text-sm leading-relaxed">
                    {topic.course_name} - {topic.number}. {topic.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="questionCount">
              Número de Preguntas (opcional)
            </Label>
            <Input
              id="questionCount"
              type="number"
              value={questionCount}
              onChange={(e) => setQuestionCount(e.target.value)}
              placeholder="Todas las disponibles"
              min="1"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Deja vacío para incluir todas las preguntas
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="globalTimeLimit">
              Tiempo Global (segundos, opcional)
            </Label>
            <Input
              id="globalTimeLimit"
              type="number"
              value={globalTimeLimit}
              onChange={(e) => setGlobalTimeLimit(e.target.value)}
              placeholder="Sin límite global"
              min="1"
              disabled={loading || useIndividualTimeLimits}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tiempo total para todo el examen
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="useIndividualTimeLimits"
            checked={useIndividualTimeLimits}
            onCheckedChange={(checked) => setUseIndividualTimeLimits(checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="useIndividualTimeLimits" className="font-normal cursor-pointer text-sm leading-relaxed">
            Usar límites de tiempo individuales de cada pregunta
          </Label>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {courses.length === 0 && (
        <Alert>
          <AlertDescription>
            Debes crear al menos un curso con preguntas antes de generar un examen
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={loading || courses.length === 0} className="w-full sm:w-auto">
        {loading ? "Generando..." : "Generar Examen"}
      </Button>
    </form>
  );
}
