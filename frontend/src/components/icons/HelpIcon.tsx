interface IconProps {
    className?: string
}

export default function HelpIcon({className = "w-10 h-10"}: IconProps) {
    return (
        <svg 
            viewBox="0 0 18 30" 
            fill="none" 
            className={className}
        >
            <path d="M9.38049 28V27.9814M2.00049 7.57143C2.84638 4.36743 5.82976 2 9.38049 2C10.7683 2 12.0696 2.36177 13.1905 2.99385M9.38049 22.4286C9.38049 14.0714 17.0005 15.9286 17.0005 9.42857C17.0005 8.7873 16.917 8.16501 16.7605 7.57143" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
}