import { useState, useEffect } from "react"
import TicketView from "../Ticket/_ViewTicket"
import TicketCreate from "../Ticket/_CreateTicket"
import Card from "./Card"
import TableContextRow from "./TableContextRow"
import TableTicketRow from "./TableTicketRow"

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

interface UserDashboardProps {
    requestId: number
}

export default function UserDashboard({ requestId }: UserDashboardProps) {  
    const [isViewOpen, setIsViewOpen] = useState<boolean>(false)
    const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
    const [ticketId, setTicketId] = useState<number>(1)
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loadingTickets, setLoadingTickets] = useState<boolean>(true)
    const [errorTickets, setErrorTickets] = useState<string>("")

    const fetchTickets = async () => {
        setLoadingTickets(true)
        setErrorTickets("")
        try {
            const response = await fetch("http://192.168.100.52:8000/api/tickets", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestId: requestId
                }),
            })
            if (response.ok) {
                const data = await response.json()
                setTickets(data)
            } else {
                setErrorTickets("Failed to fetch tickets")
            }
        } catch (err) {
            setErrorTickets("Error connecting to server")
        } finally {
            setLoadingTickets(false)
        }
    }

    useEffect(() => {
        fetchTickets()
    }, [])

    const handleViewTicket = (id: number) => {
        setTicketId(id)
        setIsViewOpen(true)
    }

    return (
        <div className="flex w-full">
            <div className="w-full h-full p-4">
                <h1 className="text-[25px] font-bold">Stats</h1>
                <div className="flex flex-wrap gap-4 mt-4 justify-start">
                    <Card title="Total Tickets" value={tickets.length} description="Your submitted tickets" />
                </div>
                
                <div className="w-full flex items-center justify-between mt-6">
                    <h1 className="text-[25px] font-bold">My Tickets</h1>
                    <p onClick={() => setIsCreateOpen(true)} className="mx-10 text-[#9F4EFF] hover:text-[#7a2ccf] hover:cursor-pointer font-bold">Create Ticket</p>
                </div>
                <div className="relative w-full min-h-17 my-4 bg-white rounded-[20px] border-[#E2E8F0] border overflow-auto">
                    <TableContextRow field={["Category", "Title & Description", "Priority", "Status", "Location", "Assigned To", "Action"]} colspan={[1, 5, 1, 1, 2, 2, 1]} totalCols={13} />        
                    {loadingTickets && <div className="p-4 text-center">Loading tickets...</div>}
                    {errorTickets && <div className="p-4 text-center text-red-500">{errorTickets}</div>}                    
                    {!loadingTickets && !errorTickets && tickets.length === 0 && (
                        <div className="p-4 text-center text-gray-500">No tickets found.</div>
                    )}
                    {!loadingTickets && !errorTickets && tickets.map((ticket) => (
                        <TableTicketRow 
                            key={ticket.ticketId} 
                            onView={() => handleViewTicket(ticket.ticketId)} 
                            ticket={ticket}
                        />
                    ))}
                </div>

                <TicketView isOpen={isViewOpen} onClose={() => { setIsViewOpen(false); fetchTickets(); }} ticketId={ticketId} requestId={requestId} />
                <TicketCreate isOpen={isCreateOpen} onClose={() => { setIsCreateOpen(false); fetchTickets(); }} requestId={requestId} />
            </div>
        </div>
    )
}