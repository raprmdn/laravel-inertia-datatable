import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
// import AuthLayout from '@/layouts/auth-layout';
// import DashboardLayout from '@/layouts/dashboard-layout.jsx';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    // layout: (name) => {
    //     switch (true) {
    //         case name === 'welcome':
    //             return null;
    //         case name.startsWith('auth/'):
    //             return AuthLayout;
    //         // case name.startsWith('settings/'):
    //         //     return [AppLayout, SettingsLayout];
    //         default:
    //             return DashboardLayout;
    //     }
    // },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
