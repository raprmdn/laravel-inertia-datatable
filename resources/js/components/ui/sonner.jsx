import { useFlashToast } from '@/hooks/use-flash-toast';
import { useAppearance } from '@/hooks/use-appearance';
import { Toaster as Sonner } from 'sonner';

function Toaster({ ...props }) {
    const { appearance } = useAppearance();

    useFlashToast();

    return (<Sonner theme={appearance} className="toaster group" position="bottom-right" style={{
            '--normal-bg': 'var(--popover)',
            '--normal-text': 'var(--popover-foreground)',
            '--normal-border': 'var(--border)',
        }} {...props}/>);
}

export { Toaster };

