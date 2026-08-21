interface CommentCardProps {
    username: string;
    message: string;
    own?: boolean;
}

export default function CommentCard({ username, message, own }: CommentCardProps) {
    return (
        <div className={`p-4 border-b border-[#E2E8F0] ${own ? 'bg-[#f8fafc]' : 'bg-white'}`}>
            <div className="flex items-center">
                <h3 className={`font-bold ${own ? 'text-[#9F4EFF]' : 'text-[#334155]'}`}>{username}</h3>
            </div>
            <p className="text-[#64748B] mt-2">{message}</p>
        </div>
    )
}