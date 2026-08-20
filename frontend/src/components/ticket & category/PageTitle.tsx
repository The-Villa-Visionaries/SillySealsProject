interface PageTileProps {
    title:string
    page?:string
}

const THEMES = {
    staff: {
        text: 'text-[#2777A3]',
        border: 'border-[#4686A9]',
    },
    admin: {
        text: 'text-[#581C87]',
        border: 'border-[#3B0764]',
    },
    default: {
        text: 'text-[#14452F]',
        border: 'border-[#1A5407]',
    }
}     
export default function PageTile({title, page}: PageTileProps) {
    const theme = THEMES[page as keyof typeof THEMES] || THEMES.default
    return (
        <div className="flex flex-col items-center my-2">
            <h2 className={`font-black italic text-[35px] leading-[29px] ${theme.text} text-center`}>
                {title}
            </h2>
            <div className={`w-[70vw] border-t-[6px] ${theme.border} rounded-full mt-2`}/>
        </div>
    )
}