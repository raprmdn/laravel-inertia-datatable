import { Badge } from '@/components/ui/badge.jsx';
import { Button } from '@/components/ui/button.jsx';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card.jsx';
import DashboardLayout from '@/layouts/dashboard-layout.jsx';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRightIcon,
    BoxesIcon,
    BracesIcon,
    Code2Icon,
    ExternalLinkIcon,
    GitCompareArrowsIcon,
    NetworkIcon,
    PackageOpenIcon,
    SlidersHorizontalIcon,
} from 'lucide-react';

const demoRepositoryUrl =
    'https://github.com/raprmdn/laravel-inertia-datatable';
const packageRepositoryUrl =
    'https://github.com/raprmdn/laravel-inertia-datatables';

const learningPath = [
    {
        title: 'Basic Orders',
        description:
            'Implicit columns, groups, search, raw filters, sorting, and pagination.',
        icon: PackageOpenIcon,
        href: 'examples.basic-orders',
    },
    {
        title: 'Relationships',
        description:
            'Search and sort customer, company, country, agent, and item counts.',
        icon: NetworkIcon,
        href: 'examples.relationships',
    },
    {
        title: 'Custom Columns',
        description:
            'Aliases, JSON fields, callbacks, and business-specific ordering.',
        icon: SlidersHorizontalIcon,
        href: 'examples.custom-columns',
    },
    {
        title: 'Query Builder',
        description:
            'Use the same request contract with joined query-builder results.',
        icon: BoxesIcon,
        href: 'examples.query-builder',
    },
    {
        title: 'JSON API',
        description: 'Return a standard paginated Laravel resource response.',
        icon: BracesIcon,
        href: 'examples.api-explorer',
    },
];

export default function Dashboard() {
    return (
        <>
            <Head title="Start Here" />

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-10 p-4 md:p-6 lg:gap-14">
                <section className="grid overflow-hidden rounded-2xl border border-border bg-card lg:grid-cols-[1.25fr_0.75fr]">
                    <div className="flex flex-col justify-center gap-6 p-6 md:p-10">
                        <Badge variant="outline">
                            Public learning repository
                        </Badge>
                        <div className="flex flex-col gap-3">
                            <p className="font-mono text-sm text-primary">
                                raprmdn/laravel-inertia-datatables
                            </p>
                            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
                                Learn the query contract by following an order.
                            </h1>
                            <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                                This repository is a public, working guide to a
                                Laravel server-side datatable builder. Each
                                lesson adds one capability to the same Order
                                Operations dataset.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button asChild size="lg">
                                <Link href={route('examples.basic-orders')}>
                                    Open Basic Orders
                                    <ArrowRightIcon data-icon="inline-end" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg">
                                <a
                                    href={packageRepositoryUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Package repository
                                    <ExternalLinkIcon data-icon="inline-end" />
                                </a>
                            </Button>
                        </div>
                    </div>

                    <div className="flex min-h-72 flex-col justify-center gap-3 border-t border-border bg-muted/40 p-6 font-mono text-sm lg:border-t-0 lg:border-l lg:p-10">
                        <div className="rounded-lg border border-border bg-background p-4">
                            <span className="text-muted-foreground">01</span>{' '}
                            Order::query()
                        </div>
                        <div className="ml-4 rounded-lg border border-primary/40 bg-primary/5 p-4 text-primary">
                            <span className="text-muted-foreground">02</span>{' '}
                            ColumnDefinition[]
                        </div>
                        <div className="ml-8 rounded-lg border border-border bg-background p-4">
                            <span className="text-muted-foreground">03</span>{' '}
                            URL → paginator
                        </div>
                    </div>
                </section>

                <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Operations</CardTitle>
                            <CardDescription>
                                A connected domain large enough to teach real
                                table behavior without hiding it behind
                                scaffolding.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                                {[
                                    'Country',
                                    'Company',
                                    'Customer',
                                    'Order',
                                    'Order Item',
                                ].map((model, index) => (
                                    <span key={model} className="contents">
                                        <Badge variant="secondary">
                                            {model}
                                        </Badge>
                                        {index < 4 && (
                                            <ArrowRightIcon className="size-3 text-muted-foreground" />
                                        )}
                                    </span>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="text-sm text-muted-foreground">
                            Agents are assigned independently; authentication
                            users remain separate from the demo domain.
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>What the package owns</CardTitle>
                            <CardDescription>
                                Backend query behavior stays presentation-layer
                                agnostic.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 sm:grid-cols-2">
                            {[
                                'Allowlisted search and filters',
                                'Validated date boundaries',
                                'Safe sortable columns',
                                'Bounded pagination output',
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3 rounded-lg border border-border p-3 text-sm"
                                >
                                    <Code2Icon className="size-4 text-primary" />
                                    {item}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </section>

                <section className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <p className="font-mono text-xs font-medium tracking-widest text-primary uppercase">
                            Ordered learning path
                        </p>
                        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                            One table concept at a time
                        </h2>
                        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                            Follow the six lessons in order or jump directly to
                            the concept you need.
                        </p>
                    </div>

                    <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {learningPath.map((item, index) => (
                            <li key={item.title}>
                                <Card className="h-full border-primary/50 bg-primary/5">
                                    <CardHeader>
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-primary">
                                                <item.icon />
                                            </div>
                                            <span className="font-mono text-xs text-muted-foreground">
                                                {String(index + 1).padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </span>
                                        </div>
                                        <CardTitle>{item.title}</CardTitle>
                                        <CardDescription>
                                            {item.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardFooter className="mt-auto">
                                        <Button asChild variant="outline">
                                            <Link href={route(item.href)}>
                                                Start lesson
                                                <ArrowRightIcon data-icon="inline-end" />
                                            </Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </li>
                        ))}
                    </ol>
                </section>

                <section className="flex flex-col gap-4 rounded-xl border border-border p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-medium">Read the source</h2>
                        <p className="text-sm text-muted-foreground">
                            The demo and package repositories are intentionally
                            separate so application code stays realistic.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline">
                            <a
                                href={demoRepositoryUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Demo repository
                                <ExternalLinkIcon data-icon="inline-end" />
                            </a>
                        </Button>
                        <Button asChild variant="outline">
                            <a
                                href={packageRepositoryUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Package repository
                                <ExternalLinkIcon data-icon="inline-end" />
                            </a>
                        </Button>
                    </div>
                </section>
            </main>
        </>
    );
}

Dashboard.layout = () => [
    DashboardLayout,
    {
        breadcrumbs: [
            {
                title: 'Overview',
                href: route('dashboard'),
            },
        ],
    },
];
