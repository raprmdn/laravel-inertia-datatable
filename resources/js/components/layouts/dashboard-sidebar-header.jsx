import { SidebarTrigger } from '@/components/ui/sidebar';
import DashboardBreadcrumbs from '@/components/layouts/dashboard-breadcrumbs.jsx';
import { NavUser } from '@/components/nav-user.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Link, usePage } from '@inertiajs/react';

export function DashboardSidebarHeader({ breadcrumbs = [] }) {
    const { auth } = usePage().props;

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-3 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex min-w-0 items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <DashboardBreadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {auth.user ? (
                <div className="shrink-0">
                    <NavUser />
                </div>
            ) : (
                <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                    <Button asChild variant="ghost" size="sm">
                        <Link href={route('login')}>Log in</Link>
                    </Button>
                    <Button asChild size="sm">
                        <Link href={route('register')}>Register</Link>
                    </Button>
                </div>
            )}
        </header>
    );
}
