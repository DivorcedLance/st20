"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ExamTaker from "@/components/ExamTaker";
import type { ExamQuestion } from "@/types";

export default function TakeExamPage() {
  const router = useRouter();
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[] | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("currentExam");
    if (!stored) {
      router.push("/dashboard/exam");
      return;
    }

    try {
      const questions = JSON.parse(stored) as ExamQuestion[];
      setExamQuestions(questions);
    } catch (error) {
      console.error("Error loading exam:", error);
      router.push("/dashboard/exam");
    }
  }, [router]);

  if (!examQuestions) {
    return <div>Cargando examen...</div>;
  }

  return <ExamTaker examQuestions={examQuestions} />;
}
