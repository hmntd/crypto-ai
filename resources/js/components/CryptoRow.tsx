type Props = {
    crypto: any
    isCollapsed?: boolean
    isSelected?: boolean
    onClick: () => void
}

export function CryptoRow({ crypto, onClick, isCollapsed, isSelected }: Props) {
    const diff = crypto.priceToday - crypto.priceYesterday
    const percent = ((diff / crypto.priceYesterday) * 100).toFixed(2)
    const isUp = diff >= 0

    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-3 rounded-xl border p-3 text-left cursor-pointer transition-all duration-300
                ${isSelected ? 'bg-muted border-primary/50' : 'hover:bg-muted'}
                ${isCollapsed ? 'md:w-[250px] w-full justify-between' : 'w-full'}
            `}
        >
            <div className="flex items-center gap-3">
                <img
                    src={crypto.image}
                    alt={crypto.name}
                    className="h-8 w-8 shrink-0 rounded-full"
                />

                <div className="flex flex-col overflow-hidden">
                    <span className="font-semibold truncate">
                        {crypto.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                        {crypto.symbol}
                    </span>
                </div>
            </div>

            <div className={`flex flex-col items-end ${isCollapsed ? 'ml-2' : 'ml-auto'}`}>
                <span className="font-semibold text-sm">
                    ${crypto.priceToday.toLocaleString()}
                </span>

                <span
                    className={`flex items-center gap-1 text-xs font-medium ${isUp ? 'text-green-500' : 'text-red-500'
                        }`}
                >
                    {isUp ? '▲' : '▼'} {percent}%
                </span>
            </div>
        </button>
    )
}
