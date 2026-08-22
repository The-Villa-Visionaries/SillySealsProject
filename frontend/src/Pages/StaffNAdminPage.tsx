import { useState } from "react";
import HeaderBar from "../component/header/_HeaderBar";
import Main from "../component/main/_Main";
import SideBar from "../component/sidebar/_SideBar";
import Profile from "../component/window/Profile";
import Validate from "../component/main/Validate";

export default function Home() {
    const [profile, setProfile] = useState<boolean>(false);
    const [requestId] = useState<number>(2)
    return (
        <div className="flex flex-col bg-[#F8FAFC] h-screen w-screen pt-13 pl-64 p-1 overflow-x-hidden">
            <HeaderBar onProfileClick={() => setProfile(true)} />
            <Validate userId={requestId} >
                <SideBar requestId={requestId} />
                <Main requestId={requestId}/>
            </Validate>
            {profile && <Profile onClose={() => setProfile(false)} />}
        </div>
    )
}