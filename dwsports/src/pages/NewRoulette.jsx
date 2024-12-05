import React, {useState,useRef,useEffect} from 'react'
import styled from 'styled-components'
import { motion,AnimatePresence } from 'framer-motion'
import { IconButton } from '@mui/material'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Ton from '../assets/logos/ton.png'
import {LatestNumbers,LeagueRowBets,ArrowDown,ArrowUp,AbsoluteIconButton,Title,Section,Container,SmallNumberWrapper,FirstColumn,ChipsHolder,ZeroRowBets,
    ColumnBets,EmptySpace,ColumnHolder,HalfZeroRowBets,WheelContainer,TableContainer,RouletteContainer,Wheel,SpinButton,Span,Number,NumberSpan,BallHolder,
    BigNumberContainer,BetsHolder,BetHolder,BetNumberHolder,NumberWrapper,BetAmount,AbsoluteIconButtonLeft,ChatRoomIcon,MessagesWrapper,ChatInputWrapper,BalanceHolder,
    ZeroHolder,
    BalanceColumn,
    RouletteBalance,
    SendBetContainer} from './indexFour'
import { FirstRowNoZeroes, SecondRowNoZeroes, ThirdRow, BetPerRows, LastRow, Zeroes, BetPerColumns, americanRouletteNumbers, SecondRow, FirstRow } from './fakeData'
import { BetNumbersArea, BetPerColumnsArea, BetPerRowsArea, LastRowArea, ZeroesArea } from './functionsTwo';
import ChipsTwo from '../components/roulette/ChipsTwo.jsx';
import { io } from "socket.io-client";
import { DndContext } from '@dnd-kit/core';
import { TouchSensor, MouseSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { RouletteState } from '../context/RouletteContext.jsx';
import { FantasyState } from '../context/FantasyContext.jsx';
import { BalanceDisplay, NumbersBetDisplay, PlacedBetDisplay, useAuth } from './functions.jsx';
import spin1 from '../assets/sounds/spin2.ogg'
import balanceIcon from '../assets/chips/balance-bag.png'
import chips from '../assets/chips/poker-chips.png'
import roulette from '../assets/chips/roulette.png'
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
import back20 from '../assets/backs/back20.jpg'
import back21 from '../assets/backs/back21.avif'
import { useNavigate } from 'react-router-dom';
import { DisplayHolder, SmallIconHolder } from './indexTwo.jsx';
import { message as ANTDmessage } from 'antd';
import { ArrowLeftRelative, StyledButton } from './index.jsx';

const socket = io.connect("https://pacgames-roulette-server.onrender.com")

const Roulete = () => {

    const [openTableMenu, setOpenTableMenu] = useState(true)
    const [openChatMenu, setOpenChatMenu] = useState(false)
    const [openRouletteMenu, setOpenRouletteMenu] = useState(false)
    const [isDateExpanded, setIsDateExpanded] = useState(true)
    const [latestNumbers, setLatestNumbers] = useState(LatestNumbers)
    const [allDroppedChips, setAllDroppedChips] = useState({});
    const [allDroppedCornerChips, setAllDroppedCornerChips] = useState({});
    const [allDroppedRowChips, setAllDroppedRowChips] = useState({});
    const [allDroppedLastRowChips, setAllDroppedLastRowChips] = useState({});
    const [allDroppedColumnChips, setAllDroppedColumnChips] = useState({});
    const [allDroppedBorderLeftChips, setAllDroppedBorderLeftChips] = useState({});
    const [allDroppedBorderTopChips, setAllDroppedBorderTopChips] = useState({});
    const [activeNumbers, setActiveNumbers] = useState([]);
    const [rotationDegrees, setRotationDegrees] = useState(0);
    const scrollableDivRef = useRef(null);
    const navigate = useNavigate();
    const intervalRef = useRef(null);
    const [seconds, setSeconds] = useState(null);
    const [allBets, setAllBets] = useState({})
    const [activeRoom, setActiveRoom] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [activeContainer, setActiveContainer] = useState(null)
    const {placedBet, setPlacedBet} = RouletteState();
    const {lastBet, setLastBet} = RouletteState();
    const {myId, setMyId} = RouletteState();
    const {balance, setBalance} = FantasyState();
    const { user } = useAuth(); 
    const [allowEffects, setAllowEffects] = useState(true);
    const [effectsVolume, setEffectsVolume] = useState(0.8);
    const soundEffectsRef = useRef([]);
    const {droppedChips, setDroppedChips} = RouletteState();
    const {droppedCornerChips, setDroppedCornerChips} = RouletteState();
    const {droppedRowChips, setDroppedRowChips} = RouletteState();
    const {droppedLastRowChips, setDroppedLastRowChips} = RouletteState();
    const {droppedColumnChips, setDroppedColumnChips} = RouletteState();
    const {droppedBorderLeftChips, setDroppedBorderLeftChips} = RouletteState();
    const {droppedBorderTopChips, setDroppedBorderTopChips} = RouletteState();
    const {droppedChipsLast, setDroppedChipsLast} = RouletteState();
    const {droppedCornerChipsLast, setDroppedCornerChipsLast} = RouletteState();
    const {droppedRowChipsLast, setDroppedRowChipsLast} = RouletteState();
    const {droppedLastRowChipsLast, setDroppedLastRowChipsLast} = RouletteState();
    const {droppedColumnChipsLast, setDroppedColumnChipsLast} = RouletteState();
    const {droppedBorderLeftChipsLast, setDroppedBorderLeftChipsLast} = RouletteState();
    const {droppedBorderTopChipsLast, setDroppedBorderTopChipsLast} = RouletteState();
    const [playerAvatar, setPlayerAvatar] = useState("https://lh3.googleusercontent.com/a/ACg8ocLECQcSdS5Tc1zKpfviRv5Mr7cY4IeOunMK0Z9-dpbtJUvGsdgf=s96-c");
    const [playerName, setPlayerName] = useState("Victor Ramirez");
    const [placeBets, setPlaceBets] = useState(false)
    const [timeOutStarted, setTimeOutStarted] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [playerFolds, setPlayerFolds] = useState(false)
    const {winningNumber, setWinningNumber} = RouletteState();
    const {winnings, setWinnings} = RouletteState();
    const [spinning, setSpinning] = useState(false);
    const totalNumbers = americanRouletteNumbers.length;
    const {showMotionDiv, setShowMotionDiv} = RouletteState();
    const [lastBetAmount,setLastBetAmount] = useState(null)

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
        if (droppedChips) {
            const droppedChipsKeys = Object.keys(droppedChips);
            droppedChipsKeys.forEach((chip) => {
                const number = parseInt(chip)
                setActiveNumbers((prevActiveNumbers) => [
                    ...new Set([...prevActiveNumbers, number]),
                ]);

            })
        }
        if (droppedCornerChips) {
            const droppedChipsValues = Object.values(droppedCornerChips);
            droppedChipsValues.forEach((value) => {
                value.forEach((number) => {
                    setActiveNumbers((prevActiveNumbers) => [
                        ...new Set([...prevActiveNumbers, number.numberId]),
                    ]);
                })
            })
        }
        if (droppedRowChips) {
            const droppedChipsValues = Object.values(droppedRowChips);
            droppedChipsValues.forEach((value) => {
                value.forEach((number) => {
                    setActiveNumbers((prevActiveNumbers) => [
                        ...new Set([...prevActiveNumbers, number.numberId]),
                    ]);
                })
            })
        }
        if (droppedLastRowChips) {
            const droppedChipsValues = Object.values(droppedLastRowChips);
            droppedChipsValues.forEach((value) => {
                value.forEach((number) => {
                    setActiveNumbers((prevActiveNumbers) => [
                        ...new Set([...prevActiveNumbers, number.numberId]),
                    ]);
                })
            })
        }
        if (droppedColumnChips) {
            const droppedChipsValues = Object.values(droppedColumnChips);
            droppedChipsValues.forEach((value) => {
                value.forEach((number) => {
                    setActiveNumbers((prevActiveNumbers) => [
                        ...new Set([...prevActiveNumbers, number.numberId]),
                    ]);
                })
            })
        }
        if (droppedBorderLeftChips) {
            const droppedChipsValues = Object.values(droppedBorderLeftChips);
            droppedChipsValues.forEach((value) => {
                value.forEach((number) => {
                    setActiveNumbers((prevActiveNumbers) => [
                        ...new Set([...prevActiveNumbers, number.numberId]),
                    ]);
                })
            })
        }
        if (droppedBorderTopChips) {
            const droppedChipsValues = Object.values(droppedBorderTopChips);
            droppedChipsValues.forEach((value) => {
                value.forEach((number) => {
                    setActiveNumbers((prevActiveNumbers) => [
                        ...new Set([...prevActiveNumbers, number.numberId]),
                    ]);
                })
            })
        }

    }, [droppedChips, droppedCornerChips, droppedRowChips, droppedLastRowChips, droppedColumnChips, droppedBorderLeftChips, droppedBorderTopChips])

    useEffect(() => {
        const allRows = FirstRowNoZeroes.concat(SecondRowNoZeroes).concat(ThirdRow).concat(Zeroes)
        if(activeContainer !== null){
            if(typeof activeContainer === 'string' && ['first', 'last', 'EVEN', 'ODD', 'black', 'red'].some(prefix => activeContainer.startsWith(prefix))){
                const filter = LastRow.filter(el => el.id === activeContainer);
                const numbers = filter[0]?.numbers || [];
                setActiveNumbers(numbers); 
            } else if(typeof activeContainer === 'string' && activeContainer.startsWith('column')){
                const filter = BetPerColumns.filter(el => el.id === activeContainer);
                const numbers = filter[0]?.numbers || [];
                setActiveNumbers(numbers); 
            } else if(typeof activeContainer === 'string' && ['1', '2', '3'].some(prefix => activeContainer.startsWith(prefix))){
                const filter = BetPerRows.filter(el => el.name === activeContainer);
                const numbers = filter[0]?.numbers || [];
                setActiveNumbers(numbers); 
            }  else if(typeof activeContainer === 'string' && activeContainer.startsWith('border')){
                const filter = allRows.filter(el => el.borderTopId === activeContainer);
                const numbers = filter[0]?.borderTop || [];
                setActiveNumbers(numbers); 
            }  else if(typeof activeContainer === 'string' && activeContainer.startsWith('split')){
                const filter = allRows.filter(el => el.borderLeftId === activeContainer);
                console.log("filter",filter)
                const numbers = filter[0]?.borderLeft || [];
                setActiveNumbers(numbers); 
            }  else if(typeof activeContainer === 'string' && activeContainer.startsWith('corner')){
                const filter = allRows.filter(el => el.cornerLeftId === activeContainer);
                const numbers = filter[0]?.cornerLeft || [];
                setActiveNumbers(numbers); 
            } 
        } else {
            setActiveNumbers([])
        }
    }, [activeContainer])

    

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

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor, {
          activationConstraint: {
            distance: 10, // Start dragging after 10px of movement
          },
        })
    );

    /* useEffect(() => {
        startCountdown();
    }, []) */

    useEffect(() => {
        scrollableDivRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [latestNumbers]);

    const item = {
        initial: { opacity: 0, y: '-100vh' },
        animate: { opacity: 1, y: 0},
        exit: { opacity: 0,y: '-100vh'}
    }
    const itemTwo = {
        initial: { opacity: 0, scale: 0 },
        animate: { opacity: 1, scale: 1},
        exit: { opacity: 0,scale: 0 }
    }

    const openTable = () => {
        setOpenRouletteMenu(false)
        setOpenChatMenu(false)
        setTimeout(() => {
            setOpenTableMenu(true)
        }, 750)
    }
    const closeTable = () => {
        setOpenTableMenu(false)
        setOpenChatMenu(false)
        setTimeout(() => {
            setOpenRouletteMenu(true)
        }, 750)
    }
    const openChat = () => {
        setOpenTableMenu(false)
        setOpenRouletteMenu(false)
        setTimeout(() => {
            setOpenChatMenu(true)
        }, 750)
    }
    const closeChat = () => {
        setOpenChatMenu(false)
        setOpenRouletteMenu(false)
        setTimeout(() => {
            setOpenTableMenu(true) 
        }, 750)
    }

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

    const handleDragStart = () => {
        setIsDragging(true);
    };

    const handleDragOver = (event) => {
        if (isDragging) {
            const { over } = event;
            if (over && over.id !== activeContainer) {
                setActiveContainer(over.id);
            }
        }
    };
    
    const handleDragEnd = (event) => {
        const { over, active } = event;
        /* if(active){
            console.log(active)
        } */
        const chipValue = active.data.current.chipValue;
        const chipImage = active.data.current.chipImage;
        const avatar = user.user_metadata.avatar_url
        let droppedNumberId = over?.id;
        const allRows = FirstRowNoZeroes.concat(SecondRowNoZeroes).concat(ThirdRow).concat(Zeroes);
        console.log(allRows)
        if(over){
            const newBalance = balance - chipValue;
            setBalance(newBalance)
            /* playEffect(39) */
        }
        // Function to update the chips and placed bets
        const updateChipsAndBets = (numberId,droppedNumberId, updateChipsFn, updateBetFn, betType) => {
            updateChipsFn((prevChips) => ({
                ...prevChips,
                [droppedNumberId]: [...(prevChips[droppedNumberId] || []), { chipValue, chipImage, betType, numberId, droppedNumberId, avatar }],
            }));
            const oldValue = placedBet;
            setPlacedBet(oldValue + chipValue);
            //setPlacedBet((prevBet) => prevBet + chipValue);
            updateBetFn(numberId, betType, droppedNumberId);
        };
    
        const updateAllBets = (numberId, betType, color) => {
            setAllBets((prevBets) => {
                const existingBets = prevBets[numberId] || [];
                const existingBetIndex = existingBets.findIndex((bet) => bet.typeofBet === betType);
                let updatedBets;
                if (existingBetIndex !== -1) {
                    updatedBets = existingBets.map((bet, index) =>
                        index === existingBetIndex ? { ...bet, amount: bet.amount + chipValue, number: droppedNumberId, color: color } : bet
                    );
                } else {
                    updatedBets = [...existingBets, { amount: chipValue, typeofBet: betType, number: droppedNumberId, color: color }];
                }
    
                return {
                    ...prevBets,
                    [numberId]: updatedBets,
                };
            });
        };
        console.log("droppedNumberId",droppedNumberId)
        if (!isNaN(droppedNumberId)) {
            const item = allRows.find(el => el.number === droppedNumberId);
            const color = item.color
            updateChipsAndBets(droppedNumberId, droppedNumberId, setDroppedChips, (id) => updateAllBets(id, 'Straight', color), 'Straight');
        } /* else if (droppedNumberId === 100 || droppedNumberId === 101) {
            const item = allRows.find(el => el.id === droppedNumberId);
            console.log("item", item)
            const color = item.color
            updateChipsAndBets(droppedNumberId, droppedNumberId, setDroppedChips, (id) => updateAllBets(id, 'Straight', color), 'Straight');
        } */ else if (droppedNumberId.startsWith('corner')) {
            const item = allRows.find(el => el.cornerLeftId === droppedNumberId);
            const numbers = item?.cornerLeft || [];
            if(numbers.length === 4){
                numbers.forEach((numberId) => {
                    const item = allRows.find(el => el.number === numberId);
                    const color = item.color
                    updateChipsAndBets(numberId,droppedNumberId, setDroppedCornerChips, (id) => updateAllBets(id, `Corner`, color), `Corner`);
                })
            } else if(numbers.length === 6){
                numbers.forEach((numberId) => {
                    const item = allRows.find(el => el.number === numberId);
                    const color = item.color
                    updateChipsAndBets(numberId,droppedNumberId, setDroppedCornerChips, (id) => updateAllBets(id, `Six Line`, color), `Six Line`);
                })
            } else if(numbers.length === 5){
                numbers.forEach((numberId) => {
                    const item = allRows.find(el => el.number === numberId);
                    const color = item.color
                    updateChipsAndBets(numberId,droppedNumberId, setDroppedCornerChips, (id) => updateAllBets(id, `Basket`, color), `Basket`);
                })
            } else if(numbers.length === 3){
                numbers.forEach((numberId) => {
                    const item = allRows.find(el => el.number === numberId);
                    const color = item.color
                    updateChipsAndBets(numberId,droppedNumberId, setDroppedCornerChips, (id) => updateAllBets(id, `Street`, color), `Street`);
                })
            }
        } else if (droppedNumberId.startsWith('split')) {
            const item = allRows.find(el => el.borderLeftId === droppedNumberId);
            const numbers = item?.borderLeft || [];
            numbers.forEach((numberId) => {
                const item = allRows.find(el => el.number === numberId);
                const color = item.color
                updateChipsAndBets(numberId,droppedNumberId, setDroppedBorderLeftChips, (id) => updateAllBets(id, `Split`, color), `Split`);
            })
        } else if (droppedNumberId.startsWith('borderTop')) {
            const item = allRows.find(el => el.borderTopId === droppedNumberId);
            const numbers = item?.borderTop || [];
            if(numbers.length === 2){
                numbers.forEach((numberId) => {
                    const item = allRows.find(el => el.number === numberId);
                    const color = item.color
                    updateChipsAndBets(numberId,droppedNumberId, setDroppedBorderTopChips, (id) => updateAllBets(id, `Split`, color), `Split`);
                }) 
            } else if(numbers.length === 3){
                numbers.forEach((numberId) => {
                    const item = allRows.find(el => el.number === numberId);
                    const color = item.color
                    updateChipsAndBets(numberId,droppedNumberId, setDroppedBorderTopChips, (id) => updateAllBets(id, `Street`, color), `Street`);
                }) 
            }
        } else if (droppedNumberId.startsWith('1') || droppedNumberId.startsWith('2') || droppedNumberId.startsWith('3')) {
            const item = BetPerRows.find(el => el.name === droppedNumberId);
            const numbers = item?.numbers || [];
            numbers.forEach((numberId) => {
                const item = allRows.find(el => el.number === numberId);
                const color = item.color
                updateChipsAndBets(numberId,droppedNumberId, setDroppedRowChips, (id) => updateAllBets(id, `Dozen`, color), `Dozen`);
            })
        } else if (droppedNumberId === "first-18") {
            const item = LastRow.find(el => el.id === droppedNumberId);
            const numbers = item?.numbers || [];
            numbers.forEach((numberId) => {
                const item = allRows.find(el => el.number === numberId);
                const color = item.color
                updateChipsAndBets(numberId,droppedNumberId, setDroppedLastRowChips, (id) => updateAllBets(id, `Low (1-18)`, color), `Low (1-18)`);
            })
        } else if (droppedNumberId === "last-18") {
            const item = LastRow.find(el => el.id === droppedNumberId);
            const numbers = item?.numbers || [];
            numbers.forEach((numberId) => {
                const item = allRows.find(el => el.number === numberId);
                const color = item.color
                updateChipsAndBets(numberId,droppedNumberId, setDroppedLastRowChips, (id) => updateAllBets(id, `High (19-36)`, color), `High (19-36)`);
            })
        } else if (droppedNumberId === "EVEN") {
            const item = LastRow.find(el => el.id === droppedNumberId);
            const numbers = item?.numbers || [];
            numbers.forEach((numberId) => {
                const item = allRows.find(el => el.number === numberId);
                const color = item.color
                updateChipsAndBets(numberId,droppedNumberId, setDroppedLastRowChips, (id) => updateAllBets(id, `Even`, color), `Even`);
            })
        } else if (droppedNumberId === "ODD") {
            const item = LastRow.find(el => el.id === droppedNumberId);
            const numbers = item?.numbers || [];
            numbers.forEach((numberId) => {
                const item = allRows.find(el => el.number === numberId);
                const color = item.color
                updateChipsAndBets(numberId,droppedNumberId, setDroppedLastRowChips, (id) => updateAllBets(id, `Odd`, color), `Odd`);
            })
        } else if (droppedNumberId === "blacks") {
            const item = LastRow.find(el => el.id === droppedNumberId);
            const numbers = item?.numbers || [];
            numbers.forEach((numberId) => {
                const item = allRows.find(el => el.number === numberId);
                const color = item.color
                updateChipsAndBets(numberId,droppedNumberId, setDroppedLastRowChips, (id) => updateAllBets(id, `Blacks`, color), `Blacks`);
            })
        } else if (droppedNumberId === "reds") {
            const item = LastRow.find(el => el.id === droppedNumberId);
            const numbers = item?.numbers || [];
            numbers.forEach((numberId) => {
                const item = allRows.find(el => el.number === numberId);
                const color = item.color
                updateChipsAndBets(numberId,droppedNumberId, setDroppedLastRowChips, (id) => updateAllBets(id, `Reds`, color), `Reds`);
            })
        } else if (droppedNumberId.startsWith('column')) {
            const item = BetPerColumns.find(el => el.id === droppedNumberId);
            const numbers = item?.numbers || [];
            numbers.forEach((numberId) => {
                const item = allRows.find(el => el.number === numberId);
                const color = item.color
                updateChipsAndBets(numberId,droppedNumberId, setDroppedColumnChips, (id) => updateAllBets(id, `Column`, color), `Column`);
            })
        }
    }; 

    const handleLeave = (id) => {
        if (activeContainer === id) {
          setActiveContainer(null); 
        }
    };

    const removeBet = (chip,elements,updateChipsFn) => {
    
        const id = chip.droppedNumberId
        const value = chip.chipValue
        
        const { [id]: removed, ...updatedElements } = elements;
    
        // Check if the element was found and removed
        if (removed) {
            console.log(removed)
            const totalValue = removed.reduce((sum, chip) => sum + chip.chipValue, 0);
            console.log("Total Chip Value:", totalValue);
            let toReduce
            if(removed[0].betType === "Split"){
                toReduce = totalValue / 2
            } else if (removed[0].betType === "Corner"){
                toReduce = totalValue / 4
            } else if (removed[0].betType === "Street"){
                toReduce = totalValue / 3
            } else if (removed[0].betType === "Basket"){
                toReduce = totalValue / 5
            } else if (removed[0].betType === "Six Line"){
                toReduce = totalValue / 6
            } else if (removed[0].betType === "Dozen"){
                toReduce = totalValue / 12
            } else if (removed[0].betType === "Low (1-18)" || removed[0].betType === "High (19-36)" || removed[0].betType === "Even"
                || removed[0].betType === "Odd" || removed[0].betType === "Blacks" || removed[0].betType === "Reds"){
                toReduce = totalValue / 18
            } else if (removed[0].betType === "Straight"){
                toReduce = totalValue 
            }
            setBalance((prev) => prev + toReduce)
            setPlacedBet((prev) => prev - toReduce)
            for (let key in allBets) {
                console.log(key)
                console.log(allBets[key])
                allBets[key] = allBets[key].filter(
                  (bet) => !(bet.number === id)
                );
                
                // Remove the key if the array is empty
                if (allBets[key].length === 0) {
                  delete allBets[key];
                }
              }
            
        } else {
            console.log(`No element found with id: ${id}`);
        }
        updateChipsFn(updatedElements)
    
    }

    useEffect(() => {
        /* const fetchInitialData = () => {
            socket.emit('getRooms');
            socket.emit('getAllPlayers');
        };
        fetchInitialData(); */
        
        
        socket?.on('thisIsYourId', (data) => {
            setMyId(data.playerId)
            setActiveRoom(data.room)
            ANTDmessage.success(data.playerId)
            //setPlayOnline(true)
            //waitingtToStarttNotify('Waiting for other players to join the room... ⌛')
        });
        socket?.on('update_players', (data) => {
            const { message, dealer, dealer_avatar, sendedBy } = data;
            console.log(message)
            /* const messageToUpdate = {
                message: message,
                playerName: dealer,
                user_avatar: dealer_avatar,
                sendedBy: sendedBy,
                room_id: activeRoom
            } */
            ANTDmessage.success(message)
            setTimeout(() => {
                setPlaceBets(true)
                playEffect(42)
                setTimeOutStarted(true)
                setOpenRouletteMenu(false)
                setTimeout(() => {
                    setOpenTableMenu(true)
                }, 750)
            }, 10000)
        });
        socket?.on('timeoutStarting', () => {
            setTimeout(() => {
                startCountdown();
            }, 10000)
        });
        socket?.on('close-betting-table', (data) => {
            const { message, dealer, dealer_avatar, sendedBy } = data;
            /* const messageToUpdate = {
                message: message,
                playerName: dealer,
                user_avatar: dealer_avatar,
                sendedBy: sendedBy,
                room_id: activeRoom
            } */
            //(messageToUpdate)
            ANTDmessage.success(message)
            setGameStarted(true)
            setTimeOutStarted(false)
            setPlayerFolds(true)
            setOpenTableMenu(false)
            setTimeout(() => {
                setOpenRouletteMenu(true)
            }, 750)
        });
        socket.on('winning-number', (winningNumber) => {
            setWinningNumber(winningNumber)
            //startRoulette();
        });
        socket.on('message-sent', (data) => {
            const { message, dealer, dealer_avatar, sendedBy } = data;
            /* const messageToUpdate = {
                message: message,
                playerName: dealer,
                user_avatar: dealer_avatar,
                sendedBy: sendedBy,
                room_id: activeRoom
            }
            sendAdminMessage(messageToUpdate) */
            ANTDmessage.success(message)
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
                openTable();
            }, 3000)
        });
        return () => {
            socket.off('thisIsYourId');
            socket.off('update_players');
            socket.off('timeoutStarting');
            socket.off('close-betting-table');
            socket.off('winning-number');
            socket.off('message-sent');
            socket.off('player-wins');
            socket.off('player-lost');
        }
    }, [socket]);

    const joinRoom = async (room) => {
        socket?.emit("join-room", {
          playerName: playerName,
          googleId: "3500e55b-9df7-4213-961f-4afde3a2b9ed",
          avatar: playerAvatar,
          roomId: "1"
        });
    }

    const getRotationForNumber = (winningNumber) => {
        const targetIndex = americanRouletteNumbers.findIndex(num => num.number === winningNumber.number);
        const degreesPerNumber = 360 / totalNumbers;
        const targetRotation = targetIndex * degreesPerNumber;
        const fullRotations = 8 * 360; // 3 full spins
        const finalRotation = fullRotations + (360 - targetRotation);
        return finalRotation;
    };

    const spinRoulette = () => {
        setSpinning(true);
        const finalRotation = getRotationForNumber(winningNumber);
        setRotationDegrees(finalRotation);
        setTimeout(() => { setSpinning(false); setRotationDegrees(0);setShowMotionDiv(true)}, 10000); 
    };

    useEffect(() => {
        if(showMotionDiv){
            socket.emit("game-finished", { activeRoom, myId, allBets });
                const sound = (winningNumber.number)
                console.log("sound to play", sound)
                if (sound > 0 && sound <= 36) {
                    playEffect(sound)
                }else if (sound === "00") {
                    playEffect(43)
                }
        } 
    }, [showMotionDiv])

    useEffect(() => {
        if(winningNumber){
            spinRoulette();
            setWinnings(null)
            playEffect(37)
            playEffect(38)
        } 
    }, [winningNumber])

    const sendBet =  () => {
        if (placedBet > 0) {
          const allChips = {
              droppedChips,
              droppedCornerChips,
              droppedRowChips,
              droppedLastRowChips,
              droppedColumnChips,
              droppedBorderLeftChips,
              droppedBorderTopChips
          };
          setDroppedChipsLast(droppedChips)
          setDroppedCornerChipsLast(droppedCornerChips)
          setDroppedRowChipsLast(droppedRowChips)
          setDroppedLastRowChipsLast(droppedLastRowChips)
          setDroppedColumnChipsLast(droppedColumnChips)
          setDroppedBorderLeftChipsLast(droppedBorderLeftChips)
          setDroppedBorderTopChipsLast(droppedBorderTopChips)
          setLastBet(allBets)
          setLastBetAmount(placedBet)
          socket?.emit("placeBet", {
              allChips: allChips,
              roomId: activeRoom,
              playerId: myId,
              placedBet: placedBet,
              
          });
          closeTable();
          setActiveContainer(null)
          
          } else {
            message.error("There is no bet placed!")
          }
      }
    


  return (
    <Section>
        <AnimatePresence>
            <AbsoluteIconButton key="#4">{openTableMenu ? <ArrowDown onClick={closeTable}/> : <ArrowUp onClick={openTable}/>}</AbsoluteIconButton>
            {(openRouletteMenu && !gameStarted) && <AbsoluteIconButtonLeft key="#5"><ArrowLeftRelative style={{transform: 'translateY(0) rotate(90deg)'}} onClick={() => navigate('/')}/></AbsoluteIconButtonLeft>}
            {openTableMenu && (
                <Container key="#1" variants={item}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 40,duration: 0.5 }}
                style={{backgroundImage: `url(${back20})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
                    <DndContext onDragEnd={handleDragEnd} sensors={sensors} onDragOver={handleDragOver} onDragStart={handleDragStart}>
                        <SendBetContainer>
                            <motion.div whileTap={{scale: 0.95}}><StyledButton style={{fontSize: '18px'}} onClick={sendBet}>PLACE BET</StyledButton></motion.div>
                        </SendBetContainer>
                    <ZeroRowBets key="#7">
                        <HalfZeroRowBets style={{height: '60%'}} key="#8"></HalfZeroRowBets>
                        <HalfZeroRowBets style={{height: '40%'}} key="#9">
                        <EmptySpace key="#10">
                        {seconds && (
                            <>
                                <motion.div key="#11" variants={item}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit">
                                    <BigNumberContainer key="#12" style={{ background: seconds > 3 ? '#71f53dd6' : '#fa0606da' }}>
                                    {seconds} 
                                    </BigNumberContainer>
                                </motion.div>
                                
                            </>
                        )}    
                        </EmptySpace>   
                        <ColumnHolder key="#13">
                            {Zeroes.map((card, index) => {
                                return (
                                    <ZeroesArea activeNumbers={activeNumbers} card={card} key={index} droppedChips={droppedChips} setDroppedChips={setDroppedChips} activeContainer={activeContainer}
                                   removeBet={removeBet} droppedBorderLeftChips={droppedBorderLeftChips} setDroppedBorderLeftChips={setDroppedBorderLeftChips}/>
                                )
                            })}
                        </ColumnHolder>
                        </HalfZeroRowBets>
                    </ZeroRowBets>
                    <LeagueRowBets key="#14">
                
                <FirstColumn key="#15">
                            {LastRow.map((card, index) => {
                                return (
                                    <LastRowArea card={card} key={index} droppedLastRowChips={droppedLastRowChips} setDroppedLastRowChips={setDroppedLastRowChips} removeBet={removeBet}/>
                                )
                            })}
                </FirstColumn>
                <FirstColumn key="#16">
                            {BetPerRows.map((card, index) => {
                                return (
                                    <BetPerRowsArea card={card} key={index} droppedRowChips={droppedRowChips} setDroppedRowChips={setDroppedRowChips} removeBet={removeBet}/>
                                )
                            })}
                </FirstColumn>
                <FirstColumn key="#17">
                            {ThirdRow.map((card, index) => {
                                return (
                                    <BetNumbersArea key={index} activeContainer={activeContainer} 
                                    card={card} onLeave={handleLeave} droppedChips={droppedChips} setDroppedChips={setDroppedChips} droppedCornerChips={droppedCornerChips} setDroppedCornerChips={setDroppedCornerChips} 
                                    droppedBorderLeftChips={droppedBorderLeftChips} setDroppedBorderLeftChips={setDroppedBorderLeftChips} droppedBorderTopChips={droppedBorderTopChips} setDroppedBorderTopChips={setDroppedBorderTopChips} 
                                    removeBet={removeBet} activeNumbers={activeNumbers}
                                    />
                                )
                            })}
                </FirstColumn>
                <FirstColumn key="#18">
                            {SecondRowNoZeroes.map((card, index) => {
                                return (
                                    <BetNumbersArea key={index} activeContainer={activeContainer} 
                                    card={card} onLeave={handleLeave} droppedChips={droppedChips} setDroppedChips={setDroppedChips} droppedCornerChips={droppedCornerChips} setDroppedCornerChips={setDroppedCornerChips} 
                                    droppedBorderLeftChips={droppedBorderLeftChips} setDroppedBorderLeftChips={setDroppedBorderLeftChips} droppedBorderTopChips={droppedBorderTopChips} setDroppedBorderTopChips={setDroppedBorderTopChips} 
                                    removeBet={removeBet} activeNumbers={activeNumbers}
                                    />
                                )
                            })}
                </FirstColumn>
                <FirstColumn key="#19">
                            {FirstRowNoZeroes.map((card, index) => {
                                return (
                                    <BetNumbersArea key={index} activeContainer={activeContainer} 
                                    card={card} onLeave={handleLeave} droppedChips={droppedChips} setDroppedChips={setDroppedChips} droppedCornerChips={droppedCornerChips} setDroppedCornerChips={setDroppedCornerChips} 
                                    droppedBorderLeftChips={droppedBorderLeftChips} setDroppedBorderLeftChips={setDroppedBorderLeftChips} droppedBorderTopChips={droppedBorderTopChips} setDroppedBorderTopChips={setDroppedBorderTopChips} 
                                    removeBet={removeBet} activeNumbers={activeNumbers}
                                    />
                                )
                            })}
                </FirstColumn>
              </LeagueRowBets>
              <ColumnBets key="#20">
                        <EmptySpace key="#21"></EmptySpace>
                        <ColumnHolder key="#22">
                            {BetPerColumns.map((card, index) => {
                                return (
                                    <BetPerColumnsArea card={card} key={index} droppedColumnChips={droppedColumnChips} setDroppedColumnChips={setDroppedColumnChips} removeBet={removeBet}/>
                                )
                            })}
                        </ColumnHolder>
                        </ColumnBets>

                        <ChipsHolder key="#23">
                                <ChipsTwo key="#24"/>
                        </ChipsHolder>
                        <RouletteBalance>
                        <BalanceColumn>
                                    <SmallIconHolder onClick={joinRoom}><img src={balanceIcon} alt="balance" /></SmallIconHolder>
                                    <DisplayHolder><BalanceDisplay balance={balance} /></DisplayHolder>
                              </BalanceColumn>
                              <BalanceColumn>
                                    <SmallIconHolder><img src={chips} alt="chips" /></SmallIconHolder>
                                    <DisplayHolder><PlacedBetDisplay placedBet={placedBet} /></DisplayHolder>
                              </BalanceColumn>
                              <BalanceColumn>
                                    <SmallIconHolder><img src={roulette} alt="balance" /></SmallIconHolder>
                                    <DisplayHolder><NumbersBetDisplay allBets={allBets} /></DisplayHolder>
                              </BalanceColumn>  
                        </RouletteBalance>
                        </DndContext>
                            </Container>
                        )}
              {openRouletteMenu && (
                  <Container variants={item}
                      initial="initial" key="#2"
                      animate="animate"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 300, damping: 40,duration: 0.5 }}
                      >
                      <WheelContainer key="#25" style={{background: 'black'}}>
                          <RouletteContainer key="#26">
                              <Wheel animate={{ rotate: rotationDegrees }} key="#27"// Framer Motion animation
                                  transition={{
                                      duration: 10, // 10-second spin duration
                                      ease: [0.22, 1, 0.36, 1], // easeOutCubic to slow down
                                  }}>
                                  <SpinButton key="#28"><img src={Ton} alt="logo" /></SpinButton>
                                  {[...Array(19)].map((_, index) => (
                                      <Span key={index} index={index} />
                                  ))}
                                  <Number key="#29">
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
                      </WheelContainer>
                      <TableContainer key="#30" style={{backgroundImage: `url(${back21})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
                          <BallHolder key="#31">
                              {latestNumbers?.map((el,index) => {
                                  return (
                                      <SmallNumberWrapper key={index} style={{ background: `${el.color}` }}>{el.number}</SmallNumberWrapper>
                                  )
                              })}
                              <div ref={scrollableDivRef}></div>
                          </BallHolder>
                          <BetsHolder key="#32">
                              {allBets && Object.entries(allBets).map(([key, valueArray]) => {
                                const value = key === "100" ? 0 : key === "101" ? "00" : key
                                  return valueArray.map((bet, index) => (
                                      <BetHolder key={index}>
                                          <BetNumberHolder>
                                              <NumberWrapper style={{ background: `${bet.color}` }}>{value}</NumberWrapper>
                                          </BetNumberHolder>
                                          <BetAmount>{bet.amount} GPZ</BetAmount>
                                          <BetAmount>{bet.typeofBet}</BetAmount>
                                      </BetHolder>
                                  ));
                              })}
                          </BetsHolder>
                          <BalanceHolder>
                              <BalanceColumn>
                                    <SmallIconHolder onClick={joinRoom}><img src={balanceIcon} alt="balance" /></SmallIconHolder>
                                    <DisplayHolder><BalanceDisplay balance={balance} /></DisplayHolder>
                              </BalanceColumn>
                              <BalanceColumn>
                                    <SmallIconHolder><img src={chips} alt="chips" /></SmallIconHolder>
                                    <DisplayHolder><PlacedBetDisplay placedBet={placedBet} /></DisplayHolder>
                              </BalanceColumn>
                              <BalanceColumn>
                                    <SmallIconHolder><img src={roulette} alt="balance" /></SmallIconHolder>
                                    <DisplayHolder><NumbersBetDisplay allBets={allBets} /></DisplayHolder>
                              </BalanceColumn>
                          </BalanceHolder>
                      </TableContainer>
                  </Container>
              )}
              {openChatMenu && (
                  <Container variants={item}
                      initial="initial" key="#3"
                      animate="animate"
                      exit="exit"
                      transition={{ type: "spring", stiffness: 300, damping: 40,duration: 0.5 }}>
                        <MessagesWrapper key="#34">

                        </MessagesWrapper>
                        <ChatInputWrapper key="#35">
                        {/* <ChatInput activeRoom={activeRoom} playerName={playerName} playerId={playerId}
                        actionMenuOpen={actionMenuOpen} setActionMenuOpen={setActionMenuOpen} showEmojiPicker={showEmojiPicker}
                        setShowEmojiPicker={setShowEmojiPicker} message={message} setMessage={setMessage} selectedFile={selectedFile} setSelectedFile={setSelectedFile}/> */}
                        </ChatInputWrapper>
                  </Container>
              )}
      </AnimatePresence>
    </Section>
  )
}

export default Roulete

