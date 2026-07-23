import { Link, usePage } from '@inertiajs/react';
import {
    BookOpenIcon,
    BoxesIcon,
    BracesIcon,
    GitCompareArrowsIcon,
    NetworkIcon,
    ShoppingCartIcon,
    SlidersHorizontalIcon,
    Settings,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { __ } from '@/lib/lang.jsx';

export function DashboardSidebar() {
    const page = usePage();
    const isAuthenticated = Boolean(page.props.auth.user);

    const navGroups = [
        {
            title: 'Start Here',
            items: [
                {
                    title: __('Overview', {}, page),
                    href: route('dashboard'),
                    icon: BookOpenIcon,
                    routeName: 'dashboard',
                },
            ],
        },
        {
            title: 'Core',
            items: [
                {
                    title: __('Basic Orders', {}, page),
                    href: route('examples.basic-orders'),
                    icon: ShoppingCartIcon,
                    routeName: 'examples.basic-orders',
                },
            ],
        },
        {
            title: 'Relationships',
            items: [
                {
                    title: __('Orders & Customers', {}, page),
                    href: route('examples.relationships'),
                    icon: NetworkIcon,
                    routeName: 'examples.relationships',
                },
            ],
        },
        {
            title: 'Advanced',
            items: [
                {
                    title: __('Custom Columns', {}, page),
                    href: route('examples.custom-columns'),
                    icon: SlidersHorizontalIcon,
                    routeName: 'examples.custom-columns',
                },
                {
                    title: __('Query Builder', {}, page),
                    href: route('examples.query-builder'),
                    icon: BoxesIcon,
                    routeName: 'examples.query-builder',
                },
            ],
        },
        {
            title: 'Integration',
            items: [
                {
                    title: __('API Explorer', {}, page),
                    href: route('examples.api-explorer'),
                    icon: BracesIcon,
                    routeName: 'examples.api-explorer',
                },
            ],
        },
        isAuthenticated && {
            title: 'Account Center',
            items: [
                {
                    title: __('Settings', {}, page),
                    href: route('profile.edit'),
                    icon: Settings,
                    routeName: [
                        'settings',
                        'profile.*',
                        'security.*',
                        'appearance.*',
                    ],
                    items: [
                        {
                            title: __('Profile', {}, page),
                            href: route('profile.edit'),
                            routeName: 'profile.*',
                        },
                        {
                            title: __('Security', {}, page),
                            href: route('security.edit'),
                            routeName: 'security.*',
                        },
                        {
                            title: __('Appearance', {}, page),
                            href: route('appearance.edit'),
                            routeName: 'appearance.*',
                        },
                    ],
                },
            ],
        },
    ]
        .filter(Boolean)
        .map((group) => ({
            ...group,
            items: group.items.map((item) => {
                const items = item.items?.map((subItem) => {
                    const current = Array.isArray(subItem.routeName)
                        ? subItem.routeName.some((routeName) =>
                              route().current(routeName),
                          )
                        : route().current(subItem.routeName);

                    return {
                        ...subItem,
                        current,
                    };
                });

                const current = Boolean(
                    (Array.isArray(item.routeName)
                        ? item.routeName.some((routeName) =>
                              route().current(routeName),
                          )
                        : route().current(item.routeName)) ||
                    items?.some((subItem) => subItem.current),
                );

                return {
                    ...item,
                    items,
                    current,
                };
            }),
        }));

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('dashboard')}>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={navGroups} />
            </SidebarContent>
        </Sidebar>
    );
}
