import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourses } from "@/actions/courses";
import { getQuestions } from "@/actions/questions";

export default async function DashboardPage() {
  const courses = await getCourses();
  const questions = await getQuestions();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Bienvenido a ST20 - Sistema de Test y Evaluación
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cursos</CardTitle>
            <CardDescription>Total de cursos creados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {courses.length}
            </div>
            <Link href="/dashboard/courses">
              <Button variant="link" className="px-0 mt-2">
                Ver todos →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preguntas</CardTitle>
            <CardDescription>Total de preguntas creadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">
              {questions.length}
            </div>
            <Link href="/dashboard/questions">
              <Button variant="link" className="px-0 mt-2">
                Ver todas →
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generar Examen</CardTitle>
            <CardDescription>Crear un nuevo examen</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/exam">
              <Button className="w-full">
                Nuevo Examen
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dashboard/courses">
              <Button variant="outline" className="w-full justify-start">
                ➕ Crear Curso
              </Button>
            </Link>
            <Link href="/dashboard/topics">
              <Button variant="outline" className="w-full justify-start">
                ➕ Crear Tema
              </Button>
            </Link>
            <Link href="/dashboard/questions">
              <Button variant="outline" className="w-full justify-start">
                ➕ Crear Pregunta
              </Button>
            </Link>
            <Link href="/dashboard/questions?import=true">
              <Button variant="outline" className="w-full justify-start">
                📥 Importar Preguntas (JSON)
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas Preguntas</CardTitle>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No hay preguntas creadas aún
              </p>
            ) : (
              <div className="space-y-2">
                {questions.slice(0, 5).map((q) => (
                  <div key={q.id} className="text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {q.course_name} - {q.topic_name}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {q.type_name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
