import React from 'react';
import Dashboard from "@/Layouts/Dashboard.jsx";
import { Head } from "@inertiajs/react";
import DataTable from "@/Pages/Roles/Partials/DataTable.jsx";

export default function Index() {
    return (
        <>
            <Head title="Roles"/>

            <div className="flex items-center">
                <h1 className="text-lg font-bold md:text-2xl">Roles</h1>
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
        {label: 'Roles'},
    ];

    return <Dashboard children={page} breadcrumbs={breadcrumbs} />
};
