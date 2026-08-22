import { useState, useEffect, useCallback } from "react"
import Detail from "./Detail"
import Edit from "./Edit"
import Comments from "./Comments"

interface ViewProps {
    isOpen?: boolean
    onClose: () => void
    ticketId: number
    requestId: number
}

export default function View({ onClose, isOpen, ticketId, requestId }: ViewProps) {
    const [mode, setMode] = useState<"detail" | "edit" | "comments">("detail")
    const [ticketData, setTicketData] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")

    const fetchTicket = useCallback(async () => {
        if (!ticketId) return
        setLoading(true)
        setErrorMessage("")
        try {
            const response = await fetch(`http://192.168.100.52:8000/api/ticket-${ticketId}/view`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ticketId,
                    requestId,
                    allowOpen: "true"
                }),
            })

            if (response.ok) {
                const data = await response.json()
                setTicketData(data)
            } else {
                const errData = await response.json()
                setErrorMessage(errData.detail || "Failed to load ticket.")
            }
        } catch (error) {
            setErrorMessage("An error occurred while fetching the ticket.")
        } finally {
            setLoading(false)
        }
    }, [ticketId, requestId])

    useEffect(() => {
        if (isOpen && ticketId) {
            fetchTicket()
        }
    }, [isOpen, ticketId, fetchTicket])

    return (
        <div className={`w-full h-full bg-black/50 fixed top-0 left-0 z-25 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => {onClose(), setMode('detail')}}>
            <div className={`w-120 h-screen bg-white absolute top-0 right-0 z-40 pt-13 border-l border-[#E2E8F0] transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
                {loading && <div className="p-4 text-center text-[#64748B]">Loading ticket...</div>}
                {errorMessage && <div className="p-4 text-center text-red-500">{errorMessage}</div>}
                {!loading && !errorMessage && ticketData && (
                    <>
                        {mode === 'detail' && <Detail ticket={ticketData} switchEdit={() => setMode('edit')} switchComments={() => setMode('comments')} requestId={requestId} onClose={onClose} />}
                        {mode === 'edit' && <Edit ticket={ticketData} switchDetail={() => setMode('detail')} reloadTicket={fetchTicket} requestId={requestId}/>}
                        {mode === 'comments' && <Comments ticket={ticketData} switchDetail={() => setMode('detail')} />}
                    </>
                )}
            </div>
        </div>
    )
}