import { useState } from 'react';
import HelpIcon from '../icons/HelpIcon';
import CleanIcon from '../icons/CleanIcon';
import MaintenanceIcon from '../icons/MaintenanceIcon';
import CustomInput from '../common/CustomInput';
import DropDown from '../common/DropDown';
import TicketCard from './TicketCard';

type CategoryType = 'help' | 'clean' | 'maintenance'
const categories: {label:string, value:CategoryType}[] = [
    {label: 'Help', value: 'help'},
    {label: 'Cleaning', value: 'clean'},
    {label: 'Maintenance', value: 'maintenance'},
]
const iconMap = {
    help: HelpIcon,
    clean: CleanIcon,
    maintenance: MaintenanceIcon,
};

interface CreateTicketFormProps {
    userId: number
    onSuccess: (ticketTitle: string) => void
    onCancel: () => void
}

export default function CreateTicketForm({userId, onSuccess, onCancel}: CreateTicketFormProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState<CategoryType>('help')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        if (!title.trim()) {
            setError("A title is required!")
            return
        }
        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch(`http://${hidden}:8000/api/ticket/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    requestId: userId,
                    title,
                    description,
                    category
                })
            })
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || "Failed to create ticket")
            }
            onSuccess(title)
        } catch (err:any) {
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }
    const CategoryIcon = iconMap[category]
    return (
        <form onSubmit={handleSubmit} className='flex flex-col w-full h-full flex-1'>
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
                    <TicketCard isPreview title={title} description={description} category={category}/>
                </div>
                <div className="flex items-center justify-between w-[80vw] gap-4 z-30">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="w-1/2 h-[65px] bg-gradient-to-b from-[#451414] to-[#540707] rounded-[20px] text-white font-black italic text-[22px] shadow-md active:scale-95 transition-transform">
                        Back
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-1/2 h-[65px] bg-gradient-to-b from-[#14452F] to-[#1A5407] rounded-[20px] text-white font-black italic text-[22px] shadow-md active:scale-95 transition-transform disabled:opacity-50">
                        {isSubmitting ? "Creating..." : "Create"}
                    </button>
                </div>
            </div>
        </form>
    )
}
