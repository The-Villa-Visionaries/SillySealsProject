import { ArrowUpDown, User, Circle } from "lucide-react"
import { useState } from "react"

interface FilterSheetProp {
    isOpen: boolean
    onClose?: () => void
}

export default function FilterSheet({isOpen, onClose}: FilterSheetProp) {
    const [activeFilter, setActiveFiler] = useState<'order' | 'Assigned' | 'status'>('status')

    if (!isOpen) return null
    return (
        <>
            <div onClick={onClose} className="fixed inset-0 w-screen h-screen z-40 cursor-pointer"/>
            <div className="fixed bottom-0 w-[102vw] bg-gradient-to-b from-[#14452F] to-[#1A5407] border-[5px] border-b-0 border-white rounded-t-[65px] flex flex-col items-center justify-center pt-6 pb-6 px-6 shadow-2xl z-40 animate-in slide-in-from-bottom duration-200">
                <h2 className="text-white font-black italic text-[26px] leading-none tracking-wide text-center">
                    Filter Tickets
                </h2>
                <div className="w-[75vw] h-[4px] bg-white my-3 rounded-full shrink-0"/>
                <div className="flex items-center justify-center gap-10 my-2">
                    <button type="button" onClick={() => setActiveFiler('order')} className={`w-[75px] h-[75px] rounded-[20px] flex items-center justify-center text-white transition-all cursor-pointer ${
                        activeFilter === 'order'
                            ? 'bg-[#103E28] border-2 border-white shadow-md scale-105'
                            : 'bg-[#0E3321] opacity-70 hover:opacity-100'
                    }`}>
                        <ArrowUpDown className="w-7 h-7 stroke-[2.5]"/>
                    </button>
                    <button type="button" onClick={() => setActiveFiler('Assigned')} className={`w-[75px] h-[75px] rounded-[20px] flex items-center justify-center text-white transition-all cursor-pointer ${
                        activeFilter === 'Assigned'
                            ? 'bg-[#103E28] border-2 border-white shadow-md scale-105'
                            : 'bg-[#0E3321] opacity-70 hover:opacity-100'
                    }`}>
                        <User className="w-7 h-7 stroke-[2.5]"/>
                    </button>
                    <button type="button" onClick={() => setActiveFiler('status')} className={`w-[75px] h-[75px] rounded-[20px] flex items-center justify-center text-white transition-all cursor-pointer ${
                        activeFilter === 'status'
                            ? 'bg-[#103E28] border-2 border-white shadow-md scale-105'
                            : 'bg-[#0E3321] opacity-70 hover:opacity-100'
                    }`}>
                        <Circle className="w-7 h-7 stroke-[2.5]"/>
                    </button>
                </div>
                <p className="text-white font-semibold text-[20px] mt-3 text-center">
                    {activeFilter === 'status' && "Status"}
                    {activeFilter === 'Assigned' && "Assigned"}
                    {activeFilter === 'order' && "Priority"}
                </p>
            </div>
        </>
    )
}