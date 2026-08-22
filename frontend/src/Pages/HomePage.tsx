import { useState } from "react";
import HeaderBar from "../component/header/_HeaderBar";
import SideBar from "../component/sidebar/_SideBar";
import Profile from "../component/window/Profile";
import UserDashboard from "../component/main/_UserDashboard";

export default function Home() {
    const [profile, setProfile] = useState<boolean>(false);
    const [requestId] = useState<number>(3)
    return (
        <div className="flex flex-col bg-[#F8FAFC] h-screen w-screen pt-13 pl-64 p-1 overflow-x-hidden">
            <HeaderBar onProfileClick={() => setProfile(true)} />
            <SideBar requestId={requestId} />
            <UserDashboard requestId={requestId}/>
            {profile && <Profile onClose={() => setProfile(false)} />}
        </div>
    )
}