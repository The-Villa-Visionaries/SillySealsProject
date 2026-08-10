import { useEffect } from "react"

interface TicketToastProps {
    type: 'made' | 'deleted'
    ticket: string
    onClose?: () => void
    duration?: number
}

export default function TicketToast({type, ticket, onClose, duration=3000}: TicketToastProps) {
    const isDeleted = type === 'deleted'

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose?.()
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration])
    return (
        <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[412] h-[136px] border-b-0 border-white rounded-t-[50px] flex flex-col items-center justify-center gap-2 px-6 shadow-2xl z-40 transistion-all ${
        isDeleted
            ? 'bg-gradient-to-b from-[#3D0A0A] to-[#200404]'
            : 'bg-gradient-to-b from-[#14452F] to-[#1A5407]'
        }`}>
            <h2 className="text-white font-black italic text-[24px] leading-none tracking-wide text-center">
                {isDeleted ? 'Ticket Deleted' : 'Ticket Made'}
            </h2>
            <div className="w-[80vw] h-[4px] bg-white my-1 rounded-full shrink-0"/>
            <p className="text-white font-semibold text-[20px] leading-tight text-center truncate max-w-[75vw]">
                {ticket}
            </p>
        </div>
    )
}