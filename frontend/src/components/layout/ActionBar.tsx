import { useState } from "react"
import FilterIcon from "../icons/FilterIcon"
import RefreshIcon from "../icons/RefreshIcon"

interface ActionBarProps {
    onFilterClick?: () => void
    onRefreshClick?: () => void
    onCreateClick?: () => void
    pram:string[]
    page?:string
}

const THEMES = {
    staff: {
        gradient: 'from-[#15293F] to-[#126AB2]',
    },
    admin: {
        gradient: 'from-[#28153E] to-[#4A12B2]',
    },
    default: {
        gradient: 'from-[#243E15] to-[#12B23F]',
    }
}

export default function ActionBar({onFilterClick, onRefreshClick, onCreateClick, pram, page='default'}: ActionBarProps) {
    const theme = THEMES[page as keyof typeof THEMES] || THEMES.default
    const showFilter = pram.includes('F')
    const showRefresh = pram.includes('R')
    const showButton = pram.includes('B')
    return (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[100vw] z-30 flex items-center justify-between gap-3 bg-white px-[10vw] py-6">
            {showFilter && (
                <button type="button" onClick={onFilterClick} aria-label="Filter Tickets" className={`w-[65px] h-[65px] bg-gradient-to-b ${theme.gradient} rounded-[20px] flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform shrink-0 cursor-pointer`}>
                    <FilterIcon/>
                </button>
            )}
            {showRefresh && (
                <button type="button" onClick={onRefreshClick} aria-label="Refresh Tickets" className={`w-[65px] h-[65px] bg-gradient-to-b ${theme.gradient} rounded-[20px] flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform shrink-0 cursor-pointer`}>
                    <RefreshIcon/>
                </button>
            )}
            {showButton && (
                <button type="button" onClick={onCreateClick} className={`h-[65px] flex-1 bg-gradient-to-b ${theme.gradient} rounded-[20px] flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform font-black italic text-[22px] leading-[25px] tracking-wide cursor-pointer`}>
                    Create
                </button>
            )}
        </div>
    )
}