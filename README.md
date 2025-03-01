
# ExamGeneration

ExamGeneration es una aplicación web de generación y gestión de exámenes desarrollada con React, TypeScript y Vite. Este proyecto proporciona una interfaz intuitiva para gestionar exámenes, analizar estadísticas, y trabajar con preguntas y revisiones de exámenes, entre otras funcionalidades.

## Tabla de Contenidos

- [ExamGeneration](#examgeneration)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Características](#características)
  - [Tecnologías Utilizadas](#tecnologías-utilizadas)
  - [Instalación](#instalación)
  - [Uso y Despliegue](#uso-y-despliegue)
  - [Estructura del Proyecto](#estructura-del-proyecto)
  - [Contribuciones](#contribuciones)
  - [Licencia](#licencia)
  - [Contacto](#contacto)

## Características

- **Generación de exámenes:** Listado de exámenes generados automáticamente para asignaturas específicas.
- **Gestión de preguntas:** Funcionalidad para obtener las preguntas más utilizadas y administrar el repositorio de preguntas.
- **Revisión y estadística:** Páginas dedicadas a estadísticas y revisiones de exámenes.
- **Rutas protegidas:** Acceso restringido para áreas de administración.
- **Integración con video:** Soporte para recursos multimedia en las funcionalidades, tal como se puede ver en [`Features.tsx`](Web_AEG/src/pages/Features.tsx).

## Tecnologías Utilizadas

- **Librería Front-end:** [React](https://reactjs.org/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Empaquetador:** [Vite](https://vitejs.dev/)
- **Estilos:** CSS
- **Routing:** [react-router-dom](https://reactrouter.com/)

## Instalación

1. Clona el repositorio:

   ```sh
   git clone https://tu-repositorio-url.git
   ```

2. Instala las dependencias:

   ```sh
   cd Web_AEG
   npm install
   ```

3. Inicia el servidor de desarrollo:

   ```sh
   npm run dev
   ```

## Uso y Despliegue

- El proyecto se ejecuta en modo desarrollo con soporte de hot module replacement (HMR).
- Realiza cambios en los archivos de la carpeta `src` y visualiza los resultados en tiempo real.
- Para crear una versión de producción, ejecuta:

  ```sh
  npm run build
  ```

## Estructura del Proyecto

La estructura principal del repositorio es la siguiente:

- **Web_AEG/**: Contiene el proyecto frontend.
  - **public/**: Archivos públicos.
  - **src/**:
    - **assets/**: Imágenes y otros recursos.
    - **components/**: Componentes reutilizables, como 

Navbar.tsx

, 

Footer.tsx

, etc.
    - **pages/**: Vistas completas de la aplicación (e.g. 

Features.tsx

).
    - **css/**: Hojas de estilo.
    - **main.tsx**: Punto de entrada de la aplicación.
- **Config Files**:
  - 

package.json

: Scripts y dependencias.
  - `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: Configuración de TypeScript.
  - `vite.config.ts`: Configuración de Vite.
- Otros archivos de configuración y documentación en la raíz.

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor, sigue estos pasos:

1. Haz un fork del proyecto.
2. Crea una rama con una nueva funcionalidad o corrección de error: `git checkout -b mi-nueva-funcionalidad`
3. Realiza tus cambios y haz commits descriptivos.
4. Envía un pull request explicando claramente tus cambios.

## Licencia

Este proyecto está licenciado bajo MIT License.

## Contacto

Si tienes alguna pregunta o sugerencia, por favor contacta a los mantenedores del proyecto.

---

*Este repositorio está gestionado profesionalmente y sigue las mejores prácticas de desarrollo y documentación.*
```