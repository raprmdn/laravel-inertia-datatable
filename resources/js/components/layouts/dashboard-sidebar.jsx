import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Settings,
    ShieldCheck,
    Tags,
    UserIcon,
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

    const navGroups = [
        {
            title: 'Platform',
            permission: null,
            items: [
                {
                    title: __('Dashboard', {}, page),
                    href: route('dashboard'),
                    icon: LayoutGrid,
                    permission: null,
                    badge: null,
                    routeName: 'dashboard',
                },
            ],
        },
        {
            title: 'Example Usage',
            permission: null,
            items: [
                {
                    title: __('Categories', {}, page),
                    href: route('categories.index'),
                    icon: Tags,
                    permission: null,
                    badge: null,
                    routeName: 'categories.*',
                },
                {
                    title: __('Users', {}, page),
                    href: route('users.index'),
                    icon: UserIcon,
                    permission: null,
                    badge: null,
                    routeName: 'users.*',
                },
                {
                    title: __('Roles', {}, page),
                    href: route('roles.index'),
                    icon: ShieldCheck,
                    permission: null,
                    badge: null,
                    routeName: 'roles.*',
                },
            ],
        },
        {
            title: 'Account Center',
            permission: null,
            items: [
                {
                    title: __('Settings', {}, page),
                    href: route('profile.edit'),
                    icon: Settings,
                    permission: null,
                    badge: null,
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
                            permission: null,
                            badge: null,
                            routeName: 'profile.*',
                        },
                        {
                            title: __('Security', {}, page),
                            href: route('security.edit'),
                            permission: null,
                            badge: null,
                            routeName: 'security.*',
                        },
                        {
                            title: __('Appearance', {}, page),
                            href: route('appearance.edit'),
                            permission: null,
                            badge: null,
                            routeName: 'appearance.*',
                        },
                    ],
                },
            ],
        },
    ].map((group) => ({
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
