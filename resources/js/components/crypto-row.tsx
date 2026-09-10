import { useState } from 'react'
import { Star } from 'lucide-react'
import axios from 'axios'
import { toast } from 'react-toastify'

type Props = {
    crypto: any
    isCollapsed?: boolean
    isSelected?: boolean
    onClick: () => void
    onFavouriteToggle?: (cryptoId: number, isFavourite: boolean) => void
}

export function CryptoRow({ crypto, onClick, isCollapsed, isSelected, onFavouriteToggle }: Props) {
    const [isFav, setIsFav] = useState<boolean>(!!crypto.is_favourite)
    const [favLoading, setFavLoading] = useState<boolean>(false)

    const diff = crypto.priceToday - crypto.priceYesterday
    const percent = crypto.priceYesterday ? ((diff / crypto.priceYesterday) * 100).toFixed(2) : '0.00'
    const isUp = diff >= 0

    const handleStarClick = async (e: React.MouseEvent) => {
        e.stopPropagation()
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

    return (
        <button
            onClick={onClick}
            className={`
                flex items-center gap-3 rounded-xl border p-3 text-left cursor-pointer transition-all duration-300
                ${isSelected ? 'bg-muted border-primary/50' : 'hover:bg-muted'}
                ${isCollapsed ? 'md:w-[250px] w-full justify-between' : 'w-full'}
            `}
        >
            <div className="flex items-center gap-2.5">
                <button
                    type="button"
                    onClick={handleStarClick}
                    disabled={favLoading}
                    title={isFav ? "Remove from favourites" : "Add to favourites"}
                    className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-amber-400 cursor-pointer"
                >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-400' : 'text-neutral-400 hover:text-amber-400'}`} />
                </button>

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
                    ${crypto.priceToday ? crypto.priceToday.toLocaleString() : '0'}
                </span>

                <span
                    className={`flex items-center gap-1 text-xs font-medium ${isUp ? 'text-green-500' : 'text-red-500'}`}
                >
                    {isUp ? '▲' : '▼'} {percent}%
                </span>
            </div>
        </button>
    )
}
