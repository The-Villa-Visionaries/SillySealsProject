import { useState } from "react"
import PanelCard from "../../common/PanelCard"

interface DetailProps {
    switchEdit: () => void
    switchComments: () => void
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
        priorityScore: string
    }
    requestId: number
    onClose: () => void
}

export default function Detail({ switchEdit, switchComments, ticket, requestId, onClose }: DetailProps) {
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

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this ticket?")) return
        try {
            const response = await fetch(`http://192.168.100.52:8000/api/ticket-${ticket.ticketId}/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ticketId: ticket.ticketId,
                    requestId: requestId,
                }),
            })
            if (response.ok) {
                onClose()
            } else {
                const errData = await response.json()
                alert(errData.detail || "Failed to delete ticket.")
            }
        } catch (error) {
            alert("An error occurred while deleting the ticket.")
        }
    }

    return (
        <>
            <div className="w-full border-b border-[#E2E8F0] p-4 flex gap-5 items-center">
                <img src="../../../../public/favicon.svg" alt="p1" className="w-5 h-5 object-cover"/>
                <h1 className="text-[15px] font-bold">{title}</h1>
            </div>
            <div className="w-full border-b border-[#E2E8F0] pt-2 flex gap-10 text-[#64748B] text-[13px] font-bold flex justify-center">
                <div className="pb-2 border-b border-[#9F4EFF] border-b-2 w-35 flex justify-center text-[#9F4EFF]">
                    <h1>Detail</h1>
                </div>
                <div onClick={switchComments} className="pb-2 hover:border-b hover:border-[#9F4EFF] border-black/0 border-b-2 hover:border-b-2 w-35 flex justify-center hover:text-[#9F4EFF]">
                    <h1>Comments</h1>
                </div>
            </div>
            <div className="w-full p-4 text-Black">
                <h1 className="text-[15px] font-bold">Description</h1>
                <p className="text-[13px] text-[#64748B] mt-1 pl-3">{description}</p>
            </div>
            <div className="w-full flex flex-wrap gap-4 p-4 justify-center">
                <PanelCard type="Category" value={categoryName} />
                <PanelCard type="Location" value={locationName} />
                <PanelCard type="Submitted" value={createdAt} />
                <PanelCard type="Last Updated" value={updatedAt} />
                <PanelCard type="Submitted By" value={submitterUid} />
                <PanelCard type="Assigned To" value={assignedUid} />
                <PanelCard type="Status" value={status} />
                <PanelCard type="Priority Score" value={priorityScore} />
            </div>
            <div className="w-full p-4 flex justify-between absolute bottom-0 left-0 border-t border-[#E2E8F0] bg-white z-27">
                <button type="button" className="w-[calc(50%-10px)] bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={handleDelete}>
                    Delete Ticket
                </button>
                <button type="button" className="w-[calc(50%-10px)] bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={switchEdit}>
                    Edit Ticket
                </button>
            </div>
        </>
    )
}