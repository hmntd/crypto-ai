import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppFooter } from '@/components/app-footer';
import { AppShell } from '@/components/app-shell';
import type { AppLayoutProps } from '@/types';

export default function AppHeaderLayout({
    children,
    breadcrumbs,
}: AppLayoutProps) {
    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent className="flex-1">{children}</AppContent>
            <AppFooter />
        </AppShell>
    );
}
