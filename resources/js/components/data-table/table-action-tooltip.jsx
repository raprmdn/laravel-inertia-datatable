import { Link } from '@inertiajs/react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip.jsx';

export default function TableActionTooltip({ href, label, icon: Icon }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    href={href}
                    className="cursor-pointer rounded-xl p-1.5 transition duration-150 hover:bg-muted focus:outline-none"
                >
                    <Icon className="size-5 text-primary" />
                </Link>
            </TooltipTrigger>
            <TooltipContent className="bg-primary text-primary-foreground shadow [&_[data-slot=tooltip-arrow]]:bg-primary [&_[data-slot=tooltip-arrow]]:fill-primary">
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    );
}
