import React, {useEffect, useState} from 'react'
import BlackJackTabs from '../components/blackjack/BlackJackTabs'
import io from 'socket.io-client';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import BJBack from '../assets/bjTable.jpg';
import ChatMessages from '../components/chats/ChatMessages';
import { transitionLong,animationFour } from '../animations';
import { Avatar } from '@mui/material';
import { StyledButton,ColumnTopSmall,ColumnTopBig } from './index'
import PlayerCards from '../components/blackjack/PlayerCards';
import { DndContext } from '@dnd-kit/core';
import Chips from '../components/blackjack/Chips';
import BetArea from '../components/blackjack/BetArea';
import { supabase } from '../supabase/client';


const socket = io.connect("https://pacton-server.vercel.app/")



const BlackJack = () => {

    const [playOnline, setPlayOnline] = useState(false)
    const [roomPlayers, setRoomPlayers] = useState({});
    const [players, setPlayers] = useState([]);
    const [activePlayer, setActivePlayer] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeRoom, setActiveRoom] = useState(null);
    const [dealerHand, setDealerHand] = useState([])
    const [dealerHidden, setDealerHidden] = useState([])
    const [dealerSum, setDealerSum] = useState(null);
    const [playerAvatar, setPlayerAvatar] = useState(null);
    const [balance, setBalance] = useState(500);
    const [placedBet, setPlacedBet] = useState(null);
    const [droppedChips, setDroppedChips] = useState([]);
    const [droppedChipValue, setDroppedChipValue] = useState(null);
    const [chipMenuOpen, setChipMenuOpen] = useState(false)
    const [myId, setMyId] = useState("");
    const [rooms, setRooms] = useState([]);
    const [cantHit, setCantHit] = useState(false)
    const [gameData, setGameData] = useState([])
    const [dealerAceCount, setDealerAceCount] = useState(null);
    const [playerSum, setPlayerSum] = useState(null);
    const [playerName, setPlayerName] = useState(null);
    const [gameFinished, setGameFinished] = useState(false)

    console.log(dealerHidden)
    
    const sendAmdminMessage = async (messageToUpdate) => {
      const { data, error } = await supabase
              .from('games_chat_messages')
              .insert([messageToUpdate])
              if (error) {
                console.error('Error inserting/updating user session data:', error.message)
              } else {
                console.log('User session data saved:', data)
            }
    }

    const handleDragEnd = (event) => {
        const { over, active } = event;
    
        // Check if the chip was dropped in the bet area
        if (over && over.id === 'bet-area') {
          const chipValue = active.data.current.chipValue;
          if (chipValue === null) {
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

    

    const callTimeOut = () => {
      sendAmdminMessage("Waiting for more players to join. The game starts in 10 secons.")
    }

    const startGame = () => {

        if (placedBet > 0) {
          socket?.emit("placeBet", {
            betAmount: placedBet,
            roomId: activeRoom,
          });
          setChipMenuOpen(false)
          const amount = balance - placedBet
          setBalance(amount)
        } else {
          message.error("There is no bet placed!")
        }
    }

    useEffect(() => {
      socket.on('connect', () => {
        console.log(`Connected with socket ID: ${socket.id}`);
      });
  
      // Handle socket disconnect
      socket.on('disconnect', () => {
        console.log('Disconnected');
      });
  
      return () => {
        socket.disconnect();
      };
    }, []);

    useEffect(() => {
      console.log(socket)
    }, [socket])

    useEffect(() => {
      const fetchInitialData = () => {
        socket.emit('getRooms');
        socket.emit('getAllPlayers');
      };
      fetchInitialData();
      socket.on('roomsUpdate', (rooms) => {
        setRooms(rooms);
        setGameData(rooms)
      });
      socket.on('allPlayersUpdate', (allPlayers) => {
        const flattenedPlayers = allPlayers.flatMap(room => room.players);
        setPlayers(flattenedPlayers);
      });
      socket?.on('thisIsYourId', (data) => {
        console.log("dataidididid", data)
        setMyId(data.playerId)
        setActiveRoom(data.room)
        setPlayOnline(true) 
        //waitingtToStarttNotify('Waiting for other players to join the room... ⌛')
      });
      socket?.on('update_players', (data) => {
        const { message, dealer, dealer_avatar, sendedBy } = data;
        const messageToUpdate = {
          message: message,
          playerName: dealer,
          user_avatar: dealer_avatar,
          sendedBy: sendedBy,
          room_id: activeRoom
        }
        sendAmdminMessage(messageToUpdate)
        callTimeOut()
      });
      socket?.on('reveal-card', (data) => {
        document.getElementById("hidden").src = "./assets/cards/" + data.hidden + ".png";
      });
      socket?.on('timeoutStarting', () => {
        console.log('time out has started')
      });
      socket?.on('timeoutExpired', () => {
        console.log("time out expired, place tyour bet")
        setChipMenuOpen(true)
      });
      socket?.on('game-started', (data) => {
        const { players, message, dealer, dealer_avatar, sendedBy } = data;
        setPlayers(players)
        /* const messageToUpdate = {
          message: message,
          playerName: dealer,
          user_avatar: dealer_avatar,
          sendedBy: sendedBy,
          room_id: activeRoom
        }
        sendAmdminMessage(messageToUpdate) */
      });
      socket?.on('firstRound', (data) => {
        setGameData(data)
        setDealerSum(data.gameData.dealerSum)
        setDealerAceCount(data.gameData.dealerAceCount)
        setDealerHidden(data.gameData.dealerHidden)
        setDealerHand(data.gameData.dealerHand)
        setPlayers(data.gameData.players)
      });
      socket.on('your-turn', () => {
        setTimeout(() => {
          setActivePlayer(true)
        }, 1000)
        console.log("ITS YOUR TURN")
      });
      socket.on("cardAfterHit", (data) => {
        const {playerName,playerSum,gameData} = data;
        setPlayerSum(playerSum)
        setPlayers(gameData.players)
        console.log(data)
      });
      socket.on("balanceUpdate", (data) => {
        const {playerName,status,payout} = data;
        if(payout > 0){
          if(status === "Win!"){
            const amount = balance + payout
            setBalance(amount)
            
            console.log(`${playerName} wins ${payout}$. All balances updated!`)
          }
          if(status === "Push!"){
            const amount = balance + payout
            setBalance(amount)
            
            console.log(`Push! ${playerName}'s bet has been returned.`)
          }
          if(status === 'BlackJack!'){
            const amount = balance + payout
            setBalance(amount)
            
            console.log(`${playerName}'s got BlackJack and wins ${payout}$!`)
          }
        } else {
          if(status === 'Lose!'){
            
            console.log(`${playerName} has lost the game.`)
          }
        }
       });
       socket?.on('bets-placed', (data) => {
        const { message, dealer, dealer_avatar, sendedBy } = data;
        const messageToUpdate = {
          message: message,
          playerName: dealer,
          user_avatar: dealer_avatar,
          sendedBy: sendedBy,
          room_id: activeRoom
        }
        sendAmdminMessage(messageToUpdate)
       })
       socket?.on('all.bets-placed', (data) => {
        const { message, dealer, dealer_avatar, sendedBy } = data;
        const messageToUpdate = {
          message: message,
          playerName: dealer,
          user_avatar: dealer_avatar,
          sendedBy: sendedBy,
          room_id: activeRoom
        }
        sendAmdminMessage(messageToUpdate)
       });
       socket.on('gameResults', (data) => {
        const { message, dealer, dealer_avatar, sendedBy, hidden } = data;
        const messageToUpdate = {
          message: message,
          playerName: dealer,
          user_avatar: dealer_avatar,
          sendedBy: sendedBy,
          room_id: activeRoom
        }
        setGameFinished(true)
        console.log(hidden)
        sendAmdminMessage(messageToUpdate)
       })
      return () => {
        socket.off('roomsUpdate');
        socket.off('allPlayersUpdate');
        socket.off('thisIsYourId');
        socket.off('timeoutStarting');
        socket.off('timeoutExpired');
        socket.off('update-room-players');
        socket.off('game-started');
        socket.off('firstRound');
        socket.off('balanceUpdate');
        socket.off('bets-placed');
        socket.off('all.bets-placed');
        socket.off('results');
      };
    }, [dealerHidden]);

    const doubleBet= () => {
      const prev = placedBet
      const value = (prev * 2)
      setPlacedBet(value)
      const chip = document.getElementById("chipSum").innerHTML = value
      const number = (parseInt(chip) * 2).toString();
      console.log(chip)
      welcomeNotify(`${playerName} has doubled his bet!`)
      socket?.emit("doubledBet", {
        placedBet: value,
        room: activeRoom,
        id: myId,
    });
    }
  
    const askHit = () => {
        socket?.emit("askForHit", {
            placedBet: placedBet,
            room: activeRoom,
            id: myId,
            gameData: gameData
        });
    }
  
    const stay = () => {
      setActivePlayer(false)
      setCantHit(false)
      //goToNext();
      socket?.emit("playerStays", {
        playerSum: playerSum,
        room: activeRoom,
        id: myId
      });
    }

    //(!playOnline)
    if (!playOnline) {
        return (
          <BlackJackTabs socket={socket} rooms={rooms} players={players} playerName={playerName} setPlayerName={setPlayerName}/>
        )
    }
      //(playOnline && players)
    if(playOnline && players){
        return (
            <BlackJackSection>
                <BlackJackTitle animate={{ height: activePlayer ? '35vh' : '40vh' }}
                    initial={{ height: '70vh' }}
                    transition={{ duration: 0.5 }}>
                    <ChatMessages isExpanded={isExpanded} setIsExpanded={setIsExpanded} activeRoom={activeRoom} playerName={playerName}
                    playerId={myId} playerAvatar={playerAvatar}/>
                    <BlackJackBigColumn>
                    <div id="dealer-cards" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                        <motion.img id="hidden" src="./assets/cards/BACK.png" initial="out" animate="in" variants={animationFour} transition={transitionLong} />
                        {dealerHand?.map(card => {
                            return (
                                <DealerCard key={card} initial="out" animate="in" variants={animationFour} transition={transitionLong}><img src={`./assets/cards/${card}.png`} /></DealerCard>
                            )
                        })}
                        {gameFinished && <DealerText>The dealer has got {dealerSum} points.</DealerText>}
                    </div>
                </BlackJackBigColumn>
                <BalanceColumn>
                    <ColumnTopBig>
                        <Avatar alt="Image" src={playerAvatar} sx={{ width: 60, height: 60 }} />
                    </ColumnTopBig>
                    <ColumnTopSmall>Balance: <span id="counter">{balance}</span></ColumnTopSmall>
                </BalanceColumn>
                </BlackJackTitle>
                <PlayerCards players={players} activePlayer={activePlayer} playerSum={playerSum}/>
            {chipMenuOpen && (
              <motion.div className="menu-container-seven" variants={item}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "70vh" }}
                transition={{ duration: .5 }}
                exit="exit">
                <DndContext onDragEnd={handleDragEnd}>
                  <ChipBalance>{placedBet !== 0 ? <div className="bet-info">Bet placed with: ${placedBet} chip</div> : <div className="bet-info">Time remaining: {timeRemaining}</div>}</ChipBalance>
                  <BetArea droppedChips={droppedChips} droppedChipValue={droppedChipValue} />
                  <BJStartGame><StyledButton onClick={startGame} /* disabled={disabled} */>START GAME</StyledButton></BJStartGame>
                  <Chips />
                </DndContext>
              </motion.div>
            )}
            {activePlayer && (
              <ActionButtons initial={{ opacity: 0, y: '13vh' }}
                animate={{ opacity: 1, y: '-10px' }}
                transition={{ duration: 0.5 }}>
                {cantHit ? (
                  <StyledButton onClick={stay}>FOLD</StyledButton>
                ) : (
                  <>
                    <StyledButton onClick={doubleBet}>DOUBLE</StyledButton>
                    <StyledButton id="hitButton" onClick={askHit}>HIT</StyledButton>
                    <StyledButton onClick={stay}>STAY</StyledButton>
                  </>
                )}
              </ActionButtons>
            )}
            </BlackJackSection>
        )
    }
}

