import { getQuestions } from "@/actions/questions";
import { getCourses } from "@/actions/courses";
import { getTopics } from "@/actions/topics";
import QuestionsList from "@/components/QuestionsList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function QuestionsPage() {
  const questions = await getQuestions();
  const courses = await getCourses();
  const topics = await getTopics();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Preguntas</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Preguntas</CardTitle>
        </CardHeader>
        <CardContent>
          <QuestionsList initialQuestions={questions} courses={courses} topics={topics} />
        </CardContent>
      </Card>
    </div>
  );
}
