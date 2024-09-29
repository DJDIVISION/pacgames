import React, {useState,useRef,useEffect} from 'react'
import { motion, useAnimation,AnimatePresence } from "framer-motion";
import { RouletteSection,RouletteColumn,RouletteContainer,BettingColumn,NumberCard,Wheel,Span,SpinButton,Number,NumberSpan,
    RouletteTableContainer,TableItem,RouletteSmallColumn,RouletteRow,ChatRoomIcon,StyledAbsolute,LatestRolls,NumberWrapper,
    BalanceWrapper,RouletteMainRow,RouletteMainIcon,PlayerBetsWrapper,BetNumberHolder,BetAmount,BetNumber,
    
    Row,
    SmallTableColumn
 } from './indexTwo'
 import {ButtonHoverAbsoluteLeft,BettingText,SmallColumn,BigColumn} from './index'
import { io } from "socket.io-client";
import {RouletteWrapper,Selector} from './indexTwo'
import { Button } from '@mui/material';
import Ton from '../assets/logos/ton.png'
import {FirstRow, SecondRow, ThirdRow, BetPerRows, LastRow, Zeroes, BetPerColumns, LatestNumbers} from './fakeData'
import RouletteTabs from '../components/roulette/RouletteTabs';
import RouletteTable from '../components/roulette/RouletteTable';
import { americanRouletteNumbers } from './functions';
import RouletteChatMessages from '../components/chats/RouletteChatMessages';
import { FoldIcon, UnfoldIcon } from '../components/chats';
import { supabase } from '../supabase/client';
import { message } from 'antd';
import { BalanceDisplayBig,PlacedBetDisplayBig,NumbersBetDisplayBig } from './functions';
import placeBet from '../assets/chips/placeBet.png'
import balanceIcon from '../assets/chips/balance-bag.png'
import roulette from '../assets/chips/roulette.png'
import { BetState } from '../context/BetsContext';
import { ZeroesArea,BetNumbersArea,BetPerColumnsArea,BetPerRowsArea,LastRowArea } from '../components/roulette/functions';



const socket = io.connect("https://pacgames-roulette-server.onrender.com")

