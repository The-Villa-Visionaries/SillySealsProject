interface SectionHeaderProps {
    status:string
    page?:string
}

const THEMES = {
    staff: {
        text: 'text-[#15293F]',
        border: 'border-[#15293F]',
    },
    admin: {
        text: 'text-[#3B0764]',
        border: 'border-[#3B0764]',
    },
    default: {
        text: 'text-[#243E15]',
        border: 'border-[#243E15]',
    }
}

export default function SectionHeader({status, page='default'}: SectionHeaderProps) {
    const theme = THEMES[page as keyof typeof THEMES] || THEMES.default
    const dotColors: Record<string, string> = {
        'Open': 'bg-[#008CFF]',
        'In-Progress': 'bg-[#FFA100]',
        'Resolved': 'bg-[#26FF00]',
        'Closed': 'bg-[#858585]',

        'Active': 'bg-[#008CFF]',
        'In-Active': 'bg-[#858585]',
    }
    return (
        <div className="flex items-center gap-2.5 mb-2 mt-2 w-[80vw]">
            <span className={`w-[23px] h-[23px] rounded-full border-[3px] ${theme.border} flex-shrink-0 ${
                dotColors[status] || 'bg-[#858585]'
            }`}/>
            <h2 className={`${theme.text} font-bold text-[23px] leading-[29px]`}>
                {status}
            </h2>
        </div>
    )
}