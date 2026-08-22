interface TileProps {
    title: string
    count?: number
    icon?: string
}

export default function Tile({ title, count, icon }: TileProps) {
    const iconSrc = icon ? `http://192.168.100.52:8000/${icon}` : "../../../../public/favicon.svg"

    return (
        <div className="w-full text-[#64748B] text-sm flex items-center z-20 py-2 px-2 gap-2 hover:bg-[#e9ecee] cursor-pointer rounded-lg transition-all duration-200 ease-in-out hover:-translate-y-0.5">
            <img src={iconSrc} alt={title} className="w-5 h-5 object-cover" />
            <h3 className="">{title}</h3>
            {count !== undefined && (
                <div className="ml-auto h-5 w-5 bg-[#e9ecee] rounded-full flex items-center justify-center text-xs">
                    {count}
                </div>
            )}
        </div>
    )
}