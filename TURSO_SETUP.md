# 🗄️ Guía de Configuración de TursoDB

Esta guía te ayudará a configurar TursoDB paso a paso para la aplicación ST20.

## ¿Qué es TursoDB?

TursoDB es una base de datos SQLite distribuida que funciona en la nube. Es perfecta para aplicaciones que necesitan una base de datos simple pero potente, con sincronización automática.

## Instalación y Configuración

### Paso 1: Crear Cuenta en TursoDB

1. Visita [https://turso.tech](https://turso.tech)
2. Haz clic en "Sign Up" o "Get Started"
3. Crea una cuenta (puedes usar GitHub para autenticarte)

### Paso 2: Instalar el CLI de Turso

#### Windows (PowerShell como Administrador)
```powershell
iwr -useb https://get.tur.so/install.ps1 | iex
```

#### macOS/Linux
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

### Paso 3: Autenticarse

```bash
turso auth login
```

Esto abrirá tu navegador para completar la autenticación.

### Paso 4: Crear tu Base de Datos

```bash
# Crear la base de datos
turso db create st20-db

# Ver información de la base de datos
turso db show st20-db
```

### Paso 5: Ejecutar el Schema SQL

Hay dos formas de hacerlo:

#### Opción A: Usando el CLI (Recomendado)

```bash
# Desde la raíz del proyecto
turso db shell st20-db < sql/db.sql
```

#### Opción B: Manualmente

```bash
# Abrir el shell interactivo
turso db shell st20-db

# Copiar y pegar el contenido de sql/db.sql
# Presionar Enter después de cada comando
```

### Paso 6: Obtener las Credenciales

```bash
# Obtener la URL de la base de datos
turso db show st20-db --url

# Crear un token de autenticación
turso db tokens create st20-db
```

Copia ambos valores, los necesitarás en el siguiente paso.

### Paso 7: Configurar Variables de Entorno

1. En la raíz del proyecto, abre el archivo `.env.local`
2. Reemplaza los valores con tus credenciales:

```env
TURSO_DATABASE_URL=libsql://st20-db-tuusuario.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

**Importante:** La URL debe comenzar con `libsql://` y el token es una cadena larga de caracteres.

## Verificación

Para verificar que todo funciona correctamente:

```bash
# Ver las tablas creadas
turso db shell st20-db

# Dentro del shell, ejecuta:
.tables

# Deberías ver:
# answer         course         question       question_type  topic          user

# Salir del shell
.exit
```

## Comandos Útiles de TursoDB

```bash
# Listar todas tus bases de datos
turso db list

# Ver información de una base de datos
turso db show st20-db

# Abrir shell interactivo
turso db shell st20-db

# Ver ubicaciones disponibles (para crear DB en región específica)
turso db locations

# Crear DB en región específica
turso db create st20-db --location lax  # Los Angeles

# Eliminar una base de datos (¡cuidado!)
turso db destroy st20-db
```

## Solución de Problemas

### Error: "command not found: turso"

**Causa:** El CLI no está instalado o no está en el PATH.

**Solución:**
- Windows: Cierra y vuelve a abrir PowerShell como Administrador
- Mac/Linux: Ejecuta `source ~/.bashrc` o `source ~/.zshrc`
- Si persiste, reinstala el CLI

### Error: "database not found"

**Causa:** El nombre de la base de datos es incorrecto.

**Solución:**
```bash
# Verificar el nombre exacto
turso db list

# Usar el nombre exacto
turso db show nombre-exacto-db
```

### Error: "authentication failed"

**Causa:** No estás autenticado o la sesión expiró.

**Solución:**
```bash
turso auth login
```

### Error: "TURSO_DATABASE_URL is not defined"

**Causa:** El archivo `.env.local` no existe o las variables no están configuradas.

**Solución:**
1. Verifica que `.env.local` existe en la raíz del proyecto
2. Asegúrate de que las variables están correctamente escritas
3. Reinicia el servidor de desarrollo (`npm run dev`)

### La aplicación no se conecta a la base de datos

**Verificación paso a paso:**

1. **Verificar credenciales:**
```bash
turso db show st20-db --url
turso db tokens create st20-db
```

2. **Verificar .env.local:**
```bash
cat .env.local  # Mac/Linux
type .env.local  # Windows
```

3. **Verificar que las tablas existen:**
```bash
turso db shell st20-db
.tables
.exit
```

4. **Reiniciar el servidor:**
```bash
# Detener el servidor (Ctrl+C)
npm run dev
```

## Plan Gratuito de TursoDB

El plan gratuito incluye:
- 9 GB de almacenamiento total
- 3 bases de datos
- 1 billion de filas leídas por mes
- Perfecto para desarrollo y proyectos pequeños

## Migración y Respaldos

### Crear un Respaldo

```bash
# Exportar toda la base de datos
turso db shell st20-db ".dump" > backup.sql

# Restaurar desde respaldo
turso db shell st20-db < backup.sql
```

### Migrar a otra Base de Datos

```bash
# Crear nueva DB
turso db create st20-db-prod

# Exportar de la antigua
turso db shell st20-db ".dump" > migration.sql

# Importar a la nueva
turso db shell st20-db-prod < migration.sql

# Actualizar .env.local con las nuevas credenciales
```

## Recursos Adicionales

- [Documentación oficial de TursoDB](https://docs.turso.tech)
- [Guía de inicio rápido](https://docs.turso.tech/quickstart)
- [CLI Reference](https://docs.turso.tech/reference/turso-cli)
- [SDK para JavaScript/TypeScript](https://docs.turso.tech/sdk/ts)
- [Comunidad en Discord](https://discord.gg/turso)

## Próximos Pasos

Una vez configurado TursoDB:

1. Ejecuta `npm run dev`
2. Abre http://localhost:3000
3. Ingresa cualquier contraseña para crear tu cuenta
4. Importa los datos de ejemplo desde `sql/sample_data.json`
5. ¡Comienza a crear y realizar exámenes!

---

¿Necesitas ayuda? Revisa los logs del servidor para más detalles sobre errores de conexión.
