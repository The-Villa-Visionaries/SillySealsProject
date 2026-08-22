import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/HomePage'
import StaffNAdminPage from './Pages/StaffNAdminPage'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/home" element={<Home />}/>
                <Route path="/staff" element={<StaffNAdminPage />}/>
                <Route path="/workspace" element={<StaffNAdminPage />}/>
            </Routes>
        </BrowserRouter>
    )
}