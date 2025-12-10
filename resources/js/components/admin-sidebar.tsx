import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Users } from 'lucide-react';
import AppLogoIconOnly from './app-logo-icon-only';

const adminNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Pendaftar',
        href: '/admin/applicants',
        icon: Users,
    },
];

export function AdminSidebar() {
    const page = usePage();

    return (
        <Sidebar
            collapsible="icon"
            variant="inset"
            className="border-r border-sidebar-border/50"
        >
            <SidebarHeader className="border-b border-sidebar-border/30 py-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="h-10 w-24"
                        >
                            <AppLogoIconOnly
                                href="/admin/dashboard"
                                size="4xl"
                            />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="py-4">
                <SidebarGroup className="px-2 py-0">
                    <SidebarGroupLabel className="px-2 py-2 text-xs font-semibold tracking-wider text-sidebar-foreground/60 uppercase">
                        Navigasi
                    </SidebarGroupLabel>
                    <SidebarMenu className="gap-1">
                        {adminNavItems.map((item) => {
                            const isActive = page.url.startsWith(
                                resolveUrl(item.href),
                            );
                            return (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive}
                                        tooltip={{ children: item.title }}
                                        className={`relative transition-all duration-200 ${
                                            isActive
                                                ? 'bg-sidebar-accent/10 font-medium text-sidebar-primary'
                                                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/5 hover:text-sidebar-foreground'
                                        }`}
                                    >
                                        <Link href={item.href} prefetch>
                                            {item.icon && (
                                                <item.icon className="h-5 w-5 shrink-0" />
                                            )}
                                            <span className="ml-2 font-medium">
                                                {item.title}
                                            </span>
                                            {isActive && (
                                                <div className="absolute top-1/2 right-0 h-6 w-1 -translate-y-1/2 rounded-l-md bg-sidebar-primary" />
                                            )}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border/30 py-4">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
