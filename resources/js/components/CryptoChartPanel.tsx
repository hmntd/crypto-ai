import { useState } from 'react'
import axios from 'axios'

type Props = {
    crypto: any
    onClose: () => void
}

type AiResult = {
    recommendation: 'BUY' | 'SELL' | 'HOLD'
    confidence: number
    reason: string
}

export function CryptoChartPanel({ crypto, onClose }: Props) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [aiResult, setAiResult] = useState<AiResult | null>(null)
    const [source, setSource] = useState<'llm' | 'cache' | null>(null)

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
        <div className="flex h-full flex-col">

            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={crypto.image}
                        className="h-8 w-8 rounded-full"
                    />
                    <div>
                        <div className="font-semibold">{crypto.name}</div>
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

            <div className="flex-1 rounded-xl border bg-muted/30 flex items-center justify-center text-muted-foreground">
                Price Chart (TradingView / Recharts)
            </div>

            <div className="mt-4 rounded-xl border p-4 space-y-3">

                <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">
                        AI Recommendation
                    </div>

                    <button
                        onClick={runAnalysis}
                        disabled={loading}
                        className="rounded-lg bg-primary px-3 py-1 text-sm text-white hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? 'Analyzing...' : 'Ask AI'}
                    </button>
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
                                <div className="text-xs text-muted-foreground">
                                    Source: {source}
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

            </div>
        </div>
    )
}
