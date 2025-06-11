import React from 'react'
import Home from './frontend/pages/Home'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './frontend/pages/Login'
import Register from './frontend/pages/Register'
import MainTaskPage from './frontend/pages/mainTaskPage'
function App() {


  return (
    <>
      <Routes>
        <Route path="/" element= {<Home/>}/>
        <Route path="/login" element= {<Login/>}/>
        <Route path="/register" element= {<Register/>}/>
        <Route path="/main" element={<MainTaskPage/>}/>
      </Routes>
    </>
  )
}

export default App
