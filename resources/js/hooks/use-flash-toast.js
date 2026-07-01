import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function useFlashToast() {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = event.detail?.flash;
            const data = flash?.toast;

            if (!data) {
                return;
            }

            toast[data.type](data.message);
        });
    }, []);
}

