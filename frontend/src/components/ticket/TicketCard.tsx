import StatusDot from "../common/StatusDot"
import HelpIcon from '../icons/HelpIcon'
import MaintenanceIcon from "../icons/MaintenanceIcon"
import CleanIcon from "../icons/CleanIcon"
import { useState, useEffect } from "react"

const iconMap = {
    help: HelpIcon,
    clean: CleanIcon,
    maintenance: MaintenanceIcon
}

interface TicketData {
    ticketId?: number
    title: string
    description: string
    status: string
    category: 'help' | 'clean' | 'maintenance'
}

interface TicketCardProp {
    ticketId?: number
    requestId?: number
    onClick?: () => void
    isPreview?: boolean
    title?: string
    description?: string
    status?: string
    category?: 'help' | 'clean' | 'maintenance'
}

export default function TicketCard({ticketId, requestId, onClick, isPreview=false, title:preTitle, description:preDescription, status:preStatus='open', category:preCategory='help'}: TicketCardProp) {
    const [ticket, setTicket] = useState<TicketData | null>(null)
    const [loading, setLoading] = useState<boolean>(!isPreview)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isPreview) return
        if (!ticketId || !requestId) {
            setError("Ticket ID and Requestor ID are required")
            setLoading(false)
            return
        }
        const fetchTicket = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch(`http://${hidden}:8000/api/ticket-${ticketId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ticketId: ticketId,
                        requestId: requestId
                    })
                })
                if (!response.ok) {
                    const errData = await response.json()
                    throw new Error(errData.detail || "Failed to fetch ticket")
                }
                const data: TicketData = await response.json()
                setTicket(data)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchTicket()
    }, [ticketId, requestId, isPreview])
    if (isPreview) {
        const displayTitle = preTitle || "Preview"
        const displayDescription = preDescription || "Ticket description preview..."
        const RenderIcon = iconMap[preCategory] || HelpIcon

        return (
            <div onClick={onClick} className="flex items-start gap-[15px] w-[75vw] min-h-[55px] cursor-pointer hover:opacity-90 transition-opacity ml-2 mb-2">
                <div className="relative flex-shrink-0">
                    <div className="w-[65px] h-[65px] bg-[#1A5407] rounded-[15px] flex items-center justify-center shadow-md">
                        <RenderIcon className="w-10 h-10 text-white"/>
                    </div>
                    <div className="absolute -bottom-3 -right-2">
                        <StatusDot status={preStatus}/>
                    </div>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                    <h3 className="text-[#1A5407] font-semibold text-[20px] leading-[23px] truncate">
                        {displayTitle}
                    </h3>
                    <p className="text-[#2A2A2A] font-medium text-[16px] leading-[18px] line-clamp-2 max-h-12">
                        {displayDescription}
                    </p>
                </div>
            </div>
        )
    }
    if (loading) {
        return <div className="text-gray-300 text-sm ml-2 mb-2 animate-pulse">Loading ticket...</div>
    }
    if (error || !ticket) {
        return <div className="text-red-400 text-sm font-medium ml-2 mb-2">{error || "Ticket not found"}</div>
    }
    const { title, description, status, category } = ticket
    const RenderIcon = iconMap[category] || HelpIcon
    return (
        <div onClick={onClick} className="flex items-start gap-[15px] w-full max-w-[75vw] min-h-[55px] cursor-pointer hover:opacity-90 transition-opacity ml-2 mb-2">
            <div className="relative flex-shrink-0">
                <div className="w-[65px] h-[65px] bg-[#1A5407] rounded-[15px] flex items-center justify-center shadow-md">
                    <RenderIcon className="w-10 h-10"/>
                </div>
                <div className="absolute -bottom-3 -right-2">
                    <StatusDot status={status}/>
                </div>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
                <h3 className="text-[#1A5407] font-semibold text-[20px] leading-[23px] truncate">
                    {title}
                </h3>
                <p className="text-[#2A2A2A] font-medium text-[16px] leading-[18px] line-clamp-2 max-h-12">
                    {description}
                </p>
            </div>
        </div>
    )
}