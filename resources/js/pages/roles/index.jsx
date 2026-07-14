import { Head } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout.jsx';
import { __ } from '@/lib/lang.jsx';
import DataTable from '@/pages/roles/partials/data-table.jsx';

export default function Index() {
    return (
        <>
            <Head title="Roles" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        {__('Roles')}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {__('Browse and filter application roles.')}
                    </p>
                </div>

                <DataTable />
            </div>
        </>
    );
}

Index.layout = (props) => {
    const breadcrumbs = [
        {
            title: __('Roles', {}, props),
            href: route('roles.index'),
        },
    ];

    return [DashboardLayout, { breadcrumbs }];
};
