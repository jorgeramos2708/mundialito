import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Predictions from './pages/Predictions'
import Ranking from './pages/Ranking'
import Groups from './pages/Groups'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/predictions" element={<Predictions />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
