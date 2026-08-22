import { useState } from "react";

interface HeaderBarProps {
    onProfileClick: () => void;
}

export default function HeaderBar({ onProfileClick }: HeaderBarProps) {
    const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
    return (
        <div className="fixed top-0 left-0 h-13 w-screen px-10 py-2 bg-white border-[#E2E8F0] border-b flex items-center justify-between z-30">
            <div className="w-40 h-13 flex items-center">
                Logo
            </div>
            <div className="w-1/3 h-13 flex items-center">
                <textarea placeholder="Search for a Ticket..." className="w-full h-5 bg-transparent resize-none border-none focus:outline-none focus:ring-0 placeholder:text-center text-center" />
            </div>
            <div className="relative flex items-center gap-3 justify-center w-40" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <img src="./././public/favicon.svg" alt="Profile" className="w-10 h-10 rounded-full border border-[#E2E8F0]" />
                <div>
                    <h1 className="text-[13px] font-bold">Naushyn</h1>
                    <p className="text-[11px] text-[#64748B]">User</p>
                </div>
                {isProfileOpen &&
                    <div className="absolute top-12 w-40 bg-white border border-[#E2E8F0] rounded-[10px] z-20 overflow-hidden flex flex-col">
                        <button type="button" className="w-full h-10 text-black hover:bg-[#E2E8F0] transition-all duration-200 ease-in-out" onClick={onProfileClick}>Profile</button>
                        <button type="button" className="w-full h-10 bg-red-500 text-white hover:bg-red-600 transition-all duration-200 ease-in-out">Logout</button>
                    </div>
        }
            </div>
        </div>
    )
}