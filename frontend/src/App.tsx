import { useState, useEffect, useCallback } from 'react'
import Header from './components/layout/Header'
import PageWrapper from './components/layout/PageWrapper'
import TicketCard from './components/ticket/TicketCard'
import ActionBar from './components/layout/ActionBar'
import SectionHeader from './components/ticket/SectionHeader'
import TicketToast from './components/ticket/TicketToast'
import FilterSheet from './components/ticket/FilterSheet'
import CreateTicketForm from './components/ticket/CreateTicketForm'
import ViewTicketForm from './components/ticket/ViewTicketForm'
import Confidential from '../../confidential'

interface Ticket {
    ticketId: number
    userId: number
    staffId: number | null
    title: string
    description: string
    status: string
    category: string
}

const STATUSES = ['Open', 'In-Progress', 'Resolved'];

export default function App() {
    const [currentView, setCurrentView] = useState<'My Tickets' | 'Create Ticket' | 'View Ticket'>('My Tickets');
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [toastState, setToastState] = useState<{ type: 'made' | 'deleted'; title: string } | null>(null);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const currentUserId = 3; // Naush user ID

    const fetchTickets = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://${hidden}:8000/api/tickets`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId: currentUserId }),
            });
            if (response.ok) {
                const data: Ticket[] = await response.json();
                setTickets(data);
            }
        } catch (error) {
            console.error("Failed to fetch tickets:", error);
        } finally {
            setIsLoading(false);
        }
    }, [currentUserId]);

    useEffect(() => {
        if (currentView === 'My Tickets') {
            fetchTickets();
        }
    }, [currentView, fetchTickets]);

    const toggleFilter = () => {
        setIsFilterOpen((prev) => !prev);
        if (toastState) setToastState(null);
    };

    const handleCreateSuccess = (ticketTitle: string) => {
        setToastState({ type: 'made', title: ticketTitle });
        setCurrentView('My Tickets');
    };

    const handleViewSuccess = (action: 'updated' | 'deleted', ticketTitle: string) => {
        setToastState({
            type: action === 'deleted' ? 'deleted' : 'made',
            title: ticketTitle
        });
        setSelectedTicketId(null);
        setCurrentView('My Tickets');
    };

    return (
        <div className={`overflow-x-hidden min-h-screen bg-[#14452F] flex flex-col items-center relative ${
            currentView !== 'My Tickets' ? 'h-screen' : ''
        }`}>
            <Header userName="Naush" avatarUrl={Confidential({ x: 1 })} showSearch={currentView === 'My Tickets'}/>

            <PageWrapper title={currentView}>
                {currentView === 'Create Ticket' ? (
                    <CreateTicketForm
                        userId={currentUserId}
                        onSuccess={handleCreateSuccess}
                        onCancel={() => setCurrentView('My Tickets')}
                    />
                ) : currentView === 'View Ticket' && selectedTicketId ? (
                    <ViewTicketForm
                        ticketId={selectedTicketId}
                        userId={currentUserId}
                        onSuccess={handleViewSuccess}
                        onCancel={() => {
                            setSelectedTicketId(null);
                            setCurrentView('My Tickets');
                        }}
                    />
                ) : (
                    <div className="flex flex-col gap-2">
                        {isLoading ? (
                            <p className="text-center py-8 text-gray-500 font-medium">Loading tickets...</p>
                        ) : (
                            STATUSES.map((status) => {
                                const statusTickets = tickets.filter(
                                    (ticket) => ticket.status.toLowerCase() === status.toLowerCase()
                                );

                                return (
                                    <div key={status} className="flex flex-col">
                                        <SectionHeader status={status} />
                                        {statusTickets.length > 0 ? (
                                            statusTickets.map((ticket) => (
                                                <TicketCard
                                                    key={ticket.ticketId}
                                                    ticketId={ticket.ticketId}
                                                    requestId={currentUserId}
                                                    onClick={() => {
                                                        setSelectedTicketId(ticket.ticketId);
                                                        setCurrentView('View Ticket');
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <p className="text-gray-400 text-sm italic pl-4 py-2">
                                                No {status.toLowerCase()} tickets
                                            </p>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </PageWrapper>
            
            {currentView === 'My Tickets' && (
                <ActionBar 
                    onFilterClick={toggleFilter}
                    onRefreshClick={() => {
                        setIsFilterOpen(false);
                        fetchTickets();
                    }} 
                    onCreateClick={() => setCurrentView('Create Ticket')}
                />
            )}
            <FilterSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
            
            {toastState && !isFilterOpen && ( 
                <TicketToast 
                    type={toastState.type} 
                    ticket={toastState.title} 
                    onClose={() => setToastState(null)}
                />
            )}
        </div>
    );
}