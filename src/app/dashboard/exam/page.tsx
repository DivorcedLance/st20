import { getCourses } from "@/actions/courses";
import { getTopics } from "@/actions/topics";
import ExamConfigForm from "@/components/ExamConfigForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ExamPage() {
  const courses = await getCourses();
  const topics = await getTopics();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Generar Examen</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Configura y genera un nuevo examen personalizado
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración del Examen</CardTitle>
        </CardHeader>
        <CardContent>
          <ExamConfigForm courses={courses} topics={topics} />
        </CardContent>
      </Card>
    </div>
  );
}
