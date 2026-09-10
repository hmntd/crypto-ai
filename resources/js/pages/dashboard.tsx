import { Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useMemo } from 'react'
import { CryptoRow } from '@/components/crypto-row'
import { CryptoChartPanel } from '@/components/crypto-chart-panel'
import { Search, Star, RefreshCw, Sparkles, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Dashboard() {
    const [cryptos, setCryptos] = useState<any[]>([])
    const [selectedCrypto, setSelectedCrypto] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterFavOnly, setFilterFavOnly] = useState(false)

    const fetchCryptos = () => {
        setIsLoading(true)
        fetch('/api/cryptos')
            .then(res => res.json())
            .then(data => {
                setCryptos(data)
                setIsLoading(false)
            })
            .catch(err => {
                console.error("Failed to fetch cryptos", err)
                setIsLoading(false)
            })
    }

    useEffect(() => {
        fetchCryptos()
    }, [])

    const handleFavouriteToggle = (cryptoId: number, isFavourite: boolean) => {
        setCryptos(prev =>
            prev.map(c => (c.id === cryptoId ? { ...c, is_favourite: isFavourite } : c))
        )
        if (selectedCrypto && selectedCrypto.id === cryptoId) {
            setSelectedCrypto(prev => (prev ? { ...prev, is_favourite: isFavourite } : null))
        }
    }

    const filteredCryptos = useMemo(() => {
        return cryptos.filter(crypto => {
            const matchesSearch =
                crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesFav = filterFavOnly ? crypto.is_favourite : true
            return matchesSearch && matchesFav
        })
    }, [cryptos, searchQuery, filterFavOnly])

    return (
        <AppLayout>
            <Head title="Crypto Dashboard — AI Market Analytics" />

            <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-background text-foreground">
                <div className="flex-1 flex relative overflow-hidden">

                    <motion.div
                        animate={{
                            width: selectedCrypto ? (window.innerWidth < 768 ? '100%' : 380) : '100%'
                        }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="border-r border-border bg-card/40 overflow-y-auto custom-scroll shrink-0 flex flex-col"
                    >
                        <div className={`p-6 transition-all duration-500 ease-in-out flex-1 flex flex-col
                                            ${selectedCrypto ? 'md:ml-0' : 'max-w-5xl mx-auto w-full'}`}>
                            
                            {/* Header & Controls */}
                            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight">Tracked Cryptocurrencies</h1>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Showing {filteredCryptos.length} of {cryptos.length} top market assets
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={fetchCryptos}
                                        disabled={isLoading}
                                        className="h-9 px-3 gap-1.5 text-xs font-semibold cursor-pointer"
                                    >
                                        <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                                        <span>Refresh</span>
                                    </Button>
                                </div>
                            </div>

                            {/* Search and Filters */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="relative flex-1">
                                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search by name or symbol (e.g. BTC, Solana)..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setFilterFavOnly(!filterFavOnly)}
                                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                                        filterFavOnly
                                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-500 shadow-xs'
                                            : 'bg-background border-border text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    <Star className={`w-3.5 h-3.5 ${filterFavOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
                                    <span>Favourites</span>
                                </button>
                            </div>

                            {/* Crypto List / Skeletons */}
                            {isLoading ? (
                                <div className="flex flex-col gap-3">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="h-16 rounded-xl border border-border/60 bg-muted/40 animate-pulse p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-muted" />
                                                <div className="space-y-1.5">
                                                    <div className="w-24 h-3 rounded bg-muted" />
                                                    <div className="w-12 h-2 rounded bg-muted" />
                                                </div>
                                            </div>
                                            <div className="w-16 h-4 rounded bg-muted" />
                                        </div>
                                    ))}
                                </div>
                            ) : filteredCryptos.length > 0 ? (
                                <div className="flex flex-col gap-3 flex-1">
                                    {filteredCryptos.map((crypto) => (
                                        <CryptoRow
                                            key={crypto.id}
                                            crypto={crypto}
                                            onClick={() => setSelectedCrypto(crypto)}
                                            isCollapsed={!!selectedCrypto && window.innerWidth >= 768}
                                            isSelected={selectedCrypto?.id === crypto.id}
                                            onFavouriteToggle={handleFavouriteToggle}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center border rounded-2xl border-dashed border-border bg-card/30 my-4">
                                    <Filter className="w-8 h-8 text-muted-foreground/50 mb-3" />
                                    <h3 className="font-bold text-base">No cryptocurrencies found</h3>
                                    <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
                                        {filterFavOnly ? "You haven't added any favorite coins yet. Click the star icon on any coin to add it to your favorites." : "No coins match your current search query."}
                                    </p>
                                    {filterFavOnly && (
                                        <Button size="sm" variant="outline" onClick={() => setFilterFavOnly(false)}>
                                            Show All Coins
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Chart & AI Panel */}
                    <AnimatePresence mode="popLayout">
                        {selectedCrypto ? (
                            <motion.div
                                key={selectedCrypto.id}
                                layout
                                initial={{ opacity: 0, x: window.innerWidth < 768 ? '100%' : 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: window.innerWidth < 768 ? '100%' : 50 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className={`
                                    bg-background overflow-y-auto custom-scroll z-50
                                    ${window.innerWidth < 768
                                        ? 'fixed inset-0 top-16 h-[calc(100vh-4rem)] w-full'
                                        : 'flex-1 h-full'}
                                `}>
                                <CryptoChartPanel
                                    crypto={selectedCrypto}
                                    onClose={() => setSelectedCrypto(null)}
                                    onFavouriteToggle={handleFavouriteToggle}
                                />
                            </motion.div>
                        ) : (
                            <div className="hidden md:flex flex-1 items-center justify-center flex-col p-8 text-center text-muted-foreground bg-muted/10">
                                <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500 mb-4">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-bold text-foreground">Select a Cryptocurrency</h3>
                                <p className="text-sm max-w-sm mt-1">
                                    Click on any coin from the list to view historical price charts and ask local AI for real-time market sentiment analysis.
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

        </AppLayout>
    )
}
