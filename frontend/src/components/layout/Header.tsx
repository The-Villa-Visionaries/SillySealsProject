import SearchIcon from '../icons/SearchIcon'
import { useState } from "react"

interface HeaderProps<T extends string | number = number> {
    userName: string
    avatarUrl: string
    showSearch?: boolean
    userId?: number
    searchMode?: 'category' | 'ticket'
    onSearchResults?: (matchedResults: T[] | null) => void
    page?: string
}

const THEMES = {
    staff: {
        bg: 'bg-[#2B94BA]',
        c1: 'bg-[#2D82AF]',
        c2: 'bg-[#2777A3]',
        border: 'border-[#4686A9]'
    },
    admin: {
        bg: 'bg-[#6B21A8]',
        c1: 'bg-[#581C87]',
        c2: 'bg-[#3B0764]',
        border: 'border-[#581C87]'
    },
    default: {
        bg: 'bg-[#0A5C36]',
        c1: 'bg-[#0F5132]',
        c2: 'bg-[#14452F]',
        border: 'border-[#0F5132]'
    }
}

export default function Header<T extends string | number = number>({userName, avatarUrl, showSearch = true, userId, searchMode = 'ticket', onSearchResults, page = 'default'}: HeaderProps<T>) {
    const theme = THEMES[page as keyof typeof THEMES] || THEMES.default
    const [searchQuery, setSearchQuery] = useState('')

    const performSearch = async (query: string) => {
        if (!query.trim()) {
            onSearchResults?.(null)
            return
        }

        try {
            const response = await fetch('http://0.0.0.0:8000/api/search', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId: userId, query, searchMode }),
            })
            if (response.ok) {
                const searchResults: Record<string, string> = await response.json()
                const keys = Object.keys(searchResults)
                const matchedResults = (searchMode === 'category' ? keys : keys.map(Number)) as unknown as T[]
                onSearchResults?.(matchedResults)
            }
        } catch (error) {
            console.error("Failed to perform search:", error)
        }
    }
    
    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault()
        e.stopPropagation()
        performSearch(searchQuery)
    }
    
    return (
        <header className={`relative w-full ${theme.bg} pt-7 pb-10 px-6 shadow-lg`}>
            <div className={`absolute -top-[50px] -left-[120px] w-[380px] h-[380px] ${theme.c1} rotate-45 pointer-events-none shadow-md`}/>
            <div className={`absolute -top-[50px] -right-[100px] w-[380px] h-[380px] ${theme.c2} rotate-45 pointer-events-none shadow-md`}/>
            <div className="relative z-10 max-w-[80vw] mx-auto space-y-5">
                <div className="flex items-center justify-between">
                    <div className="w-[72px] h-[72px]"/>
                    <div className="flex flex-col text-white items-center text-center">
                        <span className="font-extrabold text-[30px] leading-[24px]">
                            Welcome,
                        </span>
                        <span className="font-black italic text-[50px] leading-[55px] tracking-tight">
                            {userName}
                        </span>
                    </div>
                    <div className={`w-[72px] h-[72px] rounded-full border-[3px] ${theme.border} overflow-hidden shrink-0 shadow-md`}>
                        <img src={avatarUrl} alt={userName} className="w-full h-full object-cover"/>
                    </div>
                </div>
                {showSearch && (
                    <form action='javascript:void(0)' onSubmit={handleSubmit} className={`relative w-full h-[50px] bg-white border-[3px] ${theme.border} rounded-[25px] flex items-center px-3.5 shadow-sm`}>
                        <SearchIcon />
                        <input type="search" value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); if (!e.target.value.trim()) performSearch('')}} onKeyDown={(e) => {if (e.key === 'Enter') {e.preventDefault(); performSearch(searchQuery)}}} placeholder="Search" className="w-full bg-transparent text-[20px] font-normal text-slate-800 placeholder-[#8C8C8C] focus:outline-none ml-[5px]"/>
                    </form>
                )}
            </div>
        </header>
    )
}