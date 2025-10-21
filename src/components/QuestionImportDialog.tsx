"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface QuestionImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (jsonData: string) => Promise<void>;
}

export default function QuestionImportDialog({
  open,
  onOpenChange,
  onImport,
}: QuestionImportDialogProps) {
  const [jsonData, setJsonData] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onImport(jsonData);
      setJsonData("");
      onOpenChange(false);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const exampleJson = `[
  {
    "course": "Matemáticas",
    "topic": "Álgebra",
    "type": "Multiple Choice",
    "question": "¿Cuál es el resultado de 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "correct_answer": 1,
    "explanation": "La suma de 2 + 2 es 4",
    "time_limit": 30
  },
  {
    "course": "Historia",
    "topic": "Historia Universal",
    "type": "True or False",
    "question": "La Segunda Guerra Mundial terminó en 1945",
    "correct_answer": true,
    "explanation": "La guerra terminó el 2 de septiembre de 1945"
  }
]`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Preguntas desde JSON</DialogTitle>
          <DialogDescription>
            Pega el JSON con las preguntas. Se crearán automáticamente los cursos y temas si no existen.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="json">JSON</Label>
            <Textarea
              id="json"
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              placeholder="Pega aquí el JSON..."
              className="font-mono text-sm min-h-[200px]"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label>Ejemplo de formato:</Label>
            <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
              {exampleJson}
            </pre>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Importando..." : "Importar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
