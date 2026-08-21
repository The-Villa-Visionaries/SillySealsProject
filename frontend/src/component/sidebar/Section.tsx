import Tile from "./Tile";

interface SectionProps {
    title: string;
}

export default function Section({ title }: SectionProps) {
    return (
        <div className="w-5/6 border-[#E2E8F0] border-b text-[#64748B] text-md flex flex-col z-20 pb-2 mt-2 px-1 transition-all duration-200 ease-in-out hover:text-[#9F4EFF]">
            <h3 className="font-semibold mb-1">{title}</h3>
            <Tile title={'title'} count={1} />
            <Tile title={'title2'} count={10} />
            <Tile title={'title3'} count={5} />
        </div>
    )
}