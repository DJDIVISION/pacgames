import React, { useEffect } from 'react'
import { createContext, useContext, useState } from "react"

const Sockets = createContext();

const SocketsContext = ({children}) => {

    const [socket, setSocket] = useState(null);
    const [draggableChipValue, setDraggableChipValue] = useState(null)
    const [dealerHidden, setDealerHidden] = useState([])
    const [dealerHand, setDealerHand] = useState([])
    const [playerHand, setPlayerHand] = useState([])
    const [dealerSum, setDealerSum] = useState(null);
    const [playerSum, setPlayerSum] = useState(null);
    const [playerAceCount, setPlayerAceCount] = useState(null);
    const [dealerAceCount, setDealerAceCount] = useState(null);
    const [gameData, setGameData] = useState([])
    const [activeRoom, setActiveRoom] = useState(null);
    const [activePlayer, setActivePlayer] = useState(false);
    const [myId, setMyId] = useState(null);
    const [playOnline, setPlayOnline] = useState(false);
    const [playerName, setPlayerName] = useState(null)
    const [playerAvatar, setPlayerAvatar] = useState(null)
    
    return(
        <Sockets.Provider value = {{socket,setSocket,draggableChipValue,setDraggableChipValue,dealerHidden,setDealerHidden,
            dealerHand,setDealerHand,playerHand,setPlayerHand,gameData,setGameData,activeRoom,setActiveRoom,myId,setMyId,
            activePlayer,setActivePlayer,playerSum,setPlayerSum,playerAceCount,setPlayerAceCount,dealerSum,setDealerSum,
            dealerAceCount,setDealerAceCount,playOnline,setPlayOnline,playerName,setPlayerName,playerAvatar,setPlayerAvatar
        }}>
            {children}
        </Sockets.Provider>
    )
}

export default SocketsContext



export const SocketState = () => {
    return useContext(Sockets);
}