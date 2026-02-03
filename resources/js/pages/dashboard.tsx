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

            <div className="relative flex h-[calc(100vh-4rem)] overflow-hidden">

                <div className="flex-1 overflow-y-auto custom-scroll">
                    <motion.div
                        className="w-full max-w-4xl mx-auto flex flex-col gap-3 p-6"
                    >
                        <h1 className="mb-4 text-2xl font-semibold">
                            Tracked Cryptocurrencies
                        </h1>

                        {isLoading ? (
                            <div className="text-center py-10">Loading prices...</div>
                        ) : (
                            cryptos.map((crypto) => (
                                <CryptoRow
                                    key={crypto.id}
                                    crypto={crypto}
                                    onClick={() => setSelectedCrypto(crypto)}
                                />
                            ))
                        )}
                    </motion.div>
                </div>

                <AnimatePresence>
                    {selectedCrypto && (
                        <motion.div
                            className="
                                w-[520px] shrink-0 border-l bg-background shadow-xl
                                sticky top-0 h-[calc(100vh-4rem)]
                            "
                            initial={{ x: 520 }}
                            animate={{ x: 0 }}
                            exit={{ x: 520 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                        >
                            <CryptoChartPanel
                                crypto={selectedCrypto}
                                onClose={() => setSelectedCrypto(null)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </AppLayout>
    )
}
