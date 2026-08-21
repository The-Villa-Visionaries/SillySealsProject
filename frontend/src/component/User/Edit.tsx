interface EditProps {
    switchDetail: () => void;
}

export default function Edit({ switchDetail }: EditProps) {
    return (
        <>             
             <div className="w-full border-b border-[#E2E8F0] p-4 flex gap-5 items-center">
                <img src="../../../../public/favicon.svg" alt="p1" className="w-5 h-5 object-cover"/>
                <h1 className="text-[15px] font-bold">Aishath Livv</h1>
            </div>
            <div className="w-full border-b border-[#E2E8F0] pt-2 flex gap-10 text-[#64748B] text-[13px] font-bold flex justify-center">
                <div className="pb-2 border-b border-[#9F4EFF] border-b-2 w-35 flex justify-center text-[#9F4EFF]">
                    <h1>Editing User</h1>
                </div>
            </div>
            <div className="w-full p-4 pb-2 text-Black">
                <h1 className="text-[15px] font-bold">Username</h1>
                <textarea placeholder="Enter Username" className="w-full h-5 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" defaultValue="Aishath Livv" />
            </div>
            <div className="w-full p-4 pb-2 text-Black">
                <h1 className="text-[15px] font-bold">Mail</h1>
                <textarea placeholder="Enter Mail" className="w-full h-5 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" defaultValue="livv@sillyseals.com" />
            </div>
            <div className="w-full px-4 py-2 text-Black">
                <h1 className="text-[15px] font-bold">Role</h1>
                <textarea placeholder="Enter Role" className="w-full h-5 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" defaultValue="Staff" />
            </div>
            <div className="w-full p-4 pb-2 text-Black">
                <h1 className="text-[15px] font-bold">Password</h1>
                <textarea placeholder="Enter Password" className="w-full h-5 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" />
            </div>
            <div className="w-full p-4 pb-2 text-Black">
                <h1 className="text-[15px] font-bold">Confirm Password</h1>
                <textarea placeholder="Confirm Password" className="w-full h-5 max-h-25 text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" />
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