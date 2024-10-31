import React, {useEffect, useState, useRef} from 'react'
import BlackJackTabs from '../components/blackjack/BlackJackTabs'
import io from 'socket.io-client';
import styled from 'styled-components';
import { motion } from 'framer-motion';

import ChatMessages from '../components/chats/ChatMessages';
import { transitionLong,animationFour } from '../animations';
import { Avatar } from '@mui/material';
import { StyledButton,ColumnTopSmall,ColumnTopBig,BettingTimer,BettingText,ButtonHoverAbsolute,WholeColumn,ButtonHoverAbsoluteLeft,
  ColumnMedium,ColumnTitle,VolumeIcon,VolumeDownIcon,DealerResult
 } from './index'
import {BlackJackSection,BlackJackSectionSmart,BlackJackTitle,BlackJackBigColumn,ActionButtons,ChatRoomIcon} from './indexTwo'
import PlayerCards from '../components/blackjack/PlayerCards';
import { DndContext } from '@dnd-kit/core';
import { TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import Chips from '../components/blackjack/Chips';
import BetArea from '../components/blackjack/BetArea';
import { supabase } from '../supabase/client';
import { BetState } from '../context/BetsContext';
import { useAuth } from './functions';
import { useNavigate } from 'react-router-dom';
import karmacoma from '../assets/sounds/karmacoma.ogg'
//import { playChipSound,playShuffle,playAmbience,playWinnings } from './functions';
import chipSound from '../assets/sounds/chipSound.ogg'
import shuffle from '../assets/sounds/shuffle.mp3'
import casinoAmbience from '../assets/sounds/casinoAmbience.ogg'
import winnings from '../assets/sounds/casinoAmbience.ogg'

import MusicMenu from '../components/music/MusicMenu';
import { ButtonAbsolute, CloseChatRoomIcon } from '../components/chats';



/* const socket = io.connect("https://pacgames.onrender.com") */


const BalanceDisplay = ({ balance }) => {
  const [displayBalance, setDisplayBalance] = useState(balance);

  useEffect(() => {
    const controls = setInterval(() => {
      setDisplayBalance((prev) => {
        if (prev < balance) return Math.min(prev + 1, balance);
        if (prev > balance) return Math.max(prev - 1, balance);
        return balance;
      });
    }, 5); // Speed of counting, adjust as necessary

    return () => clearInterval(controls);
  }, [balance]);

  return (
    <motion.div
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
      style={{ fontSize: '2rem', fontWeight: 'bold' }}
    >
      ${displayBalance}
    </motion.div>
  );
};


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
    const [chatMenuOpen, setChatMenuOpen] = useState(false)
    const [myId, setMyId] = useState("");
    const [rooms, setRooms] = useState([]);
    const [cantHit, setCantHit] = useState(false)
    const [gameData, setGameData] = useState([])
    const [dealerAceCount, setDealerAceCount] = useState(null);
    const [playerSum, setPlayerSum] = useState(null);
    const [playerName, setPlayerName] = useState(null);
    const [gameFinished, setGameFinished] = useState(false)
    const { user } = useAuth();
    const navigate = useNavigate();
    const [seconds, setSeconds] = useState(null);
    const intervalRef = useRef(null);
    const [volumeMenuOpen, setVolumeMenuOpen] = useState(false)
    const [effectsVolume, setEffectsVolume] = useState(0.5);
    const [musicVolume, setMusicVolume] = useState(0.5);
    const [allowMusic, setAllowMusic] = useState(true);
    const soundEffectsRef = useRef([]);
    const musicRef = useRef(new Audio(casinoAmbience));
    const [allowEffects, setAllowEffects] = useState(true);
    const [currentTrack, setCurrentTrack] = useState(null);
    console.log(musicVolume)

    

    const sensors = useSensors(
      useSensor(MouseSensor),
      useSensor(TouchSensor, {
        activationConstraint: {
          distance: 10, // Start dragging after 10px of movement
        },
      })
    );

    const closeChat = () => {
      setIsExpanded(!isExpanded)
    }

    useEffect(() => {
      soundEffectsRef.current = [
        new Audio(chipSound),
        new Audio(shuffle),
        new Audio(winnings),
      ];
      
      // Apply the initial volume
      soundEffectsRef.current.forEach((sound) => {
        sound.volume = effectsVolume;
      });
    }, []);

    useEffect(() => {
      soundEffectsRef.current.forEach((sound) => {
        sound.volume = effectsVolume;
      });
    }, [effectsVolume]);
  
    // Function to play a specific sound effect
    const playEffect = (effectIndex) => {
      if (allowEffects) {
        soundEffectsRef.current[effectIndex].play();
      }
    };

    const toggleVolumeMenu = () => {
      setVolumeMenuOpen(!volumeMenuOpen);
    }

    const startCountdown = () => {
      let countdownTime = 15;
      setSeconds(countdownTime);
  
      // Store the interval ID in intervalRef
      intervalRef.current = setInterval(() => {
        countdownTime -= 1;
        setSeconds(countdownTime);
  
        // Stop the timer when it reaches 0
        if (countdownTime <= 0) {
          clearInterval(intervalRef.current);
        }
      }, 1000); // Every 1 second
    };
  
    // Function to stop the countdown manually
    const stopCountdown = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // Clears the interval
        intervalRef.current = null; // Reset the reference
        setSeconds(null); // Optionally reset the timer display
      }
    };
    
    
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
        playEffect(0);
    };

    const callTimeOut = () => {
      sendAmdminMessage("Waiting for more players to join. The game starts in 10 secons.")
    }

    const startGame = () => {
      stopCountdown();
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
      const fetchInitialData = () => {
        socket.emit('getRooms');
        socket.emit('getAllPlayers');
      };
      fetchInitialData();
      socket.on('roomsUpdate', (rooms) => {
        setRooms(rooms);
        //setGameData(rooms)
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
        startCountdown();
      });
      socket?.on('game-started', (data) => {
        const { players, message, dealer, dealer_avatar, sendedBy } = data;
        setPlayers(players)
        const messageToUpdate = {
          message: message,
          playerName: dealer,
          user_avatar: dealer_avatar,
          sendedBy: sendedBy,
          room_id: activeRoom
        }
        sendAmdminMessage(messageToUpdate)
      });
      socket?.on('firstRound', (data) => {
        playEffect(1);
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
        playEffect(1);
        setPlayerSum(playerSum)
        setPlayers(gameData.players)
        console.log(data)
        if(playerSum >= 21){
          document.getElementById('hitButton').style.display = 'none'
          document.getElementById('doubleButton').style.display = 'none'
          document.getElementById('stayButton').style.boxShadow = '0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4, 0 0 100px #03e9f4'
          document.getElementById('stayButton').style.background = '#03e9f4'
          document.getElementById('stayButton').style.color = '#fcfcfc'
        }
      });
      socket.on("balanceUpdate", (data) => {
        const {playerName,status,payout} = data;
        if(payout > 0){
          if(status === "Win"){
            const amount = balance + payout
            setBalance(amount)
            playEffect(2);
            
            console.log(`${playerName} wins ${payout}$. All balances updated!`)
          }
          if(status === "Push"){
            const amount = balance + payout
            setBalance(amount)
            
            console.log(`Push! ${playerName}'s bet has been returned.`)
          }
          if(status === 'BlackJack'){
            const amount = balance + payout
            setBalance(amount)
            
            console.log(`${playerName}'s got BlackJack and wins ${payout}$!`)
          }
        } else {
          if(status === 'Lose'){
            
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
        sendAmdminMessage(messageToUpdate)
        //startJoinTimeOut()
       });
       socket.on('player-keeps-playing', (data) => {
        const { room, message, dealer, dealer_avatar, sendedBy } = data;
        console.log(data)
        const messageToUpdate = {
          message: message,
          playerName: dealer,
          user_avatar: dealer_avatar,
          sendedBy: sendedBy,
          room_id: activeRoom
        }
        setGameData(room)
        setDealerSum(room.dealerSum)
        setDealerAceCount(room.dealerAceCount)
        setDealerHidden(room.dealerHidden)
        setDealerHand(room.dealerHand)
        setPlayers(room.players)
        setPlacedBet(0)
        setDroppedChips([])
        document.getElementById("hidden").src = "./assets/cards/BACK.png";
        
        sendAmdminMessage(messageToUpdate)
        //setPlayAgainTimer()
       });
       
       socket.on('player-has-left-room', (data) => {
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
      socket.on('openChipMenu', () => {
        setChipMenuOpen(true)
        startCountdown()
      })
      socket.on('disconnected-for-leaving', () => {
        selfDisconnect();
      })
      socket.on('disconnected-for-no-bet', () => {
        selfDisconnect();
      })
      socket.on('removed-by-own-decision', () => {
        selfDisconnect();
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
        socket.off('gameResults');
        socket.off('player-keeps-playing');
        socket.off('player-has-left-room');
        socket.off('openChipMenu');
        socket.off('removed-by-own-decision');
        socket.off('disconnected-for-no-bet');
      };
    }, [dealerHidden]);


    const selfDisconnect = () => {
      console.log("disconnecting")
      socket?.disconnect();
      navigate('/')
    }

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
      setGameFinished(true)
      //goToNext();
      console.log(activeRoom)
      socket?.emit("playerStays", {
        roomId: activeRoom,
        id: myId
      });
    }

    const keepPlaying = () => {
      setGameFinished(false)
      socket?.emit("next-match-players", {
        roomId: activeRoom,
        playerId: myId,
        message: 'staying'
      });
    }
    const leaveGame = () => {
      setGameFinished(false)
      selfDisconnect();
      socket?.emit('next-match-players',{
        playerId: myId,
        roomId : activeRoom,
        message: 'leaving'
      })
    }

    

    console.log("volumn", effectsVolume)
    


    //(!playOnline)
    if (!playOnline) {
        return (
          <>
            <ButtonHoverAbsolute onClick={toggleVolumeMenu}><VolumeIcon /></ButtonHoverAbsolute>
            <BlackJackTabs socket={socket} rooms={rooms} players={players} playerName={playerName} setPlayerName={setPlayerName}/>
            {volumeMenuOpen && (
                <MusicMenu volumeMenuOpen={volumeMenuOpen} setVolumeMenuOpen={setVolumeMenuOpen} musicVolume={musicVolume} setMusicVolume={setMusicVolume} 
                effectsVolume={effectsVolume} setEffectsVolume={setEffectsVolume} allowMusic={allowMusic} setAllowMusic={setAllowMusic}
                allowEffects={allowEffects} setAllowEffects={setAllowEffects} currentTrack={currentTrack} setCurrentTrack={setCurrentTrack}/>
              )}
          </>
          
        
        )
    }
      //(playOnline && players)
    if(playOnline && players){
        return (
          <>
            <BlackJackSection>
            <ButtonHoverAbsolute onClick={toggleVolumeMenu}><VolumeIcon /></ButtonHoverAbsolute>
            <ButtonHoverAbsoluteLeft onClick={closeChat}><ChatRoomIcon /></ButtonHoverAbsoluteLeft>
              <BlackJackTitle animate={{ height: activePlayer || gameFinished ? '25%' : '30%' }}
                    initial={{ height: '30%' }}
                    transition={{ duration: 0.5 }}>
              <ChatMessages isExpanded={isExpanded} setIsExpanded={setIsExpanded} activeRoom={activeRoom} playerName={playerName}
                    playerId={myId} playerAvatar={playerAvatar}/>
              <BlackJackBigColumn>
                    
                              <div className="topCard"><motion.img id="hidden"  src="./assets/cards/BACK.png" initial="out" animate="in" variants={animationFour} transition={transitionLong} /></div>
                              {dealerHand?.map(card => {
                                  return (
                                      <DealerCard key={card} className="topCard" /* initial="out" animate="in" variants={animationFour} transition={transitionLong} */><img src={`./assets/cards/${card}.png`} /></DealerCard>
                                  )
                              })}
                     
              </BlackJackBigColumn>
              <BalanceColumn>
                    <WholeColumn>
                      <ColumnTopBig>
                          <Avatar alt = "Image" src = {user.user_metadata.avatar_url}  sx={{
                      width: { xs: 20, sm: 20, md: 40, lg: 70, xl: 70 }, 
                      height: { xs: 20, sm: 20, md: 40, lg: 70, xl: 70 },
                    }}/>
                    </ColumnTopBig>
                  <ColumnTopSmall>Balance: <span><BalanceDisplay balance={balance} /></span></ColumnTopSmall>
                    </WholeColumn>

                </BalanceColumn>
              </BlackJackTitle>
              <PlayerCards players={players} activePlayer={activePlayer} playerSum={playerSum} gameFinished={gameFinished}/>
              <ActionButtons animate={{ height: activePlayer || gameFinished ? '15%' : '0' }}
                    initial={{ height: '0' }}
                    transition={{ duration: 0.5 }}>
                    {activePlayer && (
                    <>
                      {cantHit ? (
                        <StyledButton onClick={stay}>FOLD</StyledButton>
                      ) : (
                        <>
                          <StyledButton onClick={doubleBet} id="doubleButton">DOUBLE</StyledButton>
                          <StyledButton id="hitButton" onClick={askHit}>HIT</StyledButton>
                          <StyledButton onClick={stay} id="stayButton">STAY</StyledButton>
                        </>
                      )}
                    </>
                    )}  
                  {gameFinished && (
                      <>
                      <StyledButton onClick={leaveGame}>LEAVE ROOM</StyledButton>
                      <DealerResult>The dealer has {dealerSum} points.</DealerResult>
                      <StyledButton onClick={keepPlaying} id="keepPlayingButton">KEEP PLAYING</StyledButton>
                      </>
                  )}
              </ActionButtons>
            </BlackJackSection>
              {volumeMenuOpen && (
                <MusicMenu volumeMenuOpen={volumeMenuOpen} setVolumeMenuOpen={setVolumeMenuOpen} musicVolume={musicVolume} setMusicVolume={setMusicVolume} 
                effectsVolume={effectsVolume} setEffectsVolume={setEffectsVolume} allowMusic={allowMusic} setAllowMusic={setAllowMusic}
                allowEffects={allowEffects} setAllowEffects={setAllowEffects} currentTrack={currentTrack} setCurrentTrack={setCurrentTrack}/>
              )} 
              {/* {chatMenuOpen && (
                <motion.div className="menu-container-six" variants={item}
                initial={{height:0, opacity:0,}}
                animate={{height:"100vh", opacity:1}}
                transition={{duration:.5}}
                exit="exit">
                <ButtonHoverAbsoluteLeft onClick={closeChat}><CloseChatRoomIcon /></ButtonHoverAbsoluteLeft>
                <ChatMessages isExpanded={isExpanded} setIsExpanded={setIsExpanded} activeRoom={activeRoom} playerName={playerName}
                    playerId={myId} playerAvatar={playerAvatar} style={{width: '100vw'}}/>
                </motion.div>
              )} */}
              {chipMenuOpen && (
              <motion.div className="menu-container-seven" variants={item}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "100vh" }}
                transition={{ duration: .5 }}
                exit="exit">
                  <BettingTimer>
                    <BettingText>You have <span>{seconds}</span> seconds to place your bet or you'll get disconnected!</BettingText>
                  </BettingTimer>
                <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
                  <ChipBalance>{placedBet !== 0 ? <div className="bet-info">Bet placed with: ${placedBet} chip</div> : ""}</ChipBalance>
                  <BetArea droppedChips={droppedChips} droppedChipValue={droppedChipValue} />
                  <BJStartGame><StyledButton onClick={startGame}>START GAME</StyledButton></BJStartGame>
                  <Chips />
                </DndContext>
              </motion.div>
            )}
            
            {/* {activePlayer && (
              <ActionButtons initial={{ opacity: 0, y: '13vh' }}
                animate={{ opacity: 1, y: '-10px' }}
                transition={{ duration: 0.5 }}>
                {cantHit ? (
                  <StyledButton onClick={stay}>FOLD</StyledButton>
                ) : (
                  <>
                    <StyledButton onClick={doubleBet} id="doubleButton">DOUBLE</StyledButton>
                    <StyledButton id="hitButton" onClick={askHit}>HIT</StyledButton>
                    <StyledButton onClick={stay} id="stayButton">STAY</StyledButton>
                  </>
                )}
              </ActionButtons>
            )} */}
              {/* <ButtonHoverAbsolute onClick={toggleVolumeMenu}><VolumeIcon /></ButtonHoverAbsolute>
              {gameFinished && <DealerText>The dealer has got <span>{dealerSum}</span> points.</DealerText>}
                <BlackJackTitle animate={{ height: activePlayer || gameFinished ? '35vh' : '40vh' }}
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
                    </div>  
                </BlackJackBigColumn>
                <BalanceColumn>
                    <WholeColumn>
                      <ColumnTopBig>
                          <Avatar alt = "Image" src = {user.user_metadata.avatar_url} sx={{ width: 60, height: 60 }} />
                    </ColumnTopBig>
                  <ColumnTopSmall>Balance: <span id="counter">{balance}$</span></ColumnTopSmall>
                    </WholeColumn>

                </BalanceColumn>
                {volumeMenuOpen && (
                <MusicMenu volumeMenuOpen={volumeMenuOpen} setVolumeMenuOpen={setVolumeMenuOpen} musicVolume={musicVolume} setMusicVolume={setMusicVolume} 
                effectsVolume={effectsVolume} setEffectsVolume={setEffectsVolume} allowMusic={allowMusic} setAllowMusic={setAllowMusic}
                allowEffects={allowEffects} setAllowEffects={setAllowEffects} currentTrack={currentTrack} setCurrentTrack={setCurrentTrack}/>
              )}

                </BlackJackTitle>
                <PlayerCards players={players} activePlayer={activePlayer} playerSum={playerSum} gameFinished={gameFinished}/>
            {chipMenuOpen && (
              <motion.div className="menu-container-seven" variants={item}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "100vh" }}
                transition={{ duration: .5 }}
                exit="exit">
                  <BettingTimer>
                    <BettingText>You have <span>{seconds}</span> seconds to place your bet or you'll get disconnected!</BettingText>
                  </BettingTimer>
                <DndContext onDragEnd={handleDragEnd}>
                  <ChipBalance>{placedBet !== 0 ? <div className="bet-info">Bet placed with: ${placedBet} chip</div> : ""}</ChipBalance>
                  <BetArea droppedChips={droppedChips} droppedChipValue={droppedChipValue} />
                  <BJStartGame><StyledButton onClick={startGame}>START GAME</StyledButton></BJStartGame>
                  <Chips />
                </DndContext>
              </motion.div>
            )}
            
            {gameFinished && (
              <ActionButtons initial={{ opacity: 0, y: '13vh' }}
                animate={{ opacity: 1, y: '-10px' }}
                transition={{ duration: 0.5 }}>
                    <StyledButton onClick={leaveGame}>LEAVE ROOM</StyledButton>
                    <StyledButton onClick={keepPlaying} id="keepPlayingButton">KEEP PLAYING</StyledButton>
              </ActionButtons>
            )} */}
            <BlackJackSectionSmart>TURN YOUR DEVICE FOR A BETTER PLAY</BlackJackSectionSmart>
          </>
        )
    }
}

export default BlackJack

const DealerCard = styled.div`
    /* max-height: 80%;
    width: 15%; */
    margin: 0 10px;
    width: 15%;
`;



export const DealerText = styled.div`
  width: 400px;
  height: 50px;
  color: ${props => props.theme.MainAccent};
  font-size: 32px;
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-42.5%, -5%);
  text-shadow: ${props => props.theme.body} -1px 2px,  ${props => props.theme.body} -2px 2px,  ${props => props.theme.body} -3px 3px;
  span{
    font-weight: bold;
  }
`;

const BalanceColumn = styled.div`
    width: 25vw;
    height: 100%;
    display: flex;
    border: 1px solid ${props => props.theme.MainAccent};
    justify-content: center;
    color: ${props => props.theme.text};
    font-size: 24px;
    flex-direction: column;
    padding: 5px;
    
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





