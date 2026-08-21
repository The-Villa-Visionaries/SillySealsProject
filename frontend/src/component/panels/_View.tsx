import { useState } from "react";
import Detail from "./Detail";
import Edit from "./Edit";

interface ViewProps {
    isOpen?: boolean;
    onClose: () => void;
}

export default function View({ onClose, isOpen }: ViewProps) {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    return (
        <div className={`w-full h-full bg-black/50 fixed top-0 left-0 z-25 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => {onClose(), setIsEdit(false)}}>
            <div className={`w-120 h-screen bg-white absolute top-0 right-0 z-40  pt-13 border-l border-[#E2E8F0] transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
                {isEdit ? <Edit /> : <Detail />}
                <div className="w-full p-4 flex justify-between absolute bottom-0 left-0 border-t border-[#E2E8F0] bg-white z-27">
                    {isEdit ? (
                        <>
                            <button type="button" className="w-[calc(50%-10px)] bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600" onClick={() => setIsEdit(false)}>
                                Cancel
                            </button>
                            <button type="button" className="w-[calc(50%-10px)] bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600" onClick={() => setIsEdit(false)}>
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <>
                            <button type="button" className="w-[calc(50%-10px)] bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
                                Delete Ticket
                            </button>
                            <button type="button" className="w-[calc(50%-10px)] bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" onClick={() => setIsEdit(true)}>
                                Edit Ticket
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}