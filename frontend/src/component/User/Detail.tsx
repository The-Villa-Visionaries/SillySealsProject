import PanelCard from "../../common/PanelCard";

interface DetailProps {
    switchEdit: () => void;
}

export default function Detail({ switchEdit }: DetailProps) {
    return (
        <>
            <div className="w-full border-b border-[#E2E8F0] p-4 flex gap-5 items-center">
                <img src="../../../../public/favicon.svg" alt="p1" className="w-5 h-5 object-cover"/>
                <h1 className="text-[15px] font-bold">Aishath Livv</h1>
            </div>
            <div className="w-full border-b border-[#E2E8F0] pt-2 flex gap-10 text-[#64748B] text-[13px] font-bold flex justify-center">
                <div className="pb-2 border-b border-[#9F4EFF] border-b-2 w-35 flex justify-center text-[#9F4EFF]">
                    <h1>Detail</h1>
                </div>
            </div>
            <div className="w-full flex flex-wrap gap-4 p-4 justify-center">
                <PanelCard type="Profile Picture" value="Placeholder" description="Upload Image" />
                <PanelCard type="Mail" value="livv@sillyseals.com"/>
                <PanelCard type="Role" value="Staff" />
            </div>
            <div className="w-full p-4 flex justify-between absolute bottom-0 left-0 border-t border-[#E2E8F0] bg-white z-27">
                <button type="button" className="w-[calc(50%-10px)] bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
                    Delete User
                </button>
                <button type="button" className="w-[calc(50%-10px)] bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={switchEdit}>
                    Edit User
                </button>
            </div>
        </>
    )
}