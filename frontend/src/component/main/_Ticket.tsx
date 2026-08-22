import { useState, useEffect } from "react"
import TicketView from "../Ticket/_ViewTicket"
import TicketCreate from "../Ticket/_CreateTicket"
import CategoryView from "../Category/_ViewCategory"
import CategoryCreate from "../Category/_CreateCategory"
import UserView from "../User/_ViewUser"
import UserCreate from "../User/_CreateUser"
import Card from "./Card"
import TableContextRow from "./TableContextRow"
import TableTicketRow from "./TableTicketRow"
import TableCategoryRow from "./TableCategoryRow"

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

interface Category {
    cid: number
    name: string
    color: string
    priorityScore: number
    icon: string
}

export default function Main() {
    const [isViewOpen, setIsViewOpen] = useState<'t' | 'u' | 'c' | 'l' | false>(false)
    const [isCreateOpen, setIsCreateOpen] = useState<'t' | 'u' | 'c' | 'l' | false>(false)
    
    const [ticketId, setTicketId] = useState<number>(1)
    const [categoryId, setCategoryId] = useState<number>(1)
    const [requestId, setRequestId] = useState<number>(1)
    
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    
    const [loadingTickets, setLoadingTickets] = useState<boolean>(true)
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true)
    
    const [errorTickets, setErrorTickets] = useState<string>("")
    const [errorCategories, setErrorCategories] = useState<string>("")

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
                    requestId: requestId,
                    allowOpen: "true"
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

    const fetchCategories = async () => {
        setLoadingCategories(true)
        setErrorCategories("")
        try {
            const response = await fetch("http://192.168.100.52:8000/api/categories", {
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
                setCategories(data)
            } else {
                setErrorCategories("Failed to fetch categories")
            }
        } catch (err) {
            setErrorCategories("Error connecting to server")
        } finally {
            setLoadingCategories(false)
        }
    }

    useEffect(() => {
        fetchTickets()
        fetchCategories()
    }, [])

    const handleViewTicket = (id: number) => {
        setTicketId(id)
        setIsViewOpen('t')
    }

    const handleViewCategory = (id: number) => {
        setCategoryId(id)
        setIsViewOpen('c')
    }

    const totalTickets = tickets.length
    const totalCategories = categories.length

    return (
        <div className="flex w-full">
            <div className="w-full h-full p-4">
                <h1 className="text-[25px] font-bold">Stats</h1>
                <div className="flex flex-wrap gap-4 mt-4 justify-center">
                    <Card title="Total Tickets" value={totalTickets} description="Tickets in the system" />
                    <Card title="Total Users" value={92} description="Users in the system" />
                    <Card title="Total Categories" value={totalCategories} description="Categories in the system" />
                    <Card title="Total Locations" value={5} description="Locations in the system" />
                </div>
                
                <div className="w-full flex items-center justify-between mt-6">
                    <h1 className="text-[25px] font-bold">All Tickets</h1>
                    <p onClick={() => setIsCreateOpen('t')} className="mx-10 text-[#9F4EFF] hover:text-[#7a2ccf] hover:cursor-pointer">Create Ticket</p>
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

                <div className="w-full flex items-center justify-between">
                    <h1 className="text-[25px] font-bold">All Users</h1>
                    <p onClick={() => setIsCreateOpen('u')} className="mx-10 text-[#9F4EFF] hover:text-[#7a2ccf] hover:cursor-pointer">Create User</p>
                </div>
                <div className="relative w-full min-h-17 my-4 bg-white rounded-[20px] border-[#E2E8F0] border overflow-auto">
                    <TableContextRow field={["Profile Picture", "UID", "Username", "Mail", "Status", "Role", "Action"]} colspan={[1, 1, 3, 2, 1, 1, 1]} totalCols={10} />
                </div>

                <div className="w-full flex items-center justify-between">
                    <h1 className="text-[25px] font-bold">All Categories</h1>
                    <p onClick={() => setIsCreateOpen('c')} className="mx-10 text-[#9F4EFF] hover:text-[#7a2ccf] hover:cursor-pointer">Create Category</p>
                </div>
                <div className="relative w-full min-h-17 my-4 bg-white rounded-[20px] border-[#E2E8F0] border overflow-auto">
                    <TableContextRow field={["Icon", "CID", "Name", "Color", "Priority", "Action"]} colspan={[1, 1, 2, 1, 1, 1]} totalCols={7} />
                    {loadingCategories && <div className="p-4 text-center">Loading categories...</div>}
                    {errorCategories && <div className="p-4 text-center text-red-500">{errorCategories}</div>}                    
                    {!loadingCategories && !errorCategories && categories.length === 0 && (
                        <div className="p-4 text-center text-gray-500">No categories found.</div>
                    )}
                    {!loadingCategories && !errorCategories && categories.map((category) => (
                        <TableCategoryRow 
                            key={category.cid} 
                            onView={() => handleViewCategory(category.cid)} 
                            category={category}
                        />
                    ))}
                </div>

                <div className="w-full flex items-center justify-between">
                    <h1 className="text-[25px] font-bold">All Locations</h1>
                    <p onClick={() => setIsCreateOpen('l')} className="mx-10 text-[#9F4EFF] hover:text-[#7a2ccf] hover:cursor-pointer">Create Location</p>
                </div>
                <div className="relative w-full min-h-17 my-4 bg-white rounded-[20px] border-[#E2E8F0] border overflow-auto">
                    <TableContextRow field={["", "LID", "Name", "Priority", "Action"]} colspan={[1, 1, 3, 1, 1]} totalCols={7} />
                </div>

                <TicketView isOpen={isViewOpen === 't'} onClose={() => { setIsViewOpen(false); fetchTickets(); }} ticketId={ticketId} requestId={requestId} />
                <TicketCreate isOpen={isCreateOpen === 't'} onClose={() => { setIsCreateOpen(false); fetchTickets(); }} requestId={requestId} />
                <CategoryView isOpen={isViewOpen === 'c'} onClose={() => { setIsViewOpen(false); fetchCategories(); }} cid={categoryId} requestId={requestId} />
                <CategoryCreate isOpen={isCreateOpen === 'c'} onClose={() => { setIsCreateOpen(false); fetchCategories(); }} />
                <UserView isOpen={isViewOpen === 'u'} onClose={() => setIsViewOpen(false)} />
                <UserCreate isOpen={isCreateOpen === 'u'} onClose={() => setIsViewOpen(false)} /> 
            </div>
        </div>
    )
}