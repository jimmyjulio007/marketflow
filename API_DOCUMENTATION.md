# 📚 NextFlow API Documentation

## 🎯 Overview

NextFlow now has **complete OpenAPI (Swagger) documentation** accessible at:

**📖 Documentation URL**: `http://localhost:3000/api`

The API includes comprehensive documentation for all endpoints with:
- ✅ Full request/response examples
- ✅ Authentication requirements
- ✅ Parameter descriptions
- ✅ Status codes
- ✅ Interactive "Try it out" functionality

---

## 🚀 Accessing the Documentation

### Development
1. Start the API server:
   ```bash
   cd apps/api
   pnpm dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/api
   ```

### Production
```
https://api.nextflow.io/api
```

---

## 🔐 Authentication

Most endpoints require JWT authentication. To use authenticated endpoints in Swagger:

1. **Register or Login** using the Authentication endpoints
2. Copy the JWT token from the response
3. Click the **"Authorize"** button (🔒) at the top right
4. Enter: `Bearer YOUR_JWT_TOKEN`
5. Click **"Authorize"** and **"Close"**
6. Now you can test all protected endpoints!

---

## 📋 API Modules

### 1. **Authentication** (`/auth`)
Endpoints for user registration, login, and profile management.

**Endpoints:**
- `POST /auth/register` - Create new user account
- `POST /auth/login` - Authenticate and get JWT token
- `GET /auth/me` - Get current user profile 🔒

**Example - Register:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe",
    "tenantName": "Acme Corp"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "clx123...",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "OWNER",
    "tenantId": "clx456..."
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. **Tenants** (`/tenants`) 🔒
Multi-tenant workspace management.

**Endpoints:**
- `GET /tenants` - List all tenants
- `GET /tenants/:id` - Get tenant details
- `POST /tenants` - Create new tenant
- `PUT /tenants/:id` - Update tenant
- `DELETE /tenants/:id` - Delete tenant
- `POST /tenants/:id/invite` - Invite user to tenant
- `GET /tenants/:id/users` - List tenant users

**Example - Create Tenant:**
```bash
curl -X POST http://localhost:3000/tenants \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Workspace",
    "plan": "PRO"
  }'
```

---

### 3. **Users** (`/users`) 🔒
User management and profiles.

**Endpoints:**
- `GET /users` - List all users (with tenant filter)
- `GET /users/:id` - Get user details
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `PUT /users/:id/password` - Update password

**Example - Get Users:**
```bash
curl http://localhost:3000/users?tenantId=clx123... \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 4. **Workflows** (`/workflows`) 🔒
Workflow creation, execution, and management.

**Endpoints:**
- `GET /workflows` - List all workflows
- `GET /workflows/:id` - Get workflow details
- `POST /workflows` - Create new workflow
- `PUT /workflows/:id` - Update workflow
- `DELETE /workflows/:id` - Delete workflow
- `POST /workflows/:id/execute` - Execute workflow
- `GET /workflows/:id/executions` - Get execution history

**Example - Create Workflow:**
```bash
curl -X POST http://localhost:3000/workflows \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Welcome Email Campaign",
    "description": "Sends welcome emails to new users",
    "definition": {
      "nodes": [
        {"id": "1", "type": "trigger", "data": {"event": "user.created"}},
        {"id": "2", "type": "email", "data": {"template": "welcome"}}
      ],
      "edges": [{"source": "1", "target": "2"}]
    }
  }'
```

**Example - Execute Workflow:**
```bash
curl -X POST http://localhost:3000/workflows/clx123.../execute \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "context": {
      "userId": "user123",
      "email": "user@example.com"
    }
  }'
```

---

### 5. **Cron Jobs** (`/cron-jobs`) 🔒
Scheduled workflow execution.

**Endpoints:**
- `GET /cron-jobs` - List all cron jobs
- `GET /cron-jobs/:id` - Get cron job details
- `POST /cron-jobs` - Create new cron job
- `PUT /cron-jobs/:id` - Update cron job
- `DELETE /cron-jobs/:id` - Delete cron job
- `PUT /cron-jobs/:id/toggle` - Toggle active status

**Example - Create Cron Job:**
```bash
curl -X POST http://localhost:3000/cron-jobs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "clx123...",
    "schedule": "0 9 * * *",
    "isActive": true
  }'