const Roulette = () => {

    const totalNumbers = americanRouletteNumbers.length;
    const degreesPerSegment = 360 / totalNumbers;
    const adjustmentRotation = degreesPerSegment * -2;
    const [rotationDegrees, setRotationDegrees] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [playOnline, setPlayOnline] = useState(false)
    const [players, setPlayers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [myId, setMyId] = useState(null);
    const [activeRoom, setActiveRoom] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [playerName, setPlayerName] = useState(null);
    const [playerAvatar, setPlayerAvatar] = useState(null);
    const [placeBets, setPlaceBets] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [seconds, setSeconds] = useState(null);
    const intervalRef = useRef(null);
    const [timeOutStarted, setTimeOutStarted] = useState(false)
    const [winningNumber, setWinningNumber] = useState(null)
    const [latestNumbers, setLatestNumbers] = useState([])
    const [placedBet, setPlacedBet] = useState(null);
    const [allBets, setAllBets] = useState({})
    const [droppedChips, setDroppedChips] = useState({});
    const [allDroppedChips, setAllDroppedChips] = useState({});
    const [droppedCornerChips, setDroppedCornerChips] = useState({});
    const [allDroppedCornerChips, setAllDroppedCornerChips] = useState({});
    const [droppedRowChips, setDroppedRowChips] = useState({});
    const [allDroppedRowChips, setAllDroppedRowChips] = useState({});
    const [droppedLastRowChips, setDroppedLastRowChips] = useState({});
    const [allDroppedLastRowChips, setAllDroppedLastRowChips] = useState({});
    const [droppedColumnChips, setDroppedColumnChips] = useState({});
    const [allDroppedColumnChips, setAllDroppedColumnChips] = useState({});
    const [droppedBorderLeftChips, setDroppedBorderLeftChips] = useState({});
    const [allDroppedBorderLeftChips, setAllDroppedBorderLeftChips] = useState({});
    const [droppedBorderTopChips, setDroppedBorderTopChips] = useState({});
    const [allDroppedBorderTopChips, setAllDroppedBorderTopChips] = useState({});
    const [lastBet, setLastBet] = useState({});
    const {balance, setBalance} = BetState();

    console.log(balance)


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
      
    const closeChat = () => {
        setIsExpanded(!isExpanded)
    }

    const openTable = () => {
        if(!gameStarted){
            setPlaceBets(!placeBets)
        } else {
            message.error("There is a game in progress!")
        }
    }

    const sendAmdminMessage = async (messageToUpdate) => {
        const { data, error } = await supabase
                .from('roulette_chat_messages')
                .insert([messageToUpdate])
                if (error) {
                  console.error('Error inserting/updating user session data:', error.message)
                } else {
                  console.log('User session data saved:', data)
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
            //sendAmdminMessage(messageToUpdate)
            setTimeout(() => {
                setPlaceBets(true)
                setTimeOutStarted(true)
            }, 2000)
        });
        socket?.on('update_players-again', (data) => {
            const { message, dealer, dealer_avatar, sendedBy } = data;
            const messageToUpdate = {
              message: message,
              playerName: dealer,
              user_avatar: dealer_avatar,
              sendedBy: sendedBy,
              room_id: activeRoom
            }
            //sendAmdminMessage(messageToUpdate)
            setTimeout(() => {
                setPlaceBets(true)
                setTimeOutStarted(true)
            }, 2000)
        });
        socket?.on('timeoutStarting', () => {
            setTimeout(() => {
                startCountdown();
            }, 2000)
        });
        socket?.on('game-started', () => {
            message.success("the game has started")
            setGameStarted(true)
            setTimeOutStarted(false)
            setPlaceBets(false)
        });
        socket?.on('close-betting-table', () => {
            setGameStarted(true)
            setTimeOutStarted(false)
            setPlaceBets(false)
        });
        socket.on('winning-number', (winningNumber) => {
            const number = winningNumber.number 
            spinRoulette(winningNumber,activeRoom,myId);
            setWinningNumber(winningNumber)
        });
        socket.on('message-sent', (data) => {
            const { message, dealer, dealer_avatar, sendedBy, room } = data;
            const messageToUpdate = {
                message: message,
                playerName: dealer,
                user_avatar: dealer_avatar,
                sendedBy: sendedBy,
                room_id: activeRoom
            }
            setAllDroppedChips(room.allDroppedChips[0])
            setAllDroppedCornerChips(room.allDroppedCornerChips[0])
            setAllDroppedRowChips(room.allDroppedRowChips[0])
            setAllDroppedLastRowChips(room.allDroppedLastRowChips[0])
            setAllDroppedColumnChips(room.allDroppedColumnChips[0])
            setAllDroppedBorderLeftChips(room.allDroppedBorderLeftChips[0])
            setAllDroppedBorderTopChips(room.allDroppedBorderTopChips[0])
              //sendAmdminMessage(messageToUpdate)
        });
        socket.on('player-lost', (data) => {
            message.error("You have lost this game!!!")
            const latest = data.latest
            setLatestNumbers(latest)
            setGameStarted(false)
            setSpinning(false)
            setWinningNumber(null)
            setAllDroppedChips({})
            setAllDroppedCornerChips({})
            setAllDroppedRowChips({})
            setAllDroppedLastRowChips({})
            setAllDroppedColumnChips({})
            setAllDroppedBorderLeftChips({})
            setAllDroppedBorderTopChips({})
        });
        socket.on('player-wins', (data) => {
            message.success("You win!!!")
            const winnings = data.winnings
            const latest = data.latest
            setLatestNumbers(latest)
            setBalance((prevBalance) => prevBalance + winnings);
            setGameStarted(false)
            setSpinning(false)
            setWinningNumber(null)
            setAllDroppedChips({})
            setAllDroppedCornerChips({})
            setAllDroppedRowChips({})
            setAllDroppedLastRowChips({})
            setAllDroppedColumnChips({})
            setAllDroppedBorderLeftChips({})
            setAllDroppedBorderTopChips({})
        });
        return () => {
            socket.off('roomsUpdate');
            socket.off('allPlayersUpdate');
            socket.off('thisIsYourId');
            socket.off('update_players');
            socket.off('timeoutStarting');
            socket.off('winning-number');
            socket.off('close-betting-table');
            socket.off('player-lost');
            socket.off('close-betting-table');
        }
    }, [socket]);


    const getRotationForNumber = (winningNumber) => {
        const targetIndex = americanRouletteNumbers.findIndex(num => num.number === winningNumber.number);
        const degreesPerNumber = 360 / totalNumbers;
        const targetRotation = targetIndex * degreesPerNumber;
        const fullRotations = 8 * 360; // 3 full spins
        const finalRotation = fullRotations + (360 - targetRotation);
        return finalRotation;
    };

    useEffect(() => {
        if (spinning === true && activeRoom && myId) {
          setTimeout(() => {
            socket.emit("game-finished", { activeRoom, myId });
          }, 10000)
        }
      }, [spinning, activeRoom, myId]);

    const spinRoulette = (winningNumber) => {
        setSpinning(true);
        const finalRotation = getRotationForNumber(winningNumber);
        setRotationDegrees(finalRotation);
        setTimeout(() => {setSpinning(false);setRotationDegrees(0)}, 10000); // 10 seconds
    }; 


    const icon = placeBets ? <UnfoldIcon /> : <FoldIcon />

    if(!playOnline){
        return(
            <RouletteTabs socket={socket} rooms={rooms} players={players} playerName={playerName} setPlayerName={setPlayerName}/>
        )
    }
  
    return (
        <RouletteSection>
            <RouletteRow>
                <RouletteSmallColumn>
                    <ButtonHoverAbsoluteLeft onClick={closeChat}><ChatRoomIcon /></ButtonHoverAbsoluteLeft>
                    <RouletteChatMessages isExpanded={isExpanded} setIsExpanded={setIsExpanded} activeRoom={activeRoom} playerName={playerName}
                    playerId={myId} playerAvatar={playerAvatar} />
                </RouletteSmallColumn>
            <RouletteColumn>
                <RouletteContainer>
                    <Wheel animate={{ rotate: rotationDegrees }} // Framer Motion animation
                            transition={{
                            duration: 10, // 10-second spin duration
                            ease: [0.22, 1, 0.36, 1], // easeOutCubic to slow down
                            }}>
                        <SpinButton><img src={Ton} alt="logo" /></SpinButton>
                    {[...Array(19)].map((_, index) => (
                            <Span key={index} index={index} />
                        ))}
                        <Number>
                        {americanRouletteNumbers.map((item, index) => (
                            <NumberSpan key={index} index={index} style={{color: `${item.color}`, filter: `drop-shadow(0 0 10px aqua)`,
                            fontWeight: 'bold' }}>
                                {item.number}
                            </NumberSpan>
                            ))}
                        </Number>
                    </Wheel>
                </RouletteContainer>
            </RouletteColumn>
            <RouletteSmallColumn>
                <StyledAbsolute onClick={openTable}>{icon}</StyledAbsolute>
                {timeOutStarted && <BettingText>The game will start in {seconds} seconds!</BettingText>}
                {gameStarted && <BettingText>The game has started!</BettingText>}
                {!gameStarted && winningNumber && <BettingText>Winning number is {winningNumber.number}</BettingText>}
            </RouletteSmallColumn>
            </RouletteRow>
            <BettingColumn>
                <SmallTableColumn></SmallTableColumn>
                <RouletteTableContainer>
                    
                    <SmallColumn>
                        <div style={{ marginLeft: 'auto' }}>
                            {Zeroes.map((card, index) => {
                                return (
                                    <ZeroesArea card={card} key={index}  allDroppedChips={allDroppedChips} setAllDroppedChips={setAllDroppedChips}/>
                                )
                            })}
                        </div>
                    </SmallColumn>
                    <BigColumn>
                        <Row>
                            {FirstRow.map((card, index) => {
                                return (
                                    <BetNumbersArea key={index}
                                        card={card} allDroppedChips={allDroppedChips} allDroppedCornerChips={allDroppedCornerChips} 
                                       allDroppedBorderLeftChips={allDroppedBorderLeftChips} setAllDroppedBorderLeftChips={setAllDroppedBorderLeftChips} allDroppedBorderTopChips={allDroppedBorderTopChips} setAllDroppedBorderTopChips={setAllDroppedBorderTopChips}
                                    />
                                )
                            })}
                        </Row>
                        <Row>
                            {SecondRow.map((card, index) => {
                                return (
                                    <BetNumbersArea key={index} card={card} allDroppedChips={allDroppedChips} allDroppedCornerChips={allDroppedCornerChips} 
                                    allDroppedBorderLeftChips={allDroppedBorderLeftChips} setAllDroppedBorderLeftChips={setAllDroppedBorderLeftChips} allDroppedBorderTopChips={allDroppedBorderTopChips} setAllDroppedBorderTopChips={setAllDroppedBorderTopChips}
                                    />
                                )
                            })}
                        </Row>
                        <Row>
                            {ThirdRow.map((card, index) => {
                                return (
                                    <BetNumbersArea key={index}
                                    card={card} allDroppedChips={allDroppedChips} allDroppedCornerChips={allDroppedCornerChips} 
                                       allDroppedBorderLeftChips={allDroppedBorderLeftChips} setAllDroppedBorderLeftChips={setAllDroppedBorderLeftChips} allDroppedBorderTopChips={allDroppedBorderTopChips} setAllDroppedBorderTopChips={setAllDroppedBorderTopChips}
                                        
                                    />
                                )
                            })}
                        </Row>
                        <Row>
                            {BetPerRows.map((card, index) => {
                                return (
                                    <BetPerRowsArea card={card} key={index} allDroppedRowChips={allDroppedRowChips} setAllDroppedRowChips={setAllDroppedRowChips}/>
                                )
                            })}
                        </Row>
                        <Row>
                            {LastRow.map((card, index) => {
                                return (
                                    <LastRowArea card={card} key={index} allDroppedLastRowChips={allDroppedLastRowChips} setAllDroppedLastRowChips={setAllDroppedLastRowChips}/>
                                )
                            })}
                        </Row>
                    </BigColumn>
                    <SmallColumn>
                        <div style={{ marginRight: 'auto' }}>
                            {BetPerColumns.map((card, index) => {
                                return (
                                    <BetPerColumnsArea card={card} key={index} allDroppedColumnChips={allDroppedColumnChips} setAllDroppedColumnChips={setAllDroppedColumnChips}/>
                                )
                            })}
                        </div>
                    </SmallColumn>
                   {/*  <BalanceWrapper>
                        <RouletteMainRow><RouletteMainIcon><img src={balanceIcon} alt="placeBet" /></RouletteMainIcon><BalanceDisplayBig balance={balance}/></RouletteMainRow>
                        <RouletteMainRow><RouletteMainIcon><img src={placeBet} alt="placeBet" /></RouletteMainIcon><PlacedBetDisplayBig placedBet={placedBet}/></RouletteMainRow>
                        <RouletteMainRow><RouletteMainIcon><img src={roulette} alt="placeBet" /></RouletteMainIcon><NumbersBetDisplayBig allBets={allBets}/></RouletteMainRow>
                </BalanceWrapper>
                <PlayerBetsWrapper>
                        {allBets && Object.entries(allBets).map(([key, valueArray]) => {
                            return valueArray.map((bet, index) => (
                                <BetNumberHolder>
                                    <BetNumber>
                                    <NumberWrapper>{key}</NumberWrapper>
                                    </BetNumber>
                                    <BetAmount></BetAmount>
                                    <BetAmount></BetAmount>
                                    <p>Amount: {bet.amount}</p>
                                    <p>Number: {bet.number}</p>
                                    <p>Bet Type: {bet.typeofBet}</p>
                                </BetNumberHolder>
                            ));
                        })}
                </PlayerBetsWrapper>
                <LatestRolls>
                        {latestNumbers?.map((number) => {
                            return(
                                <NumberWrapper style={{background: `${number.color}`}}>{number.number}</NumberWrapper>
                            )
                        })}
                    </LatestRolls> */}
                </RouletteTableContainer>
                <SmallTableColumn></SmallTableColumn>
                
            
            </BettingColumn>
            <RouletteTable setPlaceBets={setPlaceBets} placeBets={placeBets} activeRoom={activeRoom} myId={myId} socket={socket}
            placedBet={placedBet} setPlacedBet={setPlacedBet} allBets={allBets} setAllBets={setAllBets}
            droppedChips={droppedChips} setDroppedChips={setDroppedChips} droppedCornerChips={droppedCornerChips} setDroppedCornerChips={setDroppedCornerChips}
            droppedRowChips={droppedRowChips} setDroppedRowChips={setDroppedRowChips} droppedLastRowChips={droppedLastRowChips} setDroppedLastRowChips={setDroppedLastRowChips}
            droppedColumnChips={droppedColumnChips} setDroppedColumnChips={setDroppedColumnChips} droppedBorderLeftChips={droppedBorderLeftChips} lastBet={lastBet} setLastBet={setLastBet}
            setDroppedBorderLeftChips={setDroppedBorderLeftChips} droppedBorderTopChips={droppedBorderTopChips} setDroppedBorderTopChips={setDroppedBorderTopChips}/>
      </RouletteSection>
    );
}

export default Roulette
