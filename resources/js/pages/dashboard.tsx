import { Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { CryptoRow } from '@/components/CryptoRow'
import { CryptoChartPanel } from '@/components/CryptoChartPanel'

const MOCK_CRYPTOS = [
    {
        id: 1,
        symbol: 'BTC',
        name: 'Bitcoin',
        image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        priceToday: 42150,
        priceYesterday: 40800,
    },
    {
        id: 2,
        symbol: 'ETH',
        name: 'Ethereum',
        image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        priceToday: 2280,
        priceYesterday: 2350,
    },
    {
        id: 3,
        symbol: 'SOL',
        name: 'Solana',
        image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
        priceToday: 96,
        priceYesterday: 91,
    },
]

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

            </div>
        </AppLayout>
    )
}
