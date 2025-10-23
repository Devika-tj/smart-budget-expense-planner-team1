import React from 'react'
import './App.css'
import Navbar from './pages/Navbar'
import Home from './pages/Home'
import Footer from './pages/Footer'
import { Route, Routes } from 'react-router-dom'


const App = () => {
  return (
    <div>
      <Navbar/>
     <Routes>
        <Route path='/' element={<Home/>}></Route>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
