# NextFlow - Durable Workflow Platform

A production-grade SaaS platform for orchestrating multi-channel customer journeys with AI automation.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Setup database (requires PostgreSQL)
cd packages/database
cp .env.example .env  # Add your DATABASE_URL
pnpm db:push

# Run development servers
cd ../..
pnpm dev
```

## 📦 What's Inside

- **apps/api** - NestJS backend with durable workflow engine
- **apps/web** - Next.js 16 frontend with Feature-Sliced Design
- **packages/database** - Prisma schema and client
- **packages/shared** - Shared types and Zod schemas

## 🏗 Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed documentation.

## 🛠 Tech Stack

- **Backend**: NestJS 11, Prisma 5, PostgreSQL
- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Monorepo**: Turborepo, pnpm

## 📝 Available Scripts

```bash
pnpm dev          # Start all apps in development
pnpm build        # Build all apps
pnpm lint         # Lint all packages
pnpm test         # Run tests
```

## 🔗 Ports

- API: http://localhost:3000
- Web: http://localhost:3001

## 📚 Documentation

- [Architecture Guide](./ARCHITECTURE.md)
- [API Documentation](#) - Coming soon
- [Deployment Guide](#) - Coming soon

## 🤝 Contributing

This is a private project. For questions, contact the team.

## 📄 License

UNLICENSED
