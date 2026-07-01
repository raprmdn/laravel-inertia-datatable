import * as React from 'react';
import { SidebarInset } from '@/components/ui/sidebar';

export function DashboardContent({ children, ...props }) {
    return <SidebarInset {...props}>{children}</SidebarInset>;
}

