import { useState, useEffect } from "react"
import _View from "../Ticket/_ViewTicket"
import Card from "./Card"
import TableContextRow from "./TableContextRow"
import TableRow from "./TableRow"
import _Create from "../Ticket/_CreateTicket"

interface Ticket {
    ticketId: number
    title: string
    description: string
    status: string
    categoryName: string
    locationName: string
    priorityScore: number
    assignedUid: string
    submitterUid: string
    createdAt: string
    updatedAt: string
}

export default function Main() {
    const [isViewOpen, setIsViewOpen] = useState<boolean>(false)
    const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
    const [ticketId, setTicketId] = useState<number>(1)
    const [requestId, setRequestId] = useState(1)
    
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")

    const fetchTickets = async () => {
        setLoading(true)
        setError("")
        try {
            const response = await fetch("http://192.168.100.52:8000/api/tickets", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestId: requestId,
                    allowOpen: "true"
                }),
            })
            if (response.ok) {
                const data = await response.json()
                setTickets(data)
            } else {
                setError("Failed to fetch tickets")
            }
        } catch (err) {
            setError("Error connecting to server")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTickets()
    }, [])

    const handleViewTicket = (id: number) => {
        setTicketId(id)
        setIsViewOpen(true)
    }

    const totalTickets = tickets.length
    const openTickets = tickets.filter(t => t.status === 'Open').length
    const inProgressTickets = tickets.filter(t => t.status === 'In-Progress').length
    const closedTickets = tickets.filter(t => t.status === 'Closed' || t.status === 'Resolved').length
    const criticalTickets = tickets.filter(t => t.priorityScore > 10 && t.status !== 'Closed').length 
    
    return (
        <div className="flex w-full h-full">
            <div className="w-full h-full p-4">
                <h1 className="text-[25px] font-bold">All Tickets</h1>
                <div className="flex flex-wrap gap-4 mt-4 justify-center">
                    <Card title="Total Tickets" value={totalTickets} description="Tickets in the system" />
                    <Card title="Open" value={openTickets} description="Tickets that are open" />
                    <Card title="In-Progress" value={inProgressTickets} description="Tickets that are in progress" />
                    <Card title="Closed / Resolved" value={closedTickets} description="Tickets that are closed" />
                    <Card title="Critical" value={criticalTickets} description="Tickets that are critical and unresolved" />
                </div>
                <div className="w-full min-h-17 my-4 bg-white rounded-[20px] border-[#E2E8F0] border overflow-auto">
                    <TableContextRow field={["Category", "Title & Description", "Priority", "Status", "Location", "Assigned To", "Action"]} colspan={[1, 5, 1, 1, 2, 2, 1]} totalCols={13} />
                    
                    {loading && <div className="p-4 text-center">Loading tickets...</div>}
                    {error && <div className="p-4 text-center text-red-500">{error}</div>}
                    
                    {!loading && !error && tickets.length === 0 && (
                        <div className="p-4 text-center text-gray-500">No tickets found.</div>
                    )}
                    
                    {!loading && !error && tickets.map((ticket) => (
                        <TableRow 
                            key={ticket.ticketId} 
                            onView={() => handleViewTicket(ticket.ticketId)} 
                            ticket={ticket}
                        />
                    ))}
                </div>
                <div onClick={() => setIsCreateOpen(true)} className="w-15 h-15 bg-[#9F4EFF] rounded-full fixed bottom-5 right-5 flex justify-center items-center text-white text-[30px] font-bold hover:bg-[#7a2ccf] hover:cursor-pointer transition-all duration-200 ease-in-out z-20">
                    <p className=" text-[50px] leading-[30px]">+</p>
                </div>
                <_View isOpen={isViewOpen} onClose={() => {setIsViewOpen(false); fetchTickets()}} ticketId={ticketId} requestId={requestId} />
                <_Create isOpen={isCreateOpen} onClose={() => {setIsCreateOpen(false); fetchTickets()}} requestId={requestId} />
            </div>
        </div>
    )
}