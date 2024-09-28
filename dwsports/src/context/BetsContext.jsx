import React, { useEffect } from 'react'
import { createContext, useContext, useState } from "react"

const Bets = createContext();

const BetsContext = ({children}) => {

    
    const [activeSport, setActiveSport] = useState("")
    const [activeCountry, setActiveCountry] = useState("")
    const [activeLeague, setActiveLeague] = useState("")
    const [activeTeam, setActiveTeam] = useState([])
    const [activePlayer, setActivePlayer] = useState([])
    const [activeSportMenu, setActiveSportMenu] = useState(true);
    const [activeCountryMenu, setActiveCountryMenu] = useState(false);
    const [activeLeaguesMenu, setActiveLeaguesMenu] = useState(false);
    const [betsMenu, setBetsMenu] = useState(false);
    const [activeMatches, setActiveMatches] = useState([])
    const [homeTeam, setHomeTeam] = useState([])
    const [homeTeamLogo, setHomeTeamLogo] = useState()
    const [homeTeamPlayers, setHomeTeamPlayers] = useState([])
    const [awayTeamLogo, setAwayTeamLogo] = useState()
    const [awayTeamPlayers, setAwayTeamPlayers] = useState([])
    const [awayTeam, setAwayTeam] = useState([])
    const [matchToBet, setMatchToBet] = useState([])
    const [user, setUser] = useState(null)
    const [selectedBet, setSelectedBet] = useState(null);
    const [multipleBets, setMultipleBets] = useState([])
    const [balance, setBalance] = useState(5000)
    
    
    return(
        <Bets.Provider value = {{activeSport,setActiveSport,activeCountry,setActiveCountry,activeLeague,setActiveLeague,
            activeSportMenu,setActiveSportMenu,activeCountryMenu,setActiveCountryMenu,activeLeaguesMenu,setActiveLeaguesMenu,
            setBetsMenu,betsMenu,activeMatches,setActiveMatches,homeTeam,setHomeTeam,awayTeam,setAwayTeam,matchToBet,setMatchToBet,
            awayTeamLogo,setAwayTeamLogo,homeTeamLogo,setHomeTeamLogo,homeTeamPlayers,setHomeTeamPlayers,awayTeamPlayers,setAwayTeamPlayers,
            user,setUser,activeTeam,setActiveTeam,activePlayer,setActivePlayer,selectedBet,setSelectedBet,setMultipleBets,
            multipleBets, balance, setBalance
        }}>
            {children}
        </Bets.Provider>
    )
}

export default BetsContext



export const BetState = () => {
    return useContext(Bets);
}