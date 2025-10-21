Eres un generador de ítems de evaluación. A partir del material que te proporcionaré, debes:

1. Identificar el **curso** y proponer **tópicos** (temas) por semana con el formato:
   **"Semana {N} – {título breve}"** (por ejemplo: `"Semana 1 – Introducción al EIA"`).
2. Para cada tópico, generar **preguntas** de dos tipos:

   * **True/False** (`type_id = 0`)
   * **Multiple Choice** (`type_id = 1`) con 3–5 opciones y **solo una** correcta.
3. Completar `time_limit` (segundos) o `null` si no aplica.
4. Responder **solo** con el **JSON** en el formato indicado (sin texto adicional, sin comentarios).
5. No incluyas `id` en ningún objeto (la BD los autogenera).
6. `topic.number` es entero que **comienza en 1** y es **único por curso**. Si el material está organizado por semanas, `number` debe coincidir con la semana (Semana 1 → `number: 1`, etc.). Si faltan semanas, numera secuencialmente.
7. Usa **español** en enunciados y opciones. No inventes contenido fuera del material.
8. En Multiple Choice, `correct_option_id` debe coincidir con uno de los `options.id`.

### Formato de salida (JSON único)

```json
{
  "course": {
    "name": "string"
  },
  "topics": [
    {
      "number": 1,
      "name": "Semana 1 – Título del tema",
      "questions": [
        {
          "type_id": 0,
          "question_data": {
            "statement": "string",
            "correctanswer": true
          },
          "time_limit": 60
        },
        {
          "type_id": 1,
          "question_data": {
            "statement": "string",
            "options": [
              { "id": 1, "content": "string" },
              { "id": 2, "content": "string" },
              { "id": 3, "content": "string" }
            ],
            "correct_option_id": 2
          },
          "time_limit": null
        }
      ]
    }
  ]
}
```

### Cantidad sugerida

* **2–5 tópicos** (semanas).
* **4–8 preguntas** por tópico (mezcla de ambos tipos).

### Material del curso

[PEGA AQUÍ EL MATERIAL O MATERIALES DEL CURSO]

---

## Ejemplo de salida (ficticio y breve)

```json
{
  "course": {
    "name": "Evaluación de Impacto Ambiental (EIA)"
  },
  "topics": [
    {
      "number": 1,
      "name": "Semana 1 – Introducción al EIA",
      "questions": [
        {
          "type_id": 0,
          "question_data": {
            "statement": "El EIA busca identificar, predecir y valorar los impactos ambientales de un proyecto antes de su ejecución.",
            "correctanswer": true
          },
          "time_limit": 45
        },
        {
          "type_id": 1,
          "question_data": {
            "statement": "¿Cuál es un objetivo central del EIA?",
            "options": [
              { "id": 1, "content": "Maximizar el presupuesto del proyecto." },
              { "id": 2, "content": "Prevenir o mitigar impactos ambientales significativos." },
              { "id": 3, "content": "Acelerar la construcción sin controles." }
            ],
            "correct_option_id": 2
          },
          "time_limit": null
        }
      ]
    },
    {
      "number": 2,
      "name": "Semana 2 – Marco legal y actores",
      "questions": [
        {
          "type_id": 0,
          "question_data": {
            "statement": "El marco legal del EIA define responsabilidades y procedimientos para proponentes y autoridades.",
            "correctanswer": true
          },
          "time_limit": 60
        },
        {
          "type_id": 1,
          "question_data": {
            "statement": "¿Qué actor suele emitir la aprobación final de un EIA?",
            "options": [
              { "id": 1, "content": "La autoridad ambiental competente." },
              { "id": 2, "content": "El contratista de obra." },
              { "id": 3, "content": "El auditor financiero del proyecto." },
              { "id": 4, "content": "La empresa supervisora de seguridad privada." }
            ],
            "correct_option_id": 1
          },
          "time_limit": 50
        }
      ]
    }
  ]
}
```