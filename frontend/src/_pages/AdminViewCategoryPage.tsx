import { useState, useEffect } from "react"
import Confidential from "../../../confidential"
import CustomInput from "../components/common/CustomInput"
import Header from "../components/layout/Header"
import PageWrapper from "../components/layout/PageWrapper"
import CategoryCard from "../components/ticket & category/CategoryCard"
import { useNavigate, useParams } from "react-router-dom"

interface ViewCategoryPageProp {
    name?: string
    onSuccess?: (action: 'updated' | 'deleted', title: string) => void
    onCancel?: () => void
}

export default function ViewCategory({ name: propCatName, onSuccess, onCancel }: ViewCategoryPageProp) {
    const params = useParams<Record<string, string>>()
    const rawParam = params.name || params.category || params.id || propCatName || ''
    const initialCategoryName = rawParam.replace(/^category-/, '')
    
    const navigate = useNavigate()
    
    const [catName, setCatName] = useState<string>(initialCategoryName)
    const [catColor, setCatColor] = useState<string>('#000')
    const [loading, setLoading] = useState<boolean>(true)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    
    const currentUserId = 3

    useEffect(() => {
        if (initialCategoryName) {
            setCatName(initialCategoryName)
        }
    }, [initialCategoryName])

    useEffect(() => {
        if (!initialCategoryName) return

        const fetchCategory = async () => {
            setLoading(true)
            setError(null)
            try {
                const response = await fetch(`http://0.0.0.0:8000/api/category/view`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ requestId: currentUserId, name: initialCategoryName })
                })

                if (!response.ok) {
                    const errData = await response.json()
                    throw new Error(errData.detail || "Failed to fetch category")
                }

                const data = await response.json()
                if (data.name) setCatName(data.name)
                if (data.color) setCatColor(data.color)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchCategory()
    }, [initialCategoryName])

    const handleUpdate = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)
        try {
            const response = await fetch(`http://0.0.0.0:8000/api/cetegory/update`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({requestId: currentUserId, changeFrom: initialCategoryName, changeTo: catName, color: catColor})
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.detail || "Failed to update category")
            }

            if (onSuccess) {
                onSuccess('updated', catName)
            } else {
                navigate('/admin/category')
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete "${initialCategoryName}"?`)) {
            return
        }

        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch("http://0.0.0.0:8000/api/category/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({requestId: currentUserId, name: initialCategoryName})
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.detail || "Failed to delete category")
            }

            if (onSuccess) {
                onSuccess('deleted', initialCategoryName)
            } else {
                navigate('/admin/category')
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
            navigate('/admin/category')
        }
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

            <PageWrapper title='Edit Category' page='admin'>
                <div className="flex flex-col items-center w-full max-w-md mx-auto px-4 pt-4 gap-3">
                    {error && (
                        <div className="w-full mb-1 text-red-600 bg-red-100 p-3 rounded-lg text-sm text-center font-medium shadow-sm">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <p className="text-white text-center py-4">Loading category...</p>
                    ) : (
                        <>
                            <CustomInput
                                label="Name"
                                value={catName}
                                onChange={e => setCatName(e.target.value)}
                                placeholder="Enter Category Name..."
                            />
                            <CustomInput
                                label="Color Hex Code"
                                value={catColor}
                                onChange={e => setCatColor(e.target.value)}
                                placeholder="#000000"
                            />
                            <button 
                                onClick={handleDelete}
                                className="w-[70vw] h-[65px] mt-5 bg-gradient-to-b from-[#8c2e2e] to-[#e31313] rounded-[18px] text-white font-black italic text-[20px] shadow-md active:scale-95 transition-transform">
                                Delete
                            </button>
                        </>
                    )}
                </div>
                <div className="flex flex-col w-full fixed bottom-0 left-0 right-0 items-center justify-center z-20 bg-white pb-6 pt-3">
                    <div className="w-full max-w-md px-2 mb-4">
                        <h3 className="text-[#14452F] font-bold text-[23px] leading-[29px] mb-2">Preview</h3>
                        <CategoryCard name={catName} color={catColor} />
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
                            disabled={isSubmitting || loading}
                            className="w-1/2 h-[65px] bg-gradient-to-b from-[#28153E] to-[#4A12B2] rounded-[18px] text-white font-black italic text-[20px] shadow-md active:scale-95 transition-transform disabled:opacity-50">
                            {isSubmitting ? "Editing..." : "Confirm Edit"}
                        </button>
                    </div>
                </div>
            </PageWrapper>
        </form>
    )
}