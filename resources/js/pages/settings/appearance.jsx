import { Head, setLayoutProps, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import AppearanceTabs from '@/components/appearance-tabs';
import Heading from '@/components/heading';
import { useAppearance } from '@/hooks/use-appearance';
import { __ } from '@/lib/lang.jsx';
import DashboardLayout from '@/layouts/dashboard-layout.jsx';
import SettingsLayout from '@/layouts/settings/layout.jsx';

export default function Appearance() {
    const { appearance, updateAppearance } = useAppearance();
    const { data, setData } = useForm({
        appearance,
    });

    useEffect(() => {
        setData('appearance', appearance);
    }, [appearance, setData]);

    const selectAppearance = (value) => {
        setData('appearance', value);
        updateAppearance(value);
    };

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
                <AppearanceTabs
                    value={data.appearance}
                    onValueChange={selectAppearance}
                />
            </div>
        </>
    );
}

Appearance.layout = [DashboardLayout, SettingsLayout];
