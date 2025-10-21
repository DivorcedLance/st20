# Modo Oscuro - ST20

## 📋 Implementación

Se ha implementado soporte completo para modo oscuro en toda la aplicación usando `next-themes`.

## 🎨 Características

- **Toggle de tema**: Botón para cambiar entre modo claro y oscuro
- **Preferencia del sistema**: Detecta automáticamente la preferencia del usuario
- **Persistencia**: El tema seleccionado se guarda en localStorage
- **Sin flash**: Transición suave sin parpadeo al cargar la página

## 🛠️ Componentes Creados

### 1. ThemeProvider (`src/components/ThemeProvider.tsx`)
- Wrapper del provider de `next-themes`
- Configurado en el layout raíz de la aplicación

### 2. ThemeToggle (`src/components/ThemeToggle.tsx`)
- Botón con iconos de sol/luna
- Cambia entre tema claro y oscuro
- Maneja correctamente la hidratación de Next.js

## 📍 Ubicaciones del Toggle

El botón de cambio de tema está disponible en:

1. **Página de Login**: Esquina superior derecha
2. **Dashboard**: En la barra de navegación junto al nombre del usuario

## 🎨 Paleta de Colores

Las variables CSS están definidas en `src/app/globals.css`:

### Modo Claro
- Background: Blanco
- Foreground: Negro
- Cards: Blanco con bordes grises
- Primary: Negro
- Secondary: Gris claro

### Modo Oscuro
- Background: Gris oscuro (#0a0a0a aproximadamente)
- Foreground: Blanco
- Cards: Gris medio con bordes sutiles
- Primary: Gris claro
- Secondary: Gris oscuro

## 🔧 Configuración

El tema está configurado en `src/app/layout.tsx`:

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange>
  {children}
</ThemeProvider>
```

- `attribute="class"`: Usa clases CSS para cambiar el tema
- `defaultTheme="system"`: Detecta la preferencia del sistema
- `enableSystem`: Permite usar la preferencia del sistema
- `disableTransitionOnChange`: Evita animaciones al cambiar de tema

## 🎯 Uso

Los usuarios pueden cambiar el tema de tres formas:

1. **Automático**: El sistema detecta la preferencia del sistema operativo
2. **Manual en Login**: Haciendo clic en el botón en la esquina superior derecha
3. **Manual en Dashboard**: Haciendo clic en el botón en la barra de navegación

El tema seleccionado se mantiene entre sesiones gracias a localStorage.

## 🔍 Clases Dark Mode

Todas las clases de Tailwind ahora soportan el prefijo `dark:`:

```tsx
<div className="bg-white dark:bg-gray-800">
  <p className="text-gray-900 dark:text-white">Texto</p>
</div>
```

## 📦 Dependencias

- `next-themes@^0.4.6`: Gestión de temas
- `lucide-react@^0.546.0`: Iconos de sol/luna

## ✅ Testing

Para verificar que el modo oscuro funciona:

1. Ejecuta `npm run dev`
2. Abre la aplicación en el navegador
3. Haz clic en el botón de sol/luna
4. Verifica que todos los componentes cambien de color
5. Recarga la página y verifica que el tema se mantenga
