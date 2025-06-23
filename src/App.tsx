import React from 'react'
import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom'
import Login from './frontend/pages/Login'
import Register from './frontend/pages/Register'
import MainTaskPage from './frontend/pages/mainTaskPage'
import CreateTask from './frontend/pages/CreateTask'

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* <Route path="/" element= {<Home/>}/> */}
        <Route path="/login" element= {<Login/>}/>
        <Route path="/register" element= {<Register/>}/>
        <Route path="/main" element={<MainTaskPage/>}/>
        <Route path="/add" element={<CreateTask/>}/>
      </Routes>
    </>
  )
}

export default App
