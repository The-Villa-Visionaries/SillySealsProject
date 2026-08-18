import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './_pages/HomePage'
import CreateTicketPage from './_pages/CreateTicketPage'
import ViewTicketPage from './_pages/ViewTicketPage'
import StaffDashboard from './_pages/StaffDashboard'
import StaffViewTicketPage from './_pages/StaffViewTicketPage'

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
            </Routes>
        </BrowserRouter>
    )
}