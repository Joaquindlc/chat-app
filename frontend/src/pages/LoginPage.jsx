import React from 'react'
import useAuthStore from '../store/useAuthStore.js';
import Navbar from "../components/Navbar.jsx";

const LoginPage = () => {
       const {authUser} =  useAuthStore();
  return (
    <div>
    <div>LoginPage</div>
    </div>
    
  )
}

export default LoginPage