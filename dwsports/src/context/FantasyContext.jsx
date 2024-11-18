import React, { useEffect } from 'react'
import { createContext, useContext, useState } from "react"
import { LatestNumbers } from '../pages/fakeData';

const Fantasy = createContext();

const FantasyContext = ({children}) => {

    const [activeLeague, setActiveLeague] = useState("Premier League")
    const [activeTeamName, setActiveTeamName] = useState(null)
    const [activeTeamId, setActiveTeamId] = useState(null)
    const [fixtureId, setFixtureId] = useState(null)
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
    const [walletMenu, setWalletMenu] = useState(false)
    const [toHide, setToHide] = useState(false)
    const [metaMaskWalletAddress, setMetaMaskWalletAddress] = useState(null)
    const [tonWalletAddress, setTonWalletAddress] = useState(null)
    const [metaMaskWalletBalance,setMetaMaskWalletBalance] = useState(null)
    const [tonWalletBalance,setTonWalletBalance] = useState(null)
    const [data, setData] = useState([])
    const [balance, setBalance] = useState(null)
    const [activeTeam, setActiveTeam] = useState(null)
    const [activePlayer, setActivePlayer] = useState(null)
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [session, setSession] = useState(null)

    useEffect(() => {
        // Toggle body overflow based on isMenuOpen state
        if (walletMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = ''; // Revert to original overflow
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
        };
    }, [walletMenu]);
    
    return(
        <Fantasy.Provider value = {{activeLeague,setActiveLeague,activeTeamName,setActiveTeamName,activeTeamId,setActiveTeamId,
            playerToUpdate,setPlayerToUpdate,playersSelected,setPlayersSelected,selectedPlayer,setSelectedPlayer,activeMatches,setActiveMatches,
            activeLeagueId,setActiveLeagueId,activeRound,setActiveRound,selectedBet,setSelectedBet,betAmounts,setBetAmounts,
            pendingBets,setPendingBets,depositMenu,setDepositMenu,metaMaskWalletAddress,setMetaMaskWalletAddress,metaMaskWalletBalance,setMetaMaskWalletBalance,
            data,setData,balance,setBalance,activeTeam,setActiveTeam,activePlayer,setActivePlayer,tonWalletAddress,setTonWalletAddress,
            provider,setProvider,account,setAccount,tonWalletBalance,setTonWalletBalance,walletMenu,setWalletMenu,
            toHide,setToHide,setFixtureId,fixtureId,session,setSession
        }}>
            {children}
        </Fantasy.Provider>
    )
}

export default FantasyContext



export const FantasyState = () => {
    return useContext(Fantasy);
}