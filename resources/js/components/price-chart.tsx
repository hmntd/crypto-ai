import { useState, useMemo } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    TimeScale,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'
import { enUS } from 'date-fns/locale'
import { subDays, isAfter, parseISO } from 'date-fns'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    TimeScale
)

type Props = {
    prices: {
        date: string
        price: number
    }[]
}

type Timeframe = '7D' | '30D' | '90D' | 'All'

export function PriceChart({ prices }: Props) {
    const [timeframe, setTimeframe] = useState<Timeframe>('All')

    const filteredPrices = useMemo(() => {
        if (timeframe === 'All') return prices

        const daysToSub = parseInt(timeframe)
        const cutoffDate = subDays(new Date(), daysToSub)

        return prices.filter(p => isAfter(parseISO(p.date), cutoffDate))
    }, [prices, timeframe])

    if (!filteredPrices || filteredPrices.length === 0) {
        return (
            <div className="flex h-full items-center justify-center text-muted-foreground italic">
                No data available for the selected period
            </div>
        )
    }

    const data = {
        labels: filteredPrices.map(p => p.date),
        datasets: [
            {
                label: 'Price (USD)',
                data: filteredPrices.map(p => p.price),
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6,
                tension: 0.1,
                fill: false,

                segment: {
                    borderColor: (ctx: any) => {
                        const p0 = ctx.p0.parsed.y;
                        const p1 = ctx.p1.parsed.y;
                        return p1 >= p0 ? '#ef4444' : '#22c55e';
                    }
                }
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 400 },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1e293b',
                bodyColor: '#1e293b',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 10,
                callbacks: {
                    label: (ctx: any) => {
                        const val = ctx.parsed.y;
                        return ` Price: $${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                    },
                },
            },
        },
        scales: {
            x: {
                type: 'time' as const,
                adapters: { date: { locale: enUS } },
                time: {
                    unit: timeframe === '7D' ? 'day' : 'month' as any,
                    displayFormats: {
                        day: 'MMM d',
                        month: 'MMM yyyy'
                    },
                },
                grid: { display: false },
                ticks: {
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 7,
                    font: { size: 11 }
                }
            },
            y: {
                beginAtZero: false,
                position: 'right' as const,
                ticks: {
                    font: { size: 10 },
                    callback: (value: any) => `$${value.toLocaleString()}`,
                },
                grid: {
                    color: 'rgba(0,0,0,0.05)',
                },
            },
        },
    }

    return (
        <div className="flex flex-col h-full w-full bg-card rounded-xl">
            <div className="flex justify-end p-3 gap-1">
                {(['7D', '30D', '90D', 'All'] as Timeframe[]).map((tf) => (
                    <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${timeframe === tf
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                    >
                        {tf}
                    </button>
                ))}
            </div>

            <div className="flex-1 min-h-0 w-full p-2">
                <Line data={data} options={options} />
            </div>
        </div>
    )
}