import { Sidebar } from "../../components/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden bg-white dark:bg-[#09090b]">
            <div className="hidden md:flex h-full flex-col">
                <Sidebar />
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto">
                <main className="flex-1 p-6 lg:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}