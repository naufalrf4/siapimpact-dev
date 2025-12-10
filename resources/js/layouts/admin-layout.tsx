import { AdminSidebar } from '@/components/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin-sidebar-header';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import { type PropsWithChildren } from 'react';

interface AdminLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

/**
 * Admin Layout Component with SidebarProvider
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 14.1, 14.2
 *
 * - 7.1: Display persistent sidebar navigation
 * - 7.2: Show navigation items for Dashboard, Applicants, and Settings
 * - 7.3: Navigate to corresponding section on click
 * - 7.4: Collapse sidebar into responsive menu on mobile
 * - 7.5: Highlight currently active navigation item
 */
export default function AdminLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<AdminLayoutProps>) {
    return (
        <AppShell variant="sidebar">
            <AdminSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AdminSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
