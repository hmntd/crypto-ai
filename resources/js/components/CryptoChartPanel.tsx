import { useState } from 'react'
import axios from 'axios'
import { Button } from './ui/button'
import { PriceChart } from './PriceChart'

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
        console.log('crypto', crypto);

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
                        className="text-sm"
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

                <div className="h-4 shrink-0" />

            </div>
        </div>
    )
}
