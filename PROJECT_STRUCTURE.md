# 📁 Estructura del Proyecto ST20

```
st20/
│
├── 📄 .env.local                    # Variables de entorno (TursoDB)
├── 📄 .gitignore                    # Archivos ignorados por Git
├── 📄 package.json                  # Dependencias del proyecto
├── 📄 tsconfig.json                 # Configuración de TypeScript
├── 📄 next.config.ts                # Configuración de Next.js
├── 📄 postcss.config.mjs            # Configuración de PostCSS
├── 📄 eslint.config.mjs             # Configuración de ESLint
├── 📄 components.json               # Configuración de Shadcn UI
│
├── 📚 README.md                     # Descripción original del proyecto
├── 📚 IMPLEMENTATION.md             # Documentación completa
├── 📚 QUICKSTART.md                 # Guía de inicio rápido
├── 📚 TURSO_SETUP.md               # Guía de configuración TursoDB
├── 📚 COMPLETED.md                  # Resumen de implementación
│
├── 📁 sql/
│   ├── db.sql                       # Schema de la base de datos
│   └── sample_data.json             # Datos de ejemplo para importar
│
├── 📁 src/
│   │
│   ├── 📁 app/                      # App Router de Next.js
│   │   ├── 📄 page.tsx              # ⭐ Página de Login
│   │   ├── 📄 layout.tsx            # Layout principal
│   │   ├── 📄 globals.css           # Estilos globales
│   │   │
│   │   └── 📁 dashboard/            # Área autenticada
│   │       ├── 📄 layout.tsx        # Layout del dashboard
│   │       ├── 📄 page.tsx          # 📊 Dashboard principal
│   │       │
│   │       ├── 📁 courses/
│   │       │   └── 📄 page.tsx      # 📚 Gestión de cursos
│   │       │
│   │       ├── 📁 topics/
│   │       │   └── 📄 page.tsx      # 📖 Gestión de temas
│   │       │
│   │       ├── 📁 questions/
│   │       │   └── 📄 page.tsx      # ❓ Gestión de preguntas
│   │       │
│   │       ├── 📁 exam/
│   │       │   ├── 📄 page.tsx      # ⚙️ Configurar examen
│   │       │   └── 📁 take/
│   │       │       └── 📄 page.tsx  # 📝 Realizar examen
│   │       │
│   │       └── 📁 settings/
│   │           └── 📄 page.tsx      # ⚙️ Configuración de usuario
│   │
│   ├── 📁 components/               # Componentes React
│   │   │
│   │   ├── 📁 ui/                   # Componentes de Shadcn UI
│   │   │   ├── alert.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── tabs.tsx
│   │   │   └── textarea.tsx
│   │   │
│   │   ├── 🔐 LoginForm.tsx         # Formulario de login
│   │   ├── 🧭 DashboardNav.tsx      # Navegación del dashboard
│   │   │
│   │   ├── 📚 CoursesList.tsx       # Lista de cursos
│   │   ├── 📖 TopicsList.tsx        # Lista de temas
│   │   │
│   │   ├── ❓ QuestionsList.tsx     # Lista de preguntas
│   │   ├── ❓ QuestionItem.tsx      # Item de pregunta
│   │   ├── ❓ QuestionFormDialog.tsx # Formulario de pregunta
│   │   ├── ❓ QuestionImportDialog.tsx # Importar preguntas
│   │   │
│   │   ├── 📝 ExamConfigForm.tsx    # Configuración de examen
│   │   ├── 📝 ExamTaker.tsx         # Interfaz de examen
│   │   │
│   │   └── ⚙️ SettingsForm.tsx      # Configuración de usuario
│   │
│   ├── 📁 actions/                  # Server Actions
│   │   ├── 🔐 auth.ts               # Autenticación
│   │   ├── 📚 courses.ts            # CRUD de cursos
│   │   ├── 📖 topics.ts             # CRUD de temas
│   │   ├── ❓ questions.ts          # CRUD de preguntas
│   │   └── 📝 exams.ts              # Generación y calificación
│   │
│   ├── 📁 lib/                      # Utilidades
│   │   ├── 🗄️ db.ts                 # Cliente de TursoDB
│   │   ├── 🔐 auth.ts               # Funciones de autenticación
│   │   ├── ✅ schemas.ts            # Esquemas de validación Zod
│   │   └── 🛠️ utils.ts              # Utilidades generales
│   │
│   └── 📁 types/                    # Definiciones TypeScript
│       └── index.ts                 # Todos los tipos
│
└── 📁 public/                       # Archivos estáticos
    └── (íconos y recursos)
```

## 🎯 Flujo de Navegación

