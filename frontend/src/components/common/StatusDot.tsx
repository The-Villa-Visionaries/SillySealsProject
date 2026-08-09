interface StatusDotProps {
    status: string
}

export default function StatusDot({status}: StatusDotProps) {
    const colors: Record<string, string> = {
        'Open': 'bg-[#008CFF]',
        'In-Progress': 'bg-[#FFA100]',
        'Resolved': 'bg-[#26FF00]',
        'Closed': 'bg-[#858585]',

        'Active': 'bg-[#008CFF]',
        'In-Active': 'bg-[#858585]',
    }
    return (
        <span className = {
            `inline-block w-[22px] h-[22px] rounded-full border-[3px] border-white flex-shrink-0 ${ colors[status] || 'bg-[#858585]'}
        `}/>
    )
}