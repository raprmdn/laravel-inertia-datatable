import { Head } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout.jsx';
import { __ } from '@/lib/lang.jsx';
import DataTable from '@/pages/posts/partials/data-table.jsx';

export default function Index() {
    return (
        <>
            <Head title="Posts" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        {__('Posts')}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {__('Browse and filter posts.')}
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
            title: __('Posts', {}, props),
            href: route('posts.index'),
        },
    ];

    return [DashboardLayout, { breadcrumbs }];
};
