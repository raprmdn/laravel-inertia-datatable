import { usePage } from '@inertiajs/react';

export function __(key, replace = {}, page = null) {
    let translations;

    try {
        const props = page?.props || usePage().props;
        translations = props.localization?.translations || {};
    } catch (e) {
        translations = {};
    }

    let translation = translations[key] ? translations[key] : key;

    Object.keys(replace).forEach(function (k) {
        translation = translation.replace(':' + k, replace[k]);
    });

    return translation;
}
