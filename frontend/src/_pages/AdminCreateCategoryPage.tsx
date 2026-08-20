import { useState } from "react";
import Confidential from "../../../confidential";
import Header from "../components/layout/Header";
import PageWrapper from "../components/layout/PageWrapper";
import CustomInput from "../components/common/CustomInput";
import CategoryCard from "../components/ticket & category/CategoryCard";
import { useNavigate } from "react-router-dom";

interface CreateCategoryPageProp {
    name?: string
    onSuccess?: (catName: string) => void
    onCancel?: () => void
}

export default function CreateCategoryPage({onSuccess, onCancel}: CreateCategoryPageProp) {
    const navigate = useNavigate()

    const [catName, setCatName] = useState('Category')
    const [catColor, setCatColor] = useState<string>('#000000')
    const [iconFile, setIconFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    const currentUserId = 3

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.name.toLowerCase().endsWith('.svg')) {
            setError("Only '.svg' file types are allowed.")
            return
        }

        setError(null)
        setIconFile(file)
        setPreviewUrl(URL.createObjectURL(file))
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!catName.trim()) {
            setError("A Category Name is required!")
            return
        } else if (!catColor.trim()) {
            setError("A Category Color is required!")
            return
        } else if (!iconFile) {
            setError("Please select an SVG file to use as an Icon.")
            return
        }

        setIsSubmitting(true)
        setError(null)
        const formData = new FormData()
        formData.append('requestId', String(currentUserId))
        formData.append('name', catName)
        formData.append('color', catColor)
        formData.append('icon', iconFile)
        try {
            const response = await fetch(`http://0.0.0.0:8000/api/category/create`, {
                method: "POST",
                body: formData,
            })
            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.detail || "Failed to create category")
            }
            if (onSuccess) {
                onSuccess(catName)
            }
            navigate('/admin/category')
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
            navigate('/admin/category')
        }
    }
    return (
        <form onSubmit={handleSubmit} className="overflow-x-hidden min-h-screen bg-[#14452F] flex flex-col items-center relative">
            <Header
                userName={String(currentUserId)} 
                avatarUrl={Confidential({ x: 1 })}
                showSearch={false}
                userId={currentUserId}
                page="admin"
            />
            <PageWrapper title="Create Category" page="admin">
                <div className="flex flex-col items-center w-full max-w-md mx-auto px-4 pt-4 gap-3">
                    {error && (
                        <div className="w-full mb-3 text-red-600 bg-red-100 p-3 rounded-lg text-sm text-center font-medium shadow-sm">
                            {error}
                        </div>
                    )}
                    <CustomInput
                        label="Category Name"
                        value={catName}
                        onChange={e => setCatName(e.target.value)}
                        placeholder="Enter a Category Name..."
                    />
                    <CustomInput
                        label="Category Color (Hex Code)"
                        value={catColor}
                        onChange={e => setCatColor(e.target.value)}
                        placeholder="Color Hex Code..."
                    />
                    <div className="relative w-full bg-white border-[3px] border-[#14452F] rounded-[20px] px-5 pt-4 pb-3 mt-4 font-semibold text-[16px] text-[#8C8C8C] resize-none shadow-sm">
                        <label className="absolute -top-[14px] left-[20px] z-10 px-1 font-black italic text-[20px] leading-[24px] text-[#0A5C36] flex items-center select-none [text-shadow:3px_3px_0_#fff,-3px_-3px_0_#fff,3px_-3px_0_#fff,-3px_3px_0_#fff,3px_0_0_#fff,-3px_0_0_#fff,0_3px_0_#fff,0_-3px_0_#fff]">SVG Icon</label>
                        <input 
                            type="file" 
                            accept=".svg"
                            onChange={handleFileChange}
                            className="w-full text-[15px] text-gray-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-white file:text-[#14452F] hover:file:bg-gray-100 cursor-pointer"
                        />
                    </div>
                </div>
                <div className="flex flex-col w-full fixed bottom-0 left-0 right-0 items-center justify-center z-20 bg-white pb-6 pt-3">
                    <div className="w-full max-w-md px-2 mb-4">
                        <h3 className="text-[#14452F] font-bold text-[23px] leading-[29px] mb-2">Preview</h3>
                        <CategoryCard name={catName} color={catColor} previewUrl={previewUrl} />
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
                            {isSubmitting ? "Creating..." : "Create Category"}
                        </button>
                    </div>
                </div>
            </PageWrapper>

        </form>
    )
}