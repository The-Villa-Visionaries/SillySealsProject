import { useState, useEffect, useCallback } from "react"
import Detail from "./Detail"
import Edit from "./Edit"

interface ViewProps {
    isOpen?: boolean
    onClose: () => void
    cid: number
    requestId: number
}

export default function View({ isOpen, onClose, cid, requestId }: ViewProps) {
    const [mode, setMode] = useState<"detail" | "edit">("detail")
    const [categoryData, setCategoryData] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")

    const fetchCategory = useCallback(async () => {
        if (!cid) return
        setLoading(true)
        setErrorMessage("")
        try {
            const response = await fetch('http://192.168.100.52:8000/api/category/view', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cid,
                    requestId,
                }),
            })

            if (response.ok) {
                const data = await response.json()
                setCategoryData(data)
            } else {
                const errData = await response.json()
                setErrorMessage(errData.detail || "Failed to load category.")
            }
        } catch (error) {
            setErrorMessage("An error occurred while fetching the category.")
        } finally {
            setLoading(false)
        }
    }, [cid, requestId])

    useEffect(() => {
        if (isOpen && cid) {
            fetchCategory()
        }
    }, [isOpen, cid, fetchCategory])

    return (
        <div className={`w-full h-full bg-black/50 fixed top-0 left-0 z-25 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => { onClose(); setMode('detail'); }}>
            <div className={`w-120 h-screen bg-white absolute top-0 right-0 z-40 pt-13 border-l border-[#E2E8F0] transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
                {loading && <div className="p-4 text-center text-[#64748B]">Loading category...</div>}
                {errorMessage && <div className="p-4 text-center text-red-500">{errorMessage}</div>}
                {!loading && !errorMessage && categoryData && (
                    <>
                        {mode === 'detail' && <Detail category={categoryData} switchEdit={() => setMode('edit')} onClose={onClose} requestId={requestId} />}
                        {mode === 'edit' && <Edit category={categoryData} switchDetail={() => setMode('detail')} reloadCategories={fetchCategory} requestId={requestId} />}
                    </>
                )}
            </div>
        </div>
    )
}