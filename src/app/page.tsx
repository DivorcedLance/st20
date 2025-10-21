import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function Home() {
  const user = await getCurrentUser();
  
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">ST20</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sistema de Test y Evaluación
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
