import React, {useEffect, useState, useRef} from 'react'
import {PlayerGrid,PlayerWrapper,PlayerAvatar,PlayerAvatarName,PlayerAvatarWrapper,PlayerBet,CurrentBetText,
    PlayerChip,PlayerCardsHolder,item,ChipContainer,ChipWrapper,ChipBalance,BJStartGame,StyledButton,PlayerCard,ActionButtons,
    
} from '../index'
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



const PlayersUI = () => {

    const [players, setPlayers] = useState([])
    const [deck, setDeck] = useState([]);
    const {socket, setSocket} = SocketState();
    const [dealer, setDealer] = useState([]);
    const [gameStarted, setGameStarted] = useState([]);
    const [gameFinished, setGameFinished] = useState(false)
    const [chipMenuOpen, setChipMenuOpen] = useState(false)
    const [placedBet, setPlacedBet] = useState(null);
    const [droppedChips, setDroppedChips] = useState([]);
    const [droppedChipValue, setDroppedChipValue] = useState(null);
    const [currentPlayerName, setCurrentPlayerName] = useState(null)
    const {dealerHidden, setDealerHidden} = SocketState();
    const {dealerHand, setDealerHand} = SocketState();
    const {playerHand, setPlayerHand} = SocketState();
    const {playerSum, setPlayerSum} = SocketState();
    const {gameData, setGameData} = SocketState();
    const {activeRoom, setActiveRoom} = SocketState();
    const {playerAceAccount, setPlayerAceAccount} = SocketState();
    const {myId, setMyId} = SocketState();
    const {activePlayer, setActivePlayer} = SocketState();
    const [active, setActive] = useState("menuTwo");
    const {dealerSum, setDealerSum} = SocketState();
    const {dealerAceAccount, setDealerAceAccount} = SocketState();
    const {playOnline, setPlayOnline} = SocketState();
    const {user, setUser} = BetState();

    const dismissAll = () =>  toast.dismiss();
    
    const placeBetNotify  = (message) => {
        toast(message, {
          className: "custom-toast",
          position: "top-right",
          autoClose: 20000,
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
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
              });
      };
    /* useEffect(() => {
        if(dealerHidden.length > 0){
            let cardImg = document.createElement("img");
            playerHand.forEach(card => {
                console.log(card)
                cardImg.src = "./assets/cards/" + card + ".png";
                document.getElementById("player-cards").append(cardImg);
            })
        }
    }, [dealerHidden,playerHand]) */

    socket?.on("cardAfterHit", (data) => {
        console.log(data.cardToHit)
        setPlayerAceAccount(data.playerAceAccount)
        const all = playerHand.concat(data.cardToHit)
        setPlayerHand(all)
        if(data.playerSum > 21){
            setPlayerSum(data.playerSum)
            //welcomeNotify("You have lost the game!!!")
        }
        if(data.playerSum === 21){
            setPlayerSum(data.playerSum)
            //welcomeNotify("BlackJack!!!")
        }
        if(data.playerSum < 21){
            setPlayerSum(data.playerSum)
            //welcomeNotify("You can keep playing!")
        }
    });

    socket?.on("firstRound", (data) => {
    const {gameData, player_id, room, playerName} = data;
    setPlayers(gameData.players);
    setActiveRoom(room)
    setGameData(gameData)
    setMyId(player_id.socket)
    setActivePlayer(true)
    setPlayerSum(gameData.playerSum)
    setPlayerAceAccount(gameData.playerAceAccount)
    setDealerSum(gameData.dealerSum)
    setDealerAceAccount(gameData.dealerAceAccount)
    setDealerHidden(gameData.dealerHidden)
    setDealerHand(gameData.dealerHand)
    setPlayerHand(gameData.playerHand)
  });

    socket?.on("deck", (data) => {
        console.log(data)
        localStorage.setItem("gameData", JSON.stringify(data))
          setPlayers(data.players);
          setDeck(data.deck);
          setDealer(data.dealer);
          setGameStarted(data.gameStarted);
    });

    socket?.on("onlyPlayerInRoom", (data) => {
        const {gameData, player_id, room, playerName} = data;
        welcomeNotify(`${playerName} has joined the Room!`)
        setTimeout(() => {
            dismissAll()
        }, 2000)
        setPlayers(gameData.players);
        setActiveRoom(room)
        setCurrentPlayerName(playerName)
        setGameData(gameData)
        setDeck(gameData.deck);
        setDealer(gameData.dealer);
        setGameStarted(gameData.gameStarted);
        setMyId(player_id.socket)
        setTimeout(() => {
            setChipMenuOpen(true)
            placeBetNotify("You have 20 seconds to place your bet!")
        }, 2500)
        
        setTimeout(() => {
            setChipMenuOpen(false)
        }, 20000)
    });

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

    const startGame = () => {
        
        if(placedBet > 0){
            socket?.emit("startSinglePlayerGame", {
                totalBetAmount: placedBet,
                room: activeRoom,
                id: myId
             });
             setChipMenuOpen(false)
             dismissAll();
        } else {
            message.error("There is no bet placed!")
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
        socket?.emit("askForHit", {
            placedBet: placedBet,
            room: activeRoom,
            id: myId,
            gameData: gameData
         });
    }

    function reduceAce(playerSum, playerAceCount) {
        while (playerSum > 21 && playerAceCount > 0) {
            playerSum -= 10;
            playerAceCount -= 1;
        }
        return playerSum;
    }
      
    
    async function stay() {
        const newdealerSum = reduceAce(dealerSum, dealerAceAccount);
        const newplayerSum = reduceAce(playerSum, playerAceAccount);
        console.log(placedBet)
        document.getElementById("hidden").src = "./assets/cards/" + dealerHidden + ".png";
        setActivePlayer(false)
        setGameFinished(true)
        let status;
        if (newplayerSum > 21) {
            welcomeNotify("You Lose!")
            status = "LOST"
        }
        else if (newdealerSum > 21) {
            welcomeNotify("You Win!")
            status = "WON"
        }
        else if (newplayerSum == newdealerSum) {
            welcomeNotify("Tie!")
            status = "TIE"
        }
        else if (newplayerSum > newdealerSum) {
            welcomeNotify("You Win!")
            status = "WON"
        }
        else if (newplayerSum < newdealerSum) {
            welcomeNotify("You Lose!")
            status = "LOST"
        }
        const updatedData = {
            email: user.email,
            playerName: user.user_metadata.name,
            playerId: user.id,
            status: status,
            roomNickname: currentPlayerName,
            totalBetAmount: placedBet
        }
        const { data, error } = await supabase
            .from('blackJack')
            .insert([updatedData])
            if (error) {
                console.error('Error inserting/updating user session data:', error.message)
            } else {
                console.log('User session data saved:', data)
                welcomeNotify("Data saved!!!")
        }
        
        socket?.emit("finishSinglePlayerGame", {
            totalBetAmount: placedBet,
            room: activeRoom,
            id: myId
         });

    }

    const disconnect = () => {
        socket.emit('leaveGame');
        socket.disconnect();
        setPlayOnline(false)
    }

    const keepPlaying = () => {

    }


  return (
    <PlayerGrid>
        {players?.map(player => {
            return(
                <PlayerWrapper key={player.socket}>
                    <PlayerAvatarWrapper>
                    <PlayerAvatar>
                    <Avatar alt="Image" src={""} sx={{ width: 80, height: 80 }}/>
                    </PlayerAvatar>
                    <PlayerAvatarName>{player.playerName}</PlayerAvatarName>
                    </PlayerAvatarWrapper>
                    <PlayerBet>
                        <CurrentBetText>CURRENT BET</CurrentBetText>
                        <PlayerChip id="playerChip">{placedBet}</PlayerChip>
                        <CurrentBetText>POINTS: {playerSum}</CurrentBetText>
                    </PlayerBet>
                    <PlayerCardsHolder id="player-cards">
                        {playerHand.map(card => {
                            return(
                                <PlayerCard initial="out" animate="in" variants={animationFour} transition={transitionLong}><img src={`./assets/cards/${card}.png`} /></PlayerCard>
                            )
                        })}
                    </PlayerCardsHolder>
                </PlayerWrapper>
            )
        })}
        {activePlayer && (
            <ActionButtons animate={animate} transition={transition}>
                <StyledButton onClick={doubleBet}>DOUBLE</StyledButton>
                <StyledButton onClick={askHit}>HIT</StyledButton>
                <StyledButton onClick={stay}>STAY</StyledButton>
            </ActionButtons>
        )}
        {gameFinished && (
            <ActionButtons animate={animate} transition={transition}>
                <StyledButton onClick={disconnect}>LEAVE ROOM</StyledButton>
                <StyledButton onClick={keepPlaying}>PLAY AGAIN</StyledButton>
            </ActionButtons>
        )}
        {chipMenuOpen && (
            <motion.div className="menu-container-seven" variants={item}
            initial={{opacity:0, height: 0}}
            animate={{ opacity:1, height: "70vh"}}
            transition={{duration:.5}}
            exit="exit">
                <DndContext onDragEnd={handleDragEnd}>
                    <ChipBalance>{placedBet && <div className="bet-info">Bet placed with: ${placedBet} chip</div>}</ChipBalance>
                    <BetArea droppedChips={droppedChips} droppedChipValue={droppedChipValue}/>
                    <BJStartGame><StyledButton onClick={startGame}>START GAME</StyledButton></BJStartGame>
                <   Chips />
                </DndContext>
            </motion.div>
        )}
    </PlayerGrid>
  )
}

export default PlayersUI
