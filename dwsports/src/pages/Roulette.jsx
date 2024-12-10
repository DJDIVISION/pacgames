import React, { useState, useRef, useEffect } from 'react'
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import {
    RouletteSection, RouletteColumn, RouletteContainer, BettingColumn, NumberCard, Wheel, Span, SpinButton, Number, NumberSpan,
    RouletteTableContainer, BigNumberHolder, RouletteSmallColumn, RouletteRow, ChatRoomIcon, StyledAbsolute, LatestRolls, NumberWrapper,
    SmallTableColumnRight, RouletteMainRow, RouletteMainIcon, PlayerBetsWrapper, BetNumberHolder, BetAmount, BetNumber,
    BetHolder, Row, SmallTableColumn, BetsWrapper, BetsBalances, SmallNumberWrapper,
    BottomContainerRow,
    SmallIconHolder,
    BigNumberContainer,
    BigWinningsContainer
} from './indexTwo'
import { ButtonHoverAbsoluteLeft, BettingText, SmallColumn, BigColumn, ArrowLeft } from './index'
import { io } from "socket.io-client";
import { RouletteWrapper, Selector } from './indexTwo'
import { Button } from '@mui/material';
import Ton from '../assets/logos/ton.png'
import { FirstRowNoZeroes, SecondRowNoZeroes, ThirdRow, BetPerRows, LastRow, Zeroes, BetPerColumns } from './fakeData'
import RouletteTabs from '../components/roulette/RouletteTabs';
import RouletteTable from '../components/roulette/RouletteTable';
import { americanRouletteNumbers, BalanceDisplay, NumbersBetDisplay, PlacedBetDisplay, WinningsDisplay } from './functions';
import RouletteChatMessages from '../components/chats/RouletteChatMessages';
import { FoldIcon, UnfoldIcon } from '../components/chats';
import { supabase } from '../supabase/client';
import { message } from 'antd';
import { BalanceDisplayBig, PlacedBetDisplayBig, NumbersBetDisplayBig } from './functions';
import placeBet from '../assets/chips/placeBet.png'
import balanceIcon from '../assets/chips/balance-bag.png'
import chips from '../assets/chips/poker-chips.png'
import roulette from '../assets/chips/roulette.png'
import { ZeroesArea, BetNumbersArea, BetPerColumnsArea, BetPerRowsArea, LastRowArea } from '../components/roulette/functions';
import spin1 from '../assets/sounds/spin2.ogg'
import noMoreBets from '../assets/sounds/noMoreBets.ogg'
import chipSound from '../assets/sounds/chipSound.ogg'
import S0 from '../assets/sounds/0.ogg'
import S1 from '../assets/sounds/1.ogg'
import S2 from '../assets/sounds/2.ogg'
import S3 from '../assets/sounds/3.ogg'
import S4 from '../assets/sounds/4.ogg'
import S5 from '../assets/sounds/5.ogg'
import S6 from '../assets/sounds/6.ogg'
import S7 from '../assets/sounds/7.ogg'
import S8 from '../assets/sounds/8.ogg'
import S9 from '../assets/sounds/9.ogg'
import S10 from '../assets/sounds/10.ogg'
import S11 from '../assets/sounds/11.ogg'
import S12 from '../assets/sounds/12.ogg'
import S13 from '../assets/sounds/13.ogg'
import S14 from '../assets/sounds/14.ogg'
import S15 from '../assets/sounds/15.ogg'
import S16 from '../assets/sounds/16.ogg'
import S17 from '../assets/sounds/17.ogg'
import S18 from '../assets/sounds/18.ogg'
import S19 from '../assets/sounds/19.ogg'
import S20 from '../assets/sounds/20.ogg'
import S21 from '../assets/sounds/21.ogg'
import S22 from '../assets/sounds/22.ogg'
import S23 from '../assets/sounds/23.ogg'
import S24 from '../assets/sounds/24.ogg'
import S25 from '../assets/sounds/25.ogg'
import S26 from '../assets/sounds/26.ogg'
import S27 from '../assets/sounds/27.ogg'
import S28 from '../assets/sounds/28.ogg'
import S29 from '../assets/sounds/29.ogg'
import S30 from '../assets/sounds/30.ogg'
import S31 from '../assets/sounds/31.ogg'
import S32 from '../assets/sounds/32.ogg'
import S33 from '../assets/sounds/33.ogg'
import S34 from '../assets/sounds/34.ogg'
import S35 from '../assets/sounds/35.ogg'
import S36 from '../assets/sounds/36.ogg'
import S00 from '../assets/sounds/00.ogg'
import youWin from '../assets/sounds/youWin.ogg'
import youLose from '../assets/sounds/youLose.ogg'
import placeYourBet from '../assets/sounds/placeYourBet.ogg'
import { RouletteState } from '../context/RouletteContext';
import { animationFive,transition as transitionMain } from '../animations';





