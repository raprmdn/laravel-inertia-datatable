import React from 'react';
import { LoaderCircle } from "lucide-react";
import { Button } from "@/shadcn/ui/button.jsx";

export default function ButtonWithLoading({ className, processing, label, ...props }) {
    return (
        <Button
            className={className}
            disabled={processing}
            {...props}
        >
            {processing ? (
                <LoaderCircle className="w-5 h-5 text-white animate-spin" />
            ) : (
                label
            )}
        </Button>
    )
}
