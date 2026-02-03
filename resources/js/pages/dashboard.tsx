import { Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { CryptoRow } from '@/components/CryptoRow'
import { CryptoChartPanel } from '@/components/CryptoChartPanel'

export default function Dashboard() {
    const [cryptos, setCryptos] = useState<any[]>([])
    const [selectedCrypto, setSelectedCrypto] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetch('/api/cryptos')
            .then(res => res.json())
            .then(data => {
                setCryptos(data)
                setIsLoading(false)
            })
            .catch(err => console.error("Failed to fetch cryptos", err))
    }, [])

    return (
        <AppLayout>
            <Head title="Crypto Dashboard" />

            <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-background">
                <div className="flex-1 flex relative overflow-hidden">

                    <motion.div
                        animate={{
                            width: selectedCrypto ? (window.innerWidth < 768 ? '100%' : 320) : '100%'
                        }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="border-r bg-card/50 overflow-y-auto custom-scroll shrink-0"
                    >
                        <div className={`p-6 transition-all duration-500 ease-in-out
                                            ${selectedCrypto ? 'md:ml-0' : 'max-w-4xl mx-auto'}`}>
                            <h1 className="mb-6 text-2xl font-semibold">Tracked Cryptocurrencies</h1>
                            <div className="flex flex-col gap-3">
                                {cryptos.map((crypto) => (
                                    <CryptoRow
                                        key={crypto.id}
                                        crypto={crypto}
                                        onClick={() => setSelectedCrypto(crypto)}
                                        isCollapsed={!!selectedCrypto && window.innerWidth >= 768}
                                        isSelected={selectedCrypto?.id === crypto.id}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    <AnimatePresence mode="popLayout">
                        {selectedCrypto && (
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
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

        </AppLayout>
    )
}
