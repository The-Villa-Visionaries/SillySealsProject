import { useState } from "react"

interface EditProps {
    switchDetail: () => void
    reloadCategories: () => void
    category: {
        cid: number
        name: string
        color: string
        priorityScore: number
        icon?: string
    }
    requestId: number
}

export default function Edit({ switchDetail, reloadCategories, category, requestId }: EditProps) {
    const [name, setName] = useState(category.name || '')
    const [color, setColor] = useState(category.color || '')
    const [priorityScore, setPriorityScore] = useState(category.priorityScore?.toString() || '0')
    const [icon, setIcon] = useState<File | null>(null)
    const [errorMessage, setErrorMessage] = useState<string>('')

    const handleSave = async () => {
        const formData = new FormData()
        formData.append('requestId', String(requestId))
        formData.append('cid', String(category.cid))
        formData.append('name', name)
        formData.append('color', color)
        formData.append('priorityScore', priorityScore)
        if (icon) {
            formData.append('icon', icon)
        }

        try {
            const response = await fetch('http://192.168.100.52:8000/api/category/update', {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                reloadCategories()
                switchDetail()
            } else {
                const errData = await response.json()
                if (typeof errData.detail === 'string') {
                    setErrorMessage(errData.detail)
                } else {
                    setErrorMessage("Failed to update category.")
                }
            }
        } catch (error) {
            setErrorMessage("An error occurred while updating the category.")
        }
    }

    return (
        <>             
             <div className="w-full border-b border-[#E2E8F0] p-4 flex gap-5 items-center">
                <h1 className="text-[15px] font-bold">{name}</h1>
            </div>
            <div className="w-full border-b border-[#E2E8F0] pt-2 flex gap-10 text-[#64748B] text-[13px] font-bold justify-center">
                <div className="pb-2 border-b border-[#9F4EFF] border-b-2 w-35 flex justify-center text-[#9F4EFF]">
                    <h1>Editing Category</h1>
                </div>
            </div>
            {errorMessage && <div className="p-4 text-center text-red-500 text-sm">{errorMessage}</div>}
            <div className="w-full p-4 pb-2 text-Black">
                <h1 className="text-[15px] font-bold">Name</h1>
                <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Enter Name" 
                    className="w-full h-8 text-[13px] text-[#64748B] mt-1 pl-3 border border-[#E2E8F0] rounded focus:outline-none" 
                />
            </div>
            <div className="w-full px-4 py-2 text-Black">
                <h1 className="text-[15px] font-bold">Color</h1>
                <input 
                    type="text" 
                    value={color} 
                    onChange={e => setColor(e.target.value)} 
                    placeholder="Enter Hex Color" 
                    maxLength={7}
                    className="w-full h-8 text-[13px] text-[#64748B] mt-1 pl-3 border border-[#E2E8F0] rounded focus:outline-none" 
                />
            </div>
            <div className="w-full px-4 py-2 text-Black">
                <h1 className="text-[15px] font-bold">Priority Score</h1>
                <p className="text-[13px] text-[#64748B] pl-3 mt-1">Priority Score is influenced by Category and Location.</p>
                <input 
                    type="number" 
                    step="1" 
                    min="0" 
                    value={priorityScore} 
                    onChange={e => setPriorityScore(e.target.value)} 
                    placeholder="(Enter priority score)" 
                    className="w-full h-8 text-[13px] text-[#64748B] mt-1 pl-3 border border-[#E2E8F0] rounded focus:outline-none" 
                />
            </div>
            <div className="w-full px-4 py-2 text-Black">
                <h1 className="text-[15px] font-bold">New Icon (.svg, optional)</h1>
                <input 
                    type="file" 
                    accept=".svg" 
                    onChange={e => setIcon(e.target.files ? e.target.files[0] : null)} 
                    className="w-full text-[13px] text-[#64748B] mt-1 pl-3" 
                />
            </div>
            <div className="w-full p-4 flex justify-between absolute bottom-0 left-0 border-t border-[#E2E8F0] bg-white z-27">
                <button type="button" className="w-[calc(50%-10px)] bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={switchDetail}>
                    Cancel
                </button>
                <button type="button" className="w-[calc(50%-10px)] bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600" onClick={handleSave}>
                    Save Changes
                </button>
            </div>
        </>
    )
}