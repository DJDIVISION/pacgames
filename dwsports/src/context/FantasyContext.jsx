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
    
    return(
        <Fantasy.Provider value = {{activeLeague,setActiveLeague,activeTeamName,setActiveTeamName,activeTeamId,setActiveTeamId,
            playerToUpdate,setPlayerToUpdate,playersSelected,setPlayersSelected,selectedPlayer,setSelectedPlayer
        }}>
            {children}
        </Fantasy.Provider>
    )
}

export default FantasyContext



export const FantasyState = () => {
    return useContext(Fantasy);
}