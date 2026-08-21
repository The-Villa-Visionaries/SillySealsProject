import { useState } from "react";
import _View from "../Ticket/_ViewTicket";
import Card from "./Card";
import TableContextRow from "./TableContextRow";
import TableRow from "./TableRow";
import _Create from "../Ticket/_CreateTicket";

export default function Main() {
    const [isViewOpen, setIsViewOpen] = useState<boolean>(false)
    const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
    return (
        <div className="flex w-full h-full">
            <div className="w-full h-full p-4">
                <h1 className="text-[25px] font-bold">All Tickets</h1>
                <div className="flex flex-wrap gap-4 mt-4 justify-center">
                    <Card title="Total Tickets" value={12} description="Tickets in the system" />
                    <Card title="Open" value={5} description="Tickets that are open" />
                    <Card title="In-Progress" value={3} description="Tickets that are in progress" />
                    <Card title="Resolved" value={9} description="Tickets that are resolved" />
                    <Card title="Critical" value={2} description="Tickets that are critical and unresolved" />
                    <Card title="Closed" value={7} description="Tickets that are closed" />
                </div>
                <div className="w-full min-h-17 my-4 bg-white rounded-[20px] border-[#E2E8F0] border overflow-auto">
                    <TableContextRow field={["Category", "Title & Description", "Priority", "Status", "Location", "Assigned To", "Action"]} colspan={[1, 5, 1, 1, 2, 2, 1]} totalCols={13} />
                    <TableRow onView={() => setIsViewOpen(true)} />
                    <TableRow onView={() => setIsViewOpen(true)} />
                    <TableRow onView={() => setIsViewOpen(true)} />
                </div>
                <div onClick={() => setIsCreateOpen(true)} className="w-15 h-15 bg-[#9F4EFF] rounded-full fixed bottom-5 right-5 flex justify-center items-center text-white text-[30px] font-bold hover:bg-[#7a2ccf] hover:cursor-pointer transition-all duration-200 ease-in-out z-20">
                    <p className=" text-[50px] leading-[30px]">+</p>
                </div>
                <_View isOpen={isViewOpen} onClose={() => setIsViewOpen(false)} />
                <_Create isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
            </div>
        </div>
    )
}