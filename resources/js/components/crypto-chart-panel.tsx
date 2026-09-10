import { useState } from 'react'
import axios from 'axios'
import { Star } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button } from './ui/button'
import { PriceChart } from './price-chart'

type Props = {
    crypto: any
    onClose: () => void
    onFavouriteToggle?: (cryptoId: number, isFavourite: boolean) => void
}

type AiResult = {
    recommendation: 'BUY' | 'SELL' | 'HOLD'
    confidence: number
    reason: string
}

export function CryptoChartPanel({ crypto, onClose, onFavouriteToggle }: Props) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [aiResult, setAiResult] = useState<AiResult | null>(null)
    const [source, setSource] = useState<'llm' | 'db_cache' | 'cache' | null>(null)

    const [isFav, setIsFav] = useState<boolean>(!!crypto.is_favourite)
    const [favLoading, setFavLoading] = useState<boolean>(false)

    const toggleFav = async () => {
        if (favLoading) return
        setFavLoading(true)

        try {
            const res = await axios.post(`/api/cryptos/${crypto.id}/favourite`)
            if (res.data.success) {
                const nextFav = res.data.is_favourite
                setIsFav(nextFav)
                if (onFavouriteToggle) {
                    onFavouriteToggle(crypto.id, nextFav)
                }
                toast.success(res.data.message)
            } else {
                toast.error(res.data.message || 'Failed to update favourite')
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || 'Error updating favourite status'
            toast.error(msg)
        } finally {
            setFavLoading(false)
        }
    }

    const runAnalysis = async () => {
        if (loading) return

        setLoading(true)
        setError(null)

        try {
            const res = await axios.get(
                `/api/cryptos/${crypto.id}/ai-analysis`
            )

            setAiResult(res.data.data)
            setSource(res.data.source)
        } catch (e: any) {
            setError('AI analysis failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const badgeColor = aiResult?.recommendation === 'BUY'
        ? 'text-green-600'
        : aiResult?.recommendation === 'SELL'
            ? 'text-red-600'
            : 'text-yellow-600'

    return (
        <div className="flex h-full flex-col p-4 overflow-y-auto custom-scroll">

            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={toggleFav}
                        disabled={favLoading}
                        title={isFav ? "Remove from favourites" : "Add to favourites"}
                        className="p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                        <Star className={`w-5 h-5 ${isFav ? 'fill-amber-400 text-amber-400' : 'text-neutral-400 hover:text-amber-400'}`} />
                    </button>
                    <img
                        src={crypto.image}
                        alt={crypto.name}
                        className="h-8 w-8 rounded-full"
                    />
                    <div>
                        <div className="font-semibold flex items-center gap-2">
                            <span>{crypto.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-muted font-mono">${crypto.priceToday ? crypto.priceToday.toLocaleString() : '0'}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {crypto.symbol}
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="rounded-lg border px-3 py-1 text-sm cursor-pointer hover:bg-muted"
                >
                    Close
                </button>
            </div>

            <div className="h-[250px] shrink-0 rounded-xl border bg-muted/30">
                {crypto.prices ? (
                    <PriceChart prices={crypto.prices} />
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                        Loading chart...
                    </div>
                )}
            </div>


            <div className="mt-4 rounded-xl border p-4 space-y-3 bg-card">

                <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">
                        AI Recommendation
                    </div>

                    <Button
                        onClick={runAnalysis}
                        disabled={loading}
                        className="text-sm cursor-pointer"
                    >
                        {loading ? 'Analyzing...' : 'Ask AI'}
                    </Button>
                </div>

                {error && (
                    <div className="text-sm text-red-600">
                        {error}
                    </div>
                )}

                {aiResult && (
                    <div className="space-y-2">

                        <div className="flex items-center gap-3">
                            <div className={`text-lg font-bold ${badgeColor}`}>
                                {aiResult.recommendation}
                            </div>

                            <div className="text-xs text-muted-foreground">
                                Confidence: {aiResult.confidence}%
                            </div>

                            {source && (
                                <div className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                                    Cache: {source}
                                </div>
                            )}
                        </div>

                        <div className="h-2 w-full rounded bg-muted overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${aiResult.confidence}%` }}
                            />
                        </div>

                        <div className="text-sm text-muted-foreground">
                            {aiResult.reason}
                        </div>
                    </div>
                )}

                {!aiResult && !loading && (
                    <div className="text-sm text-muted-foreground">
                        Click "Ask AI" to get a trading recommendation based on full historical data.
                    </div>
                )}

                <div className="h-4 shrink-0" />

            </div>
        </div>
    )
}
