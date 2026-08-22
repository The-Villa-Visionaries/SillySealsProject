interface EditProps {
    switchDetail: () => void;
}

export default function Edit({ switchDetail }: EditProps) {
    return (
        <>             
             <div className="w-full border-b border-[#E2E8F0] p-4 flex gap-5 items-center">
                <img src="../../../../public/favicon.svg" alt="p1" className="w-5 h-5 object-cover"/>
                <h1 className="text-[15px] font-bold">Maintenance</h1>
            </div>
            <div className="w-full border-b border-[#E2E8F0] pt-2 flex gap-10 text-[#64748B] text-[13px] font-bold flex justify-center">
                <div className="pb-2 border-b border-[#9F4EFF] border-b-2 w-35 flex justify-center text-[#9F4EFF]">
                    <h1>Editing Category</h1>
                </div>
            </div>
            <div className="w-full p-4 pb-2 text-Black">
                <h1 className="text-[15px] font-bold">Name</h1>
                <textarea placeholder="Enter Name" className="w-full h-5 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" defaultValue="Maintenance" />
            </div>
            <div className="w-full p-4 pb-2 text-Black">
                <h1 className="text-[15px] font-bold">CID</h1>
                <textarea placeholder="Enter CID" className="w-full h-5 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" defaultValue="1" />
            </div>
            <div className="w-full px-4 py-2 text-Black">
                <h1 className="text-[15px] font-bold">Color</h1>
                <textarea placeholder="Enter Hex Color" className="w-full h-5 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" defaultValue="#9F4EFF" />
            </div>
            <div className="w-full px-4 py-2 text-Black">
                <h1 className="text-[15px] font-bold">Priority Score</h1>
                <p className="text-[13px] text-[#64748B] pl-3 mt-1">Priority Score is influenced by Category and Location.</p>
                <input type="number" step="1" min="0" placeholder="(Enter priority score)" className="w-full h-5 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" />
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