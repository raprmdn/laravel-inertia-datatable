import { Badge } from '@/components/ui/badge.jsx';

export default function ExampleHeader({
    lesson,
    title,
    description,
    features = [],
}) {
    return (
        <header className="flex flex-col gap-5 border-b border-border pb-6">
            <div className="flex flex-col gap-2">
                <p className="font-mono text-xs font-medium tracking-widest text-primary uppercase">
                    {lesson}
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                    {title}
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
                    {description}
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                {features.map((feature) => (
                    <Badge key={feature} variant="secondary">
                        {feature}
                    </Badge>
                ))}
            </div>
        </header>
    );
}
