import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Link, usePage } from '@inertiajs/react'

export function TopbarUser() {
    const user = usePage().props.auth.user

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1 cursor-pointer hover:bg-muted">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url || ''} />
                    <AvatarFallback>
                        {user.name?.charAt(0)}
                    </AvatarFallback>
                </Avatar>

                <span className="text-sm font-medium">
                    {user.name}
                </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                    <Link href="/settings/profile" className="flex items-center gap-2 w-full">Profile Settings</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    asChild
                    className="text-red-600 cursor-pointer"
                >
                    <a href="/logout" method="post" class="flex items-center gap-2 w-full">
                        Logout
                    </a>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
