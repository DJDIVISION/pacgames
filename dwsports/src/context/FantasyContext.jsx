import React, { useEffect } from 'react'
import { createContext, useContext, useState } from "react"
import { LatestNumbers } from '../pages/fakeData';

const Fantasy = createContext();

const FantasyContext = ({children}) => {

    const [activeLeague, setActiveLeague] = useState("Premier League")
    const [activeTeamName, setActiveTeamName] = useState(null)
    const [activeTeamId, setActiveTeamId] = useState(null)
    const [playerToUpdate, setPlayerToUpdate] = useState({})
    const [playersSelected, setPlayersSelected] = useState([])
    const [selectedPlayer, setSelectedPlayer] = useState([])
    const [activeMatches, setActiveMatches] = useState([])
    const [activeLeagueId, setActiveLeagueId] = useState(39)
    const [activeRound,setActiveRound] = useState(null)
    const [selectedBet, setSelectedBet] = useState([]);
    const [betAmounts, setBetAmounts] = useState({});
    const [pendingBets, setPendingBets] = useState(null)
    const [depositMenu, setDepositMenu] = useState(false)
    const [walletAddress, setWalletAddress] = useState(null)
    const [walletBalance,setWalletBalance] = useState(0)
    
    return(
        <Fantasy.Provider value = {{activeLeague,setActiveLeague,activeTeamName,setActiveTeamName,activeTeamId,setActiveTeamId,
            playerToUpdate,setPlayerToUpdate,playersSelected,setPlayersSelected,selectedPlayer,setSelectedPlayer,activeMatches,setActiveMatches,
            activeLeagueId,setActiveLeagueId,activeRound,setActiveRound,selectedBet,setSelectedBet,betAmounts,setBetAmounts,
            pendingBets,setPendingBets,depositMenu,setDepositMenu,walletAddress,setWalletAddress,walletBalance,setWalletBalance
        }}>
            {children}
        </Fantasy.Provider>
    )
}

export default FantasyContext



export const FantasyState = () => {
    return useContext(Fantasy);
}