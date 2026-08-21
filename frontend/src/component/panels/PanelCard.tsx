import { useState } from "react";

interface PanelCardProps {
    type: string;
    value: string;
    description?: string;
    readOnly?: boolean;
}

export default function PanelCard({ type, value, description, readOnly=true }: PanelCardProps) {
    const [useValue, setValue] = useState<string>(value);
    return (
        <div className="w-50 h-15 flex flex-col justify-center items-center">
            <h3 className="text-[5 px] text-[#64748B]">{type}</h3>
            <input type="text" value={useValue} readOnly={readOnly} onChange={(e) => setValue(e.target.value)} className="text-[15px] font-semibold text-center focus:outline-none focus:ring-0 focus:border-transparent" />
            <p className="text-[9px] text-[#64748B]">{description}</p>
        </div>
    )
}