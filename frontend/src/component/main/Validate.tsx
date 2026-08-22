import { useState, useEffect, type ReactNode } from "react"

interface RoleGuardProps {
    userId: number | string
    children: ReactNode
}

interface UserData {
    uid: number
    role: string
}

export default function RoleGuard({ userId, children }: RoleGuardProps) {
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const response = await fetch("http://192.168.100.52:8000/api/user/validate", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        requestId: Number(userId)
                    }),
                })
                if (response.ok) {
                    const data: UserData = await response.json()
                    const userRole = data.role?.toLowerCase()
                    if (userRole === "admin" || userRole === "staff") {
                        setIsAuthorized(true)
                    } else {
                        setIsAuthorized(false)
                    }
                } else {
                    setIsAuthorized(false)
                }
            } catch {
                setIsAuthorized(false)
            }
        }
        if (userId) {
            checkUserRole()
        }
    }, [userId])
    if (!isAuthorized) {
        return <></>
    }
    return <>{children}</>
}