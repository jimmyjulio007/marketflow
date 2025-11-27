# NextFlow - Production-Grade SaaS Platform Architecture

## 🎯 Overview

NextFlow is a fullstack SaaS platform for orchestrating durable customer journeys across multiple channels (Email, WhatsApp, Facebook) with AI-assisted automation. Built as a Turborepo monorepo with NestJS backend and Next.js 16 frontend.

## 📁 Monorepo Structure

```
marketflow/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   └── src/
│   │       ├── common/         # Shared utilities (Prisma, guards, interceptors)
│   │       │   └── prisma/     # PrismaService & PrismaModule
│   │       ├── modules/        # Feature Modules
│   │       │   ├── auth/       # AuthModule (Better-Auth integration)
│   │       │   ├── workflows/  # WorkflowsModule (Durable engine)
│   │       │   │   └── engine/ # WorkflowOrchestrator, WorkflowLock
│   │       │   └── cron/       # CronModule (Scheduled workflows)
│   │       └── app.module.ts   # Main App Module
│   │
│   └── web/                    # Next.js 16 Frontend (App Router)
│       └── src/
│           ├── app/            # App Router pages
│           │   └── (dashboard)/ # Dashboard layout group
│           │       ├── layout.tsx
│           │       └── workflows/
│           ├── entities/       # FSD: Domain models (workflow, tenant)
│           ├── features/       # FSD: Complex features (workflow-builder)
│           ├── widgets/        # FSD: Composite components (sidebar, header)
│           └── shared/         # FSD: Shared utilities (api client)
│
└── packages/
    ├── database/               # Prisma Client & Schema
    │   ├── prisma/
    │   │   └── schema.prisma   # Multi-tenant schema
    │   └── src/
    │       └── index.ts        # Re-exports Prisma Client
    │
    ├── shared/                 # Shared Types & DTOs
    │   └── src/
    │       └── index.ts        # Zod schemas, TypeScript types
    │
    ├── ui/                     # Shared UI Components (shadcn/ui)
    ├── typescript-config/      # Shared TSConfig
    └── eslint-config/          # Shared ESLint
```

## 🛠 Tech Stack

### Backend (apps/api)
- **NestJS 11** - Modular architecture
- **Prisma 5** - Multi-tenant PostgreSQL ORM
- **PostgreSQL** - Durable workflow state
- **Redis** - Cache, locks, rate limiting (planned)
- **@nestjs/schedule** - Cron engine
- **TypeScript** - Strict mode

### Frontend (apps/web)
- **Next.js 16** - App Router
- **React 19** - UI library
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **TypeScript** - Strict mode

### Shared
- **Zod** - Schema validation
- **Turborepo** - Monorepo orchestration
- **pnpm** - Package manager

## 🗄 Database Schema (Prisma)

### Multi-Tenancy
```prisma
model Tenant {
  id        String   @id @default(cuid())
  name      String
  slug      String   @unique
  plan      String   @default("FREE") // FREE, PRO, BIZ
  
  users     User[]
  workflows Workflow[]
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  tenantId  String
  tenant    Tenant   @relation(fields: [tenantId], references: [id])
  role      String   @default("OPERATOR")
}
```

### Durable Workflows
```prisma
model Workflow {
  id          String   @id @default(cuid())
  tenantId    String
  name        String
  definition  Json     // Workflow graph (nodes/edges)
  isActive    Boolean  @default(false)
  
  executions  WorkflowExecution[]
  cronJobs    CronJob[]
}

model WorkflowExecution {
  id          String    @id @default(cuid())
  workflowId  String
  status      String    // PENDING, RUNNING, COMPLETED, FAILED
  context     Json      // Current state
  startedAt   DateTime
  completedAt DateTime?
  
  steps       WorkflowExecutionStep[]
}
```

### Cron Engine
```prisma
model CronJob {
  id          String    @id @default(cuid())
  workflowId  String
  schedule    String    // Cron expression
  lastRunAt   DateTime?
  nextRunAt   DateTime?
  isActive    Boolean   @default(true)
}
```

## 🔌 API Architecture

### Modules

#### 1. **PrismaModule** (Global)
- `PrismaService` - Extends PrismaClient with lifecycle hooks
- Auto-connects on app init, disconnects on destroy

#### 2. **WorkflowsModule**
- `WorkflowOrchestratorService` - Executes workflow steps
- `WorkflowLockService` - Distributed locking (Redis planned)

**Key Methods:**
```typescript
processExecution(executionId: string)
  → Acquires lock
  → Loads workflow + current state
  → Executes next step
  → Persists state to DB
  → Releases lock
```

