import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Signup from './pages/Signup'
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login'
import {Routes,Route, Navigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
import Home from './pages/Home'
import LandingPage from './pages/LandingPage'

function App() {
  const [count, setCount] = useState(0)
  const {user} = useSelector((state) => state.user)
  console.log(user);
  
  return (
    <div className='bg-black'>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/compass" element={user? <Home user={user}/> : <Navigate to={'/signup'}/>} />
        <Route path="/login" element={!user? <Login /> : <Navigate to={'/'}/>} />
        <Route path="/signup" element={!user? <Signup /> : <Navigate to={'/'}/>} />
      </Routes>
      <Toaster position="top-right" />
    </div>
  )
}

export default App
