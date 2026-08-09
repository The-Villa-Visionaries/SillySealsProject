import FilterIcon from "../icons/FilterIcon"
import RefreshIcon from "../icons/RefreshIcon"

interface ActionBarProps {
    onFilterClick?: () => void
    onRefreshClick?: () => void
    onCreateClick?: () => void
}

export default function ActionBar({onFilterClick, onRefreshClick, onCreateClick}: ActionBarProps) {
    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[80vw] z-30 flex items-center justify-between gap-3">
            <button type="button" onClick={onFilterClick} aria-label="Filter Tickets" className="w-[65px] h-[65px] bg-gradient-to-b from-[#14452F] to-[#1A5407] rounded-[20px] flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform shrink-0 cursor-pointer">
                <FilterIcon/>
            </button>
            <button type="button" onClick={onRefreshClick} aria-label="Refresh Tickets" className="w-[65px] h-[65px] bg-gradient-to-b from-[#14452F] to-[#1A5407] rounded-[20px] flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform shrink-0 cursor-pointer">
                <RefreshIcon/>
            </button>
            <button type="button" onClick={onCreateClick} className="h-[65px] flex-1 bg-gradient-to-b from-[#14452F] to-[#1A5407] rounded-[20px] flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform font-black italic text-[22px] leading-[25px] tracking-wide cursor-pointer">
                Create Ticket
            </button>
        </div>
    )
}