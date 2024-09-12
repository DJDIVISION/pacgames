import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import { themes } from "./styles/Themes";
import { ThemeProvider } from "styled-components";


import Bets from './pages/Bets';
import Home from './pages/Home';
import PlayerStats from './pages/PlayerStats';
import TeamStats from './pages/TeamStats';
import Login from './pages/Login';
import Roulette from './pages/Roulette';
import Poker from './pages/Poker';
import BlackJack from './pages/BlackJack';

function App() {

  const [theme, setTheme] = useState('dark');

  return (
    <ThemeProvider theme={themes[theme]}>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/bets" element={<Bets />} />
        <Route path="/blackjack" element={<BlackJack />} />
        <Route path="/poker" element={<Poker />} />
        <Route path="/player/:id" element={<PlayerStats />} />
        <Route path="/team/:id" element={<TeamStats />} />
      </Routes>
    </Router>
    </ThemeProvider>
  )
}

export default App


