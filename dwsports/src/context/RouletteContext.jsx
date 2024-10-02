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
    const [droppedChips, setDroppedChips] = useState({});
    const [droppedCornerChips, setDroppedCornerChips] = useState({});
    const [droppedRowChips, setDroppedRowChips] = useState({});
    const [droppedLastRowChips, setDroppedLastRowChips] = useState({});
    const [droppedColumnChips, setDroppedColumnChips] = useState({});
    const [droppedBorderLeftChips, setDroppedBorderLeftChips] = useState({});
    const [droppedBorderTopChips, setDroppedBorderTopChips] = useState({});

    const [droppedChipsLast, setDroppedChipsLast] = useState({});
    const [droppedCornerChipsLast, setDroppedCornerChipsLast] = useState({});
    const [droppedRowChipsLast, setDroppedRowChipsLast] = useState({});
    const [droppedLastRowChipsLast, setDroppedLastRowChipsLast] = useState({});
    const [droppedColumnChipsLast, setDroppedColumnChipsLast] = useState({});
    const [droppedBorderLeftChipsLast, setDroppedBorderLeftChipsLast] = useState({});
    const [droppedBorderTopChipsLast, setDroppedBorderTopChipsLast] = useState({});



    
    return(
        <Roulette.Provider value = {{
            balance,setBalance,placedBet,setPlacedBet,myId,setMyId,latestNumbers,setLatestNumbers,winningNumber,setWinningNumber,
            allBets,setAllBets,activeRoom,setActiveRoom,lastBet,setLastBet,showMotionDiv,setShowMotionDiv,winnings,setWinnings,
            droppedChips,setDroppedChips,droppedCornerChips,setDroppedCornerChips,droppedRowChips,setDroppedRowChips,droppedLastRowChips,setDroppedLastRowChips,
            droppedColumnChips,setDroppedColumnChips,droppedBorderLeftChips,setDroppedBorderLeftChips,droppedBorderTopChips,setDroppedBorderTopChips,
            droppedChipsLast,setDroppedChipsLast,droppedCornerChipsLast,setDroppedCornerChipsLast,droppedRowChipsLast,setDroppedRowChipsLast,
            droppedLastRowChipsLast,setDroppedLastRowChipsLast,droppedColumnChipsLast,setDroppedColumnChipsLast,droppedBorderLeftChipsLast,
            setDroppedBorderLeftChipsLast,droppedBorderTopChipsLast,setDroppedBorderTopChipsLast
        }}>
            {children}
        </Roulette.Provider>
    )
}

export default RouletteContext



export const RouletteState = () => {
    return useContext(Roulette);
}