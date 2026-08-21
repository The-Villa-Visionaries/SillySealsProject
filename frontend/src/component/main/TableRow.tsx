interface TableRowProps {
    onView: () => void;
}

export default function TableRow({ onView }: TableRowProps) {
    return (
        <div className="flex w-full grid grid-cols-13 h-10 border-t border-[#E2E8F0] px-5 items-center z-5 bg-white">
            <div className="col-span-1 flex items-center justify-center">
                <img src="../../../../public/favicon.svg" alt="p1"  className="w-5 h-5 object-cover"/>
            </div>
            <div className="col-span-5 flex items-center flex flex-col">
                <h3 className="w-full text-[13px] font-bold text-[#9F4EFF] truncate">Server rack overheating — fans not spinning</h3>
                <p className="w-full text-[11px] text-[#64748B] pl-5 truncate">The primary rack in the server room has two fans that have stopped. Temperature readings are climbing. Immediate attention required before thermal shutdown. </p>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <p className="text-[13px] truncate">Critical</p>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <p className="text-[13px] truncate">Open</p>
            </div>
            <div className="col-span-2 flex items-center justify-center">
                <p className="text-[13px] truncate">Server Room</p>
            </div>
            <div className="col-span-2 flex items-center justify-center">
                <p className="text-[13px] truncate">@Aishath Livv</p>  
            </div>
            <button type="button" onClick={onView} className="col-span-1 h-7 bg-[#9F4EFF] text-white rounded-[10px] text-[13px] font-bold hover:bg-[#7a2ccf] hover:cursor-pointer transition-all duration-200 ease-in-out">
                {'View ➤'}
            </button>
        </div>
    )
}