```

**Cron Schedule Examples:**
- `* * * * *` - Every minute
- `0 * * * *` - Every hour
- `0 9 * * *` - Daily at 9:00 AM
- `0 9 * * 1` - Every Monday at 9:00 AM
- `0 0 1 * *` - First day of every month at midnight

---

### 6. **Events** (`/events`)
Event intake and webhook management.

**Endpoints:**
- `POST /events` - Process incoming event
- `POST /events/trigger-workflow` - Trigger workflow from event
- `POST /events/webhooks/whatsapp` - WhatsApp webhook
- `GET /events/webhooks/whatsapp` - WhatsApp verification
- `POST /events/webhooks/facebook` - Facebook webhook
- `GET /events/webhooks/facebook` - Facebook verification

**Example - Trigger Workflow:**
```bash
curl -X POST http://localhost:3000/events/trigger-workflow \
  -H "Content-Type: application/json" \
  -d '{
    "workflowId": "clx123...",
    "source": "api",
    "context": {
      "customData": "value"
    }
  }'
```

**Example - WhatsApp Webhook:**
```bash
curl -X POST http://localhost:3000/events/webhooks/whatsapp \
  -H "Content-Type: application/json" \
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "id": "msg123",
            "from": "1234567890",
            "text": {"body": "Hello"}
          }]
        }
      }]
    }]
  }'
```

---

## 🔒 Security

### Authentication
- All endpoints (except `/auth/register` and `/auth/login`) require JWT authentication
- JWT tokens expire after 7 days
- Include token in `Authorization` header: `Bearer YOUR_TOKEN`

### Multi-Tenancy
- All data is isolated by `tenantId`
- Users can only access data from their tenant
- Tenant ID is extracted from JWT token

### Webhooks
- WhatsApp and Facebook webhooks support signature verification
- Set `WHATSAPP_WEBHOOK_SECRET` and `FACEBOOK_WEBHOOK_SECRET` environment variables
- Signatures are validated using HMAC SHA256

---

## 📊 Response Formats

### Success Response
```json
{
  "id": "clx123...",
  "name": "Resource Name",
  "createdAt": "2024-01-01T00:00:00.000Z",
  ...
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Common Status Codes
- `200 OK` - Success
- `201 Created` - Resource created
- `204 No Content` - Success with no response body
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid JWT token
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource

---

## 🛠 Development Tools

### Swagger UI Features
- ✅ **Interactive Testing** - Try endpoints directly from browser
- ✅ **Request/Response Examples** - See what data to send/expect
- ✅ **Schema Documentation** - Full DTO/model documentation
- ✅ **Authentication** - Test with your JWT token
- ✅ **Download Spec** - Export OpenAPI JSON/YAML

### Export OpenAPI Specification
Access the raw OpenAPI spec at:
- JSON: `http://localhost:3000/api-json`
- YAML: `http://localhost:3000/api-yaml`

### Generate Client SDKs
Use the OpenAPI spec to generate client libraries:

```bash
# TypeScript/JavaScript
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:3000/api-json \
  -g typescript-axios \
  -o ./generated/api-client

# Python
npx @openapitools/openapi-generator-cli generate \
  -i http://localhost:3000/api-json \
  -g python \
  -o ./generated/python-client
```

---

## 🎯 Best Practices

### 1. **Always Use TypeScript Types**
Import DTOs from the API package in your frontend:
```typescript
import { CreateWorkflowDto } from '@marketflow/shared';
```

### 2. **Handle Errors Gracefully**
```typescript
try {
  const response = await apiClient.post('/workflows', data);
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
  } else if (error.response?.status === 404) {
    // Handle not found
  }
}
```

### 3. **Use Query Parameters for Filtering**
```bash
GET /users?tenantId=clx123...
GET /workflows?isActive=true
```

### 4. **Validate Input Data**
All DTOs use `class-validator` decorators. Validation happens automatically.

### 5. **Pagination** (Coming Soon)
```bash
GET /workflows?page=1&limit=20
```

---

## 📝 Environment Variables

Required environment variables for the API:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/nextflow"

# Auth
JWT_SECRET="your-secret-key-change-in-production"

# Webhooks
WHATSAPP_WEBHOOK_SECRET="your-whatsapp-secret"
WHATSAPP_VERIFY_TOKEN="your-verification-token"
FACEBOOK_WEBHOOK_SECRET="your-facebook-secret"
FACEBOOK_VERIFY_TOKEN="your-verification-token"

# Server
PORT=3000
NODE_ENV=development
```

---

## 🚀 Next Steps

1. ✅ **Explore the API** - Open `http://localhost:3000/api`
2. ✅ **Test Endpoints** - Use the interactive Swagger UI
3. ✅ **Register** - Create your first user account
4. ✅ **Create Workflow** - Build your first workflow
5. ✅ **Execute** - Run your workflow

---

## 📞 Support

For API support:
- 📧 Email: support@nextflow.io
- 📚 Documentation: https://docs.nextflow.io
- 💬 Discord: https://discord.gg/nextflow

---

**Built with ❤️ using NestJS + Swagger/OpenAPI**
