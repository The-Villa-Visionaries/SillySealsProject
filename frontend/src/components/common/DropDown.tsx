import { useState } from "react"

export interface Options {
    label:string
    value:string
}
interface DropDownProps {
    label:string
    value:string
    options: Options[]
    onChange: (value:string) => void
}

export default function DropDown({label, value, options, onChange}: DropDownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const selected = options.find((opt) => opt.value === value)
    const handleSelect = (optionValue:string) => {
        onChange(optionValue)
        setIsOpen(false)
    }
    return (
        <div className="relative my-4 w-[70vw]">
            <label className="absolute -top-[14px] left-[20px] z-10 px-1 font-black italic text-[20px] leading-[24px] text-[#0A5C36] flex items-center justify-center select-none [text-shadow:3px_3px_0_#fff,-3px_-3px_0_#fff,3px_-3px_0_#fff,-3px_3px_0_#fff,3px_0_0_#fff,-3px_0_0_#fff,0_3px_0_#fff,0_-3px_0_#fff]">
                {label}
            </label>
            <div className="w-full border-[3px] border-[#14452F] rounded-[20px] overflow-hidden bg-[D9D9D9] shadow-sm">
                <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full h-11 bg-[#1A5407] text-white font-semibold text-[16px] flex items-center justify-between px-5 focus:outline-none">
                    <span className="w-full text-center captalize">
                        {selected ? selected.label : "Select Option"}
                    </span>
                    <svg
                        className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {isOpen && (
                    <div className="flex flex-col">
                        {options.map((option) => {
                            const isSelected = option.value === value
                            return (
                                <button key={option.value} type="button" onClick={() => handleSelect(option.value)} className={`w-full h-8 font-semibold text-[16px] transition-colors ${
                                    isSelected
                                        ? "bg-[#858585] text-white"
                                        : "bg-[#D9D9D9] text-[#2A2A2A] hover:bg-[#A3A3A3]"
                                }`}>
                                    {option.label}
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}