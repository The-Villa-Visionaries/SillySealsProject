import type React from "react";
import SearchIcon from '../icons/SearchIcon'

interface HeaderProps {
    userName: string
    avatarUrl: string
    showSearch?: boolean
    searchQuery?: string
    onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function Header({userName, avatarUrl, showSearch = true, searchQuery, onSearchChange}: HeaderProps) {
    return (
        <header className="relative w-full bg-[#0A5C36] pt-7 pb-10 px-6 shadow-lg">
            <div className="absolute -top-[50px] -left-[120px] w-[380px] h-[380px] bg-[#0F5132] rotate-45 pointer-events-none shadow-md"/>
            <div className="absolute -top-[50px] -right-[100px] w-[380px] h-[380px] bg-[#14452F] rotate-45 pointer-events-none shadow-md"/>
            <div className="relative z-10 max-w-[80vw] mx-auto space-y-5">
                <div className="flex items-center justify-between">
                    <div className="w-[72px] h-[72px]"/>
                    <div className="flex flex-col text-white items-center text-center">
                        <span className="font-extrabold text-[30px] leading-[24px]">
                            Welcome,
                        </span>
                        <span className="font-black italic text-[50px] leading-[55px] tracking-tight">
                            {userName}
                        </span>
                    </div>
                    <div className="w-[72px] h-[72px] rounded-full border-[3px] border-[#1A5407] overflow-hidden shrink-0 shadow-md">
                        <img src={avatarUrl} alt={userName} className="w-full h-full object-cover"/>
                    </div>
                </div>
                {showSearch &&(
                    <div className="relative w-full h-[50px] bg-white border-[3px] border-[#0F5132] rounded-[25px] flex items-center px-3.5 shadow-sm">
                        <SearchIcon />
                        <input type="text" value={searchQuery} onChange={onSearchChange} placeholder="Search" className="w-full bg-transparent text-[20px] font-normal text-slate-800 placeholder-[#8C8C8C] focus:outline-none ml-[5px]"/>
                    </div>
                )}
            </div>
        </header>
    )
}