```
┌─────────────────────────────────────────────────────────────────┐
│                      🏠 Página de Login                         │
│                       (No autenticado)                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │  Ingresa tu contraseña                               │     │
│  │  ┌────────────────────────────────────────┐          │     │
│  │  │ Contraseña: ************              │          │     │
│  │  └────────────────────────────────────────┘          │     │
│  │                                                       │     │
│  │  Si no existe, se crea automáticamente               │     │
│  │                                                       │     │
│  │         [ Ingresar ] ──────────┐                     │     │
│  └─────────────────────────────────│─────────────────────┘     │
└────────────────────────────────────│───────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    📊 Dashboard Principal                       │
│                      (Autenticado)                              │
│                                                                 │
│  Navegación: Inicio | Cursos | Temas | Preguntas | Examen |   │
│              Configuración                                      │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐                 │
│  │ Cursos   │  │Preguntas │  │Generar Examen│                 │
│  │   15     │  │   124    │  │              │                 │
│  └──────────┘  └──────────┘  └──────────────┘                 │
│                                                                 │
│  Acciones Rápidas:                                             │
│  • Crear Curso                                                 │
│  • Crear Tema                                                  │
│  • Crear Pregunta                                              │
│  • Importar Preguntas (JSON)                                   │
└─────────────────────────────────────────────────────────────────┘
         │           │           │           │
         ▼           ▼           ▼           ▼
    ┌────────┐  ┌────────┐  ┌──────────┐  ┌────────┐
    │ Cursos │  │ Temas  │  │Preguntas │  │ Examen │
    └────────┘  └────────┘  └──────────┘  └────────┘
         │           │           │             │
         │           │           │             ▼
         │           │           │      ┌─────────────┐
         │           │           │      │ Configurar  │
         │           │           │      │   Examen    │
         │           │           │      └──────┬──────┘
         │           │           │             │
         │           │           │             ▼
         │           │           │      ┌─────────────┐
         │           │           │      │  Realizar   │
         │           │           │      │   Examen    │
         │           │           │      └──────┬──────┘
         │           │           │             │
         │           │           │             ▼
         │           │           │      ┌─────────────┐
         │           │           │      │ Resultados  │
         │           │           │      │ y Calific.  │
         │           │           │      └─────────────┘
         └───────────┴───────────┴─────────────────────
```

## 🔄 Flujo de Datos

```
┌──────────────┐
│   Usuario    │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────┐
│  Componente React (Client)       │
│  - LoginForm                      │
│  - CoursesList                    │
│  - QuestionsList                  │
│  - ExamTaker                      │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Server Action                    │
│  - auth.ts                        │
│  - courses.ts                     │
│  - questions.ts                   │
│  - exams.ts                       │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Validación (Zod)                 │
│  - loginSchema                    │
│  - createCourseSchema             │
│  - createQuestionSchema           │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│  Base de Datos (TursoDB)          │
│  - user                           │
│  - course                         │
│  - topic                          │
│  - question                       │
│  - answer                         │
└───────────────────────────────────┘
```

## 📊 Esquema de Base de Datos

```
┌─────────────┐
│    user     │
├─────────────┤
│ id          │──┐
│ email       │  │
│ name        │  │
│ password    │  │
└─────────────┘  │
                 │
                 │  ┌─────────────┐
                 │  │   answer    │
                 │  ├─────────────┤
                 └──│ user_id (FK)│
                    │ question_id │──┐
                    │ answer_data │  │
                    │ submitted_at│  │
                    └─────────────┘  │
                                     │
┌─────────────┐                     │
│   course    │                     │
├─────────────┤                     │
│ id          │──┐                  │
│ name        │  │                  │
└─────────────┘  │                  │
                 │                  │
                 │  ┌─────────────┐ │
                 │  │    topic    │ │
                 │  ├─────────────┤ │
                 └──│ course_id(FK)│ │
                    │ number      │ │
                    │ name        │ │
                    └──────┬──────┘ │
                           │        │
                           │        │
                    ┌──────┴──────┐ │
                    │  question   │ │
                    ├─────────────┤ │
                    │ topic_id(FK)│─┘
                    │ type_id (FK)│──┐
                    │ question_data│  │
                    │ time_limit  │  │
                    └─────────────┘  │
                                     │
                    ┌────────────────┴──┐
                    │  question_type    │
                    ├───────────────────┤
                    │ 0: True or False  │
                    │ 1: Multiple Choice│
                    └───────────────────┘
```

## 🎨 Paleta de Colores (Tailwind)

```
Primarios:
- Blue:   #3B82F6  (Botones, enlaces)
- Green:  #10B981  (Éxito, correcto)
- Red:    #EF4444  (Error, incorrecto)

Neutrales:
- Gray 50:  #F9FAFB  (Fondo claro)
- Gray 900: #111827  (Texto oscuro)
- Gray 800: #1F2937  (Fondo oscuro)
```

## 📱 Responsive Breakpoints

```
sm:  640px   - Tablets pequeñas
md:  768px   - Tablets
lg:  1024px  - Laptops
xl:  1280px  - Desktops
2xl: 1536px  - Pantallas grandes
```

## 🔑 Variables de Entorno

```env
# .env.local
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOi...
```

## 🚀 Scripts Disponibles

```bash
npm run dev      # Desarrollo con Turbopack
npm run build    # Build para producción
npm start        # Iniciar servidor de producción
npm run lint     # Ejecutar ESLint
```

---

**Total de archivos creados:** 45+
**Líneas de código:** ~3,500+
**Componentes React:** 25+
**Server Actions:** 5 archivos
**Tiempo de compilación:** ~29s
