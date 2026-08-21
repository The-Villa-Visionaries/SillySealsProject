import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/HomePage'
import CategoryPage from './Pages/CategoryPage'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}/>
                <Route path="/home" element={<Home />}/>
                
                <Route path="/category" element={<CategoryPage />}/>
            </Routes>
        </BrowserRouter>
    )
}