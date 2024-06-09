import React from 'react';
import { clsx } from "clsx";

export default function InputError({ message = '', className }) {
    return message && (
        <p className={clsx(className, 'text-sm text-red-600')}>
            {message}
        </p>
    )
}
