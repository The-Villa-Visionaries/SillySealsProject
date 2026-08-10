interface CustomInputProps {
    label: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    placeholder?: string
    rows?: number
}

export default function CustomInput({label, value, onChange, placeholder, rows}: CustomInputProps) {
    return (
        <div className="relative my-4 w-[70vw]">
            <label className="absolute -top-[14px] left-[20px] z-10 bg-white px-1 font-black italic text-[20px] leading-[24px] text-[#0A5C36] border-[3px] border-white flex items-center select-none">
                {label}
            </label>
            {rows ? (
                <textarea
                    rows={rows}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-white border-[3px] border-[#14452F] rounded-[20px] px-5 pt-4 pb-3 font-semibold text-[16px] text-[#1A5407] placeholder-[#1A5407]/50 focus:outline-none focus:ring-2 focus:ring-[#0A5C36] resize-none shadow-sm"
                />
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full h-[45px] bg-white border-[3px] border-[#14452F] rounded-[20px] px-5 font-semibold text-[16px] text-[#1A5407] placeholder-[#1A5407]/50 focus:outline-none focus:ring-2 focus:ring-[#0A5C36] shadow-sm flex items-center"
                />
            )}
        </div>
    );
}