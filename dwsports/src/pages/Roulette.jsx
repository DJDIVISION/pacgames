import React, { useState, useRef, useEffect } from 'react'
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import {
    RouletteSection, RouletteColumn, RouletteContainer, BettingColumn, NumberCard, Wheel, Span, SpinButton, Number, NumberSpan,
    RouletteTableContainer, BigNumberHolder, RouletteSmallColumn, RouletteRow, ChatRoomIcon, StyledAbsolute, LatestRolls, NumberWrapper,
    SmallTableColumnRight, RouletteMainRow, RouletteMainIcon, PlayerBetsWrapper, BetNumberHolder, BetAmount, BetNumber,
    BetHolder, Row, SmallTableColumn, BetsWrapper, BetsBalances, SmallNumberWrapper,
    BottomContainerRow,
    SmallIconHolder
} from './indexTwo'
import { ButtonHoverAbsoluteLeft, BettingText, SmallColumn, BigColumn } from './index'
import { io } from "socket.io-client";
import { RouletteWrapper, Selector } from './indexTwo'
import { Button } from '@mui/material';
import Ton from '../assets/logos/ton.png'
import { FirstRow, SecondRow, ThirdRow, BetPerRows, LastRow, Zeroes, BetPerColumns, LatestNumbers } from './fakeData'
import RouletteTabs from '../components/roulette/RouletteTabs';
import RouletteTable from '../components/roulette/RouletteTable';
import { americanRouletteNumbers, BalanceDisplay, NumbersBetDisplay, PlacedBetDisplay } from './functions';
import RouletteChatMessages from '../components/chats/RouletteChatMessages';
import { FoldIcon, UnfoldIcon } from '../components/chats';
import { supabase } from '../supabase/client';
import { message } from 'antd';
import { BalanceDisplayBig, PlacedBetDisplayBig, NumbersBetDisplayBig } from './functions';
import placeBet from '../assets/chips/placeBet.png'
import balanceIcon from '../assets/chips/balance-bag.png'
import chips from '../assets/chips/poker-chips.png'
import roulette from '../assets/chips/roulette.png'
import { BetState } from '../context/BetsContext';
import { ZeroesArea, BetNumbersArea, BetPerColumnsArea, BetPerRowsArea, LastRowArea } from '../components/roulette/functions';



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
    const {placedBet, setPlacedBet} = BetState();
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
    const { balance, setBalance } = BetState();
    const [latestNumbers, setLatestNumbers] = useState(LatestNumbers)
    const [activeNumbers, setActiveNumbers] = useState([]);
    const [showMotionDiv, setShowMotionDiv] = useState(false);





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
        if (!gameStarted) {
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
        if (allDroppedChips) {
            const droppedChipsKeys = Object.keys(allDroppedChips);
            droppedChipsKeys.forEach((chip) => {
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

    console.log(droppedChips)
    console.log(droppedCornerChips)
    console.log(droppedBorderTopChips)
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
            sendAmdminMessage(messageToUpdate)
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
            sendAmdminMessage(messageToUpdate)
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
            sendAmdminMessage(messageToUpdate)
            setGameStarted(true)
            setTimeOutStarted(false)
            setPlaceBets(false)
            setAllBets([])
            setBalance((prevBalance) => prevBalance + placedBet);

            //setPlacedBet(null)
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
        });
        socket.on('winning-number', (winningNumber) => {
            const number = winningNumber.number
            spinRoulette(winningNumber, activeRoom, myId);
            setWinningNumber(winningNumber)
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
            sendAmdminMessage(messageToUpdate)
        });
        socket.on('player-lost', (data) => {
            setLatestNumbers(prevElements => [...prevElements, data.number]);
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
        });
        socket.on('player-wins', (data) => {
            const winnings = data.winnings
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
                socket.emit("game-finished", { activeRoom, myId, allBets });
                setShowMotionDiv(false)
            }, 20000)
        }
    }, [spinning, activeRoom, myId]);

    const spinRoulette = (winningNumber) => {
        setSpinning(true);
        const finalRotation = getRotationForNumber(winningNumber);
        setRotationDegrees(finalRotation);
        setTimeout(() => { setSpinning(false); setRotationDegrees(0);setShowMotionDiv(true) }, 10000); // 10 seconds
    };

    const icon = placeBets ? <UnfoldIcon /> : <FoldIcon />

    const item={
        initial: { scale: 0,opacity: 0, x: 0, y: 0 },
        animate: { scale: 1, opacity: 1,x: 0, y: 0, transition: { duration: 0.5 } },
        exit: { scale: 0, opacity: 0, x: 0, y: 0, transition: { duration: 0.5 } }
    }

    const NumberCircle = ({ color, number }) => {
        return (
          <BigNumberHolder bgColor={color}>
            {number}
          </BigNumberHolder>
        );
      };

    if (!playOnline) {
        return (
            <RouletteTabs socket={socket} rooms={rooms} players={players} playerName={playerName} setPlayerName={setPlayerName} />
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
                    {latestNumbers.map(el => {
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
                            {FirstRow.map((card, index) => {
                                return (
                                    <BetNumbersArea key={index} activeNumbers={activeNumbers}
                                        card={card} allDroppedChips={allDroppedChips} allDroppedCornerChips={allDroppedCornerChips}
                                        allDroppedBorderLeftChips={allDroppedBorderLeftChips} setAllDroppedBorderLeftChips={setAllDroppedBorderLeftChips} allDroppedBorderTopChips={allDroppedBorderTopChips} setAllDroppedBorderTopChips={setAllDroppedBorderTopChips}
                                    />
                                )
                            })}
                        </Row>
                        <Row>
                            {SecondRow.map((card, index) => {
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
                            <motion.div variants={item}
                            initial="initial"
                            animate="animate"
                            exit="exit">
                            <NumberCircle color={winningNumber.color} number={winningNumber.number} />
                            {/* {Object.values(winningNumber).map((item) => {
                                console.log(item)
                                return(
                                    <BigNumberHolder style={{background: ``}}>

                                    </BigNumberHolder>
                                )
                            })} */}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </SmallTableColumnRight>


            </BettingColumn>
            <RouletteTable setPlaceBets={setPlaceBets} placeBets={placeBets} activeRoom={activeRoom} myId={myId} socket={socket}
                 allBets={allBets} setAllBets={setAllBets} latestNumbers={latestNumbers}
                droppedChips={droppedChips} setDroppedChips={setDroppedChips} droppedCornerChips={droppedCornerChips} setDroppedCornerChips={setDroppedCornerChips}
                droppedRowChips={droppedRowChips} setDroppedRowChips={setDroppedRowChips} droppedLastRowChips={droppedLastRowChips} setDroppedLastRowChips={setDroppedLastRowChips}
                droppedColumnChips={droppedColumnChips} setDroppedColumnChips={setDroppedColumnChips} droppedBorderLeftChips={droppedBorderLeftChips} lastBet={lastBet} setLastBet={setLastBet}
                setDroppedBorderLeftChips={setDroppedBorderLeftChips} droppedBorderTopChips={droppedBorderTopChips} setDroppedBorderTopChips={setDroppedBorderTopChips} />
        </RouletteSection>
    );
}

export default Roulette
