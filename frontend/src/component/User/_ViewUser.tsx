import { useState } from "react"
import Detail from "./Detail"
import Edit from "./Edit"

interface ViewProps {
    isOpen?: boolean
    onClose: () => void
    uid: string | number
    requestId: number | string
}

export default function View({ onClose, isOpen, uid, requestId }: ViewProps) {
    const [mode, setMode] = useState<"detail" | "edit">("detail")

    return (
        <div className={`w-full h-full bg-black/50 fixed top-0 left-0 z-25 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => { onClose(); setMode('detail') }} >
            <div className={`w-120 h-screen bg-white absolute top-0 right-0 z-40 pt-13 border-l border-[#E2E8F0] transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
                {mode === 'detail' && (
                    <Detail 
                        switchEdit={() => setMode('edit')} 
                        uid={uid} 
                        requestId={requestId} 
                        onClose={onClose} 
                    />
                )}
                {mode === 'edit' && (
                    <Edit 
                        switchDetail={() => setMode('detail')} 
                        uid={uid} 
                        requestId={requestId}
                    />
                )}
            </div>
        </div>
    )
}