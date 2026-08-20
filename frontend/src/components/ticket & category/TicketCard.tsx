import StatusDot from "../common/StatusDot"
import { useState, useEffect } from "react"

interface TicketData {
    ticketId?:number
    title:string
    description:string
    status:string
    category:string
}
interface TicketCardProp {
    ticketId?:number
    requestId?:number
    onClick?: () => void
    isPreview?:boolean
    title?:string
    description?:string
    status?:string
    category?:string
}

export default function TicketCard({ticketId, requestId, onClick, isPreview = false, title: preTitle, description: preDescription, status: preStatus = 'open', category: preCategory = 'help'}: TicketCardProp) {
    const [ticket, setTicket] = useState<TicketData | null>(null)
    const [categoryColor, setCategoryColor] = useState<string>('#000')
    const [loading, setLoading] = useState<boolean>(!isPreview)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isPreview) return
        if (!ticketId || !requestId) {
            setError("Ticket ID and Requestor ID are required")
            setLoading(false)
            return
        }

        const fetchTicketAndCategory = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch(`http://0.0.0.0:8000/api/ticket-${ticketId}/view`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ticketId, requestId })
                })

                if (!response.ok) {
                    const errData = await response.json()
                    throw new Error(errData.detail || "Failed to fetch ticket")
                }

                const ticketData: TicketData = await response.json()
                setTicket(ticketData)

                const catResponse = await fetch(`http://0.0.0.0:8000/api/category/color`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ requestId, name: ticketData.category })
                })

                if (catResponse.ok) {
                    const colData = await catResponse.json()
                    const hexColor = Array.isArray(colData) ? colData[0] : colData
                    if (hexColor) setCategoryColor(hexColor)
                }
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchTicketAndCategory()
    }, [ticketId, requestId, isPreview])

    if (isPreview) {
        const displayTitle = preTitle || "Preview"
        const displayDescription = preDescription || "Ticket description preview..."
        const iconUrl = `http://0.0.0.0:8000/static/icons/${preCategory}.svg`
        return (
            <div onClick={onClick} className="flex items-start gap-[15px] w-[75vw] min-h-[55px] cursor-pointer hover:opacity-90 transition-opacity ml-2 mb-2">
                <div className="relative flex-shrink-0">
                    <div 
                        style={{backgroundColor: categoryColor}}
                        className="w-[65px] h-[65px] rounded-[15px] flex items-center justify-center shadow-md"
                    >
                        <img src={iconUrl} alt={preCategory} className="w-10 h-10 object-contain brightness-0 invert block shrink-0"/>
                    </div>
                    <div className="absolute -bottom-3 -right-2">
                        <StatusDot status={preStatus}/>
                    </div>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                    <h3 
                        style={{color: categoryColor}}
                        className="font-semibold text-[20px] leading-[23px] truncate"
                    >
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
    } else if (error || !ticket) {
        return <div className="text-red-400 text-sm font-medium ml-2 mb-2">{error || "Ticket not found"}</div>
    }
    const { title, description, status, category } = ticket
    const iconUrl = `http://0.0.0.0:8000/static/icons/${category}.svg`
    return (
        <div onClick={onClick} className="flex items-start gap-[15px] w-full max-w-[75vw] min-h-[55px] cursor-pointer hover:opacity-90 transition-opacity ml-2 mb-2">
            <div className="relative flex-shrink-0">
                <div 
                    style={{backgroundColor: categoryColor}}
                    className="w-[65px] h-[65px] rounded-[15px] flex items-center justify-center shadow-md"
                >
                    <img src={iconUrl} alt={category} className="w-10 h-10 object-contain brightness-0 invert block shrink-0"/>
                </div>
                <div className="absolute -bottom-3 -right-2">
                    <StatusDot status={status}/>
                </div>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
                <h3 
                    style={{color: categoryColor}}
                    className="font-semibold text-[20px] leading-[23px] truncate"
                >
                    {title}
                </h3>
                <p className="text-[#2A2A2A] font-medium text-[16px] leading-[18px] line-clamp-2 max-h-12">
                    {description}
                </p>
            </div>
        </div>
    )
}