
import './App.css'
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import FilmsPage from './pages/FilmsPage'
import CustomersPage from './pages/CustomersPage'
function App() {
  
  return (
    <>
  <div className="container mx-auto">
    <Navbar/>
    <Routes>
    <Route path="/" element={<HomePage /> } />
    
    <Route path="/films" element={<FilmsPage /> } />
    
    <Route path="/customers" element={<CustomersPage /> } />
    </Routes>
  </div>
   
             
   </> 
  )
}

export default App
