import { create } from 'zustand';

interface WorkflowState {
    nodes: any[];
    edges: any[];
    setNodes: (nodes: any[]) => void;
    setEdges: (edges: any[]) => void;
}

export const useWorkflowStore = create<WorkflowState>((set) => ({
    nodes: [],
    edges: [],
    setNodes: (nodes: any[]) => set({ nodes }),
    setEdges: (edges: any[]) => set({ edges }),
}));
