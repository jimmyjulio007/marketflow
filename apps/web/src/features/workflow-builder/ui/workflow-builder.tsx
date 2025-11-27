'use client';

import React from 'react';
import { useWorkflowStore } from '@/entities/workflow/model/workflow.store';

export const WorkflowBuilder = () => {
    const { nodes, edges } = useWorkflowStore();

    return (
        <div className="h-[600px] w-full border rounded-lg bg-slate-50 p-4 relative">
            <div className="absolute top-4 left-4 bg-white p-2 shadow rounded">
                <h2 className="font-bold">Workflow Builder</h2>
                <p className="text-sm text-gray-500">{nodes.length} nodes, {edges.length} edges</p>
            </div>

            <div className="flex items-center justify-center h-full text-gray-400">
                Canvas Placeholder (Integrate ReactFlow here)
            </div>
        </div>
    );
};
