interface IconProps {
    className?: string
}

export default function RefreshIcon({className = "w-10 h-10"}: IconProps) {
    return (
        <svg 
            viewBox="0 0 29 35" 
            fill="none"
            className={className}
        >
            <path d="M1.5 20.0037C1.5 27.3676 7.46953 33.3371 14.8333 33.3371C22.1972 33.3371 28.1667 27.3676 28.1667 20.0037C28.1667 12.6399 22.1972 6.67041 14.8333 6.67041C12.2345 6.67041 9.80943 7.41389 7.75905 8.69978" stroke="white" stroke-width="3" stroke-linecap="round"/>
            <path d="M10.2307 1.50037L7.33093 8.06907C6.9592 8.91113 7.34048 9.89512 8.18256 10.2668L14.7513 13.1666" stroke="white" stroke-width="3" stroke-linecap="round"/>
        </svg>
    )
}