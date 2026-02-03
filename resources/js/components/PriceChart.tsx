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

export function PriceChart({ prices }: Props) {
    if (!prices || prices.length === 0) {
        return <div className="flex h-full items-center justify-center text-muted-foreground">No data available</div>
    }

    const data = {
        labels: prices.map(p => p.date),
        datasets: [
            {
                label: 'Price (USD)',
                data: prices.map(p => p.price),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
                tension: 0.2,
                fill: true,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 500,
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1e293b',
                bodyColor: '#1e293b',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                callbacks: {
                    label: (ctx: any) => {
                        return ` Price: $${ctx.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                    },
                },
            },
        },
        scales: {
            x: {
                type: 'time' as const,
                adapters: {
                    date: {
                        locale: enUS,
                    },
                },
                time: {
                    unit: 'day' as const,
                    displayFormats: {
                        day: 'MMM d',
                    },
                },
                grid: {
                    display: false,
                },
                ticks: {
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 7,
                }
            },
            y: {
                beginAtZero: false,
                ticks: {
                    callback: (value: any) => `$${value.toLocaleString()}`,
                },
                grid: {
                    color: 'rgba(0,0,0,0.05)',
                },
            },
        },
    }

    return (
        <div className="h-[250px] w-full p-2">
            <Line data={data} options={options} />
        </div>
    )
}