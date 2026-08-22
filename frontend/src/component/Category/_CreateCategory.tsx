interface CreateProps {
    isOpen?: boolean;
    onClose: () => void;
}

export default function Create({ onClose, isOpen }: CreateProps) {
    return (
        <div className={`w-full h-full bg-black/50 fixed top-0 left-0 z-25 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={onClose}>
            <div className={`w-120 h-screen bg-white absolute top-0 right-0 z-40  pt-13 border-l border-[#E2E8F0] transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
                <div className="w-full border-b border-[#E2E8F0] pt-2 flex gap-10 text-[#64748B] text-[13px] font-bold flex justify-center">
                    <div className="pb-2 border-b border-[#9F4EFF] border-b-2 w-35 flex justify-center text-[#9F4EFF]">
                        <h1>Creating Category</h1>
                    </div>
                </div>
               <div className="w-full p-4 pb-2 text-Black">
                    <h1 className="text-[15px] font-bold">Name</h1>
                    <textarea placeholder="Enter Name" className="w-full h-5 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" />
                </div>
                <div className="w-full p-4 pb-2 text-Black">
                    <h1 className="text-[15px] font-bold">Color</h1>
                    <textarea placeholder="Enter Hex Color" className="w-full h-15 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" />
                </div>
                <div className="w-full px-4 py-2 text-Black">
                    <h1 className="text-[15px] font-bold">Priority Score</h1>
                    <p className="text-[13px] text-[#64748B] pl-3 mt-1">Priority Score is influenced by Category and Location.</p>
                    <input type="number" step="1" min="0" placeholder="(Enter priority score)" className="w-full h-5 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" />
                </div>
                <div className="w-full p-4 flex justify-between absolute bottom-0 left-0 border-t border-[#E2E8F0] bg-white z-27">
                    <button type="button" className="w-[calc(50%-10px)] bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="button" className="w-[calc(50%-10px)] bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600" onClick={onClose}>
                        Create Category
                    </button>
                </div>  
            </div>
        </div>
    )
}