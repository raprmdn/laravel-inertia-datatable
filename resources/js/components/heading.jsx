export default function Heading({ title, description, variant = 'default', }) {
    return (<header className={variant === 'small' ? '' : 'mb-8 space-y-0.5'}>
            <h2 className={variant === 'small'
            ? 'mb-0.5 text-base font-medium'
            : 'text-xl font-semibold tracking-tight'}>
                {title}
            </h2>
            {description && (<p className="text-sm text-muted-foreground">{description}</p>)}
        </header>);
}

