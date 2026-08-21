import HeaderBar from "../component/header/_HeaderBar";
import Main from "../component/main/_Main";
import SideBar from "../component/sidebar/_SideBar";

export default function Home() {
    return (
        <div className="flex flex-col bg-[#F8FAFC] h-screen w-screen pt-13 pl-64 p-1 overflow-x-hidden">
            <SideBar />
            <HeaderBar />
            <Main />
        </div>
    )
}