export default BlackJack

const DealerCard = styled(motion.div)`
    height: 150px;
    width: 100px;
    margin: 0 5px;
`;

const BlackJackBigColumn = styled.div`
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 25vw;
    border: 1px solid red;
`;

export const DealerText = styled.div`
  width: 400px;
  height: 50px;
  color: ${props => props.theme.text};
  font-size: 24px;
  position: absolute;
  top: 110%;
  left: -5%;
`;

const BalanceColumn = styled.div`
    width: 25vw;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text};
    font-size: 24px;
    flex-direction: column;
    padding: 5px;
    position: absolute;
    top: 0;
    left: 75vw;
`;

const ActionButtons = styled(motion.div)`
    width: 30%;
    height: 10vh;
    border: 1px solid ${props => props.theme.MainAccent};
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px;
`;

const item = {
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      ease: "easeInOut",
      duration: 0.3,
      delay: 1
    }
  }
}

const ChipBalance = styled.div`
    width: 50%;
    height: 10vh;
    display: flex;
    align-items: center;
    justify-content: space-around;
`;

const BJStartGame = styled.div`
    width: 30%;
    height: 15vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const BlackJackSection = styled.div`
    width: 100vw;
    min-height: 100vh;
    background: ${props => props.theme.body};
    display: flex;
    flex-direction: column;
    align-items: center;
    background-image: url(${BJBack});
    background-repeat: no-repeat;
    background-size: cover;
`;

const BlackJackTitle = styled(motion.div)`
    width: 100%;
    height: 40vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text};
    font-size: 98px;
    position: relative;
`;