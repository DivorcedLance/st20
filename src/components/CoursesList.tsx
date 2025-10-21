"use client";

import { useState } from "react";
import { createCourse, updateCourse, deleteCourse } from "@/actions/courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Course } from "@/types";

interface CoursesListProps {
  initialCourses: Course[];
}

export default function CoursesList({ initialCourses }: CoursesListProps) {
  const [courses, setCourses] = useState(initialCourses);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (editingCourse) {
        const updated = await updateCourse({ id: editingCourse.id, name });
        setCourses(courses.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const newCourse = await createCourse({ name });
        setCourses([...courses, newCourse]);
      }
      setIsOpen(false);
      setName("");
      setEditingCourse(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setName(course.name);
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este curso? Esto eliminará todos sus temas y preguntas.")) {
      return;
    }

    try {
      await deleteCourse(id);
      setCourses(courses.filter((c) => c.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEditingCourse(null);
      setName("");
      setError("");
    }
  };

  return (
    <div className="space-y-4">
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button>Crear Curso</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCourse ? "Editar Curso" : "Crear Curso"}</DialogTitle>
            <DialogDescription>
              {editingCourse ? "Modifica el nombre del curso" : "Ingresa el nombre del nuevo curso"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Matemáticas"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : editingCourse ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {courses.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No hay cursos creados aún</p>
      ) : (
        <div className="space-y-2">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <span className="font-medium text-gray-900 dark:text-white">{course.name}</span>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(course)} className="flex-1 sm:flex-none">
                  Editar
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(course.id)} className="flex-1 sm:flex-none">
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
