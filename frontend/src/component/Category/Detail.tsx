import PanelCard from "../../common/PanelCard"

interface DetailProps {
    category: {
        cid: number
        name: string
        color: string
        priorityScore: number
        icon?: string
    }
    switchEdit: () => void
    onClose: () => void
    requestId: number | string
}

export default function Detail({ category, switchEdit, onClose, requestId }: DetailProps) {
    
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this Category?")) return
        try {
            const response = await fetch(`http://192.168.100.52:8000/api/category/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cid: category.cid,
                    requestId: requestId,
                }),
            })
            if (response.ok) {
                onClose()
            } else {
                const errData = await response.json()
                alert(errData.detail || "Failed to delete Category.")
            }
        } catch (error) {
            alert("An error occurred while deleting the Category.")
        }
    }
    return (
        <>
            <div className="w-full border-b border-[#E2E8F0] p-4 flex gap-5 items-center">
                <img src={`http://192.168.100.52:8000/${category.icon}`} alt="p1" className="w-5 h-5 object-cover"/>
                <h1 className="text-[15px] font-bold">{category.name}</h1>
            </div>
            <div className="w-full border-b border-[#E2E8F0] pt-2 flex gap-10 text-[#64748B] text-[13px] font-bold justify-center">
                <div className="pb-2 border-b border-[#9F4EFF] border-b-2 w-35 flex justify-center text-[#9F4EFF]">
                    <h1>Category Details</h1>
                </div>
            </div>
            <div className="w-full flex flex-wrap gap-4 p-4 justify-center">
                <PanelCard type="Category ID" value={category.cid} />
                <PanelCard type="Color" value={category.color} />
                <PanelCard type="Priority Score" value={category.priorityScore} />
            </div>
            <div className="w-full p-4 flex justify-between absolute bottom-0 left-0 border-t border-[#E2E8F0] bg-white z-27">
                <button type="button" className="w-[calc(50%-10px)] bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={handleDelete}>
                    Delete Category
                </button>
                <button type="button" className="w-[calc(50%-10px)] bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={switchEdit}>
                    Edit Category
                </button>
            </div>
        </>
    )
}