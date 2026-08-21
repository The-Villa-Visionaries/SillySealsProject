import { useState } from "react";
import HeaderBar from "../component/header/_HeaderBar";
import Main from "../component/main/_Main";
import SideBar from "../component/sidebar/_SideBar";
import Profile from "../component/window/Profile";

export default function Home() {
    const [profile, setProfile] = useState<boolean>(false);
    return (
        <div className="flex flex-col bg-[#F8FAFC] h-screen w-screen pt-13 pl-64 p-1 overflow-x-hidden">
            <SideBar />
            <HeaderBar onProfileClick={() => setProfile(true)} />
            <Main />
            {profile && <Profile onClose={() => setProfile(false)} />}
        </div>
    )
}