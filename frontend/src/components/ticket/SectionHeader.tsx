interface SectionHeaderProps {
    status: string
}

export default function SectionHeader({status}: SectionHeaderProps) {
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
            <span className={`w-[23px] h-[23px] rounded-full border-[3px] border-[#14452F] flex-shrink-0 ${
                dotColors[status] || 'bg-[#858585]'
            }`}/>
            <h2 className="text-[#14452F] font-bold text-[23px] leading-[29px]">
                {status}
            </h2>
        </div>
    )
}