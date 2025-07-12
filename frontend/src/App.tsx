import "tailwindcss";
import Navbar from "./components/Navbar.jsx";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage  from "./pages/HomePage.jsx";
import LoginPage  from "./pages/LoginPage.jsx";
import SignupPage  from "./pages/SignupPage.jsx";
import SettingsPage  from "./pages/SettingsPage.jsx";
import ProfilePage  from "./pages/ProfilePage.jsx";
import useAuthStore from "./store/useAuthStore.js";
import { useState, useEffect} from "react";

import {Loader} from "lucide-react";
import { Navigate } from "react-router-dom";
const App = ()=>{

 const { authUser, checkAuth, isCheckingAuth } =  useAuthStore();
   const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Detecta la preferencia del sistema operativo si no hay tema guardado
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

   useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

 useEffect(() => {
  checkAuth();
 }, [checkAuth]);

console.log("authUser actual:", authUser);
console.count("Render App");

if(isCheckingAuth && !authUser) return (

<div className="flex items-center justify-center h-screen">
<span className="loading loading-spinner text-primary"></span>

</div>

);

  return (
    <div>
  
    {/* <Navbar/> */}

        {/* Botón de alternancia de tema. Puedes moverlo a Navbar o a un layout global */}
        <div className="flex justify-end p-4">
          <button className="btn btn-ghost" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark ' : '☀️ Light '}
          </button>
        </div>

    <Routes >
      <Route path="/" element={ authUser ? <HomePage/> : <Navigate to="/login"/>}/>
      <Route path="/signup" element={ !authUser ? <SignupPage/> : <Navigate to="/"/>}/>
      <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/"/>}/>
      <Route path="/settings" element={<SettingsPage/>}/>
      <Route path="/profile" element={ authUser ? <ProfilePage/> : <Navigate to="/login"/>}/>

    </Routes>
     <Toaster />
    </div>

  );
}

export default App;