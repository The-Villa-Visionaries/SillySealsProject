export default function TableContextRow() {
    return (
        <div className="flex w-full grid grid-cols-13 h-7 border-b border-[#E2E8F0] px-5 items-center bg-[#64748B] text-white">
            <div className="col-span-1 flex items-center justify-center">
                <p className="font-bold">Category</p>
            </div>
            <div className="col-span-5 flex flex flex-col">
                <p className="font-bold">Title & Description</p>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <p className="font-bold">Priority</p>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <p className="font-bold">Status</p>
            </div>
            <div className="col-span-2 flex items-center justify-center">
                <p className="font-bold">Location</p>
            </div>
            <div className="col-span-2 flex items-center justify-center">
                <p className="font-bold">Assigned To</p>
            </div>
            <div className="col-span-1 flex items-center justify-center">
                <p className="font-bold">Action</p>
            </div>
        </div>
    )
}