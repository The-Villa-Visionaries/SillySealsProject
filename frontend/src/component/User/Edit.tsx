import { useState, useEffect } from "react"

interface EditProps {
    switchDetail: () => void
    uid: string | number
    requestId: string | number
}

export default function Edit({ switchDetail, uid, requestId}: EditProps) {
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [role, setRole] = useState<string>("user")
    const [status, setStatus] = useState<string>("Active")
    const [password, setPassword] = useState<string>("")
    const [error, setError] = useState<string>("")

    const fetchUserDetails = async () => {
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
                setUsername(data.username || "")
                setEmail(data.email || "")
                setRole(data.role || "user")
                setStatus(data.status || "Active")
            }
        } catch (err) {
            setError("Error loading current user details.")
        }
    }

    useEffect(() => {
        if (uid) fetchUserDetails()
    }, [uid])

    const handleUpdate = async () => {
        setError("")
        try {
            const response = await fetch("http://192.168.100.52:8000/api/user/update", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestId: Number(requestId),
                    uid: Number(uid),
                    username: username,
                    email: email,
                    role: role,
                    status: status,
                    password: password.trim() !== "" ? password : null
                }),
            })

            if (response.ok) {
                switchDetail()
            } else {
                const data = await response.json()
                setError(data.detail || "Failed to update user.")
            }
        } catch (err) {
            setError("Error connecting to server.")
        }
    }

    return (
        <>
            <div className="w-full border-b border-[#E2E8F0] p-4 flex items-center">
                <h1 className="text-[15px] font-bold">{username}</h1>
            </div>
            <div className="w-full border-b border-[#E2E8F0] pt-2 flex gap-10 text-[#64748B] text-[13px] font-bold flex justify-center">
                <div className="pb-2 border-b border-[#9F4EFF] border-b-2 w-35 flex justify-center text-[#9F4EFF]">
                    <h1>Detail</h1>
                </div>
        </div>
            {error && <div className="p-4 text-red-500 text-xs">{error}</div>}
            <div className="w-full p-4 pb-2 text-black">
                <h1 className="text-[14px] font-bold">Username</h1>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full h-8 text-[13px] text-[#64748B] mt-1 pl-3 border border-[#E2E8F0] rounded focus:outline-none" />
            </div>
            <div className="w-full p-4 pb-2 text-black">
                <h1 className="text-[14px] font-bold">Email</h1>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full h-8 text-[13px] text-[#64748B] mt-1 pl-3 border border-[#E2E8F0] rounded focus:outline-none" />
            </div>
            <div className="w-full p-4 pb-2 text-black">
                <h1 className="text-[14px] font-bold">Role</h1>
                <select value={role} onChange={e => setRole(e.target.value)}className="w-full h-8 text-[13px] text-[#64748B] mt-1 px-3 border border-[#E2E8F0] rounded focus:outline-none">
                    <option value="user">User</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
            <div className="w-full p-4 pb-2 text-black">
                <h1 className="text-[14px] font-bold">Status</h1>
                <select value={status} onChange={e => setStatus(e.target.value)}className="w-full h-8 text-[13px] text-[#64748B] mt-1 px-3 border border-[#E2E8F0] rounded focus:outline-none">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
            <div className="w-full p-4 pb-2 text-black">
                <h1 className="text-[14px] font-bold">New Password (optional)</h1>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave empty to keep current" className="w-full h-8 text-[13px] text-[#64748B] mt-1 pl-3 border border-[#E2E8F0] rounded focus:outline-none" />
            </div>
            <div className="w-full p-4 flex justify-between absolute bottom-0 left-0 border-t border-[#E2E8F0] bg-white z-27">
                <button type="button" className="w-[calc(50%-10px)] bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={switchDetail}>
                    Cancel
                </button>
                <button type="button" className="w-[calc(50%-10px)] bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600" onClick={handleUpdate}>
                    Save Changes
                </button>
            </div>
        </>
    )
}