import { useState } from "react"

interface TableRowProps {
    onView: () => void
    ticket: {
        ticketId: number
        title: string
        description: string
        categoryName: string
        locationName: string
        createdAt: string
        updatedAt: string
        submitterUid: string
        assignedUid: string
        status: string
        priorityScore: number | string
    }
}

export default function TableTicketRow({ onView, ticket }: TableRowProps) {
    const [title] = useState(ticket.title ? ticket.title : 'No Title')
    const [description] = useState(ticket.description ? ticket.description : 'No Description')
    const [categoryName] = useState(ticket.categoryName ? ticket.categoryName : 'No Category')
    const [locationName] = useState(ticket.locationName ? ticket.locationName : 'No Location')
    const [createdAt] = useState(ticket.createdAt ? ticket.createdAt : 'No Date')
    const [updatedAt] = useState(ticket.updatedAt ? ticket.updatedAt : 'No Date')
    const [submitterUid] = useState(ticket.submitterUid ? ticket.submitterUid : 'No Submitter')
    const [assignedUid] = useState(ticket.assignedUid ? ticket.assignedUid : 'Not Assigned')
    const [status] = useState(ticket.status ? ticket.status : 'No Status')
    const [priorityScore] = useState(ticket.priorityScore ? ticket.priorityScore : '0')
    
    return (
        <div className="flex w-full grid grid-cols-13 h-10 border-t border-[#E2E8F0] px-5 items-center z-5 bg-white">
            <div className="col-span-1 flex items-center justify-center">
                <img src="../../../../public/favicon.svg" alt="p1" className="w-5 h-5 object-cover"/>
            </div>
            <div className="col-span-5 flex items-center flex flex-col">
                <h3 className="w-full text-[13px] font-bold text-[#9F4EFF] truncate">{title}</h3>
                <p className="w-full text-[11px] text-[#64748B] pl-5 truncate">{description}</p>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <p className="text-[13px] truncate">{priorityScore}</p>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <p className="text-[13px] truncate">{status}</p>
            </div>
            <div className="col-span-2 flex items-center justify-center">
                <p className="text-[13px] truncate">{locationName}</p>
            </div>
            <div className="col-span-2 flex items-center justify-center">
                <p className="text-[13px] truncate">{assignedUid}</p>  
            </div>
            <button type="button" onClick={onView} className="col-span-1 h-7 bg-[#9F4EFF] text-white rounded-[10px] text-[13px] font-bold hover:bg-[#7a2ccf] hover:cursor-pointer transition-all duration-200 ease-in-out">
                {'View ➤'}
            </button>
        </div>
    )
}