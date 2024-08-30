import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import { themes } from "./styles/Themes";
import { ThemeProvider } from "styled-components";


import Bets from './pages/Bets';
import MatchStats from './components/MatchStats';

function App() {

  const [theme, setTheme] = useState('dark');

  return (
    <ThemeProvider theme={themes[theme]}>
    <Router>
      <Routes>
        <Route path="/" element={<Bets />} />
      </Routes>
    </Router>
    </ThemeProvider>
  )
}

export default App


