"use client";

import { useState } from "react";
import { createTopic, updateTopic, deleteTopic, getNextTopicNumber } from "@/actions/topics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { TopicWithCourse, Course } from "@/types";

interface TopicsListProps {
  initialTopics: TopicWithCourse[];
  courses: Course[];
}

export default function TopicsList({ initialTopics, courses }: TopicsListProps) {
  const [topics, setTopics] = useState(initialTopics);
  const [isOpen, setIsOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<TopicWithCourse | null>(null);
  const [name, setName] = useState("");
  const [courseId, setCourseId] = useState<string>("");
  const [number, setNumber] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCourseChange = async (value: string) => {
    setCourseId(value);
    if (!editingTopic) {
      const nextNumber = await getNextTopicNumber(parseInt(value));
      setNumber(nextNumber.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (editingTopic) {
        const updated = await updateTopic({
          id: editingTopic.id,
          name,
          number: parseInt(number),
        });
        const course = courses.find((c) => c.id === editingTopic.course_id);
        setTopics(
          topics.map((t) =>
            t.id === updated.id
              ? { ...updated, course_name: course?.name || "" }
              : t
          )
        );
      } else {
        const newTopic = await createTopic({
          course_id: parseInt(courseId),
          name,
          number: parseInt(number),
        });
        const course = courses.find((c) => c.id === parseInt(courseId));
        setTopics([...topics, { ...newTopic, course_name: course?.name || "" }]);
      }
      setIsOpen(false);
      resetForm();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (topic: TopicWithCourse) => {
    setEditingTopic(topic);
    setName(topic.name);
    setCourseId(topic.course_id.toString());
    setNumber(topic.number.toString());
    setIsOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este tema? Esto eliminará todas sus preguntas.")) {
      return;
    }

    try {
      await deleteTopic(id);
      setTopics(topics.filter((t) => t.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const resetForm = () => {
    setEditingTopic(null);
    setName("");
    setCourseId("");
    setNumber("");
    setError("");
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <div className="space-y-4">
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button disabled={courses.length === 0}>Crear Tema</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTopic ? "Editar Tema" : "Crear Tema"}</DialogTitle>
            <DialogDescription>
              {editingTopic ? "Modifica el tema" : "Ingresa los datos del nuevo tema"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="course">Curso</Label>
              <Select value={courseId} onValueChange={handleCourseChange} disabled={!!editingTopic || loading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un curso" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Álgebra Lineal"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="1"
                required
                min="1"
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
                {loading ? "Guardando..." : editingTopic ? "Actualizar" : "Crear"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {courses.length === 0 && (
        <Alert>
          <AlertDescription>Debes crear al menos un curso antes de crear temas</AlertDescription>
        </Alert>
      )}

      {topics.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No hay temas creados aún</p>
      ) : (
        <div className="space-y-2">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {topic.number}. {topic.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{topic.course_name}</div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(topic)}>
                  Editar
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(topic.id)}>
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
