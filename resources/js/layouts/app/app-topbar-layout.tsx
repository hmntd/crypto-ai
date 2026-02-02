import { ReactNode } from 'react'
import { Link } from '@inertiajs/react'
import AppLogo from '@/components/app-logo'
import { TopbarUser } from '@/components/TopbarUser'

type Props = {
    children: ReactNode
}

export default function AppTopbarLayout({ children }: Props) {
    return (
        <div className="flex min-h-screen flex-col bg-background">

            <header className="flex h-16 items-center justify-between border-b px-6">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <AppLogo />
                </Link>

                <TopbarUser />
            </header>

            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}
