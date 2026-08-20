import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import PageWrapper from '../components/layout/PageWrapper'
import TicketCard from '../components/ticket & category/TicketCard'
import ActionBar from '../components/layout/ActionBar'
import SectionHeader from '../components/ticket & category/SectionHeader'
import TicketToast from '../components/ticket & category/TicketToast'
import FilterSheet from '../components/ticket & category/FilterSheet'
import Confidential from '../../../confidential'

interface Ticket {
    ticketId: number
    userId: number
    staffId: number | null
    title: string
    description: string
    status: string
    category: string
}

const STATUSES = ['Open', 'In-Progress', 'Resolved', 'Closed']

export default function Home() {
    const navigate = useNavigate()
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [toastState, setToastState] = useState<{ type: 'made' | 'deleted', title: string } | null>(null)
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const currentUserId = 3
    const fetchTickets = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`http://0.0.0.0:8000/api/tickets`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId: currentUserId, allowOpen:'T' }),
            })
            if (response.ok) {
                const data: Ticket[] = await response.json()
                setTickets(data)
            }
        } catch (error) {
            console.error("Failed to fetch tickets:", error)
        } finally {
            setIsLoading(false)
        }
    }, [currentUserId])

    useEffect(() => {
        fetchTickets()
    }, [fetchTickets])

    const handleSearchResults = (matchedIds: number[] | null) => {
        if (matchedIds === null) {
            fetchTickets()
        } else {
            setTickets((prev) => prev.filter((ticket) => matchedIds.includes(ticket.ticketId)))
        }
    }

    return (
        <div className="overflow-x-hidden min-h-screen bg-[#14452F] flex flex-col items-center relative">
            <Header 
                userName={String(currentUserId)} 
                avatarUrl={Confidential({ x: 1 })} 
                showSearch={true}
                userId={currentUserId}
                onSearchResults={handleSearchResults}
                page='admin'
            />

            <PageWrapper title="Tickets" page='admin'>
                <div className="flex flex-col gap-2">
                    {isLoading ? (
                        <p className="text-center py-8 text-gray-500 font-medium">Loading tickets...</p>
                    ) : (
                        STATUSES.map((status) => {
                            const statusTickets = tickets.filter(
                                (ticket) => ticket.status.toLowerCase() === status.toLowerCase()
                            )
                            return (
                                <div key={status} className="flex flex-col">
                                    <SectionHeader status={status} page='admin'/>
                                    {statusTickets.length > 0 ? (
                                        statusTickets.map((ticket) => (
                                            <TicketCard
                                                key={ticket.ticketId}
                                                ticketId={ticket.ticketId}
                                                requestId={currentUserId}
                                                onClick={() => navigate(`/admin/ticket-${ticket.ticketId}/view`)}
                                            />
                                        ))
                                    ) : (
                                        <p className="text-gray-400 text-sm italic pl-4 py-2">
                                            No {status.toLowerCase()} tickets
                                        </p>
                                    )}
                                </div>
                            )
                        })
                    )}
                </div>
            </PageWrapper>

            <ActionBar 
                onFilterClick={() => setIsFilterOpen((prev) => !prev)}
                onRefreshClick={fetchTickets} 
                onCreateClick={() => navigate('/ticket/create')}
                pram={['F', 'R']}
                page='admin'
            />

            <FilterSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
            
            {toastState && !isFilterOpen && ( 
                <TicketToast 
                    type={toastState.type} 
                    ticket={toastState.title} 
                    onClose={() => setToastState(null)}
                />
            )}
        </div>
    )
}