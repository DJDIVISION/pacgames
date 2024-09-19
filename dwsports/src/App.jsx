import { useState } from 'react'
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
import TeamStats from './pages/TeamStats';
import Login from './pages/Login';
import Poker from './pages/Poker';
import BlackJack from './pages/BlackJack';
import Airdrop from './pages/Airdrop';

function App() {

  const [theme, setTheme] = useState('dark');
  const { user, loading } = useAuth(); 

  if (loading) {
    return <HomeSection><CircularProgress sx={{ width: 80, height: 80 }} /></HomeSection>; // Display a loading message while checking the session
  }

  return (
    <ThemeProvider theme={themes[theme]}>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/bets" element={<ProtectedRoute><Bets /></ProtectedRoute>} />
        <Route path="/blackjack" element={<ProtectedRoute><BlackJack /></ProtectedRoute>} />
        <Route path="/poker" element={<ProtectedRoute><Poker /></ProtectedRoute>} />
        <Route path="/airdrop" element={<ProtectedRoute><Airdrop /></ProtectedRoute>} />
        <Route path="/player/:id" element={<ProtectedRoute><PlayerStats /></ProtectedRoute>} />
        <Route path="/team/:id" element={<ProtectedRoute><TeamStats /></ProtectedRoute>} />
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
    return <Navigate to="/login" />;
  }

  // If user exists, render the children components (protected content)
  return children;
};


