import { useState } from "react"

interface EditProps {
    switchDetail: () => void
    reloadTicket: () => void
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
    requestId: number
}

export default function Edit({ switchDetail, reloadTicket, ticket, requestId }: EditProps) {
    const [title, setTitle] = useState(ticket.title ? ticket.title : 'No Title')
    const [description, setDescription] = useState(ticket.description ? ticket.description : 'No Description')
    const [categoryName, setCategoryName] = useState(ticket.categoryName ? ticket.categoryName : 'No Category')
    const [locationName, setLocationName] = useState(ticket.locationName ? ticket.locationName : 'No Location')
    const [errorMessage, setErrorMessage] = useState<string>('')

    const handleSave = async () => {
        try {
            const response = await fetch(`http://192.168.100.52:8000/api/ticket-${ticket.ticketId}/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ticketId: ticket.ticketId,
                    requestId: requestId,
                    title: title,
                    description: description,
                    categoryName: categoryName,
                    locationName: locationName,
                    createdAt: ticket.createdAt,
                    updatedAt: ticket.updatedAt,
                    submitterUid: ticket.submitterUid,
                    assignedUid: ticket.assignedUid,
                    status: ticket.status,
                }),
            })

            if (response.ok) {
                reloadTicket()
                switchDetail()
            } else {
                const errData = await response.json()
                if (typeof errData.detail === 'string') {
                    setErrorMessage(errData.detail)
                } else if (Array.isArray(errData.detail)) {
                    setErrorMessage(errData.detail.map((e: any) => e.msg).join(', '))
                } else {
                    setErrorMessage("Failed to update ticket.")
                }
            }
        } catch (error) {
            setErrorMessage("An error occurred while updating the ticket.")
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
                    <h1>Editing Ticket</h1>
                </div>
            </div>
            {errorMessage && <div className="p-4 text-center text-red-500 text-sm">{errorMessage}</div>}
            <div className="w-full p-4 pb-2 text-Black">
                <h1 className="text-[15px] font-bold">Title</h1>
                <textarea value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter Title" className="w-full h-5 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent"/>
            </div>
            <div className="w-full p-4 pb-2 text-Black">
                <h1 className="text-[15px] font-bold">Description</h1>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter Description" className="w-full h-15 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" />
            </div>
            <div className="w-full px-4 py-2 text-Black">
                <h1 className="text-[15px] font-bold">Category</h1>
                <textarea value={categoryName} onChange={e => setCategoryName(e.target.value)} placeholder="Enter Category" className="w-full h-5 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" />
            </div>
            <div className="w-full px-4 py-2 text-Black">
                <h1 className="text-[15px] font-bold">Location</h1>
                <textarea value={locationName} onChange={e => setLocationName(e.target.value)} placeholder="Enter Location" className="w-full h-5 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" />
            </div>
            <div className="w-full p-4 flex justify-between absolute bottom-0 left-0 border-t border-[#E2E8F0] bg-white z-27">
                <button type="button" className="w-[calc(50%-10px)] bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={switchDetail}>
                    Cancel
                </button>
                <button type="button" className="w-[calc(50%-10px)] bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600" onClick={handleSave}>
                    Save Changes
                </button>
            </div>
        </>
    )
}