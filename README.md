# st20:

Es una aplicación diseñada para crear test con preguntas de diferentes tipos (opción múltiple, verdadero/falso, etc) con opcionalmente limite de tiempo en base a material de estudio proporcionado por el usuario. Permite organizar por curso y tema, facilitando la generación de exámenes personalizados para evaluar conocimientos en diversas áreas.

## Funcionalidades principales:

### Login:
Para el login solo se requerira una contraseña, no es necesario un usuario. La contraseña se almacenará de forma segura en la base de datos.
Al ingresar se le pedira al usuario su contraseña, si ingresa una que no existe se creara una nueva cuenta con esa contraseña.
Luego através de las configuraciones el usuario podrá cambiar su contraseña y proveer opcionalmente sus datos personales (nombre, email).

### Gestión de cursos y temas:
La aplicación permitirá a los usuarios crear, editar y eliminar cursos y temas. Cada curso podrá contener múltiples temas, y cada tema podrá contener múltiples preguntas. Esto facilitará la organización del material de estudio y la creación de exámenes personalizados. Para la gestión de cursos y temas, se proporcionará una interfaz intuitiva que permitirá a los usuarios agregar nuevos cursos y temas, así como editar o eliminar los existentes de manera sencilla.

### Creación y gestión de preguntas:
Los usuarios podrán crear preguntas de diferentes tipos, como opción múltiple, verdadero/falso, entre otros. Cada pregunta podrá tener una explicación o retroalimentación asociada para ayudar al usuario a comprender mejor el material de estudio. Además las preguntas podrán tener definido un tiempo límite para responderlas.

Al momento de crear o editar una pregunta, el usuario podrá escribir el contenido de la pregunta y la explicación en formato Markdown, lo que permitirá una mayor flexibilidad en la presentación del material. Sin embargo también tendrá la opción de copiar un json con la estructura de la pregunta para facilitar la creación masiva de preguntas. En esta estructura se incluirán también los temas y cursos de la pregunta, de modo que al pegar el json se creen automáticamente los cursos y temas si no existen.

### Generación de exámenes:
Los usuarios podrán generar exámenes personalizados seleccionando cursos y temas específicos. La aplicación permitirá configurar el número de preguntas. Por defecto, el límite de tiempo para responder cada pregunta será el definido en la pregunta, pero el usuario también puede optar por establecer un límite de tiempo global para todo el examen e ignorar los tiempos individuales de las preguntas.

## Base de datos:

La base de datos será TursoDB, una base de datos SQLite en la nube que permite sincronización y almacenamiento seguro de datos. La base de datos almacenará toda la información relacionada con usuarios, cursos, temas y preguntas. Se accederá a ella mediante la librería `libsql`.

## Implementación técnica:

La aplicación estará desarrollada utilizando Next.js con TypeScript para el frontend y backend. Se utilizará Tailwind CSS junto con Shadcn UI para el diseño de la interfaz de usuario, asegurando una experiencia visual atractiva y responsiva.

El contenido de las preguntas y explicaciones se manejará en formato Markdown, permitiendo una fácil edición y presentación del material de estudio. Se utilizará la librería `react-markdown` para crear los componentes necesarios para renderizar este contenido en la aplicación.

## Tecnologías utilizadas:

Next.js
TypeScript
TursoDB
Tailwind CSS
Shadcn UI
Zod
SWR
react-markdown