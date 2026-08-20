import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './_pages/HomePage'
import CreateTicketPage from './_pages/CreateTicketPage'
import ViewTicketPage from './_pages/ViewTicketPage'
import StaffDashboard from './_pages/StaffDashboard'
import StaffViewTicketPage from './_pages/StaffViewTicketPage'
import AdminDashboard from './_pages/AdminTicketDashboard'
import AdminViewTicketPage from './_pages/AdminViewTicketPage'
import AdminCategoryPage from './_pages/AdminCategoryDashboard'
import AdminViewCategoryPage from './_pages/AdminViewCategoryPage'
import AdminCreateCategoryPage from  './_pages/AdminCreateCategoryPage'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />

                <Route path="/ticket/create" element={<CreateTicketPage />} />

                <Route path="/:ticket/view" element={<ViewTicketPage />} />
                
                <Route path="/staff" element={<StaffDashboard />} />

                <Route path="/staff/:ticket/view" element={<StaffViewTicketPage />} />

                <Route path="/admin" element={<AdminDashboard />} />

                <Route path="/admin/:ticket/view" element={<AdminViewTicketPage />} />
                
                <Route path="/admin/category" element={<AdminCategoryPage />} />
            
                <Route path="/admin/category/create" element={<AdminCreateCategoryPage />} />

                <Route path="/admin/:category/edit" element={<AdminViewCategoryPage />} />
            </Routes>
        </BrowserRouter>
    )
}