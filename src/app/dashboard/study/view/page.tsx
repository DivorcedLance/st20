"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StudyViewer from "@/components/StudyViewer";
import type { ExamQuestion } from "@/types";

export default function StudyViewPage() {
  const router = useRouter();
  const [studyQuestions, setStudyQuestions] = useState<ExamQuestion[] | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("currentStudy");
    if (!stored) {
      router.push("/dashboard/study");
      return;
    }

    try {
      const questions = JSON.parse(stored) as ExamQuestion[];
      if (questions.length === 0) {
        router.push("/dashboard/study");
        return;
      }
      setStudyQuestions(questions);
    } catch {
      router.push("/dashboard/study");
    }
  }, [router]);

  if (!studyQuestions) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12 text-gray-500 dark:text-gray-400">
        Cargando preguntas...
      </div>
    );
  }

  return <StudyViewer studyQuestions={studyQuestions} />;
}
