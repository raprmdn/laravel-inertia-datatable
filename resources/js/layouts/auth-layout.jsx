import { Link } from '@inertiajs/react';
// import {
//     Carousel,
//     CarouselContent,
//     CarouselBullets,
//     CarouselItem,
// } from '@/components/ui/carousel';
// import Autoplay from 'embla-carousel-autoplay';

export default function AuthLayout({ children }) {
    return (
        <div vaul-drawer-wrapper="">
            <div className="bg-background min-h-screen p-2 sm:p-3 lg:p-4">
                <div className="grid min-h-[calc(100vh-1rem)] grid-cols-1 gap-2 sm:min-h-[calc(100vh-1.5rem)] sm:gap-3 lg:min-h-[calc(100vh-2rem)] lg:gap-4 xl:grid-cols-[3.9fr_2fr]">
                    <div className="border flex flex-col justify-between rounded-2xl bg-white dark:bg-card px-4 py-12 shadow-xl sm:px-6 lg:px-16">
                        <div className="flex flex-1 flex-col justify-center">
                            {children}
                        </div>
                        <div className="text-muted-foreground flex flex-col-reverse items-center justify-between gap-y-2 text-sm md:flex-row">
                            <p>
                                &copy; {new Date().getFullYear()} Copyrights. All
                                rights reserved.
                            </p>
                            <Link href={route('login')}>Privacy Policy</Link>
                        </div>
                    </div>

                    <div className="bg-background relative hidden overflow-hidden rounded-2xl shadow-xl xl:block border">
                        {/*<Carousel*/}
                        {/*    className="h-full w-full"*/}
                        {/*    opts={{*/}
                        {/*        loop: true,*/}
                        {/*    }}*/}
                        {/*    plugins={[*/}
                        {/*        Autoplay({*/}
                        {/*            delay: 2000,*/}
                        {/*        }),*/}
                        {/*    ]}*/}
                        {/*>*/}
                        {/*    <CarouselContent className="h-full">*/}
                        {/*        {[*/}
                        {/*            {*/}
                        {/*                src: '/carousel/slide-1.svg',*/}
                        {/*                title: 'Manage All Tickets in One Dashboard',*/}
                        {/*                description:*/}
                        {/*                    'Track, respond to, and resolve customer tickets more efficiently in a single, organized workspace.',*/}
                        {/*            },*/}
                        {/*            {*/}
                        {/*                src: '/carousel/slide-2.svg',*/}
                        {/*                title: 'Respond Faster, Stay in Control',*/}
                        {/*                description:*/}
                        {/*                    'Assign tickets, monitor statuses, and ensure no customer request is missed.',*/}
                        {/*            },*/}
                        {/*            {*/}
                        {/*                src: '/carousel/slide-3.svg',*/}
                        {/*                title: 'Ensure Every Ticket Gets Resolved',*/}
                        {/*                description:*/}
                        {/*                    'Manage priorities, track SLAs, and deliver better support experiences.',*/}
                        {/*            },*/}
                        {/*        ].map((slide, index) => (*/}
                        {/*            <CarouselItem*/}
                        {/*                key={index}*/}
                        {/*                className="relative h-full min-h-[calc(100vh-2rem)]"*/}
                        {/*            >*/}
                        {/*                <div className="absolute top-10 right-0 left-0 z-10 flex flex-col items-center p-8 text-center text-white">*/}
                        {/*                    <h3 className="text-3xl leading-relaxed font-bold">*/}
                        {/*                        {slide.title}*/}
                        {/*                    </h3>*/}
                        {/*                    <p className="mt-5 max-w-sm text-sm leading-relaxed font-medium text-white">*/}
                        {/*                        {slide.description}*/}
                        {/*                    </p>*/}
                        {/*                </div>*/}

                        {/*                <img*/}
                        {/*                    alt={slide.title}*/}
                        {/*                    src={slide.src}*/}
                        {/*                    className="absolute right-0 -bottom-10 left-0 w-full object-contain object-bottom"*/}
                        {/*                />*/}
                        {/*            </CarouselItem>*/}
                        {/*        ))}*/}
                        {/*    </CarouselContent>*/}
                        {/*    <CarouselBullets className="absolute top-64 right-0 left-0" />*/}
                        {/*</Carousel>*/}
                    </div>
                </div>
            </div>
        </div>
    );
}
