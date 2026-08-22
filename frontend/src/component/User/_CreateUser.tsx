import { useState } from "react"

interface CreateProps {
    isOpen?: boolean
    onClose: () => void
    requestId: number
    reloadUsers?: () => void
}

export default function Create({ onClose, isOpen, requestId, reloadUsers }: CreateProps) {
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [role, setRole] = useState<string>("user")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")

    const HandleSubmit = async () => {
        if (!username || !email || !password) {
            window.alert("Please fill in all required fields.")
            return
        }
        if (password !== confirmPassword) {
            window.alert("Passwords do not match!")
            return
        }

        try {
            const response = await fetch('http://192.168.100.52:8000/api/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestId,
                    username,
                    email,
                    role,
                    password,
                }),
            })

            if (response.ok) {
                setUsername("")
                setEmail("")
                setRole("user")
                setPassword("")
                setConfirmPassword("")
                reloadUsers?.()
                onClose()
            } else {
                const errData = await response.json()
                console.error(errData.detail || "Failed to create user.")
            }
        } catch (error) {
            console.error("An error occurred while creating the user.")
        }
    }

    return (
        <div className={`w-full h-full bg-black/50 fixed top-0 left-0 z-25 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={onClose}>
            <div className={`w-120 h-screen bg-white absolute top-0 right-0 z-40 pt-13 border-l border-[#E2E8F0] transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
                <div className="w-full border-b border-[#E2E8F0] pt-2 flex gap-10 text-[#64748B] text-[13px] font-bold justify-center">
                    <div className="pb-2 border-b border-[#9F4EFF] border-b-2 w-35 flex justify-center text-[#9F4EFF]">
                        <h1>Creating User</h1>
                    </div>
                </div>
                <div className="w-full p-4 pb-2 text-Black">
                    <h1 className="text-[15px] font-bold">Username</h1>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter Username"
                        className="w-full h-9 text-[13px] text-[#64748B] mt-1 pl-3 border border-[#E2E8F0] rounded focus:outline-none focus:border-[#9F4EFF]"
                    />
                </div>
                <div className="w-full p-4 pb-2 text-Black">
                    <h1 className="text-[15px] font-bold">Mail</h1>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter Mail"
                        className="w-full h-9 text-[13px] text-[#64748B] mt-1 pl-3 border border-[#E2E8F0] rounded focus:outline-none focus:border-[#9F4EFF]"
                    />
                </div>
                <div className="w-full p-4 pb-2 text-Black">
                    <h1 className="text-[15px] font-bold">Role</h1>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full h-9 text-[13px] text-[#64748B] mt-1 pl-3 border border-[#E2E8F0] rounded focus:outline-none focus:border-[#9F4EFF]">
                        <option value="user">User</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="w-full p-4 pb-2 text-Black">
                    <h1 className="text-[15px] font-bold">Password</h1>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        className="w-full h-9 text-[13px] text-[#64748B] mt-1 pl-3 border border-[#E2E8F0] rounded focus:outline-none focus:border-[#9F4EFF]"
                    />
                </div>
                <div className="w-full p-4 pb-2 text-Black">
                    <h1 className="text-[15px] font-bold">Confirm Password</h1>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="w-full h-9 text-[13px] text-[#64748B] mt-1 pl-3 border border-[#E2E8F0] rounded focus:outline-none focus:border-[#9F4EFF]"
                    />
                </div>
                <div className="w-full p-4 flex justify-between absolute bottom-0 left-0 border-t border-[#E2E8F0] bg-white z-27">
                    <button type="button" className="w-[calc(50%-10px)] bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={onClose}>
                        Cancel
                    </button>
                    <button type="button" className="w-[calc(50%-10px)] bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600" onClick={HandleSubmit}>
                        Create User
                    </button>
                </div>  
            </div>
        </div>
    )
}