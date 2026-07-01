import { usePage } from '@inertiajs/react';
import { HasAbility } from './utils';

export function can(permission) {
    const { permissions } = usePage().props.auth;

    return HasAbility(permissions, permission);
}
