import { useState } from "react";
import TicketView from "../Ticket/_ViewTicket";
import TicketCreate from "../Ticket/_CreateTicket";
import CategoryView from "../Category/_ViewCategory";
import CategoryCreate from "../Category/_CreateCategory";
import UserView from "../User/_ViewUser";
import UserCreate from "../User/_CreateUser";
//import LocationView from "../Location/_ViewLocation";
//import LocationCreate from "../Location/_CreateLocation";
import Card from "./Card";
import TableContextRow from "./TableContextRow";
import TableRow from "./TableTicketRow";

export default function Main() {
    const [isViewOpen, setIsViewOpen] = useState<'t' | 'u' | 'c' | 'l' | false>(false)
    const [isCreateOpen, setIsCreateOpen] = useState<'t' | 'u' | 'c' | 'l' | false>(false)
    return (
        <div className="flex w-full">
            <div className="w-full h-full p-4">
                <h1 className="text-[25px] font-bold">Stats</h1>
                <div className="flex flex-wrap gap-4 mt-4 justify-center">
                    <Card title="Total Tickets" value={17} description="Tickets in the system" />
                    <Card title="Total Users" value={92} description="Users in the system" />
                    <Card title="Total Categories" value={8} description="Categories in the system" />
                    <Card title="Total Locations" value={5} description="Locations in the system" />
                </div>
                <div className="w-full flex items-center justify-between">
                    <h1 className="text-[25px] font-bold">All Tickets</h1>
                    <p onClick={() => setIsCreateOpen('t')} className="mx-10 text-[#9F4EFF] hover:text-[#7a2ccf] hover:cursor-pointer">Create Ticket</p>
                </div>
                <div className="relative w-full min-h-17 my-4 bg-white rounded-[20px] border-[#E2E8F0] border overflow-auto">
                    <TableContextRow field={["Category", "Title & Description", "Priority", "Status", "Location", "Assigned To", "Action"]} colspan={[1, 5, 1, 1, 2, 2, 1]} totalCols={13} />
                    <TableRow onView={() => setIsViewOpen('t')} />
                </div>
                <div className="w-full flex items-center justify-between">
                    <h1 className="text-[25px] font-bold">All Users</h1>
                    <p onClick={() => setIsCreateOpen('u')} className="mx-10 text-[#9F4EFF] hover:text-[#7a2ccf] hover:cursor-pointer">Create User</p>
                </div>
                <div className="relative w-full min-h-17 my-4 bg-white rounded-[20px] border-[#E2E8F0] border overflow-auto">
                    <TableContextRow field={["Profile Picture", "UID", "Username", "Mail", "Status", "Role", "Action"]} colspan={[1, 1, 3, 2, 1, 1, 1]} totalCols={10} />
                    <TableRow onView={() => setIsViewOpen('u')} />
                </div>
                <div className="w-full flex items-center justify-between">
                    <h1 className="text-[25px] font-bold">All Categories</h1>
                    <p onClick={() => setIsCreateOpen('c')} className="mx-10 text-[#9F4EFF] hover:text-[#7a2ccf] hover:cursor-pointer">Create Category</p>
                </div>
                <div className="relative w-full min-h-17 my-4 bg-white rounded-[20px] border-[#E2E8F0] border overflow-auto">
                    <TableContextRow field={["Icon", "CID", "Name", "Color", "Priority", "Action"]} colspan={[1, 1, 2, 1, 1, 1]} totalCols={7} />
                    <TableRow onView={() => setIsViewOpen('c')} />
                </div>
                <div className="w-full flex items-center justify-between">
                    <h1 className="text-[25px] font-bold">All Locations</h1>
                    <p onClick={() => setIsCreateOpen('l')} className="mx-10 text-[#9F4EFF] hover:text-[#7a2ccf] hover:cursor-pointer">Create Location</p>
                </div>
                <div className="relative w-full min-h-17 my-4 bg-white rounded-[20px] border-[#E2E8F0] border overflow-auto">
                    <TableContextRow field={["", "LID", "Name", "Priority", "Action"]} colspan={[1, 1, 3, 1, 1]} totalCols={7} />
                    <TableRow onView={() => setIsViewOpen('l')} />
                </div>
                <TicketView isOpen={isViewOpen === 't'} onClose={() => setIsViewOpen(false)} />
                <TicketCreate isOpen={isCreateOpen === 't'} onClose={() => setIsCreateOpen(false)} />
                <CategoryView isOpen={isViewOpen === 'c'} onClose={() => setIsViewOpen(false)} />
                <CategoryCreate isOpen={isCreateOpen === 'c'} onClose={() => setIsCreateOpen(false)} />
                <UserView isOpen={isViewOpen === 'u'} onClose={() => setIsViewOpen(false)} />
                <UserCreate isOpen={isCreateOpen === 'u'} onClose={() => setIsCreateOpen(false)} /> 
            </div>
        </div>
    )
}