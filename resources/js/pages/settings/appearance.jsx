import { Head, setLayoutProps } from '@inertiajs/react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { __ } from '@/lib/lang.jsx';
import DashboardLayout from '@/layouts/dashboard-layout.jsx';
import SettingsLayout from '@/layouts/settings/layout.jsx';

export default function Appearance() {
    setLayoutProps({
        breadcrumbs: [
            { title: __('Settings') },
            { title: __('Appearance'), href: route('appearance.edit') },
        ],
    });

    return (
        <>
            <Head title="Appearance settings" />

            <h1 className="sr-only">Appearance settings</h1>

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Appearance settings"
                    description="Update the appearance settings for your account"
                />
                <AppearanceTabs />
            </div>
        </>
    );
}

Appearance.layout = [DashboardLayout, SettingsLayout];
