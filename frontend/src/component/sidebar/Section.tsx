import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Tile from "./Tile"

interface SectionProps {
    title: string
    requestId: number
    endpoint: string
    onClick?: (selectedTitle: string) => void
}

interface ItemData {
    title: string
    count?: number
    icon?: string
}

export default function Section({ title, requestId, endpoint, onClick }: SectionProps) {
    const [items, setItems] = useState<ItemData[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (endpoint === 'categories') {
                    const res = await fetch("http://192.168.100.52:8000/api/categories", {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ requestId })
                    })
                    if (res.ok) {
                        const data = await res.json()
                        setItems(data.map((c: any) => ({ title: c.name, icon: c.icon })))
                    }
                } else if (endpoint === 'locations') {
                    const res = await fetch("http://192.168.100.52:8000/api/locations", {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ requestId })
                    })
                    if (res.ok) {
                        const data = await res.json()
                        setItems(data.map((l: any) => ({ title: l.name })))
                    }
                } else if (endpoint === 'status') {
                    setItems([
                        { title: 'Open' },
                        { title: 'In-Progress' },
                        { title: 'Resolved' },
                        { title: 'Closed' }
                    ])
                } else if (endpoint === 'navigate') {
                    setItems([
                        { title: 'Home' },
                        { title: 'Workspace' }
                    ])
                }
            } catch (err) {
                console.error(`Failed to load section ${title}:`, err)
            }
        }
        fetchData()
    }, [endpoint, requestId, title])

    const handleTileClick = (selectedTitle: string) => {
        const cleanName = selectedTitle.toLowerCase().trim()

        if (cleanName === "home") {
            navigate("/home")
        } else if (cleanName === "workspace") {
            navigate("/workspace")
        }

        onClick?.(selectedTitle)
    }

    return (
        <div className="w-5/6 border-[#E2E8F0] border-b text-[#64748B] text-md flex flex-col z-20 pb-2 mt-2 px-1 transition-all duration-200 ease-in-out hover:text-[#9F4EFF]">
            <h3 className="font-semibold mb-1">{title}</h3>
            {items.map((item, idx) => (
                <Tile 
                    onClick={handleTileClick} 
                    key={idx} 
                    title={item.title} 
                    count={item.count} 
                    icon={item.icon} 
                />
            ))}
        </div>
    )
}