interface IconProps {
    className?: string
}

export default function SearchIcon({className = "w-5 h-5"}: IconProps) {
    return (
        <svg 
            viewBox="0 11 25 1" 
            fill="none"
            className={className}
        >
            <path d="M9.88889 4.33333C12.9571 4.33333 15.4444 6.82064 15.4444 9.88889M16.1764 16.1721L21 21M18.7778 9.88889C18.7778 14.7981 14.7981 18.7778 9.88889 18.7778C4.97969 18.7778 1 14.7981 1 9.88889C1 4.97969 4.97969 1 9.88889 1C14.7981 1 18.7778 4.97969 18.7778 9.88889Z" stroke="#8C8C8C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}