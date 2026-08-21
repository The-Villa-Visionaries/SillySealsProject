interface EditProps {
    switchDetail: () => void;
}

export default function Edit({ switchDetail }: EditProps) {
    return (
        <>             
             <div className="w-full border-b border-[#E2E8F0] p-4 flex gap-5 items-center">
                <img src="../../../../public/favicon.svg" alt="p1" className="w-5 h-5 object-cover"/>
                <h1 className="text-[15px] font-bold">Server rack overheating — fans not spinning</h1>
            </div>
            <div className="w-full border-b border-[#E2E8F0] pt-2 flex gap-10 text-[#64748B] text-[13px] font-bold flex justify-center">
                <div className="pb-2 border-b border-[#9F4EFF] border-b-2 w-35 flex justify-center text-[#9F4EFF]">
                    <h1>Editing Ticket</h1>
                </div>
            </div>
            <div className="w-full p-4 pb-2 text-Black">
                <h1 className="text-[15px] font-bold">Title</h1>
                <textarea placeholder="Enter Title" className="w-full h-5 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" defaultValue="Server rack overheating — fans not spinning" />
            </div>
            <div className="w-full p-4 pb-2 text-Black">
                <h1 className="text-[15px] font-bold">Description</h1>
                <textarea placeholder="Enter Description" className="w-full h-15 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" defaultValue="The primary rack in the server room has two fans that have stopped. Temperature readings are climbing. Immediate attention required before thermal shutdown." />
            </div>
            <div className="w-full px-4 py-2 text-Black">
                <h1 className="text-[15px] font-bold">Category</h1>
                <textarea placeholder="Enter Category" className="w-full h-5 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" defaultValue="Maintenance" />
            </div>
            <div className="w-full px-4 py-2 text-Black">
                <h1 className="text-[15px] font-bold">Location</h1>
                <textarea placeholder="Enter Location"className="w-full h-5 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" defaultValue="Server Room" />
            </div>
            <div className="w-full px-4 py-2 text-Black">
                <h1 className="text-[15px] font-bold">Priority Score</h1>
                <p className="text-[13px] text-[#64748B] pl-3 mt-1">Priority Score is influenced by Category, Location, and user set score.</p>
                <input type="number" step="1" min="0" max="5" placeholder="(Enter priority score from 1 to 5)" className="w-full h-5 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" defaultValue={13} />
            </div>
            <div className="w-full p-4 flex justify-between absolute bottom-0 left-0 border-t border-[#E2E8F0] bg-white z-27">
                <button type="button" className="w-[calc(50%-10px)] bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={switchDetail}>
                    Cancel
                </button>
                <button type="button" className="w-[calc(50%-10px)] bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600" onClick={switchDetail}>
                    Save Changes
                </button>
            </div>
        </>
    )
}