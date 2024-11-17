# Phaser Game with Next.js

Este es un proyecto que combina [Phaser](https://phaser.io) para la creación de juegos y [Next.js](https://nextjs.org) para la interfaz de usuario y la gestión del backend. El juego incluye características como un sistema de puntuación, enemigos que disparan, y un tablero de puntuaciones.

## Comenzando

Antes de comenzar, asegúrate de configurar las variables de entorno necesarias. Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables:

```bash
DATABASE_URL="postgresql://user:password@host:port/database
```

Después de configurar las variables de entorno, ejecuta el siguiente comando para generar el cliente de Prisma:

```bash
npx prisma generate
# o
yarn prisma generate
# o
pnpm prisma generate
# o
bun prisma generate
```

Por último, ejecuta el siguiente comando para aplicar las migraciones de la base de datos:

```bash
npx prisma migrate dev
# o
yarn prisma migrate dev
# o
pnpm prisma migrate dev
# o
bun prisma migrate dev
```

Finalmente, ejecuta el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver el resultado.

Puedes comenzar a editar la página modificando `app/page.tsx`. La página se actualizará automáticamente a medida que editas el archivo.

Este proyecto utiliza `next/font` para optimizar y cargar automáticamente Geist, una nueva familia de fuentes para Vercel.

## Estructura del Proyecto

- `src/app`: Contiene los componentes y páginas de Next.js.
- `src/game`: Contiene la lógica del juego, incluyendo escenas, objetos y eventos.
- `src/database`: Contiene la configuración y funciones de Prisma para la base de datos.
- `public`: Contiene archivos estáticos como imágenes y fuentes.
- `prisma`: Contiene el esquema de Prisma y las migraciones de la base de datos.

## Características

- **Phaser**: Utilizado para la lógica del juego.
- **Next.js**: Utilizado para la interfaz de usuario y el backend.
- **Prisma**: Utilizado para la gestión de la base de datos.
- **Tailwind CSS**: Utilizado para el diseño y estilos.

## Scripts Disponibles

- `dev`: Inicia el servidor de desarrollo.
- `build`: Construye la aplicación para producción.
- `start`: Inicia el servidor en modo producción.
- `lint`: Ejecuta ESLint para encontrar y arreglar problemas en el código.
- `postinstall`: Genera el cliente de Prisma.
- `vercel-build`: Script de construcción para Vercel.

## Aprender Más

Para aprender más sobre las tecnologías utilizadas en este proyecto, consulta los siguientes recursos:

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Phaser](https://phaser.io/docs)
- [Documentación de Prisma](https://www.prisma.io/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)

## Despliegue en Vercel

La forma más fácil de desplegar tu aplicación Next.js es usar la [Plataforma Vercel](https://vercel.com) de los creadores de Next.js.

Consulta nuestra [documentación de despliegue de Next.js](https://nextjs.org/docs/deployment) para más detalles.

