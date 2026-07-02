import { route as ziggyRoute } from 'ziggy-js';
import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import ReactDOMServer from 'react-dom/server';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance.jsx';

// Fallback so `route` is never undefined at module eval time
globalThis.route = ziggyRoute;

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title} - ${appName}` : appName),
        resolve: (name) => {
            const pages = import.meta.glob('./pages/**/*.jsx', { eager: true });
            return pages[`./pages/${name}.jsx`];
        },
        setup({ App, props }) {
            const { ziggy } = props.initialPage?.props ?? props;

            if (ziggy) {
                globalThis.Ziggy = {
                    ...ziggy,
                    location: new URL(ziggy.location),
                };
                globalThis.route = (
                    name,
                    params,
                    absolute,
                    config = globalThis.Ziggy,
                ) => ziggyRoute(name, params, absolute, config);
            }

            return (
                <TooltipProvider delayDuration={0}>
                    <App {...props} />
                    <Toaster />
                </TooltipProvider>
            );
        },
    }),
);

initializeTheme();
