import { useState, useEffect } from "react"
import PanelCard from "../../common/PanelCard"

interface DetailProps {
    switchEdit: () => void
    uid: string | number
    requestId: string | number
    onClose: () => void
}

interface UserData {
    uid: number
    username: string
    email: string
    role: string
    status: string
    profilePicture?: string
}

export default function Detail({ switchEdit, uid, requestId, onClose }: DetailProps) {
    const [user, setUser] = useState<UserData | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string>("")

    const fetchUserDetails = async () => {
        setLoading(true)
        setError("")
        try {
            const response = await fetch("http://192.168.100.52:8000/api/user/view", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestId: Number(requestId),
                    uid: Number(uid)
                }),
            })
            if (response.ok) {
                const data = await response.json()
                setUser(data)
            } else {
                const errData = await response.json()
                setError(errData.detail || "Failed to load user details.")
            }
        } catch (err) {
            setError("Error connecting to server.")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this user?")) return
        try {
            const response = await fetch("http://192.168.100.52:8000/api/user/delete", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestId: Number(requestId),
                    uid: Number(uid)
                }),
            })
            if (response.ok) {
                onClose()
            } else {
                const errData = await response.json()
                setError(errData.detail || "Failed to delete user.")
            }
        } catch (err) {
            setError("Error deleting user.")
        }
    }

    useEffect(() => {
        if (uid) fetchUserDetails()
    }, [uid])

    if (loading) return <div className="p-4 text-center text-xs">Loading user info...</div>
    if (error) return <div className="p-4 text-red-500 text-xs">{error}</div>
    if (!user) return null

    return (
        <>
            <div className="w-full border-b border-[#E2E8F0] p-4 flex gap-5 items-center">
                <img src={user.profilePicture} alt="p1" className="w-5 h-5 object-cover"/>
                <h1 className="text-[15px] font-bold">{user.username}</h1>
            </div>
            <div className="w-full border-b border-[#E2E8F0] pt-2 flex gap-10 text-[#64748B] text-[13px] font-bold flex justify-center">
                <div className="pb-2 border-b border-[#9F4EFF] border-b-2 w-35 flex justify-center text-[#9F4EFF]">
                    <h1>Detail</h1>
                </div>
            </div>
            <div className="w-full h-full">
                <div className="flex flex-col items-center mt-6">
                    <img 
                        src={user.profilePicture} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full object-cover border border-[#E2E8F0]"
                    />
                    <h2 className="text-[18px] font-bold mt-2">{user.username}</h2>
                    <span className="text-[12px] text-[#64748B]">UID: {user.uid}</span>
                </div>
                <div className="w-full flex flex-wrap gap-4 p-4 justify-center">
                    <PanelCard type="Role" value={user.role} />
                    <PanelCard type="Account Status" value={user.status} />
                    <PanelCard type="Email Address" value={user.email} />
                </div>
            </div>
            <div className="w-full p-4 flex justify-between absolute bottom-0 left-0 border-t border-[#E2E8F0] bg-white z-27">
                <button type="button" className="w-[calc(50%-10px)] bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={handleDelete}>
                    Delete User
                </button>
                <button type="button" className="w-[calc(50%-10px)] bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={switchEdit}>
                    Edit User
                </button>
            </div>
        </>
    )
}