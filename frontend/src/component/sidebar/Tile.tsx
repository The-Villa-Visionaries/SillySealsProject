interface TileProps {
    title: string;
    count?: number;
}

export default function Tile({ title, count }: TileProps) {
    return (
        <div className="w-full text-[#64748B] text-sm flex items-center z-20 py-2 px-2 gap-2 hover:bg-[#e9ecee] cursor-pointer rounded-lg transition-all duration-200 ease-in-out hover:-translate-y-0.5">
            <img src="../../../../public/favicon.svg" alt="p1"  className="w-5 h-5 object-cover"/>
            <h3 className="">{title}</h3>
            <div className="ml-auto h-5 w-5 bg-[#e9ecee] rounded-full flex items-center justify-center">{count}</div>
        </div>
    )
}