import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CustomInput from '../components/common/CustomInput'
import DropDown from '../components/common/DropDown'
import TicketCard from '../components/ticket/TicketCard'
import Header from '../components/layout/Header'
import PageWrapper from '../components/layout/PageWrapper'
import Confidential from '../../../confidential'

type CategoryType = 'help' | 'clean' | 'maintenance'

const categories: { label: string, value: CategoryType }[] = [
    { label: 'Help', value: 'help' },
    { label: 'Cleaning', value: 'clean' },
    { label: 'Maintenance', value: 'maintenance' },
]

interface CreateTicketPageProps {
    userId?: number
    onSuccess?: (ticketTitle: string) => void
    onCancel?: () => void
}

export default function CreateTicketPage({ onSuccess, onCancel }: CreateTicketPageProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState<CategoryType>('help')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const currentUserId = 1
    const navigate = useNavigate()

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!title.trim()) {
            setError("A title is required!")
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch(`http://0.0.0.0:8000/api/ticket/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    requestId: currentUserId,
                    title,
                    description,
                    category
                })
            })

            if (!response.ok) {
                const errData = await response.json()
                if (Array.isArray(errData.detail)) {
                    throw new Error(errData.detail[0]?.msg || "Validation failed")
                }
                throw new Error(errData.detail || "Failed to create ticket")
            }

            if (onSuccess) {
                onSuccess(title)
            }

            navigate('/home')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }
    const handleBack = () => {
        if (onCancel) {
            onCancel()
        } else {
            navigate('/home')
        }
    }
    return (
        <form onSubmit={handleSubmit} className="overflow-x-hidden min-h-screen bg-[#14452F] flex flex-col items-center relative">
            <Header 
                userName={String(currentUserId)} 
                avatarUrl={Confidential({ x: 1 })}
                showSearch={false}
                userId={currentUserId}
            />
            <PageWrapper title="Create Ticket">
                <div className="flex flex-col items-center w-full max-w-md mx-auto px-4 pt-4 gap-3">
                    {error && (
                        <div className="w-full mb-3 text-red-600 bg-red-100 p-3 rounded-lg text-sm text-center font-medium shadow-sm">
                            {error}
                        </div>
                    )}
                    <CustomInput
                        label="Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="Enter a Title..."
                    />
                    <CustomInput
                        label="Description"
                        value={description}
                        rows={3}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Enter a Description..."
                    />
                    <DropDown
                        label="Category"
                        value={category}
                        options={categories}
                        onChange={(val) => setCategory(val as CategoryType)}
                    />
                </div>
                <div className="flex flex-col w-full fixed bottom-0 left-0 right-0 items-center justify-center z-20 bg-white pb-6 pt-3">
                    <div className="w-full max-w-md px-2 mb-4">
                        <h3 className="text-[#14452F] font-bold text-[23px] leading-[29px] mb-2">Preview</h3>
                        <TicketCard 
                            isPreview 
                            title={title || "Enter a Title..."} 
                            description={description || "Enter a Description..."} 
                            category={category} 
                        />
                    </div>
                    <div className="flex items-center justify-between w-[85vw] max-w-md gap-4">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="w-1/2 h-[65px] bg-gradient-to-b from-[#451414] to-[#540707] rounded-[18px] text-white font-black italic text-[20px] shadow-md active:scale-95 transition-transform">
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-1/2 h-[65px] bg-gradient-to-b from-[#14452F] to-[#1A5407] rounded-[18px] text-white font-black italic text-[20px] shadow-md active:scale-95 transition-transform disabled:opacity-50">
                            {isSubmitting ? "Creating..." : "Create"}
                        </button>
                    </div>
                </div>
            </PageWrapper>
        </form>
    )
}