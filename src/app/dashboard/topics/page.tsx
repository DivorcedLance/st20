import { getTopics } from "@/actions/topics";
import { getCourses } from "@/actions/courses";
import TopicsList from "@/components/TopicsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TopicsPage() {
  const topics = await getTopics();
  const courses = await getCourses();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Temas</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Temas</CardTitle>
        </CardHeader>
        <CardContent>
          <TopicsList initialTopics={topics} courses={courses} />
        </CardContent>
      </Card>
    </div>
  );
}
