import React, { useEffect } from 'react'
import { createContext, useContext, useState } from "react"

const Bets = createContext();

const BetsContext = ({children}) => {

    
    const [activeSport, setActiveSport] = useState("")
    const [activeCountry, setActiveCountry] = useState("")
    const [activeLeague, setActiveLeague] = useState("")
    const [activeSportMenu, setActiveSportMenu] = useState(true);
    const [activeCountryMenu, setActiveCountryMenu] = useState(false);
    const [activeLeaguesMenu, setActiveLeaguesMenu] = useState(false);
    const [betsMenu, setBetsMenu] = useState(false);
    const [activeMatches, setActiveMatches] = useState([])
    const [homeTeam, setHomeTeam] = useState([])
    const [homeTeamLogo, setHomeTeamLogo] = useState()
    const [awayTeamLogo, setAwayTeamLogo] = useState()
    const [awayTeam, setAwayTeam] = useState([])
    const [matchToBet, setMatchToBet] = useState([])
    
    return(
        <Bets.Provider value = {{activeSport,setActiveSport,activeCountry,setActiveCountry,activeLeague,setActiveLeague,
            activeSportMenu,setActiveSportMenu,activeCountryMenu,setActiveCountryMenu,activeLeaguesMenu,setActiveLeaguesMenu,
            setBetsMenu,betsMenu,activeMatches,setActiveMatches,homeTeam,setHomeTeam,awayTeam,setAwayTeam,matchToBet,setMatchToBet,
            awayTeamLogo,setAwayTeamLogo,homeTeamLogo,setHomeTeamLogo
        }}>
            {children}
        </Bets.Provider>
    )
}

export default BetsContext



export const BetState = () => {
    return useContext(Bets);
}