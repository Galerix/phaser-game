# Space Shooter Game 🚀

A fast-paced space shooter game built with Phaser 3, Next.js, and TypeScript.

![Space Shooter Game](public/assets/logo.png)

## Features

- **Dynamic Combat System**: WASD movement controls with directional shooting
- **Enemy AI**: Intelligent enemy behavior with tracking and shooting mechanics
- **Modern Tech Stack**: Built with Next.js 15, Phaser 3, and TypeScript
- **Responsive Design**: Seamless gameplay across different screen sizes
- **Persistent Leaderboards**: Global rankings stored in PostgreSQL

## Quick Start

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL database
- pnpm, npm, or yarn

### Environment Setup

1. Create a `.env` file in the root directory:

```bash
DATABASE_URL="postgresql://user:password@host:port/database"
```

2. Set up your PostgreSQL database and update the connection string accordingly.

### Database Setup with Prisma

1. Install project dependencies:

```bash
npm install
```

2. Generate Prisma Client:

```bash
npx prisma generate
```

3. Create and apply database migrations:

```bash
# Create a new migration
npx prisma migrate dev --name init

# Apply existing migrations
npx prisma migrate deploy
```

4. (Optional) Explore your database with Prisma Studio:

```bash
npx prisma studio
```

### Running the Application

```bash
# Start development server
npm run dev
```

Visit `http://localhost:3000` to start playing!

## Game Controls

- **Movement**: WASD keys
- **Shooting**: Arrow keys (⬆️⬅️⬇️➡️)
- **Objective**: Destroy enemies and survive as long as possible

## Tech Stack

- **Frontend**: Next.js 15, React 19
- **Game Engine**: Phaser 3
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Project Structure

```
├── src/
│   ├── app/          # Next.js app directory
│   ├── components/   # React components
│   ├── game/         # Phaser game logic
│   │   ├── objects/  # Game objects (Player, Enemy)
│   │   └── scenes/   # Game scenes
│   └── database/     # Database operations
├── prisma/          # Database schema and migrations
│   ├── schema.prisma # Database schema
│   └── migrations/   # Database migrations
└── public/          # Static assets
```

## Database Schema

```prisma
model Score {
  id         Int      @id @default(autoincrement())
  playerName String   @default("Player")
  score      Int
  createdAt  DateTime @default(now())
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Phaser](https://phaser.io/) - HTML5 game framework
- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## Contact

David Galera Rodriguez - [LinkedIn](https://es.linkedin.com/in/david-galera-rodriguez-47a65b1b6)

Project Link: [https://github.com/Galerix/phaser-game](https://github.com/Galerix/phaser-game)

