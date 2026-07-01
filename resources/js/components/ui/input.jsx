import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                // Layout
                "flex h-10 w-full min-w-0 rounded-md border px-3 py-1",

                // Appearance
                "border-input bg-transparent text-base shadow-xs md:text-sm",

                // Placeholder & Selection
                "placeholder:text-muted-foreground placeholder:text-sm",
                "selection:bg-primary selection:text-primary-foreground",

                // File Input
                "file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",

                // States
                "transition-[color,box-shadow] outline-none",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:border-destructive",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",

                // Disabled
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",

                className
            )}
            {...props}
        />
    );
}

export { Input };

