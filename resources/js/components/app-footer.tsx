import { Link } from '@inertiajs/react'
import AppLogo from './app-logo'
import { Sparkles, Shield, Cpu, ExternalLink } from 'lucide-react'

export function AppFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-sidebar-border/80 bg-background/50 backdrop-blur-md transition-colors">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Section */}
                    <div className="space-y-4 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2">
                            <AppLogo />
                        </Link>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            AI-driven cryptocurrency tracking platform monitoring 15 top market assets with daily updates, custom price alerts, and automated trading sentiment analysis.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI Engine v2.4 Active</span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Platform</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home Page</Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">Crypto Dashboard</Link>
                            </li>
                            <li>
                                <Link href="/settings/integrations" className="text-muted-foreground hover:text-foreground transition-colors">Notifications & Integrations</Link>
                            </li>
                            <li>
                                <Link href="/settings/profile" className="text-muted-foreground hover:text-foreground transition-colors">User Profile</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Core Features</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Cpu className="w-3.5 h-3.5 text-primary" />
                                <span>15 Top Crypto Assets</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                <span>Local LLM Caching</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Shield className="w-3.5 h-3.5 text-primary" />
                                <span>Slack & Telegram Alerts</span>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="https://laravel.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <span>Laravel Framework</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://inertiajs.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <span>Inertia.js + React</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://coingecko.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <span>CoinGecko API</span>
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-6 border-t border-sidebar-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p>© {currentYear} Crypto AI Platform. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <span>Real-time price calculations</span>
                        <span>•</span>
                        <span>DB AI Cache System</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
