import CommentCard from "./CommentCard";

interface CommentsProps {
    switchDetail: () => void;
}
export default function Comments({ switchDetail }: CommentsProps) {
    return (
        <div className="relative w-full h-full flex flex-col">             
            <div className="w-full border-b border-[#E2E8F0] p-4 flex gap-5 items-center">
                <img src="../../../../public/favicon.svg" alt="p1" className="w-5 h-5 object-cover"/>
                <h1 className="text-[15px] font-bold">Server rack overheating — fans not spinning</h1>
            </div>
            <div className="w-full border-b border-[#E2E8F0] pt-2 flex gap-10 text-[#64748B] text-[13px] font-bold flex justify-center">
                <div onClick={switchDetail} className="pb-2 hover:border-b hover:border-[#9F4EFF] border-black/0 border-b-2 hover:border-b-2 w-35 flex justify-center hover:text-[#9F4EFF]">
                    <h1>Detail</h1>
                </div>
                <div className="pb-2 border-b border-[#9F4EFF] border-b-2 w-35 flex justify-center text-[#9F4EFF]">
                    <h1>Comments</h1>
                </div>
            </div>
            <CommentCard username="Aishath Livv" message="This is a sample comment." />
            <CommentCard username="Aishath Naushyn" message="Another comment for testing." own={true} />
            <div className="absolute bottom-0 left-0 right-0 p-4 pb-2 border-t border-[#E2E8F0]">
                <textarea name="comment" id="comment" placeholder="Write a comment..." className="w-full resize-none p-2 border border-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#9F4EFF]"></textarea>
            </div>
        </div>
    )
}