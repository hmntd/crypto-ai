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
                <motion.div
                    className="flex w-full max-w-4xl flex-col gap-3 p-6 mx-auto"
                    animate={{ x: selectedCrypto ? -320 : 0 }}
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

                <AnimatePresence>
                    {selectedCrypto && (
                        <motion.div
                            className="absolute right-0 top-0 h-full w-[380px] border-l bg-background p-4 shadow-xl"
                            initial={{ x: 400 }}
                            animate={{ x: 0 }}
                            exit={{ x: 400 }}
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