#### 3. **CronModule**
- `CronService` - Runs every minute via `@Cron`
- Checks DB for due jobs
- Triggers workflow executions

#### 4. **AuthModule**
- `AuthService` - Better-Auth integration (placeholder)
- `AuthController` - `/auth/me` endpoint

## 🎨 Frontend Architecture (FSD)

### Feature-Sliced Design Layers

#### **app/** - Routes
- `(dashboard)/layout.tsx` - Sidebar + Main layout
- `(dashboard)/workflows/page.tsx` - Workflow list/builder

#### **entities/** - Domain Logic
- `workflow/model/workflow.store.ts` - Zustand store for nodes/edges

#### **features/** - Complex UI
- `workflow-builder/ui/workflow-builder.tsx` - Canvas component (ReactFlow integration planned)

#### **shared/** - Utilities
- `api/client.ts` - Fetch wrapper with base URL

### API Integration
```typescript
// shared/api/client.ts
const apiClient = <T>(path: string) => 
  fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`)
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Setup Database
```bash
# Create .env in packages/database/
echo "DATABASE_URL=postgresql://user:pass@localhost:5432/nextflow" > packages/database/.env

# Generate Prisma Client
cd packages/database
pnpm db:generate

# Push schema to DB
pnpm db:push
```

### 3. Run Development Servers
```bash
# From root - runs all apps
pnpm dev

# Or individually:
cd apps/api && pnpm dev    # http://localhost:3000
cd apps/web && pnpm dev    # http://localhost:3001
```

### 4. Build All
```bash
pnpm build
```

## 📊 Data Flow

### Workflow Execution Flow
```
User triggers workflow (UI/API)
  ↓
Create WorkflowExecution record (status: PENDING)
  ↓
WorkflowOrchestratorService.processExecution()
  ↓
Acquire Redis lock on executionId
  ↓
Load workflow definition + current context
  ↓
Determine next step (from graph)
  ↓
Execute step (AI, Email, WhatsApp, etc.)
  ↓
Save step result to WorkflowExecutionStep
  ↓
Update execution context & status
  ↓
Release lock
  ↓
If more steps → Queue next execution
If done → Mark COMPLETED
```

### Cron Flow
```
Every minute (CronService @Cron)
  ↓
Query CronJob where nextRunAt <= now AND isActive = true
  ↓
For each job:
  - Trigger workflow execution
  - Calculate next run time (cron expression)
  - Update CronJob.lastRunAt, nextRunAt
```

## 🔐 Multi-Tenancy Strategy

- **Row-Level Isolation**: Every entity has `tenantId`
- **Middleware**: All queries inject `where: { tenantId }`
- **Auth Context**: User JWT contains `tenantId`
- **Workspace Switching**: UI allows switching between tenants

## 🎯 Next Steps

### Immediate
- [ ] Add `.env` files with DB connection strings
- [ ] Implement Redis for `WorkflowLockService`
- [ ] Add Better-Auth integration
- [ ] Integrate ReactFlow in WorkflowBuilder

### Short-term
- [ ] Add N+1 detection middleware
- [ ] Implement AI engine abstraction
- [ ] Add channel modules (Email, WhatsApp, Facebook)
- [ ] Build analytics/metrics module

### Long-term
- [ ] Add billing/subscription module
- [ ] Implement AI-powered workflow optimization
- [ ] Add real-time collaboration (Y.js)
- [ ] Build comprehensive dashboard

## 📝 Best Practices

### 1. Type Safety
- All DTOs defined in `packages/shared` using Zod
- Infer TypeScript types from Zod schemas
- Strict TypeScript everywhere

### 2. Module Boundaries
- `apps/web` NEVER imports from `apps/api`
- Only import from `packages/*`
- Each package has clear exports

### 3. Database Queries
- Always filter by `tenantId`
- Use Prisma transactions for multi-step operations
- Log slow queries (>100ms)

### 4. Error Handling
- Use NestJS exception filters
- Return proper HTTP status codes
- Log errors with context

### 5. Testing
- Unit tests for services
- E2E tests for critical flows
- Mock external dependencies

## 🔍 Troubleshooting

### Build Errors
```bash
# Regenerate Prisma Client
cd packages/database
pnpm db:generate

# Clean and rebuild
pnpm turbo build --force
```

### Module Resolution
- Check `tsconfig.json` for correct `baseUrl` and `paths`
- Verify `package.json` exports in workspace packages

### Database Issues
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Run `pnpm db:push` to sync schema

---

**Built with ❤️ using Turborepo, NestJS, and Next.js**