/* const socket = io.connect("http://localhost:8080") */

const Roulette = () => {

    const totalNumbers = americanRouletteNumbers.length;
    const degreesPerSegment = 360 / totalNumbers;
    const adjustmentRotation = degreesPerSegment * -2;
    const [rotationDegrees, setRotationDegrees] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [playOnline, setPlayOnline] = useState(false)
    const [players, setPlayers] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [playerName, setPlayerName] = useState(null);
    const [playerAvatar, setPlayerAvatar] = useState(null);
    const [placeBets, setPlaceBets] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [seconds, setSeconds] = useState(null);
    const intervalRef = useRef(null);
    const [timeOutStarted, setTimeOutStarted] = useState(false)
    const [allDroppedChips, setAllDroppedChips] = useState({});
    const [allDroppedCornerChips, setAllDroppedCornerChips] = useState({});
    const [allDroppedRowChips, setAllDroppedRowChips] = useState({});
    const [allDroppedLastRowChips, setAllDroppedLastRowChips] = useState({});
    const [allDroppedColumnChips, setAllDroppedColumnChips] = useState({});
    const [allDroppedBorderLeftChips, setAllDroppedBorderLeftChips] = useState({});
    const [allDroppedBorderTopChips, setAllDroppedBorderTopChips] = useState({});
    const {lastBet, setLastBet} = RouletteState();
    const { balance, setBalance } = RouletteState();
    const {placedBet, setPlacedBet} = RouletteState();
    const {myId, setMyId} = RouletteState();
    const {winningNumber, setWinningNumber} = RouletteState();
    const {latestNumbers, setLatestNumbers} = RouletteState();
    const {allBets, setAllBets} = RouletteState();
    const {activeRoom, setActiveRoom} = RouletteState();
    const {showMotionDiv, setShowMotionDiv} = RouletteState();
    const {winnings, setWinnings} = RouletteState();
    const {droppedChips, setDroppedChips} = RouletteState();
    const {droppedCornerChips, setDroppedCornerChips} = RouletteState();
    const {droppedRowChips, setDroppedRowChips} = RouletteState();
    const {droppedLastRowChips, setDroppedLastRowChips} = RouletteState();
    const {droppedColumnChips, setDroppedColumnChips} = RouletteState();
    const {droppedBorderLeftChips, setDroppedBorderLeftChips} = RouletteState();
    const {droppedBorderTopChips, setDroppedBorderTopChips} = RouletteState();

    const [activeNumbers, setActiveNumbers] = useState([]);
    const soundEffectsRef = useRef([]);
    const [effectsVolume, setEffectsVolume] = useState(0.8);
    const [allowEffects, setAllowEffects] = useState(true);
    const [allowFinish, setAllowFinish] = useState(false)
    const [playerFolds, setPlayerFolds] = useState(false)


    useEffect(() => {
        soundEffectsRef.current = [
          new Audio(S0), 
          new Audio(S1),
          new Audio(S2),
          new Audio(S3),
          new Audio(S4),
          new Audio(S5),
          new Audio(S6),
          new Audio(S7),
          new Audio(S8),
          new Audio(S9),
          new Audio(S10),
          new Audio(S11),
          new Audio(S12),
          new Audio(S13),
          new Audio(S14),
          new Audio(S15),
          new Audio(S16),
          new Audio(S17),
          new Audio(S18),
          new Audio(S19),
          new Audio(S20),
          new Audio(S21),
          new Audio(S22),
          new Audio(S23),
          new Audio(S24),
          new Audio(S25),
          new Audio(S26),
          new Audio(S27),
          new Audio(S28),
          new Audio(S29),
          new Audio(S30),
          new Audio(S31),
          new Audio(S32),
          new Audio(S33),
          new Audio(S34),
          new Audio(S35),
          new Audio(S36),
          new Audio(noMoreBets),
          new Audio(spin1),
          new Audio(chipSound),
          new Audio(youWin),
          new Audio(youLose),
          new Audio(placeYourBet),
          new Audio(S00),
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

      const playEffect = (effectIndex) => {
        if (allowEffects) {
          soundEffectsRef.current[effectIndex].play();
        }
      };


    const startCountdown = () => {
        let countdownTime = 20;
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
        if (!gameStarted) {
            setPlaceBets(!placeBets)
        } else {
            message.error("There is a game in progress!")
        }
    }

    const sendAdminMessage = async (messageToUpdate) => {
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
        if (allDroppedChips) {
            const droppedChipsKeys = Object.keys(allDroppedChips);
            droppedChipsKeys.forEach((chip) => {
                console.log(chip)
                const number = parseInt(chip)
                setActiveNumbers((prevActiveNumbers) => [
                    ...new Set([...prevActiveNumbers, number]),
                ]);

            })
        }
        if (allDroppedCornerChips) {
            const droppedChipsValues = Object.values(allDroppedCornerChips);
            droppedChipsValues.forEach((value) => {
                value.forEach((number) => {
                    setActiveNumbers((prevActiveNumbers) => [
                        ...new Set([...prevActiveNumbers, number.numberId]),
                    ]);
                })
            })
        }
        if (allDroppedRowChips) {
            const droppedChipsValues = Object.values(allDroppedRowChips);
            droppedChipsValues.forEach((value) => {
                value.forEach((number) => {
                    setActiveNumbers((prevActiveNumbers) => [
                        ...new Set([...prevActiveNumbers, number.numberId]),
                    ]);
                })
            })
        }
        if (allDroppedLastRowChips) {
            const droppedChipsValues = Object.values(allDroppedLastRowChips);
            droppedChipsValues.forEach((value) => {
                value.forEach((number) => {
                    setActiveNumbers((prevActiveNumbers) => [
                        ...new Set([...prevActiveNumbers, number.numberId]),
                    ]);
                })
            })
        }
        if (allDroppedColumnChips) {
            const droppedChipsValues = Object.values(allDroppedColumnChips);
            droppedChipsValues.forEach((value) => {
                value.forEach((number) => {
                    setActiveNumbers((prevActiveNumbers) => [
                        ...new Set([...prevActiveNumbers, number.numberId]),
                    ]);
                })
            })
        }
        if (allDroppedBorderLeftChips) {
            const droppedChipsValues = Object.values(allDroppedBorderLeftChips);
            droppedChipsValues.forEach((value) => {
                value.forEach((number) => {
                    setActiveNumbers((prevActiveNumbers) => [
                        ...new Set([...prevActiveNumbers, number.numberId]),
                    ]);
                })
            })
        }
        if (allDroppedBorderTopChips) {
            const droppedChipsValues = Object.values(allDroppedBorderTopChips);
            droppedChipsValues.forEach((value) => {
                value.forEach((number) => {
                    setActiveNumbers((prevActiveNumbers) => [
                        ...new Set([...prevActiveNumbers, number.numberId]),
                    ]);
                })
            })
        }

    }, [allDroppedChips, allDroppedCornerChips, allDroppedRowChips, allDroppedLastRowChips, allDroppedColumnChips, allDroppedBorderLeftChips, allDroppedBorderTopChips])
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
        if(winningNumber){
            spinRoulette();
            setWinnings(null)
            playEffect(37)
            playEffect(38)
        } 
    }, [winningNumber])

    useEffect(() => {
        if(showMotionDiv){
            
            socket.emit("game-finished", { activeRoom, myId, allBets });
                const sound = (winningNumber.number)
                if (sound > 0 && sound <= 36) {
                    playEffect(sound)
                }else if (sound === "00") {
                    playEffect(43)
                }
        } 
    }, [showMotionDiv])

    useEffect(() => {
        if(playerFolds){
            setAllBets([])
            setBalance((prevBalance) => prevBalance + placedBet);
            setPlacedBet(null)
            setDroppedChips({})
            setDroppedCornerChips({})
            setDroppedRowChips({})
            setDroppedLastRowChips({})
            setDroppedColumnChips({})
            setDroppedBorderLeftChips({})
            setDroppedBorderTopChips({})
            setAllDroppedChips({})
            setAllDroppedCornerChips({})
            setAllDroppedRowChips({})
            setAllDroppedLastRowChips({})
            setAllDroppedColumnChips({})
            setAllDroppedBorderLeftChips({})
            setAllDroppedBorderTopChips({})
        }
    }, [playerFolds])

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
            sendAdminMessage(messageToUpdate)
            setTimeout(() => {
                setPlaceBets(true)
                playEffect(42)
                setTimeOutStarted(true)
            }, 10000)
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
            sendAdminMessage(messageToUpdate)
            setTimeout(() => {
                setPlaceBets(true)
                setTimeOutStarted(true)
            }, 10000)
        });
        socket?.on('timeoutStarting', () => {
            setTimeout(() => {
                startCountdown();
            }, 10000)
        });
        socket?.on('game-started', (data) => {
            setGameStarted(true)
            setTimeOutStarted(false)
            setPlaceBets(false)
            const { allDroppedChips, allDroppedCornerChips, allDroppedRowChips, allDroppedLastRowChips, allDroppedColumnChips,
                allDroppedBorderLeftChips, allDroppedBorderTopChips } = data;
            setAllDroppedChips(allDroppedChips)
            setAllDroppedCornerChips(allDroppedCornerChips)
            setAllDroppedRowChips(allDroppedRowChips)
            setAllDroppedLastRowChips(allDroppedLastRowChips)
            setAllDroppedColumnChips(allDroppedColumnChips)
            setAllDroppedBorderLeftChips(allDroppedBorderLeftChips)
            setAllDroppedBorderTopChips(allDroppedBorderTopChips)

        });
        socket?.on('close-betting-table', (data) => {
            const { message, dealer, dealer_avatar, sendedBy } = data;
            const messageToUpdate = {
                message: message,
                playerName: dealer,
                user_avatar: dealer_avatar,
                sendedBy: sendedBy,
                room_id: activeRoom
            }
            sendAdminMessage(messageToUpdate)
            setGameStarted(true)
            setTimeOutStarted(false)
            setPlaceBets(false)
            setPlayerFolds(true)
        });
        socket.on('winning-number', (winningNumber) => {
            setWinningNumber(winningNumber)
            //startRoulette();
        });
        socket.on('message-sent', (data) => {
            const { message, dealer, dealer_avatar, sendedBy } = data;
            const messageToUpdate = {
                message: message,
                playerName: dealer,
                user_avatar: dealer_avatar,
                sendedBy: sendedBy,
                room_id: activeRoom
            }
            sendAdminMessage(messageToUpdate)
        });
        socket.on('player-lost', (data) => {
            setLatestNumbers(prevElements => [...prevElements, data.number]);
            //playEffect(41)
            setGameStarted(false)
            setSpinning(false)
            setAllBets({})
            setPlacedBet(null)
            //setWinningNumber(null)
            setAllDroppedChips({})
            setAllDroppedCornerChips({})
            setAllDroppedRowChips({})
            setAllDroppedLastRowChips({})
            setAllDroppedColumnChips({})
            setAllDroppedBorderLeftChips({})
            setAllDroppedBorderTopChips({})
            setActiveNumbers([])
            setDroppedChips({})
            setDroppedCornerChips({})
            setDroppedRowChips({})
            setDroppedLastRowChips({})
            setDroppedColumnChips({})
            setDroppedBorderLeftChips({})
            setDroppedBorderTopChips({})
            setTimeout(() => {
                playEffect(41)
            }, 3000)
        });
        socket.on('player-wins', (data) => {
            const winnings = data.winnings
            setWinnings((prevWinnings) => prevWinnings + winnings);
            setLatestNumbers(prevElements => [...prevElements, data.number]);
            setBalance((prevBalance) => prevBalance + winnings);
            setGameStarted(false)
            setSpinning(false)
            setAllBets({})
            setPlacedBet(null)
            //setWinningNumber(null)
            setAllDroppedChips({})
            setAllDroppedCornerChips({})
            setAllDroppedRowChips({})
            setAllDroppedLastRowChips({})
            setAllDroppedColumnChips({})
            setAllDroppedBorderLeftChips({})
            setAllDroppedBorderTopChips({})
            setDroppedChips({})
            setDroppedCornerChips({})
            setDroppedRowChips({})
            setDroppedLastRowChips({})
            setDroppedColumnChips({})
            setDroppedBorderLeftChips({})
            setDroppedBorderTopChips({})
            setActiveNumbers([])
            setTimeout(() => {
                playEffect(40)
            }, 3000)
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
            socket.off('player-wins');
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
                setShowMotionDiv(false)
            }, 20000)
        }

    }, [spinning, activeRoom, myId]);

   

    const spinRoulette = () => {
        setSpinning(true);
        const finalRotation = getRotationForNumber(winningNumber);
        setRotationDegrees(finalRotation);
        setTimeout(() => { setSpinning(false); setRotationDegrees(0);setShowMotionDiv(true)}, 10000); 
    };

    const icon = placeBets ? <UnfoldIcon /> : <FoldIcon />

    const item={
        initial: { scale: 0,opacity: 0, x: 0, y: 0 },
        animate: { scale: 1, opacity: 1,x: 0, y: 0, transition: { duration: 0.5 } },
        exit: { scale: 0, opacity: 0, x: 0, y: 0, transition: { duration: 0.5 } }
    }

    let animate = {};
    if(winnings === null) animate = {  top: 'calc(20vh + 60px)', opacity: 0, display: 'none' };
    else if (winnings !== null) animate = {  top: '20vh', opacity: 1 };

    const transition = {
        type: 'tween',
        duration: 0.2
    };

    const NumberCircle = ({ color, number }) => {
        return (
            
                <BigNumberContainer>
                    <BigNumberHolder bgcolor={color}>
                        {number}
                    </BigNumberHolder>
                </BigNumberContainer>
          
        );
    };


    if (!playOnline) {
        return (
            <RouletteTabs socket={socket} rooms={rooms} players={players} playerName={playerName} setPlayerName={setPlayerName} />
        )
    }

    return (
        <motion.div initial="out" animate="in" variants={animationFive} transition={transitionMain}>
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
                                    <NumberSpan key={index} index={index} style={{
                                        color: `${item.color}`, filter: `drop-shadow(0 0 10px aqua)`,
                                        fontWeight: 'bold'
                                    }}>
                                        {item.number}
                                    </NumberSpan>
                                ))}
                            </Number>
                        </Wheel>
                    </RouletteContainer>
                </RouletteColumn>
                <RouletteSmallColumn>
                    <StyledAbsolute onClick={openTable}>{icon}</StyledAbsolute>
                    <BetsWrapper>
                        {allBets && Object.entries(allBets).map(([key, valueArray]) => {
                            return valueArray.map((bet, index) => (
                                <BetHolder>
                                    <BetNumberHolder>

                                        <NumberWrapper style={{ background: `${bet.color}` }}>{key}</NumberWrapper>

                                    </BetNumberHolder>
                                    <BetAmount>${bet.amount}</BetAmount>
                                    <BetAmount>{bet.typeofBet}</BetAmount>
                                </BetHolder>
                            ));
                        })}
                    </BetsWrapper>
                    <BetsBalances>
                        <BottomContainerRow>
                            <SmallIconHolder><img src={balanceIcon} alt="balance" /></SmallIconHolder>
                            <BalanceDisplay balance={balance} />
                        </BottomContainerRow>
                        <BottomContainerRow>
                            <SmallIconHolder><img src={chips} alt="balance" /></SmallIconHolder>
                            <PlacedBetDisplay placedBet={placedBet} />
                        </BottomContainerRow>
                        <BottomContainerRow>
                            <SmallIconHolder><img src={roulette} alt="balance" /></SmallIconHolder>
                            <NumbersBetDisplay allBets={allBets} />
                        </BottomContainerRow>
                    </BetsBalances>
                </RouletteSmallColumn>
            </RouletteRow>
            <BettingColumn>
                <SmallTableColumn>
                    {latestNumbers?.map(el => {
                        return (
                            <SmallNumberWrapper style={{ background: `${el.color}` }}>{el.number}</SmallNumberWrapper>
                        )
                    })}
                </SmallTableColumn>
                <RouletteTableContainer>

                    <SmallColumn>
                        <div style={{ marginLeft: 'auto' }}>
                            {Zeroes.map((card, index) => {
                                return (
                                    <ZeroesArea card={card} key={index} allDroppedChips={allDroppedChips} setAllDroppedChips={setAllDroppedChips} />
                                )
                            })}
                        </div>
                    </SmallColumn>
                    <BigColumn>
                        <Row>
                            {FirstRowNoZeroes.map((card, index) => {
                                return (
                                    <BetNumbersArea key={index} activeNumbers={activeNumbers}
                                        card={card} allDroppedChips={allDroppedChips} allDroppedCornerChips={allDroppedCornerChips}
                                        allDroppedBorderLeftChips={allDroppedBorderLeftChips} setAllDroppedBorderLeftChips={setAllDroppedBorderLeftChips} allDroppedBorderTopChips={allDroppedBorderTopChips} setAllDroppedBorderTopChips={setAllDroppedBorderTopChips}
                                    />
                                )
                            })}
                        </Row>
                        <Row>
                            {SecondRowNoZeroes.map((card, index) => {
                                return (
                                    <BetNumbersArea activeNumbers={activeNumbers} key={index} card={card} allDroppedChips={allDroppedChips} allDroppedCornerChips={allDroppedCornerChips}
                                        allDroppedBorderLeftChips={allDroppedBorderLeftChips} setAllDroppedBorderLeftChips={setAllDroppedBorderLeftChips} allDroppedBorderTopChips={allDroppedBorderTopChips} setAllDroppedBorderTopChips={setAllDroppedBorderTopChips}
                                    />
                                )
                            })}
                        </Row>
                        <Row>
                            {ThirdRow.map((card, index) => {
                                return (
                                    <BetNumbersArea key={index} activeNumbers={activeNumbers}
                                        card={card} allDroppedChips={allDroppedChips} allDroppedCornerChips={allDroppedCornerChips}
                                        allDroppedBorderLeftChips={allDroppedBorderLeftChips} setAllDroppedBorderLeftChips={setAllDroppedBorderLeftChips} allDroppedBorderTopChips={allDroppedBorderTopChips} setAllDroppedBorderTopChips={setAllDroppedBorderTopChips}

                                    />
                                )
                            })}
                        </Row>
                        <Row>
                            {BetPerRows.map((card, index) => {
                                return (
                                    <BetPerRowsArea card={card} key={index} allDroppedRowChips={allDroppedRowChips} setAllDroppedRowChips={setAllDroppedRowChips} />
                                )
                            })}
                        </Row>
                        <Row>
                            {LastRow.map((card, index) => {
                                return (
                                    <LastRowArea card={card} key={index} allDroppedLastRowChips={allDroppedLastRowChips} setAllDroppedLastRowChips={setAllDroppedLastRowChips} />
                                )
                            })}
                        </Row>
                    </BigColumn>
                    <SmallColumn>
                        <div style={{ marginRight: 'auto' }}>
                            {BetPerColumns.map((card, index) => {
                                return (
                                    <BetPerColumnsArea card={card} key={index} allDroppedColumnChips={allDroppedColumnChips} setAllDroppedColumnChips={setAllDroppedColumnChips} />
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
                <SmallTableColumnRight>
                    <AnimatePresence>
                        {showMotionDiv && (
                            <>
                                <motion.div variants={item}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit">
                                    <NumberCircle color={winningNumber.color} number={winningNumber.number} />
                                </motion.div>
                                
                            </>
                        )}
                        {seconds && (
                            <>
                                <motion.div variants={item}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit">
                                    <BigNumberContainer>
                                        <BigNumberHolder style={{ background: seconds > 3 ? 'green' : 'red' }}>
                                            {seconds}
                                        </BigNumberHolder>
                                    </BigNumberContainer>
                                </motion.div>
                                
                            </>
                        )}
                        <motion.div animate={animate} transition={transition} className='winningsContainer'>
                            <WinningsDisplay winnings={winnings} />
                        </motion.div>
                        
                    </AnimatePresence>
                </SmallTableColumnRight>


            </BettingColumn>
            <RouletteTable setPlaceBets={setPlaceBets} placeBets={placeBets}  socket={socket} playEffect={playEffect}/>
        </RouletteSection>
        </motion.div>
    );
}

export default Roulette
