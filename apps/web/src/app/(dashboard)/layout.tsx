export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-slate-900 text-white p-4">
                <div className="font-bold text-xl mb-8">NextFlow</div>
                <nav className="space-y-2">
                    <a href="/dashboard" className="block p-2 hover:bg-slate-800 rounded">Dashboard</a>
                    <a href="/workflows" className="block p-2 hover:bg-slate-800 rounded">Workflows</a>
                    <a href="/settings" className="block p-2 hover:bg-slate-800 rounded">Settings</a>
                </nav>
            </aside>
            <main className="flex-1 bg-slate-100">
                {children}
            </main>
        </div>
    );
}
