interface ProfileProps {
    onClose: () => void
}

export default function Profile({ onClose }: ProfileProps) {
    return (
        <div className="w-full h-full bg-black/50 fixed top-0 left-0 z-25 flex items-center justify-center" onClick={onClose}>
            <div className="w-120 h-100 bg-white border-l border-[#E2E8F0] z-40 flex flex-col rounded-2xl flex flex-col items-center overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <h3 className="w-full text-center text-[30px] m-4 mb-0 border-b border-[#E2E8F0]">Profile</h3>
                <div className="w-full h-full flex items-center justify-center">
                    <div className="relative w-2/4 h-full bg-[#E2E8F0] flex flex-col items-center justify-center">
                        <img src="../../../../public/favicon.svg" alt="Profile" className="w-30 h-30 mx-10 bg-white rounded-full border border-[#E2E8F0]" />
                        <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    </div>
                    <div className="w-full h-full flex flex-col bg-white"> 
                        <div className="w-full p-4 pb-2 text-Black">
                            <h1 className="text-[15px] font-bold">Username</h1>
                            <textarea placeholder="Enter Username" className="w-full h-5 max-h-25 resize-none text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" />
                        </div>
                        <div className="w-full px-4 py-2 text-Black">
                            <h1 className="text-[15px] font-bold">Email</h1>
                            <textarea placeholder="Enter Email" className="w-full h-5 max-h-25 resize-none text-[13px] text-[#64748B] mt-1 pl-3 focus:outline-none focus:ring-0 focus:border-transparent" />
                        </div>
                    </div> 
                </div>
            </div>
        </div>

    )
}