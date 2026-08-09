import StatusDot from "../common/StatusDot"
import HelpIcon from '../icons/HelpIcon'
import MaintenanceIcon from "../icons/MaintenanceIcon"
import CleanIcon from "../icons/CleanIcon"

const iconMap = {
    help: HelpIcon,
    clean: CleanIcon,
    maintenance: MaintenanceIcon
}

interface TicketCardProp {
    title: string
    description: string
    status: string
    icon?: 'help' | 'clean' | 'maintenance'
    onClick?: () => void
}

export default function TicketCard({title, description, status, icon='help', onClick}: TicketCardProp) {
    const RenderIcon = iconMap[icon] || HelpIcon

    return (
        <div onClick={onClick} className="flex items-start gap-[15px] w-full max-w-[75vw] min-h-[55px] cursor-pointer hover:opacity-90 transition-opacity ml-2 mb-2">
            <div className="relative flex-shrink-0">
                <div className="w-[65px] h-[65px] bg-[#1A5407] rounded-[15px] flex items-center justify-center shadow-md">
                    <RenderIcon className="w-10 h-10"/>
                </div>
                <div className="absolute -bottom-3 -right-2">
                    <StatusDot status={status}/>
                </div>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
                <h3 className="text-[#1A5407] font-semibold text-[20px] leading-[23px] truncate">
                    {title}
                </h3>
                <p className="text-[#2A2A2A] font-medium text-[16px] leading-[18px] line-clamp-2 max-h-12">
                    {description}
                </p>
            </div>
        </div>
    )
}