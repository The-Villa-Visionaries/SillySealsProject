import type React from "react"
import PageTitle from '../ticket/PageTitle'

interface PageWrapperProps {
    title: string
    children: React.ReactNode
}

export default function PageWrapper({title, children}: PageWrapperProps) {
    return (
        <section className="w-full bg-white rounded-t-[65px] px-6 pt-6 pb-12 shadow-2xl min-h-[calc(100vh-160px)] -mt-6 relative z-20">
            <PageTitle title={title}/>
            <div className="max-w-[80vw] mx-auto space-y-4">
                {children}
            </div>
        </section>
    )
}