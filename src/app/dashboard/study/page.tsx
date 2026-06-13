import { getCourses } from "@/actions/courses";
import { getTopics } from "@/actions/topics";
import StudyConfigForm from "@/components/StudyConfigForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function StudyPage() {
  const courses = await getCourses();
  const topics = await getTopics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Modo Estudio</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Selecciona los cursos y temas que quieres repasar. Las preguntas se mostrarán con su respuesta correcta.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Estudio</CardTitle>
        </CardHeader>
        <CardContent>
          <StudyConfigForm courses={courses} topics={topics} />
        </CardContent>
      </Card>
    </div>
  );
}
