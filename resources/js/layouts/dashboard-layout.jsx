import { DashboardShell } from '@/components/layouts/dashboard-shell.jsx';
import { DashboardSidebar } from '@/components/layouts/dashboard-sidebar.jsx';
import { DashboardContent } from '@/components/layouts/dashboard-content.jsx';
import { DashboardSidebarHeader } from '@/components/layouts/dashboard-sidebar-header.jsx';

export default function DashboardLayout({ children, breadcrumbs = [] }) {
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
