import AppTopbarLayout from '@/layouts/app/app-topbar-layout'
import type { AppLayoutProps } from '@/types'

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <AppTopbarLayout>
            {children}
        </AppTopbarLayout>
    )
}
