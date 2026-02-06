import { ReactNode, useEffect, useState } from 'react'
import { Link } from '@inertiajs/react'
import AppLogo from '@/components/app-logo'
import { TopbarUser } from '@/components/topbar-user'
import { ToastContainer } from 'react-toastify';

type Props = {
    children: ReactNode
}

export default function AppTopbarLayout({ children }: Props) {
    const [toastTheme, setToastTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        const checkTheme = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setToastTheme(isDark ? 'dark' : 'light');
        };

        checkTheme();

        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-background">

            <header className="flex h-16 items-center justify-between border-b px-6">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <AppLogo />
                </Link>

                <TopbarUser />
            </header>

            <main className="flex-1">
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme={toastTheme}
                />

                {children}
            </main>
        </div>
    )
}
