import { getCourses } from "@/actions/courses";
import CoursesList from "@/components/CoursesList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Cursos</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Cursos</CardTitle>
        </CardHeader>
        <CardContent>
          <CoursesList initialCourses={courses} />
        </CardContent>
      </Card>
    </div>
  );
}
