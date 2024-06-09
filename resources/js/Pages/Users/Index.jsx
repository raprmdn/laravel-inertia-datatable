import React from 'react';
import Dashboard from "@/Layouts/Dashboard.jsx";
import { Head } from "@inertiajs/react";
import DataTable from "@/Pages/Users/Partials/DataTable.jsx";

export default function Index() {
    return (
        <>
            <Head title="Users"/>

            <div className="flex items-center">
                <h1 className="text-lg font-bold md:text-2xl">Users</h1>
            </div>

            <div className="flex-1 mt-5">
                <DataTable />
            </div>
        </>
    )
}

Index.layout = (page) => {
    const breadcrumbs = [
        {href: route('dashboard'), label: 'Dashboard'},
        {href: '#', label: 'Contents'},
        {label: 'Users'},
    ];

    return <Dashboard children={page} breadcrumbs={breadcrumbs} />
};
