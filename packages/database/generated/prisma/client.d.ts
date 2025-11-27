import * as runtime from "@prisma/client/runtime/client";
import * as $Class from "./internal/class.js";
import * as Prisma from "./internal/prismaNamespace.js";
export * as $Enums from './enums.js';
export * from "./enums.js";
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Tenants
 * const tenants = await prisma.tenant.findMany()
 * ```
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model Tenant
 *
 */
export type Tenant = Prisma.TenantModel;
/**
 * Model User
 *
 */
export type User = Prisma.UserModel;
/**
 * Model ApiKey
 *
 */
export type ApiKey = Prisma.ApiKeyModel;
/**
 * Model Workflow
 *
 */
export type Workflow = Prisma.WorkflowModel;
/**
 * Model WorkflowExecution
 *
 */
export type WorkflowExecution = Prisma.WorkflowExecutionModel;
/**
 * Model WorkflowExecutionStep
 *
 */
export type WorkflowExecutionStep = Prisma.WorkflowExecutionStepModel;
/**
 * Model CronJob
 *
 */
export type CronJob = Prisma.CronJobModel;
//# sourceMappingURL=client.d.ts.map