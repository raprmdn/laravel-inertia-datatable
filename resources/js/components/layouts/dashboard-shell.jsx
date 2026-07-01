import { usePage } from '@inertiajs/react';
import { SidebarProvider } from '@/components/ui/sidebar';

export function DashboardShell({ children }) {
    const isOpen = usePage().props.sidebarOpen;

    return <SidebarProvider defaultOpen={isOpen}>{children}</SidebarProvider>;
}

