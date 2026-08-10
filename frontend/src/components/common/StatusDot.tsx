interface StatusDotProps {
    status: string
}

export default function StatusDot({status}: StatusDotProps) {
    const colors: Record<string, string> = {
        'open': 'bg-[#008CFF]',
        'in-progress': 'bg-[#FFA100]',
        'resolved': 'bg-[#26FF00]',
        'closed': 'bg-[#858585]',

        'active': 'bg-[#008CFF]',
        'in-active': 'bg-[#858585]',
    }
    return (
        <span className = {
            `inline-block w-[22px] h-[22px] rounded-full border-[3px] border-white flex-shrink-0 ${ colors[status] || 'bg-[#858585]'}
        `}/>
    )
}