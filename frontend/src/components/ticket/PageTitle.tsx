interface PageTileProps {
    title: string
}

export default function PageTile({title}: PageTileProps) {
    return (
        <div className="flex flex-col items-center my-2">
            <h2 className="font-black italic text-[35px] leading-[29px] text-[#14452F] text-center">
                {title}
            </h2>
            <div className="w-[70vw] border-t-[6px] border-[#1A5407] rounded-full mt-2"/>
        </div>
    )
}