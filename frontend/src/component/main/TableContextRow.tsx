interface TableContextRowProps {
    field: string[]
    colspan?: number[]
    totalCols?: number
}

export default function TableContextRow({ field, colspan, totalCols }: TableContextRowProps) {
    const cols = totalCols || field.length;

    return (
        <div 
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            className="grid h-7 border-b border-[#E2E8F0] px-5 items-center bg-[#64748B] text-white"
        >
            {field.map((title, index) => {
                const spanSize = colspan?.[index] || 1; 

                return (
                    <div 
                        key={index} 
                        style={{ gridColumn: `span ${spanSize} / span ${spanSize}` }}
                        className="flex items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                        <p className="font-bold text-xs">{title}</p>
                    </div>
                );
            })}
        </div>
    );
}
