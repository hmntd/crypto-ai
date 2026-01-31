type Props = {
    crypto: any
    onClick: () => void
}

export function CryptoRow({ crypto, onClick }: Props) {
    const diff = crypto.priceToday - crypto.priceYesterday
    const percent = ((diff / crypto.priceYesterday) * 100).toFixed(2)
    const isUp = diff >= 0

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-4 rounded-xl border p-4 text-left cursor-pointer transition hover:bg-muted"
        >
            <img
                src={crypto.image}
                alt={crypto.name}
                className="h-10 w-10 rounded-full"
            />

            <div className="flex flex-col">
                <span className="font-semibold">
                    {crypto.name}
                </span>
                <span className="text-sm text-muted-foreground">
                    {crypto.symbol}
                </span>
            </div>

            <div className="ml-auto flex flex-col items-end">
                <span className="font-semibold">
                    ${crypto.priceToday.toLocaleString()}
                </span>

                <span
                    className={`flex items-center gap-1 text-sm font-medium ${isUp ? 'text-green-500' : 'text-red-500'
                        }`}
                >
                    {isUp ? '▲' : '▼'}
                    {Math.abs(diff).toFixed(2)} ({percent}%)
                </span>
            </div>
        </button>
    )
}
