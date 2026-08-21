import PanelCard from "../../common/PanelCard";

interface DetailProps {
    switchEdit: () => void;
    switchComments: () => void;
}

export default function Detail({ switchEdit, switchComments }: DetailProps) {
    return (
        <>
            <div className="w-full border-b border-[#E2E8F0] p-4 flex gap-5 items-center">
                <img src="../../../../public/favicon.svg" alt="p1" className="w-5 h-5 object-cover"/>
                <h1 className="text-[15px] font-bold">Server rack overheating — fans not spinning</h1>
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
                <p className="text-[13px] text-[#64748B] mt-1 pl-3">The primary rack in the server room has two fans that have stopped. Temperature readings are climbing. Immediate attention required before thermal shutdown.</p>
            </div>
            <div className="w-full flex flex-wrap gap-4 p-4 justify-center">
                <PanelCard type="Category" value="Maintenance" />
                <PanelCard type="Location" value="Server Room"/>
                <PanelCard type="Submitted" value="Aug 20 2026 14:22" description="5h ago" />
                <PanelCard type="Last Updated" value="Aug 20 2026 14:58" description="5h ago" />
                <PanelCard type="Submitted By" value="@Aishath Naushyn" />
                <PanelCard type="Assigned To" value="@Aishath Livv (staff)" />
                <PanelCard type="Status" value="Open" />
                <PanelCard type="Priority Score" value="13 points" />
            </div>
            <div className="w-full p-4 flex justify-between absolute bottom-0 left-0 border-t border-[#E2E8F0] bg-white z-27">
                <button type="button" className="w-[calc(50%-10px)] bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
                    Delete Ticket
                </button>
                <button type="button" className="w-[calc(50%-10px)] bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={switchEdit}>
                    Edit Ticket
                </button>
            </div>
        </>
    )
}