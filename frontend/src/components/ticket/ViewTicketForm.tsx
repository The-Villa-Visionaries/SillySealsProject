import { useState, useEffect } from 'react'
import CustomInput from '../common/CustomInput'
import DropDown from '../common/DropDown'
import TicketCard from './TicketCard'

type CategoryType = 'help' | 'clean' | 'maintenance'
const categories: { label: string, value: CategoryType }[] = [
    { label: 'Help', value: 'help' },
    { label: 'Cleaning', value: 'clean' },
    { label: 'Maintenance', value: 'maintenance' },
]

interface ViewTicketFormProps {
    ticketId: number
    userId: number
    onSuccess: (action: 'updated' | 'deleted', title: string) => void
}

export default function ViewTicketForm({ticketId, userId, onSuccess}: ViewTicketFormProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState<CategoryType>('help')
    const [status, setStatus] = useState<string>('open')
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchTicketDetails = async () => {
            setLoading(true)
            try {
                const response = await fetch(`http://0.0.0.0:8000/api/ticket-${ticketId}/view`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ticketId, requestId: userId })
                })
                if (!response.ok) throw new Error('Failed to fetch ticket details')
                const data = await response.json()
                setTitle(data.title || '')
                setDescription(data.description || '')
                setCategory(data.category || 'help')
                setStatus(data.status || 'open')
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchTicketDetails()
    }, [ticketId, userId])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const response = await fetch(`http://0.0.0.0:8000/api/ticket-${ticketId}/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId, requestId: userId, title, description, category })
            })
            if (!response.ok) throw new Error('Failed to update ticket')
            onSuccess('updated', title)
        } catch (err: any) {
            console.error("Update Error:", err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        setIsSubmitting(true)
        try {
            const res = await fetch(`http://0.0.0.0:8000/api/ticket-${ticketId}/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId, requestId: userId })
            })
            
            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.detail || 'Failed to delete ticket')
            }

            onSuccess('deleted', title || 'Ticket')
        } catch (err) {
            console.error("Delete Error:", err)
        }
    }

    if (loading) {
        return <div className="text-center py-8 text-gray-500 font-medium">Loading ticket details...</div>
    }

    return (
        <form onSubmit={handleUpdate} className='flex flex-col w-full h-full flex-1'>
            <div className='flex flex-col items-center w-full max-w-[80vw] mx-auto px-2 pt-4'>
                {error && (
                    <div className='w-full mb-3 text-red-600 bg-red-100 p-2 rounded-lg text-sm text-center font-medium'>
                        {error}
                    </div>
                )}
                <CustomInput
                    label='Title'
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder='Enter a Title...'
                />
                <CustomInput
                    label='Description'
                    value={description}
                    rows={3}
                    onChange={e => setDescription(e.target.value)}
                    placeholder='Enter a Description...'
                />
                <DropDown
                    label='Category'
                    value={category}
                    options={categories}
                    onChange={(val) => setCategory(val as CategoryType)}
                />
            </div>
            <div className='flex flex-col w-full fixed bottom-0 -left-0 items-center justify-center z-15 bg-white pb-6'>
                <div className='w-[80vw] mt-4 mb-8 items-center justify-center'>
                    <h3 className='text-[#14452F] font-black italic text-[20px] mb-2'>Preview</h3>
                    <TicketCard isPreview title={title} description={description} category={category} status={status}/>
                </div>
                <div className="flex items-center justify-between w-[80vw] gap-4 z-30">
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="w-1/2 h-[65px] bg-gradient-to-b from-[#451414] to-[#540707] rounded-[20px] text-white font-black italic text-[22px] shadow-md active:scale-95 transition-transform">
                        Delete
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-1/2 h-[65px] bg-gradient-to-b from-[#14452F] to-[#1A5407] rounded-[20px] text-white font-black italic text-[22px] shadow-md active:scale-95 transition-transform disabled:opacity-50">
                        {isSubmitting ? "Updating..." : "Update"}
                    </button>
                </div>
            </div>
        </form>
    )
}
