import { Link } from '@inertiajs/react';
import {
    Carousel,
    CarouselContent,
    CarouselBullets,
    CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

export default function AuthLayout({ children }) {
    return (
        <div vaul-drawer-wrapper="">
            <div className="min-h-screen bg-background p-2 sm:p-3 lg:p-4">
                <div className="grid min-h-[calc(100vh-1rem)] grid-cols-1 gap-2 sm:min-h-[calc(100vh-1.5rem)] sm:gap-3 lg:min-h-[calc(100vh-2rem)] lg:gap-4 xl:grid-cols-[3.9fr_2fr]">
                    <div className="flex flex-col justify-between rounded-2xl border bg-white px-4 py-12 shadow-xl sm:px-6 lg:px-16 dark:bg-card">
                        <div className="flex flex-1 flex-col justify-center">
                            {children}
                        </div>
                        <div className="flex flex-col-reverse items-center justify-between gap-y-2 text-sm text-muted-foreground md:flex-row">
                            <p>
                                &copy; {new Date().getFullYear()} Copyrights.
                                All rights reserved.
                            </p>
                            <Link href={route('login')}>Privacy Policy</Link>
                        </div>
                    </div>

                    <div className="relative hidden overflow-hidden rounded-2xl border bg-background shadow-xl xl:block">
                        <Carousel
                            className="h-full w-full"
                            opts={{
                                loop: true,
                            }}
                            plugins={[
                                Autoplay({
                                    delay: 2000,
                                }),
                            ]}
                        >
                            <CarouselContent className="h-full">
                                {[
                                    {
                                        title: 'Search, Filter, and Sort Data Easily',
                                        description:
                                            'Build clean server-side tables with searchable columns, safe filters, sorting, pagination, and page limits.',
                                    },
                                    {
                                        title: 'Keep Queries Clean and Controlled',
                                        description:
                                            'Define allowed filters and sortable columns so request parameters stay predictable and secure.',
                                    },
                                    {
                                        title: 'Designed for Laravel and Inertia',
                                        description:
                                            'Connect Laravel query builders with React tables for fast, reusable, and maintainable admin pages.',
                                    },
                                ].map((slide, index) => (
                                    <CarouselItem
                                        key={index}
                                        className="relative h-full min-h-[calc(100vh-2rem)]"
                                    >
                                        <div className="absolute top-10 right-0 left-0 z-10 flex flex-col items-center p-8 text-center text-gray-900 dark:text-white">
                                            <h3 className="text-3xl leading-relaxed font-bold">
                                                {slide.title}
                                            </h3>
                                            <p className="mt-5 max-w-sm text-sm leading-relaxed font-medium text-gray-700 dark:text-gray-100">
                                                {slide.description}
                                            </p>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselBullets className="absolute top-64 right-0 left-0" />
                        </Carousel>
                    </div>
                </div>
            </div>
        </div>
    );
}
