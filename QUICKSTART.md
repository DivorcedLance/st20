# 🚀 Inicio Rápido - ST20

## Configuración en 3 Pasos

### 1️⃣ Configurar TursoDB

1. Visita [turso.tech](https://turso.tech) y crea una cuenta
2. Instala el CLI de Turso:
   ```bash
   # Windows (PowerShell)
   iwr -useb https://get.tur.so/install.ps1 | iex
   
   # Mac/Linux
   curl -sSfL https://get.tur.so/install.sh | bash
   ```

3. Inicia sesión:
   ```bash
   turso auth login
   ```

4. Crea una base de datos:
   ```bash
   turso db create st20-db
   ```

5. Ejecuta el script de la base de datos:
   ```bash
   turso db shell st20-db < sql/db.sql
   ```

6. Obtén las credenciales:
   ```bash
   turso db show st20-db --url
   turso db tokens create st20-db
   ```

7. Copia las credenciales a `.env.local`:
   ```env
   TURSO_DATABASE_URL=libsql://tu-base-de-datos.turso.io
   TURSO_AUTH_TOKEN=tu-token-aqui
   ```

### 2️⃣ Instalar y Ejecutar

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

### 3️⃣ Usar la Aplicación

1. Abre http://localhost:3000
2. Ingresa cualquier contraseña (se creará tu cuenta automáticamente)
3. Ve a "Preguntas" → "Importar JSON"
4. Copia y pega el contenido de `sql/sample_data.json`
5. Haz clic en "Importar"
6. Ve a "Generar Examen" y crea tu primer examen

## 🎯 Primeros Pasos

### Opción A: Importar Datos de Ejemplo
La forma más rápida de probar la app es importar el archivo `sql/sample_data.json`:

1. Dashboard → Preguntas → Importar JSON
2. Pega el contenido del archivo
3. Haz clic en "Importar"
4. ¡Listo! Ya tienes 8 preguntas de ejemplo

### Opción B: Crear Manualmente
1. Crea un curso (ej: "Matemáticas")
2. Crea un tema (ej: "Álgebra")
3. Crea preguntas usando el formulario
4. Genera un examen

## 📚 Recursos

- [Documentación completa](./IMPLEMENTATION.md)
- [README original](./README.md)
- [Estructura de la base de datos](./sql/db.sql)

## ❓ Solución de Problemas

### Error: "TURSO_DATABASE_URL is not defined"
- Asegúrate de haber creado el archivo `.env.local`
- Verifica que las variables estén correctamente configuradas
- Reinicia el servidor de desarrollo

### No aparecen las preguntas
- Verifica que hayas ejecutado el script `sql/db.sql`
- Asegúrate de haber creado al menos un curso y tema
- Revisa la consola del navegador para errores

### Error al importar JSON
- Verifica que el JSON tenga el formato correcto
- Los campos requeridos son: course, topic, type, question, correct_answer
- Para Multiple Choice también necesitas "options"

## 🎓 Ejemplo de Uso

```
1. Login con contraseña: "mipassword123"
2. Importar sql/sample_data.json
3. Ir a "Generar Examen"
4. Seleccionar cursos: Matemáticas, Historia
5. Número de preguntas: 5
6. Usar límites individuales: Sí
7. Generar Examen
8. ¡Responder y ver resultados!
```

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start

# Lint
npm run lint

# Verificar TypeScript
npx tsc --noEmit
```

¡Disfruta usando ST20! 🎉
