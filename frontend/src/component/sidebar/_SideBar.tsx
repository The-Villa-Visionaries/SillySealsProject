import Section from './Section'

interface SideBarProps {
    requestId: number
    onSelectFilter?: (type: string, value: string) => void
}

export default function SideBar({ requestId }: SideBarProps) {
    return (
        <div className="fixed left-0 top-0 w-64 h-screen bg-white pt-14 flex flex-col z-20 border-[#E2E8F0] border-r items-center overflow-y-auto">
            <Section title="Navigate" requestId={requestId} endpoint="navigate" />
            <Section title="Categories" requestId={requestId} endpoint="categories" />
            <Section title="Locations" requestId={requestId} endpoint="locations" />
            <Section title="Status" requestId={requestId} endpoint="status" />
        </div>
    )
}