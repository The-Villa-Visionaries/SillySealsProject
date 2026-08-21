import Card from "./Card";

export default function Main() {
    return (
        <div className="flex w-full h-full">
            <div className="w-full h-full p-4">
                <h1 className="text-[25px] font-bold">All Tickets</h1>
                <div className="flex flex-wrap gap-4 mt-4">
                    <Card title="Total Tickets" value={12} description="Tickets in the system" />
                    <Card title="Open" value={5} description="Tickets that are open" />
                    <Card title="In-Progress" value={3} description="Tickets that are in progress" />
                    <Card title="Resolved" value={9} description="Tickets that are resolved" />
                    <Card title="Critical" value={2} description="Tickets that are critical and unresolved" />
                    <Card title="Closed" value={7} description="Tickets that are closed" />
                </div>
                <div className="w-full h-full mt-4 bg-white rounded-[20px] border-[#E2E8F0] border p-4">

                </div>
            </div>
        </div>
    )
}