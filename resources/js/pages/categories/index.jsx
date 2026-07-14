import { Head } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout.jsx';
import { __ } from '@/lib/lang.jsx';
import DataTable from '@/pages/categories/partials/data-table.jsx';

export default function Index() {
    return (
        <>
            <Head title="Categories" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        {__('Categories')}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {__('Browse and search categories.')}
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
            title: __('Categories', {}, props),
            href: route('categories.index'),
        },
    ];

    return [DashboardLayout, { breadcrumbs }];
};
