# NextFlow - Durable Workflow Orchestration Platform

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-UNLICENSED-red)
![Node](https://img.shields.io/badge/node-%3E%3D18-green)

**NextFlow** is a production-grade, full-stack SaaS platform for orchestrating durable, multi-channel customer journeys with AI-assisted automation. Built with modern technologies and designed for scale, multi-tenancy, and enterprise reliability.

## 🌟 Features

### ✅ Core Platform
- **Durable Workflow Engine** - Execute complex, long-running workflows with state persistence
- **Multi-Channel Support** - Email, WhatsApp, Facebook integration ready
- **AI-Powered Automation** - AI-assisted decision making and message generation
- **Cron Job Management** - Scheduled workflow execution with visual management
- **Multi-Tenant Architecture** - Row-level isolation with workspace support
- **Real-Time Monitoring** - Track workflow executions and performance metrics

### 🎯 Backend Features (NestJS)
- RESTful API with full CRUD operations
- Prisma ORM with PostgreSQL adapter
- Durable workflow orchestration
- Scheduled job management
- Authentication & Authorization (Better-Auth ready)
- Multi-tenant data isolation
- Database connection pooling
- Comprehensive error handling

### 🎨 Frontend Features (Next.js 16)
- **App Router** with React Server Components
- **Feature-Sliced Design (FSD)** architecture
- **Tailwind CSS v4** with modern design system
- Workflow builder UI (ready for ReactFlow integration)
- Dashboard with KPI metrics
- Responsive design for all devices

## 🏗 Architecture

```
marketflow/
├── apps/
│   ├── api/                    # NestJS Backend (Port 3000)
│   │   └── src/
│   │       ├── common/         # Shared utilities
│   │       │   └── prisma/     # Database service
│   │       └── modules/        # Feature modules
│   │           ├── auth/       # Authentication
│   │           ├── workflows/  # Workflow orchestration
│   │           └── cron/       # Cron job management
│   │
│   └── web/                    # Next.js 16 Frontend (Port 3001)
│       └── src/
│           ├── app/            # App Router pages
│           ├── entities/       # Domain models (FSD)
│           ├── features/       # Features (FSD)
│           ├── widgets/        # Composite components (FSD)
│           └── shared/         # Utilities (FSD)
│
└── packages/
    ├── database/               # Prisma v7 + PostgreSQL
    │   ├── prisma/
    │   │   ├── schema.prisma   # Database schema
    │   │   └── prisma.config.ts # Prisma v7 config
    │   └── lib/
    │       └── prisma.ts       # Configured client with adapter
    │
    ├── shared/                 # Shared types & schemas (Zod)
    ├── ui/                     # Shared UI components
    └── typescript-config/      # Shared TypeScript configs
```

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: NestJS 11
- **Database**: PostgreSQL with Prisma v7
- **Adapter**: `@prisma/adapter-pg`
- **Validation**: class-validator, class-transformer
- **Scheduling**: @nestjs/schedule, cron-parser
- **Language**: TypeScript 5.5+

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Validation**: Zod v4
- **Language**: TypeScript 5.8+

### Infrastructure
- **Monorepo**: Turborepo
- **Package Manager**: pnpm 8+
- **Database**: PostgreSQL 14+
- **Caching** (planned): Redis

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 14 or higher
- pnpm 8 or higher

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd marketflow
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Setup database**
```bash
# Create .env file in packages/database
cp packages/database/.env.example packages/database/.env

# Edit .env and add your PostgreSQL connection string:
# DATABASE_URL="postgresql://user:password@localhost:5432/nextflow?schema=public"

# Generate Prisma client
cd packages/database
pnpm db:generate

# Push schema to database
pnpm db:push
```

4. **Start development servers**
```bash
# From root directory
pnpm dev

# Or start individually:
# Backend:  cd apps/api && pnpm dev     # http://localhost:3000
# Frontend: cd apps/web && pnpm dev     # http://localhost:3001
```

## 📦 Project Structure

### Apps

#### `apps/api` - NestJS Backend
RESTful API server with modular architecture:

**Modules:**
- **AuthModule** - User authentication (Better-Auth integration ready)
- **WorkflowsModule** - Workflow CRUD and execution
- **CronModule** - Scheduled job management
- **PrismaModule** - Database access layer

**Key Files:**
- `src/app.module.ts` - Application root module
- `src/common/prisma/prisma.service.ts` - Prisma client wrapper
- `src/modules/workflows/workflows.service.ts` - Workflow business logic
- `src/modules/cron/cron.service.ts` - Cron execution engine

#### `apps/web` - Next.js Frontend
Modern web application with Feature-Sliced Design:

**Layers:**
- **app/** - Next.js App Router pages and layouts
- **entities/** - Domain-specific business logic
- **features/** - User-facing features
- **widgets/** - Composite UI components
- **shared/** - Reusable utilities and components

### Packages

#### `packages/database`
- **Prisma v7** schema and client
- **PostgreSQL adapter** for connection pooling
- Multi-tenant data model
- Migration system

#### `packages/shared`
- **Zod schemas** for validation
- **TypeScript types** shared between frontend and backend
- DTOs and API contracts

## 🔌 API Endpoints

### Workflows
```
GET    /workflows              # List all workflows
GET    /workflows/:id          # Get workflow by ID
POST   /workflows              # Create new workflow
PUT    /workflows/:id          # Update workflow
DELETE /workflows/:id          # Delete workflow
POST   /workflows/:id/execute  # Execute workflow
GET    /workflows/:id/executions # Get execution history
```

### Cron Jobs
```
GET    /cron-jobs              # List all cron jobs
GET    /cron-jobs/:id          # Get cron job by ID
POST   /cron-jobs              # Create new cron job
PUT    /cron-jobs/:id          # Update cron job
DELETE /cron-jobs/:id          # Delete cron job
PUT    /cron-jobs/:id/toggle   # Toggle active status
```

### Example Requests

**Create Workflow:**
```bash
curl -X POST http://localhost:3000/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Welcome Email Flow",
    "description": "Send welcome email to new users",
    "definition": {
      "nodes": [],
      "edges": []
    }
  }'
```

**Create Cron Job:**
```bash
curl -X POST http://localhost:3000/cron-jobs \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "clx...",
    "schedule": "0 9 * * *",
    "isActive": true
  }'
```

## 📊 Database Schema

### Core Models

**Tenant** - Multi-tenant isolation
- `id`, `name`, `slug`, `plan`
- Relations: users, workflows, apiKeys

**User** - Platform users
- `id`, `email`, `name`, `role`
- Relations: tenant

**Workflow** - Workflow definitions
- `id`, `name`, `description`, `definition` (JSON)
- `isActive`, `tenantId`
- Relations: executions, cronJobs

**WorkflowExecution** - Execution records
- `id`, `workflowId`, `status`, `context` (JSON)
- `startedAt`, `completedAt`
- Relations: steps

**CronJob** - Scheduled jobs
- `id`, `workflowId`, `schedule`, `nextRunAt`
- `isActive`, `lastRunAt`

## 🎯 Development Workflow

### Available Scripts

From root directory:
```bash
pnpm dev          # Start all apps in development
pnpm build        # Build all apps
pnpm lint         # Lint all packages
pnpm test         # Run tests (when implemented)
```

From `apps/api`:
```bash
pnpm dev          # Start NestJS with watch mode
pnpm build        # Build for production
pnpm start:prod   # Start production build
```

From `apps/web`:
```bash
pnpm dev          # Start Next.js dev server
pnpm build        # Build for production
pnpm start        # Start production build
```

From `packages/database`:
```bash
pnpm db:generate  # Generate Prisma client
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Prisma Studio
```

### Code Quality

**TypeScript:**
- Strict mode enabled
- Path aliases configured (`@/` for apps)
- Shared configs in `packages/typescript-config`

**Linting:**
- ESLint with custom configs
- Shared rules in `packages/eslint-config`

**Formatting:**
- Prettier with `.prettierrc.mjs`


## 🔒 Security

- **Environment Variables**: Never commit `.env` files
- **Multi-Tenancy**: Row-level data isolation
- **Authentication**: Better-Auth integration (ready)
- **Validation**: All inputs validated with class-validator and Zod

## 🌐 Environment Variables

### Database (`packages/database/.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/nextflow?schema=public"
```

### API (`apps/api/.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/nextflow?schema=public"
PORT=3000
NODE_ENV=development
```

### Web (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📚 Documentation

- **Architecture Guide**: [ARCHITECTURE.md](./ARCHITECTURE.md)
- **API Documentation**: Auto-generated (Swagger planned)
- **Prisma Schema**: `packages/database/prisma/schema.prisma`

## 🤝 Contributing

This is a private project. For internal team development:

1. Create a feature branch
2. Make your changes
3. Ensure all builds pass (`pnpm build`)
4. Submit for review

## 📝 License

UNLICENSED - Private Project

## 🎓 Learn More

- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Verify PostgreSQL is running
pg_isready

# Check connection string in .env
cat packages/database/.env

# Regenerate Prisma client
cd packages/database
pnpm db:generate
```

### Build Errors
```bash
# Clean and reinstall
rm -rf node_modules
pnpm install

# Rebuild all packages
pnpm build --force
```

### Port Already in Use
```bash
# Find and kill process on port 3000 (API)
lsof -ti:3000 | xargs kill -9

# Find and kill process on port 3001 (Web)
lsof -ti:3001 | xargs kill -9
```

## 📬 Support

For questions or issues, contact the development team.

---

**Built with ❤️ using NestJS, Next.js, and Prisma**
