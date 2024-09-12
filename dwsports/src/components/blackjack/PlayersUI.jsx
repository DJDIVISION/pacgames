import React, {useEffect, useState, useRef} from 'react'
import {Disconnect,PlayerGridLoading,LoadingText,LogOutContainer,LogOutText} from './index'
import { SocketState } from '../../context/SocketsContext'
import { Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import Chips from './Chips';
import BetArea from './BetArea';
import { DndContext } from '@dnd-kit/core';
import { message } from 'antd';
import { animationFour,transitionLong } from '../../animations';
import { ToastContainer, toast } from 'react-toastify';
import { BetState } from '../../context/BetsContext';
import { supabase } from '../../supabase/client'
import {CircularProgress,IconButton } from '@mui/material'



const PlayersUI = () => {

    const [players, setPlayers] = useState([])
    const [deck, setDeck] = useState([]);
    const {socket, setSocket} = SocketState();
    const [dealer, setDealer] = useState([]);
    const [gameStarted, setGameStarted] = useState([]);
    const [gameFinished, setGameFinished] = useState(false)
    const [chipMenuOpen, setChipMenuOpen] = useState(false)
    const [gameInProgress, setGameInProgress] = useState(false)
    const [placedBet, setPlacedBet] = useState(0);
    const [droppedChips, setDroppedChips] = useState([]);
    const [droppedChipValue, setDroppedChipValue] = useState(null);
    const [currentPlayerName, setCurrentPlayerName] = useState(null)
    const {dealerHidden, setDealerHidden} = SocketState();
    const {dealerHand, setDealerHand} = SocketState();
    const {playerHand, setPlayerHand} = SocketState();
    const {playerSum, setPlayerSum} = SocketState();
    const {gameData, setGameData} = SocketState();
    const {playerAceCount, setPlayerAceCount} = SocketState();
    const {myId, setMyId} = SocketState();
    const {activePlayer, setActivePlayer} = SocketState();
    const [active, setActive] = useState("menuTwo");
    const {dealerSum, setDealerSum} = SocketState();
    const {dealerAceCount, setDealerAceCount} = SocketState();
    const {playOnline, setPlayOnline} = SocketState();
    const {user, setUser} = BetState();
    const cardsContainerRef = useRef(null);
    const [counter, setCounter] = useState(0);  // Variable that triggers the timeout
    const timeoutRef = useRef(null);
    const [disabled, setDisabled] = useState(false)
    const {playerName, setPlayerName} = SocketState();
    const [timeRemaining, setTimeRemaining] = useState(10); // Start with 15 seconds
    const [betPlaced, setBetPlaced] = useState(false);
    const timerRef = useRef(null);
    const [activeRoom, setActiveRoom] = useState({room: null})
    const activeRoomRef = useRef(activeRoom);

    activeRoomRef.current = activeRoom

    const dismissAll = () =>  toast.dismiss();
    const placeBetNotify  = (message) => {
        toast(message, {
          className: "custom-toast",
          position: "top-right",
          autoClose: 15000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      };

      const waitingtToStarttNotify  = (message) => {
        toast(message, {
          className: "custom-toast",
          position: "top-right",
          autoClose: 75000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      };

      const welcomeNotify = (message) => {
        toast(message, {
          className: "custom-toast",
          position: "top-right",
          autoClose: 2500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
              });
      };

      const autoCloseOff = (message) => {
        toast(message, {
          className: "custom-toast",
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
              });
      };


    

    useEffect(() => {
        socket.on('thisIsYourId', (data) => {
            console.log("dataidididid", data)
            setMyId(data.playerId)
            waitingtToStarttNotify('Waiting for other players to join the room... ⌛')
            //setPlayers(gameData.players)
            //autoCloseOff("!Waiting for more players to join. The game will start in a few seconds.") 
        });
        socket.on('betting-start', (data) => {
            console.log(data)
            dismissAll();
            placeBetNotify("You have 15 seconds to place your bet ⏱️")
            setPlayers(data.players)
            setChipMenuOpen(true)
            //setGameInProgress(true)
        });
        socket.on('update_players', (data) => {
            const {gameData, message} = data;
            console.log("updatePlayers", data)
            dismissAll();
            welcomeNotify(message)
            setTimeout(() => {
                dismissAll();
                waitingtToStarttNotify('Waiting for other players to join the room... ⌛')
            }, 2500)
            setPlayers(gameData.players)
            setActiveRoom(gameData.room)
        });
        socket.on('new_update_players', (data) => {
            const {gameData, playerName, bet} = data;
            console.log("new_update_players", data)
            setPlayers(gameData.players)
            setActiveRoom(gameData.room)
            welcomeNotify(`${playerName} has placed a ${bet}$ bet`)

        }),
        socket.on('selfDisconnected', (data) => {
            welcomeNotify("A player has left the room")
            setPlayers(data.gameData.players)
        });
        socket.on('firstRound', (data) => {
            setGameData(data.gameData)
            setPlayers(data.gameData.players)
        });
        socket.on('dealCards', (data) => {
            //welcomeNotify("All players have placed their bets.")
            console.log("this is the data", data)
            setGameData(data.gameData)
            setPlayers(data.gameData.players)
            setPlayerSum(data.gameData.playerSum)
            setPlayerAceCount(data.gameData.playerAceCount)
            setDealerSum(data.gameData.dealerSum)
            setDealerAceCount(data.gameData.dealerAceCount)
            setDealerHidden(data.gameData.dealerHidden)
            setDealerHand(data.gameData.dealerHand)
            setPlayerHand(data.gameData.playerHand)
        });
        socket.on("game-started", (data) => {
            welcomeNotify(`${data.message}`)
        })
        socket.on("cardAfterHit", (data) => {
            const {playerName,playerSum,gameData} = data;
            setPlayerSum(playerSum)
            setPlayers(gameData.players)
        })
        socket.on("your-turn", (data) => {
            setActivePlayer(true)
        })
        socket.on('all-bets-placed', (data) => {
            dismissAll();
            welcomeNotify(`${data.message}`)
        })
        return () => {
            socket.off('thisIsYourId');
            socket.off('betting-start');
            socket.off('update_players');
            socket.off('new_update_players');
            socket.off('all-bets-placed');
            socket.off('selfDisconnected');
            socket.off('firstRound');
            socket.off('game-started');
            socket.off('your-turn');
          };
    }, [])

    

    
    console.log(dealerHand)

    const handleDragEnd = (event) => {
        const { over, active } = event;
        
        // Check if the chip was dropped in the bet area
        if (over && over.id === 'bet-area') {
          const chipValue = active.data.current.chipValue;
          if(chipValue === null){
            setPlacedBet(chipValue);
            setDroppedChipValue(chipValue);
          } else {
            const oldValue = placedBet
            setPlacedBet(oldValue + chipValue)
            setDroppedChipValue(chipValue);
          }
          const chipImage = active.data.current.chipImage;
          setDroppedChips((prev) => [
            ...prev,
            { chipValue, chipImage },  // Store value and image of the chip
          ]);
        }
      };


    const Switch = () => {
        if(active === "menuOne"){
            setActive("menuTwo");
        } else if(active === "menuTwo"){
            setActive("menuOne");
        }
    }

    let animate = {};
    if(active === "menuOne") animate = {  position: 'absolute', top: '50vh', display: 'none',x: '32.5vw', scale: 0 };
    else if (active === "menuTwo") animate = {  position: 'absolute', top: '50vh', x: '32.5vw', scale: 1 };

    const transition = {
        type: 'tween',
        duration: 0.2
    };
    console.log(activeRoom)
    const startGame = () => {
        if(placedBet > 0){
            console.log(`Bet of ${placedBet} placed`);
            setDisabled(true)
            setChipMenuOpen(false)
            socket?.emit("place-bet", {
                bet: placedBet,
                room: activeRoom,
                playerId: myId
                });
                dismissAll();
                //waitingtToStarttNotify("Waiting for players to place their bets.")
        } 
    }

    const doubleBet= () => {
        const prev = placedBet
        const value = (prev * 2)
        setPlacedBet(value)
        welcomeNotify(`${currentPlayerName} has doubled his bet!`)
    }

    const askHit = () => {
        console.log(placedBet)
        console.log(activeRoom)
        socket?.emit("askForHit", {
            placedBet: placedBet,
            room: activeRoom,
            id: myId,
            gameData: gameData
         });
    }

    const disconnect = () => {
        socket.emit('leaveGame');
        socket.disconnect();
        setPlayOnline(false)
    }

    const keepPlaying = () => {
        setPlayers([])
        setPlayerHand([])
        setDealerHand([])
        setDealerHidden([])
        setGameFinished(false)
        setDroppedChips([])
        setDroppedChipValue(null)
        setPlacedBet(0)
        document.getElementById("hidden").src = "./assets/cards/BACK.png";
        setAskingNextSingleMatch(true)
        setChipMenuOpen(true)
        placeBetNotify("You have 20 seconds to place your bet!")  
    }

    if(gameInProgress){
        return(
            <PlayerGridLoading>
                <LogOutContainer><LogOutText>LEAVE ROOM</LogOutText><IconButton className={"MyCustomIconButton"} onClick={disconnect}><Disconnect /></IconButton></LogOutContainer>
                <CircularProgress size={80} color="secondary" />
                <LoadingText>There is a game in process, you will join on the next one</LoadingText>
            </PlayerGridLoading>
        )
    }


  return (
    <div></div>
  )
}

export default PlayersUI
