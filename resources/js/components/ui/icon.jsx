
export function Icon({ iconNode: IconComponent, className }) {
    if (!IconComponent) {
        return null;
    }

    return <IconComponent className={className}/>;
}

