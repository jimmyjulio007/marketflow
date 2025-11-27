import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Swagger/OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('NextFlow API')
    .setDescription(`
      **NextFlow** - Production-Grade Durable Workflow Orchestration Platform
      
      ## Features
      - 🔐 **Authentication & Authorization** - JWT-based auth with multi-tenant support
      - 👥 **Multi-Tenancy** - Complete workspace and tenant management
      - 📝 **Workflow Engine** - Create and execute durable, long-running workflows
      - ⏰ **Cron Jobs** - Schedule workflows with cron expressions
      - 📡 **Event System** - Webhook intake for WhatsApp, Facebook, and custom events
      - 👤 **User Management** - Complete user CRUD with preferences
      
      ## Authentication
      Most endpoints require JWT authentication. Get your token from:
      - \`POST /auth/login\` - Login with email/password
      - \`POST /auth/register\` - Create new account
      
      Then include the token in the \`Authorization\` header:
      \`\`\`
      Authorization: Bearer YOUR_JWT_TOKEN
      \`\`\`
      
      ## Rate Limiting
      - **Development**: No limits
      - **Production**: 100 requests per minute per IP
      
      ## Webhooks
      External webhooks are available at:
      - \`POST /events/webhooks/whatsapp\` - WhatsApp Cloud API webhooks
      - \`POST /events/webhooks/facebook\` - Facebook Messenger webhooks
      
      ## Support
      For API support, contact: support@nextflow.io
    `)
    .setVersion('1.0.0')
    .setContact(
      'NextFlow Support',
      'https://nextflow.io',
      'support@nextflow.io'
    )
    .setLicense('UNLICENSED', '')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User authentication and authorization endpoints')
    .addTag('Tenants', 'Multi-tenant workspace management')
    .addTag('Users', 'User management and profiles')
    .addTag('Workflows', 'Workflow creation, execution, and management')
    .addTag('Cron Jobs', 'Scheduled workflow execution')
    .addTag('Events', 'Event intake and webhook management')
    .addServer('http://localhost:3000', 'Development')
    .addServer('https://api.nextflow.io', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'NextFlow API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo_text.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
}

void bootstrap();
