interface CustomInputProps {
    label: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    placeholder?: string
    rows?: number
    blocked?: string
}

export default function CustomInput({label, value, onChange, placeholder, rows, blocked}: CustomInputProps) {
    return (
        <div className="relative my-4 w-[70vw]">
            {blocked ? (
                <label className="absolute -top-[14px] left-[20px] z-10 px-1 font-black italic text-[20px] leading-[24px] text-[#8C8C8C] flex items-center select-none [text-shadow:3px_3px_0_#fff,-3px_-3px_0_#fff,3px_-3px_0_#fff,-3px_3px_0_#fff,3px_0_0_#fff,-3px_0_0_#fff,0_3px_0_#fff,0_-3px_0_#fff]">
                    {label}
                </label>
            ) : (
                <label className="absolute -top-[14px] left-[20px] z-10 px-1 font-black italic text-[20px] leading-[24px] text-[#0A5C36] flex items-center select-none [text-shadow:3px_3px_0_#fff,-3px_-3px_0_#fff,3px_-3px_0_#fff,-3px_3px_0_#fff,3px_0_0_#fff,-3px_0_0_#fff,0_3px_0_#fff,0_-3px_0_#fff]">
                    {label}
                </label>
            )}
            {rows ? (
                blocked ? (
                <textarea
                    readOnly
                    rows={rows}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-[#D9D9D9] border-[3px] border-[#858585] rounded-[20px] px-5 pt-4 pb-3 font-semibold text-[16px] text-[#8C8C8C] resize-none shadow-sm"
                />
                ) : (
                <textarea
                    rows={rows}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-white border-[3px] border-[#14452F] rounded-[20px] px-5 pt-4 pb-3 font-semibold text-[16px] text-[#1A5407] placeholder-[#1A5407]/50 focus:outline-none focus:ring-2 focus:ring-[#0A5C36] resize-none shadow-sm"
                />
                )
            ) : (
                blocked ? (
                    <textarea
                        readOnly
                        onChange={onChange}
                        value={value}
                        className="w-full h-[45px] bg-[#D9D9D9] border-[3px] border-[#858585] rounded-[20px] px-5 leading-[39px] py-0 font-semibold text-[16px] text-[#8C8C8C] shadow-sm resize-none"
                    />
                ) : (
                    <input
                        type="text"
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className="w-full h-[45px] bg-white border-[3px] border-[#14452F] rounded-[20px] px-5 font-semibold text-[16px] text-[#1A5407] placeholder-[#1A5407]/50 focus:outline-none focus:ring-2 focus:ring-[#0A5C36] shadow-sm flex items-center"
                    />
                )
            )}
        </div>
    )
}