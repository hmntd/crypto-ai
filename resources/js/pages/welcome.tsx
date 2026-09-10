import { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';
import AppLogo from '@/components/app-logo';
import { AppFooter } from '@/components/app-footer';
import { useAppearance } from '@/hooks/use-appearance';
import { 
    Sparkles, 
    TrendingUp, 
    TrendingDown, 
    Zap, 
    Bell, 
    Database, 
    LineChart, 
    ShieldCheck, 
    Bot, 
    ArrowRight, 
    CheckCircle2,
    Lock,
    Clock,
    Sun,
    Moon
} from 'lucide-react';

interface QuickCrypto {
    symbol: string;
    name: string;
    price: number;
    change: number;
    badge: 'BUY' | 'HOLD' | 'ACCUMULATE';
}

const mockFeaturedCryptos: QuickCrypto[] = [
    { symbol: 'BTC', name: 'Bitcoin', price: 92450.00, change: 3.42, badge: 'BUY' },
    { symbol: 'ETH', name: 'Ethereum', price: 3410.50, change: 1.85, badge: 'ACCUMULATE' },
    { symbol: 'SOL', name: 'Solana', price: 198.20, change: 5.12, badge: 'BUY' },
    { symbol: 'BNB', name: 'BNB', price: 650.80, change: -0.45, badge: 'HOLD' },
    { symbol: 'XRP', name: 'XRP', price: 2.35, change: 12.40, badge: 'BUY' },
];

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const [currentTime, setCurrentTime] = useState<string>('');

    useEffect(() => {
        const update = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <Head title="Crypto AI — Autonomous Cryptocurrency Intelligence">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
                {/* Navbar */}
                <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center gap-2">
                            <AppLogo />
                        </Link>

                        <div className="flex items-center gap-3">
                            {currentTime && (
                                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-medium bg-muted text-muted-foreground rounded-full border border-border">
                                    <Clock className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                                    <span>{currentTime}</span>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => updateAppearance(resolvedAppearance === 'dark' ? 'light' : 'dark')}
                                title={`Switch to ${resolvedAppearance === 'dark' ? 'Light' : 'Dark'} mode`}
                                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                            >
                                {resolvedAppearance === 'dark' ? (
                                    <Sun className="w-4 h-4 text-amber-400" />
                                ) : (
                                    <Moon className="w-4 h-4 text-slate-700" />
                                )}
                            </button>

                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-all cursor-pointer"
                                >
                                    <span>Go to Dashboard</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link
                                        href={login()}
                                        className="rounded-xl px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-all cursor-pointer"
                                        >
                                            <span>Get Started</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24">
                    {/* Glowing background ambient lights */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute top-1/3 right-1/4 w-[400px] h-[300px] bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />

                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-500 mb-8 shadow-xs animate-fade-in">
                            <Sparkles className="w-4 h-4" />
                            <span>Autonomous Crypto Intelligence • 15 Top Coins Tracked</span>
                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl max-w-4xl mx-auto leading-[1.1] mb-6">
                            Smart Daily Market Insights Powered by <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-sky-500 bg-clip-text text-transparent">Local AI</span>
                        </h1>

                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                            Monitor top cryptocurrencies, track 7D/30D/90D market trends, receive database-cached AI recommendations, and get direct daily alerts on Slack & Telegram.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                            <Link
                                href={auth.user ? dashboard() : register()}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg hover:shadow-emerald-500/20 hover:opacity-95 transition-all cursor-pointer"
                            >
                                <span>Launch Dashboard</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>

                            <a
                                href="#features"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-8 py-3.5 text-base font-semibold text-foreground hover:bg-muted transition-all"
                            >
                                <span>Explore Features</span>
                            </a>
                        </div>

                        {/* Live Price Marquee Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
                            {mockFeaturedCryptos.map((coin) => (
                                <div key={coin.symbol} className="rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-xs hover:border-emerald-500/40 transition-all shadow-xs">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-sm">{coin.symbol}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded font-mono font-semibold ${
                                            coin.badge === 'BUY' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-sky-500/15 text-sky-500'
                                        }`}>
                                            {coin.badge}
                                        </span>
                                    </div>
                                    <div className="text-lg font-bold">${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                    <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${coin.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {coin.change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                        <span>{coin.change >= 0 ? '+' : ''}{coin.change}% (24h)</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20 bg-muted/30 border-y border-border/60">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                                Complete Autonomous Crypto Platform
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Everything you need to analyze top cryptocurrencies, manage favorites, and automate scheduled daily reports.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature 1 */}
                            <div className="rounded-2xl border border-border bg-card p-8 shadow-xs flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-6">
                                        <Bot className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">AI Sentiment & DB Caching</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                        Generates actionable Buy / Sell / Hold recommendations based on historical pricing data, persisted in a dedicated PostgreSQL DB cache.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500 pt-4 border-t border-border">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>DB Cache TTL Engine</span>
                                </div>
                            </div>

                            {/* Feature 2 */}
                            <div className="rounded-2xl border border-border bg-card p-8 shadow-xs flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center mb-6">
                                        <Bell className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">Slack & Telegram Alerts</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                        Configure custom daily report times and receive direct price alerts for your favorite coins straight to Slack & Telegram.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-sky-500 pt-4 border-t border-border">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Time-Scheduled Delivery</span>
                                </div>
                            </div>

                            {/* Feature 3 */}
                            <div className="rounded-2xl border border-border bg-card p-8 shadow-xs flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6">
                                        <LineChart className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">Favorite Coins & Charts</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                        Star your favorite cryptocurrencies for instant access and analyze dynamic 7D / 30D / 90D trend graphs with color-coded sentiment.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 pt-4 border-t border-border">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>Star Favorite System</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tech Stack Banner */}
                <section className="py-16">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-8">
                            Powered by Modern Infrastructure
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-80">
                            <span className="font-bold text-lg tracking-tight">Laravel</span>
                            <span className="font-bold text-lg tracking-tight">Inertia + React</span>
                            <span className="font-bold text-lg tracking-tight">PostgreSQL</span>
                            <span className="font-bold text-lg tracking-tight">CoinGecko API</span>
                            <span className="font-bold text-lg tracking-tight">Ollama AI</span>
                            <span className="font-bold text-lg tracking-tight">Chart.js</span>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <AppFooter />
            </div>
        </>
    );
}
