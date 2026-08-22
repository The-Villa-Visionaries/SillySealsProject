import { useState } from "react"

interface TableUserRowProps {
    onView: () => void
    user: {
        uid: number
        username: string
        email: string
        status: string
        role: string
        profilePicture?: string
    }
}

export default function TableUserRow({ onView, user }: TableUserRowProps) {
    const [uid] = useState(user.uid ? user.uid : 'N/A')
    const [username] = useState(user.username ? user.username : 'No Username')
    const [email] = useState(user.email ? user.email : 'No Email')
    const [status] = useState(user.status ? user.status : 'Active')
    const [role] = useState(user.role ? user.role : 'user')
    const [profilePicture] = useState(user.profilePicture ? user.profilePicture : '../../../../public/favicon.svg')

    return (
        <div className="flex w-full grid grid-cols-10 h-10 border-t border-[#E2E8F0] px-5 items-center z-5 bg-white">
            <div className="col-span-1 flex items-center justify-center">
                <img src={profilePicture} alt="profile" className="w-6 h-6 rounded-full object-cover" />
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <p className="text-[13px] truncate">{uid}</p>
            </div>
            <div className="col-span-3 flex items-center justify-center">
                <p className="text-[13px] font-bold text-[#9F4EFF] truncate">{username}</p>
            </div>
            <div className="col-span-2 flex items-center justify-center">
                <p className="text-[13px] text-[#64748B] truncate">{email}</p>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <p className="text-[13px] truncate">{status}</p>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <p className="text-[13px] truncate capitalize">{role}</p>
            </div>
            <button 
                type="button" 
                onClick={onView} 
                className="col-span-1 h-7 bg-[#9F4EFF] text-white rounded-[10px] text-[13px] font-bold hover:bg-[#7a2ccf] hover:cursor-pointer transition-all duration-200 ease-in-out"
            >
                {'View ➤'}
            </button>
        </div>
    )
}