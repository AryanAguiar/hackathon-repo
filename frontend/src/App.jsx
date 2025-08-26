import './App.css'
import axios from "axios"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Dashboard from "./components/Dashboard";

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} /> 
        <Route path='/login' element={<LoginForm />} /> 
        <Route path='/dashboard' element={<Dashboard />} /> 
        <Route path='/signup' element={<SignupForm />} />
      </Routes>
    </Router>  
  )
}

export default App
