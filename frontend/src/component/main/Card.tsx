interface CardProps {
    title: string;
    value: number;
    description: string;
    icon?: string;
}

export default function Card({ title, value, description, icon }: CardProps) {
    return (
        <div className="flex flex-col w-45 h-40 bg-white rounded-[20px] p-4 border-[#E2E8F0] border transition-transform duration-300 ease-out hover:scale-105 hover:cursor-pointer hover:border-[#9F4EFF]">
            <div className="flex justify-between w-full">
                <div className="w-10 flex items-center justify-center">
                    <h3 className="text-[35px] text-[#9F4EFF] font-bold leading-[40px]">{value}</h3>
                </div>
                <img src="../../../../public/favicon.svg" alt="" className="w-10 h-10 object-contain" />
            </div>
            <div className="flex flex-col mt-auto text-[#64748B]">
                <h1 className="font-bold">{title}</h1>
                <p className="text-[13px]">{description}</p>
            </div>
        </div>
    )
}