import Section from './Section'

export default function SideBar() {
    return (
        <div className="fixed left-0 top-0 w-64 h-screen bg-white pt-14 flex flex-col z-20 border-[#E2E8F0] border-r items-center">
            <Section title="Navigate" />
            <Section title="Categories" />
            <Section title="Locations" />
            <Section title="Status" />
        </div>
    )
}