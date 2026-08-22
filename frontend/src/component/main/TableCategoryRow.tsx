import { useState } from "react"

interface TableCategoryRowProps {
    onView: () => void
    category: {
        cid: number
        name: string
        color: string
        priorityScore: number | string
        icon?: string
    }
}

export default function TableCategoryRow({ onView, category }: TableCategoryRowProps) {
    const [name] = useState(category.name ? category.name : 'No Name')
    const [color] = useState(category.color ? category.color : '#000000')
    const [priorityScore] = useState(category.priorityScore !== undefined ? category.priorityScore : '0')
    const [cid] = useState(category.cid ? category.cid : 0)
    
    const iconSrc = `http://192.168.100.52:8000/${category.icon}`

    return (
        <div className="flex w-full grid grid-cols-7 h-10 border-t border-[#E2E8F0] px-5 items-center z-5 bg-white">
            <div className="col-span-1 flex items-center justify-center">
                <img src={iconSrc} alt={name} className="w-5 h-5 object-cover"/>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <p className="text-[13px] truncate">{cid}</p>
            </div>
            <div className="col-span-2 flex items-center justify-center">
                <h3 className="w-full text-[13px] font-bold text-[#9F4EFF] truncate">{name}</h3>
            </div>
            <div className="col-span-1 flex items-center justify-center gap-2">
                <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: color }}></div>
                <p className="text-[13px] truncate">{color}</p>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <p className="text-[13px] truncate">{priorityScore}</p>
            </div>
            <button type="button" onClick={onView} className="col-span-1 h-7 bg-[#9F4EFF] text-white rounded-[10px] text-[13px] font-bold hover:bg-[#7a2ccf] hover:cursor-pointer transition-all duration-200 ease-in-out">
                {'View ➤'}
            </button>
        </div>
    )
}