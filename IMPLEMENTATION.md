# ST20 - Implementación Completa

## ✅ Funcionalidades Implementadas

### 🔐 Autenticación
- Login basado únicamente en contraseña
- Creación automática de cuenta si la contraseña no existe
- Sistema de sesiones con cookies HTTP-only
- Actualización de perfil (nombre, email, cambio de contraseña)
- Hash seguro de contraseñas con bcrypt

### 📚 Gestión de Cursos
- Crear, editar y eliminar cursos
- Listado completo de cursos
- Validación de datos con Zod

### 📖 Gestión de Temas
- Crear, editar y eliminar temas
- Asociación automática con cursos
- Numeración automática de temas por curso
- Validación de unicidad por curso

### ❓ Gestión de Preguntas
- Dos tipos de preguntas:
  - Verdadero/Falso
  - Opción Múltiple
- Creación manual mediante formulario
- Importación masiva desde JSON
- Creación automática de cursos y temas al importar
- Soporte para Markdown en preguntas y explicaciones
- Tiempo límite opcional por pregunta
- Edición y eliminación de preguntas
- Filtrado por tipo de pregunta

### 📝 Sistema de Exámenes
- Generación de exámenes personalizados:
  - Selección por cursos
  - Filtrado opcional por temas
  - Límite de cantidad de preguntas
  - Tiempo global o tiempos individuales
- Realización de exámenes:
  - Interfaz intuitiva con navegación
  - Temporizador visual por pregunta
  - Indicadores de progreso
  - Avance automático al terminar el tiempo
- Calificación automática:
  - Resultados con porcentaje
  - Detalle de respuestas correctas e incorrectas
  - Mostrar explicaciones
  - Historial de respuestas

### 🎨 Interfaz de Usuario
- Diseño moderno con Tailwind CSS
- Componentes de Shadcn UI
- Modo oscuro/claro
- Diseño responsive
- Navegación intuitiva

## 🗂️ Estructura del Proyecto

```
src/
├── actions/          # Server Actions
│   ├── auth.ts
│   ├── courses.ts
│   ├── topics.ts
│   ├── questions.ts
│   └── exams.ts
├── app/              # App Router
│   ├── page.tsx                    # Login
│   ├── layout.tsx
│   └── dashboard/
│       ├── layout.tsx
│       ├── page.tsx                # Dashboard principal
│       ├── courses/page.tsx
│       ├── topics/page.tsx
│       ├── questions/page.tsx
│       ├── exam/
│       │   ├── page.tsx            # Configurar examen
│       │   └── take/page.tsx       # Realizar examen
│       └── settings/page.tsx
├── components/       # Componentes React
│   ├── ui/          # Componentes de Shadcn UI
│   ├── LoginForm.tsx
│   ├── DashboardNav.tsx
│   ├── CoursesList.tsx
│   ├── TopicsList.tsx
│   ├── QuestionsList.tsx
│   ├── QuestionItem.tsx
│   ├── QuestionFormDialog.tsx
│   ├── QuestionImportDialog.tsx
│   ├── ExamConfigForm.tsx
│   ├── ExamTaker.tsx
│   └── SettingsForm.tsx
├── lib/              # Utilidades
│   ├── db.ts        # Cliente de TursoDB
│   ├── auth.ts      # Funciones de autenticación
│   ├── schemas.ts   # Esquemas de validación Zod
│   └── utils.ts     # Utilidades generales
└── types/            # Definiciones TypeScript
    └── index.ts
```

## 🚀 Configuración e Instalación

### 1. Configurar Base de Datos

1. Crea una cuenta en [TursoDB](https://turso.tech)
2. Crea una nueva base de datos
3. Ejecuta el script SQL de `sql/db.sql` en tu base de datos:

```bash
turso db shell your-database-name < sql/db.sql
```

4. Copia las credenciales a `.env.local`:

```env
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your-auth-token
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 4. Construir para Producción

```bash
npm run build
npm start
```

## 📋 Uso de la Aplicación

### Primer Acceso
1. Ingresa cualquier contraseña en la página de login
2. Se creará automáticamente una cuenta con esa contraseña
3. Serás redirigido al dashboard

### Crear Contenido
1. **Cursos**: Ve a "Cursos" y crea tus cursos
2. **Temas**: Ve a "Temas", selecciona un curso y crea temas
3. **Preguntas**: Ve a "Preguntas" y:
   - Crea preguntas manualmente con el formulario
   - O importa preguntas masivamente con JSON

### Importar Preguntas (JSON)

Ejemplo de formato JSON para importación:

```json
[
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
]
```

### Generar y Realizar Exámenes
1. Ve a "Generar Examen"
2. Selecciona cursos (y opcionalmente temas)
3. Configura el número de preguntas y tiempo límite
4. Haz clic en "Generar Examen"
5. Responde las preguntas
6. Al finalizar, verás tus resultados con explicaciones

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 15 con App Router
- **Lenguaje**: TypeScript
- **Base de Datos**: TursoDB (SQLite en la nube) con libsql
- **Estilos**: Tailwind CSS v4
- **Componentes UI**: Shadcn UI
- **Validación**: Zod
- **Markdown**: react-markdown
- **Autenticación**: bcryptjs + cookies
- **Data Fetching**: Server Actions (no necesita SWR en esta implementación)

## 📝 Notas Importantes

### Seguridad
- Las contraseñas se almacenan con hash bcrypt
- Las sesiones usan cookies HTTP-only
- Todas las acciones del servidor validan autenticación
- Validación de datos con Zod en cliente y servidor

### Base de Datos
- SQLite con TursoDB para sincronización en la nube
- Foreign keys habilitadas para integridad referencial
- Índices optimizados para consultas frecuentes
- Cascadas para eliminación automática de datos relacionados

### Características Especiales
- Soporte completo para Markdown en preguntas y explicaciones
- Sistema de temporizadores individuales o globales
- Importación masiva con creación automática de estructura
- Interfaz responsive para móviles y tablets
- Modo oscuro/claro automático

## 🔄 Próximas Mejoras Posibles

- [ ] Historial de exámenes realizados
- [ ] Estadísticas y reportes de rendimiento
- [ ] Exportación de preguntas a PDF
- [ ] Compartir exámenes con otros usuarios
- [ ] Banco de preguntas públicas
- [ ] Soporte para imágenes en preguntas
- [ ] Más tipos de preguntas (llenar espacios, ordenar, etc.)
- [ ] Categorías y etiquetas para preguntas
- [ ] Sistema de niveles de dificultad

## 📄 Licencia

Este proyecto es de uso educativo y personal.
