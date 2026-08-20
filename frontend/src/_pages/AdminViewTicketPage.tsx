import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CustomInput from '../components/common/CustomInput'
import DropDown from '../components/common/DropDown'
import TicketCard from '../components/ticket & category/TicketCard'
import Header from '../components/layout/Header'
import Confidential from '../../../confidential'
import PageWrapper from '../components/layout/PageWrapper'

type CategoryType = 'help' | 'clean' | 'maintenance'

const categories: { label: string, value: CategoryType }[] = [
    { label: 'Help', value: 'help' },
    { label: 'Cleaning', value: 'clean' },
    { label: 'Maintenance', value: 'maintenance' },
]

type StatusType = 'open' | 'in-progress' | 'resolved' | 'closed'

const statuses: { label: string, value: StatusType }[] = [
    { label: 'Open', value: 'open' },
    { label: 'In-progress', value: 'in-progress' },
    { label: 'Resolved', value: 'resolved' },
    { label: 'Closed', value: 'closed' },
]

interface ViewTicketPageProps {
    ticket?: number
    onSuccess?: (action: 'updated' | 'deleted', title: string) => void
    onCancel?: () => void
}

export default function ViewTicketPage({ ticket: propTicketId, onSuccess, onCancel }: ViewTicketPageProps) {
    const { ticket } = useParams<{ ticket: string }>()
    const ticketId = ticket ? Number(ticket.replace('ticket-', '')) : NaN;
    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState<CategoryType>('help')
    const [status, setStatus] = useState<StatusType>('open')
    const [user, setUser] = useState('')
    const [staff, setStaff] = useState('')
    const [deleted, setDeleted] = useState()
    const [loading, setLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const currentUserId = 3

    const handleActionSuccess = (action: 'updated' | 'deleted', ticketTitle: string) => {
        if (onSuccess) {
            onSuccess(action, ticketTitle)
        }
    }

    useEffect(() => {
        if (!ticketId || isNaN(ticketId)) {
            setError("Invalid or missing Ticket ID")
            setLoading(false)
            return
        }

        const fetchTicketDetails = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch(`http://0.0.0.0:8000/api/ticket-${ticketId}/view`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ticketId, requestId: currentUserId })
                })

                if (!response.ok) {
                    const errData = await response.json()
                    throw new Error(errData.detail || 'Failed to fetch ticket details')
                }

                const data = await response.json()
                setTitle(data.title || '')
                setDescription(data.description || '')
                setCategory(data.category || 'help')
                setStatus(data.status || 'open')
                setUser(data.userId || 'Unknown')
                setStaff(data.staffId || 'Uknown')
                setDeleted(data.deleted || false)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchTicketDetails()
    }, [ticketId, currentUserId])

    const handleUpdate = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!title.trim()) {
            setError("A title is required!")
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch(`http://0.0.0.0:8000/api/ticket-${ticketId}/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId, requestId: currentUserId, title, description, category, status, staffId: staff, user, deleted})
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.detail || 'Failed to update ticket')
            }

            handleActionSuccess('updated', title)
            navigate('/admin')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }
    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
            return
        }
        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch(`http://0.0.0.0:8000/api/ticket-${ticketId}/delete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({requestId: currentUserId, ticketId})
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.detail || "Failed to delete category")
            }

            if (onSuccess) {
                onSuccess('deleted', String(ticketId))
            } else {
                navigate('/admin')
            }
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
            navigate('/admin')
        }
    }

    if (loading) {
        return <div className="text-center py-8 text-white/80 font-medium">Loading ticket details...</div>
    }

    return (
        <form onSubmit={handleUpdate} className="overflow-x-hidden min-h-screen bg-[#14452F] flex flex-col items-center relative">
            <Header 
                userName={String(currentUserId)} 
                avatarUrl={Confidential({ x: 1 })}
                showSearch={false}
                userId={currentUserId}
                page='admin'
            />

            <PageWrapper title='Edit a Ticket' page='admin'>
                <div className="flex flex-col items-center w-full max-w-md mx-auto px-4 pt-4 gap-3">
                    {error && (
                        <div className="w-full mb-1 text-red-600 bg-red-100 p-3 rounded-lg text-sm text-center font-medium shadow-sm">
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

                    <CustomInput
                        label="User"
                        value={user}
                        onChange={e => setUser(e.target.value)}
                        placeholder="User"
                    />

                    <CustomInput
                        label="Staff"
                        value={staff}
                        onChange={e => setStaff(e.target.value)}
                        placeholder="Staff"
                    />

                    <DropDown
                        label="Category"
                        value={category}
                        options={categories}
                        onChange={(val) => setCategory(val as CategoryType)}
                    />

                    <DropDown
                        label="Status"
                        value={status}
                        options={statuses}
                        onChange={(val) => setStatus(val as StatusType)}
                    />
                    <button 
                        onClick={handleDelete}
                        className="w-[70vw] h-[65px] mt-5 bg-gradient-to-b from-[#8c2e2e] to-[#e31313] rounded-[18px] text-white font-black italic text-[20px] shadow-md active:scale-95 transition-transform">
                        Delete
                    </button>
                </div>
                <div className="flex flex-col w-full fixed bottom-0 left-0 right-0 items-center justify-center z-20 bg-white pb-6 pt-3">
                    <div className="w-full max-w-md px-2 mb-4">
                        <h3 className="text-[#14452F] font-bold text-[23px] leading-[29px] mb-2">Preview</h3>
                        <TicketCard 
                            isPreview 
                            title={title || "Loading..."} 
                            description={description || "Loading..."} 
                            category={category} 
                            status={status}
                        />
                    </div>

                    <div className="flex items-center justify-between w-[85vw] max-w-md gap-4">
                        <button
                            type="button"
                            onClick={handleBack}
                            disabled={isSubmitting}
                            className="w-1/2 h-[65px] bg-gradient-to-b from-[#3E1515] to-[#B21212] rounded-[18px] text-white font-black italic text-[20px] shadow-md active:scale-95 transition-transform">
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-1/2 h-[65px] bg-gradient-to-b from-[#28153E] to-[#4A12B2] rounded-[18px] text-white font-black italic text-[20px] shadow-md active:scale-95 transition-transform disabled:opacity-50">
                            {isSubmitting ? "Editing..." : "Confirm Edit"}
                        </button>
                    </div>
                </div>
            </PageWrapper>
        </form>
    )
}