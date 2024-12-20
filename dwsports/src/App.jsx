import { useState,useEffect,useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import { themes } from "./styles/Themes";
import { ThemeProvider } from "styled-components";
import { useAuth } from './pages/functions';
import { Navigate } from 'react-router-dom';
import { HomeSection } from './pages';
import { CircularProgress } from '@mui/material';

import Bets from './pages/Bets';
import Home from './pages/Home';
import PlayerStats from './pages/PlayerStats';
import TeamStats from './components/menus/TeamStats';
import Login from './pages/Login';
import BlackJack from './pages/BlackJack';
import Roulette from './pages/Roulette';
import Casino from './pages/Casino';
import Texas from './pages/Texas';
import Slots from './pages/Slots';

import Tonopoly from './pages/Tonopoly';
import Airdrop from './pages/Airdrop';
import NewFantasy from './pages/NewFantasy'; 
import NavBar from './components/NavBar';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Partners from './pages/Partners';
import NewRoulette from './pages/NewRoulette';
import { FantasyState } from './context/FantasyContext';
import Admin from './pages/Admin';
import Fantasy from './pages/Fantasy';
import CryptoPrediction from './pages/CryptoPrediction';


function App() {

  const [theme, setTheme] = useState('dark');
  const { user, loading } = useAuth(); 
  const themeObject = useMemo(() => themes[theme], [theme]);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  if (loading) {
    return <HomeSection><CircularProgress sx={{ width: 80, height: 80 }} /></HomeSection>; // Display a loading message while checking the session
  }
  
  return (
    <ThemeProvider theme={themeObject}>
    <Router>
      <Routes>
        <Route path="/" element={<Home toggleTheme={toggleTheme}/>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/bets" element={<ProtectedRoute><Bets /></ProtectedRoute>} />
        <Route path="/casino" element={<ProtectedRoute><Casino /></ProtectedRoute>} />
        <Route path="/fantasy" element={<ProtectedRoute><Fantasy /></ProtectedRoute>} />
        <Route path="/newfantasy" element={<ProtectedRoute><NewFantasy /></ProtectedRoute>} />
        <Route path="/blackjack" element={<ProtectedRoute><BlackJack /></ProtectedRoute>} />
        <Route path="/airdrop" element={<ProtectedRoute><Airdrop /></ProtectedRoute>} />
        <Route path="/crypto-prediction" element={<ProtectedRoute><CryptoPrediction /></ProtectedRoute>} />
        <Route path="/partners" element={<ProtectedRoute><Partners /></ProtectedRoute>} />
        <Route path="/texas" element={<ProtectedRoute><Texas /></ProtectedRoute>} />
        <Route path="/tonopoly" element={<ProtectedRoute><Tonopoly /></ProtectedRoute>} />
        <Route path="/slots" element={<ProtectedRoute><Slots /></ProtectedRoute>} />
        <Route path="/roulette" element={<ProtectedRoute><Roulette /></ProtectedRoute>} />
        <Route path="/player/:id" element={<ProtectedRoute><PlayerStats /></ProtectedRoute>} />
        <Route path="/team/:teamId" element={<ProtectedRoute><TeamStats /></ProtectedRoute>} />
        <Route path="/newroulette" element={<NewRoulette />} />
        {/* <Route path="/" element={<Login />} /> */}
      </Routes>
    </Router>
    </ThemeProvider>
  )
}

export default App

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <HomeSection><CircularProgress sx={{ width: 80, height: 80 }} /></HomeSection>; // Display a loading message while checking the session
  }

  if (!user) {
    // If no user, redirect to the login page
    return <Navigate to="/" />;
  }

  // If user exists, render the children components (protected content)
  return children;
};


