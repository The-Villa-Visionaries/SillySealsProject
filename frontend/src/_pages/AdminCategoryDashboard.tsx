import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import PageWrapper from '../components/layout/PageWrapper'
import CategoryCard from '../components/ticket & category/CategoryCard'
import ActionBar from '../components/layout/ActionBar'
import TicketToast from '../components/ticket & category/TicketToast'
import FilterSheet from '../components/ticket & category/FilterSheet'
import Confidential from '../../../confidential'

interface Category {
    name: string
    color: string
}

export default function AdminCategoryPage() {
    const navigate = useNavigate()
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [toastState, setToastState] = useState<{ type: 'made' | 'deleted', title: string } | null>(null)
    
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const currentUserId = 3

    const fetchCategories = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`http://0.0.0.0:8000/api/category`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ requestId: currentUserId }),
            })
            if (response.ok) {
                const data: Category[] = await response.json()
                setCategories(data)
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error)
        } finally {
            setIsLoading(false)
        }
    }, [currentUserId])

    useEffect(() => {
        fetchCategories()
    }, [fetchCategories])

    const handleCategorySearchResults = (matchedNames: string[] | null) => {
        if (matchedNames === null) {
            fetchCategories()
        } else {
            setCategories((prev) => prev.filter((category) => matchedNames.includes(category.name)))
        }
    }

    return (
        <div className="overflow-x-hidden min-h-screen bg-[#6B21A8] flex flex-col items-center relative">
            <Header 
                userName={String(currentUserId)} 
                avatarUrl={Confidential({ x: 1 })} 
                showSearch={true}
                userId={currentUserId}
                searchMode="category"
                onSearchResults={handleCategorySearchResults}
                page='admin'
            />

            <PageWrapper title="Category" page='admin'>
                <div className="flex flex-col gap-2">
                    {isLoading ? (
                        <p className="text-center py-8 text-gray-500 font-medium">Loading categories...</p>
                    ) : categories.length === 0 ? (
                        <p className="text-center py-8 text-gray-500 font-medium">No categories found.</p>
                    ) : (
                        categories.map((cat) => (
                            <CategoryCard
                                name={cat.name}
                                color={cat.color}
                                onClick={() => navigate(`/admin/category-${cat.name}/edit`)}
                            />
                        ))
                    )}
                </div>
            </PageWrapper>

            <ActionBar 
                onFilterClick={() => setIsFilterOpen((prev) => !prev)}
                onRefreshClick={fetchCategories} 
                onCreateClick={() => navigate('/admin/category/create')}
                pram={['F', 'R', 'B']}
                page='admin'
            />

            <FilterSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
            
            {toastState && !isFilterOpen && ( 
                <TicketToast 
                    type={toastState.type} 
                    ticket={toastState.title} 
                    onClose={() => setToastState(null)}
                />
            )}
        </div>
    )
}