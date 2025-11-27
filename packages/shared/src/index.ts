import { z } from 'zod';

// --- Tenant Schemas ---
export const TenantSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    plan: z.enum(['FREE', 'PRO', 'BIZ', 'ENTERPRISE']),
});

export type TenantDto = z.infer<typeof TenantSchema>;

// --- Workflow Schemas ---
export const WorkflowNodeSchema = z.object({
    id: z.string(),
    type: z.string(), // 'TRIGGER', 'ACTION', 'CONDITION', 'AI'
    position: z.object({ x: z.number(), y: z.number() }),
    data: z.record(z.any()),
});

export const WorkflowEdgeSchema = z.object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
    type: z.string().optional(),
});

export const WorkflowDefinitionSchema = z.object({
    nodes: z.array(WorkflowNodeSchema),
    edges: z.array(WorkflowEdgeSchema),
});

export const CreateWorkflowSchema = z.object({
    name: z.string().min(3),
    description: z.string().optional(),
    definition: WorkflowDefinitionSchema.optional(),
});

export type CreateWorkflowDto = z.infer<typeof CreateWorkflowSchema>;
export type WorkflowDefinition = z.infer<typeof WorkflowDefinitionSchema>;

// --- API Response Wrappers ---
export interface ApiResponse<T> {
    data: T;
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
}
