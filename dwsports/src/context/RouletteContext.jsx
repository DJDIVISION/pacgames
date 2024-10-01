import React, { useEffect } from 'react'
import { createContext, useContext, useState } from "react"
import { LatestNumbers } from '../pages/fakeData';

const Roulette = createContext();

const RouletteContext = ({children}) => {

    
    const [myId, setMyId] = useState(null);
    const [balance, setBalance] = useState(5000)
    const [placedBet, setPlacedBet] = useState(0)
    const [latestNumbers, setLatestNumbers] = useState(LatestNumbers)
    const [winningNumber, setWinningNumber] = useState(null)
    const [allBets, setAllBets] = useState({})
    const [activeRoom, setActiveRoom] = useState(null);
    const [lastBet, setLastBet] = useState({});
    const [showMotionDiv, setShowMotionDiv] = useState(false);
    const [winnings, setWinnings] = useState(null)

    
    return(
        <Roulette.Provider value = {{
            balance,setBalance,placedBet,setPlacedBet,myId,setMyId,latestNumbers,setLatestNumbers,winningNumber,setWinningNumber,
            allBets,setAllBets,activeRoom,setActiveRoom,lastBet,setLastBet,showMotionDiv,setShowMotionDiv,winnings,setWinnings
        }}>
            {children}
        </Roulette.Provider>
    )
}

export default RouletteContext



export const RouletteState = () => {
    return useContext(Roulette);
}