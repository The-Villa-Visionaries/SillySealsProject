import type React from "react"
import PageTitle from '../ticket & category/PageTitle'

interface PageWrapperProps {
    title: string
    children: React.ReactNode
    page?:string
}

export default function PageWrapper({title, children, page}: PageWrapperProps) {
    return (
        <section className="w-full flex-1 bg-white rounded-t-[65px] px-6 pt-6 pb-60 shadow-2xl -mt-6 relative z-20 flex flex-col">
            <PageTitle title={title} page={page}/>
            <div className="max-w-[80vw] mx-auto space-y-4 flex-1 flex flex-col justify-between">
                {children}
            </div>
        </section>
    )
}