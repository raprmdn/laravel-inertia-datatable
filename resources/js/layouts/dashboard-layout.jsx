import { DashboardShell } from '@/components/layouts/dashboard-shell.jsx';
import { DashboardSidebar } from '@/components/layouts/dashboard-sidebar.jsx';
import { DashboardContent } from '@/components/layouts/dashboard-content.jsx';
import { DashboardSidebarHeader } from '@/components/layouts/dashboard-sidebar-header.jsx';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function DashboardLayout({ children, breadcrumbs = [] }) {
    const { flash } = usePage().props;

    useEffect(() => {
        const { toast: flashToast } = flash;
        if (flashToast?.type) {
            toast[flashToast.type](flashToast.message, {
                duration: 5000,
                position: 'top-center',
            });
        }
    }, [flash]);

    return (
        <DashboardShell>
            <DashboardSidebar />
            <DashboardContent className="overflow-x-hidden">
                <DashboardSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </DashboardContent>
        </DashboardShell>
    );
}
