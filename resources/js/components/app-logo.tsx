import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <div className="flex items-center gap-2.5">
            <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 shadow-xs border border-neutral-800 dark:border-neutral-200 transition-colors">
                <AppLogoIcon className="h-4 w-auto fill-current" />
            </div>
            <span className="font-bold text-base tracking-tight text-neutral-900 dark:text-neutral-50">
                Crypto AI
            </span>
        </div>
    );
}
