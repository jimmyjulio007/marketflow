import { WorkflowBuilder } from '@/features/workflow-builder/ui/workflow-builder';

export default function WorkflowsPage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Workflows</h1>
            <WorkflowBuilder />
        </div>
    );
}
