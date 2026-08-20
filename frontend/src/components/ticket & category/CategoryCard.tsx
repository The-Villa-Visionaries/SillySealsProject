interface CategoryCardProp {
    name:string
    color?:string
    onClick?: () => void
    previewUrl?:string | null
}

export default function CategoryCard({name, onClick, color, previewUrl}: CategoryCardProp) {
    const iconUrl = `http://0.0.0.0:8000/static/icons/${name}.svg`
    const imageSource = previewUrl || iconUrl
    return (
        <div onClick={onClick} className="flex items-start gap-[15px] w-[80vw] min-h-[55px] cursor-pointer hover:opacity-90 transition-opacity ml-2 mb-2">
            <div 
                style={{backgroundColor: color}}
                className="w-[65px] h-[65px] rounded-[15px] flex items-center justify-center shadow-md flex-shrink-0"
            >
                <img src={imageSource} alt={name} className="w-10 h-10 object-contain brightness-0 invert block shrink-0"/>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
                <h3 
                    style={{color: color}}
                    className="font-semibold text-[20px] leading-[23px] truncate"
                >
                    {name}
                </h3>
                <p className="text-[#2A2A2A] font-medium text-[16px] leading-[18px] line-clamp-2 max-h-12">
                    Color: {color}
                </p>
            </div>
        </div>
    )
}