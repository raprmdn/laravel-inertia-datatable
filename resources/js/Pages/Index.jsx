import { Head } from '@inertiajs/react';
import Dashboard from "@/Layouts/Dashboard.jsx";
import React from "react";

export default function Index() {

    return (
        <>
            <Head title="Dashboard"/>

            <div className="flex items-center mb-5">
                <h1 className="text-lg font-bold md:text-2xl">Dashboard</h1>
            </div>
        </>
    );
}

Index.layout = (page) => {
    const breadcrumbs = [
        { href: route('dashboard'), label: 'Dashboard' },
        { label: 'Dashboard' },
    ];

    return <Dashboard children={page} breadcrumbs={breadcrumbs} />
};
