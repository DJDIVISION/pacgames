import React,{useEffect, useState, useRef} from 'react'
import styled from 'styled-components'
import { RouletteSection,BigColumn,SmallColumn,Row,TopRow,BottomRow,BigBottomColumn,SmallBottomColumn,
    BottomContainer,IconHolder,IconWrapper,IconName,IconRound,BottomContainerColumn,RowIcons,BottomContainerRow,
    SmallIconHolder,SmallTextHolder,BettingText
 } from '../../pages/indexTwo'
import {FirstRow, SecondRow, ThirdRow, BetPerRows, LastRow, Zeroes, BetPerColumns} from '../../pages/fakeData'
import { motion,AnimatePresence  } from 'framer-motion'
import { DndContext } from '@dnd-kit/core';
import { TouchSensor, MouseSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import Chips from './Chips';
import './styles.css'
import blueChip from '../../assets/chips/emptyChip2.png'
import chips from '../../assets/chips/poker-chips.png'
import cross from '../../assets/chips/delete.png'
import roulette from '../../assets/chips/roulette.png'
import repeat from '../../assets/chips/repeat.png'
import placeBet from '../../assets/chips/placeBet.png'
import balanceIcon from '../../assets/chips/balance-bag.png'
import x2 from '../../assets/chips/x2.png'
import { BalanceDisplay,PlacedBetDisplay,NumbersBetDisplay, useAuth } from '../../pages/functions';
import { BetState } from '../../context/BetsContext'






const RouletteTable = ({setPlaceBets,placeBets,activeRoom,myId,socket,
    allBets,setAllBets,droppedChips,setDroppedChips,droppedCornerChips,setDroppedCornerChips,droppedRowChips,setDroppedRowChips,
    droppedLastRowChips,setDroppedLastRowChips,droppedColumnChips,setDroppedColumnChips,droppedBorderLeftChips,setDroppedBorderLeftChips,
    droppedBorderTopChips,setDroppedBorderTopChips,lastBet,setLastBet,latestNumbers
}) => {

    
    
    const [selectedId, setSelectedId] = useState(null)
    const [activeContainer, setActiveContainer] = useState(null)
    const [activeNumbers, setActiveNumbers] = useState([]);
    const [clearBetMenuOpen, setClearBetMenuOpen] = useState(false)
    const [seconds, setSeconds] = useState(null);
    const intervalRef = useRef(null);
    const {balance, setBalance} = BetState();
    const scrollableDivRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const {placedBet, setPlacedBet} = BetState();
    const { user } = useAuth();
    const [lastBetAmount,setLastBetAmount] = useState(null)

    useEffect(() => {
        scrollableDivRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
    
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

    const startCountdown = () => {
        let countdownTime = 15000;
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

    useEffect(() => {
        if(placeBets){
            startCountdown();
        }
    }, [placeBets])


    

    useEffect(() => {
        const allRows = FirstRow.concat(SecondRow).concat(ThirdRow)
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
    
    const CornerDropArea = ({ card }) => {
        const { isOver, setNodeRef } = useDroppable({
          id: `corner-${card.number}`, 
        });
        
        const cornerLeft = card.cornerLeft
        if(isOver){
            console.log(cornerLeft)
        }
        return (
            <CornerLeft ref={setNodeRef} id={`corner-${card.number}`} >
            {/* Display chips if there are any */}
            {droppedCornerChips[card.cornerLeftId]?.length > 0 && (
              <div className="corner-chips">
                {droppedCornerChips[card.cornerLeftId].map((chip, index) => (
                  <img
                    key={index}
                    src={chip.chipImage}
                    alt={`Chip ${chip.chipValue}`}
                    className="corner-dropped-chip"
                    onClick={() => removeBet(chip,droppedCornerChips,setDroppedCornerChips)}
                  />
                ))}
              </div>
            )}
          </CornerLeft>
        );
    };

    const BorderLeftArea = ({ card }) => {
        const { isOver, setNodeRef } = useDroppable({
          id: `split-${card.number}`, // Unique ID for the corner area
        });
        const borderLeft = card.borderLeft
        const wrappedId = "split-"+ card.number
        return (
            <BorderLeft ref={setNodeRef} id={`split-${card.number}`}>
            {/* Display chips if there are any */}
            {droppedBorderLeftChips[wrappedId]?.length > 0 && (
              <div className="corner-chips">
                {droppedBorderLeftChips[wrappedId].map((chip, index) => (
                  <img
                    key={index}
                    src={chip.chipImage}
                    alt={`Chip ${chip.chipValue}`}
                    className="borderLeft-dropped-chip"
                    onClick={() => removeBet(chip,droppedBorderLeftChips,setDroppedBorderLeftChips)}
                  />
                ))}
              </div>
            )}
          </BorderLeft>
        );
    };

    const BorderTopArea = ({ card }) => {
        const { isOver, setNodeRef } = useDroppable({
          id: `borderTop-${card.number}`, // Unique ID for the corner area
        });
        const borderTop = card.borderTop
        const wrappedId = "borderTop-"+card.number
        if(isOver){
            console.log(wrappedId)
        }
        return (
            <BorderTop ref={setNodeRef} id={wrappedId}>
            {/* Display chips if there are any */}
            {droppedBorderTopChips[wrappedId]?.length > 0 && (
              <div className="corner-chips">
                {droppedBorderTopChips[wrappedId].map((chip, index) => (
                  <img
                    key={index}
                    src={chip.chipImage}
                    alt={`Chip ${chip.chipValue}`}
                    className="borderTop-dropped-chip"
                    onClick={() => removeBet(chip,droppedBorderTopChips,setDroppedBorderTopChips)}
                  />
                ))}
              </div>
            )}
          </BorderTop>
        );
      };

      const ZeroesArea = ({card,onLeave,activeContainer  }) => {
        const { isOver, setNodeRef } = useDroppable({
          id: card.number,
        });
        if (!isOver && onLeave) {
            onLeave(card.number);
          }
        const borderTop = card.borderTop
        const number = card.number
        return (
          <Zero ref={setNodeRef} id={card.number} className={activeContainer === number ? "number-active" : "number-inactive"}  
           key={card.number}  >
            <NumberZeroWrapper style={{background: `${card.color}`}}  >{number}</NumberZeroWrapper>
            <BorderTopArea card={card} droppedBorderTopChips={droppedBorderTopChips} setDroppedBorderTopChips={setDroppedBorderTopChips}/>
            {
                !droppedChips[number] || droppedChips[number].length === 0 ? (
                    <div></div>
                ) : (
                    <div className="roulette-dropped-chips">
                    {droppedChips[number].map((chip, index) => (
                        <img
                        key={index}
                        src={chip.chipImage}
                        alt={`Chip ${chip.chipValue}`}
                        className="zero-dropped-chip"
                        onClick={() => removeBet(chip,droppedChips,setDroppedChips)}
                        />
                    ))}
                    </div>
                )
                }
          </Zero>
        );
    };

    const BetPerRowsArea = ({card,onLeave  }) => {
        const { isOver, setNodeRef } = useDroppable({
          id: card.name,
        });
        if (!isOver && onLeave) {
            onLeave(card.name);
          }
        const name = card.name
        const numbers = card.numbers
        return (
          <BetPerRowsWrapper ref={setNodeRef} id={name} 
           key={name}  >
            {
                !droppedRowChips[name] || droppedRowChips[name].length === 0 ? (
                    <div>{name}</div>
                ) : (
                    <div className="roulette-dropped-chips">
                    {droppedRowChips[name].map((chip, index) => (
                        <img
                        key={index}
                        src={chip.chipImage}
                        alt={`Chip ${chip.chipValue}`}
                        className="first-dropped-chip"
                        onClick={() => removeBet(chip,droppedRowChips,setDroppedRowChips)}
                        />
                    ))}
                    </div>
                )
                }
          </BetPerRowsWrapper>
        );
    };

    const LastRowArea = ({card,onLeave  }) => {
        const { isOver, setNodeRef } = useDroppable({
          id: card.id,
        });
        if (!isOver && onLeave) {
            onLeave(card.id);
          }
        const name = card.name
        const numbers = card.numbers
        
        return (
          <LastRowWrapper style={{background: `${card.color}`}} ref={setNodeRef} id={card.id} 
           key={card.id}  >
            {
                !droppedLastRowChips[card.id] || droppedLastRowChips[card.id].length === 0 ? (
                    <div>{name}</div>
                ) : (
                    <div className="roulette-dropped-chips">
                    {droppedLastRowChips[card.id].map((chip, index) => (
                        <img
                        key={index}
                        src={chip.chipImage}
                        alt={`Chip ${chip.chipValue}`}
                        className="first-dropped-chip"
                        onClick={() => removeBet(chip,droppedLastRowChips,setDroppedLastRowChips)}
                        />
                    ))}
                    </div>
                )
                }
          </LastRowWrapper>
        );
    };


    const BetPerColumnsArea = ({card,onLeave  }) => {
        const { isOver, setNodeRef } = useDroppable({
          id: card.id,
        });
        if (!isOver && onLeave) {
            onLeave(card.id);
          }
        const borderTop = card.borderTop
        const name = card.name
        const numbers = card.numbers
        return (
          <Number ref={setNodeRef} id={card.id} className="number-inactive"
           key={card.id}  >
            {
                !droppedColumnChips[card.id] || droppedColumnChips[card.id].length === 0 ? (
                    <div>{name}</div>
                ) : (
                    <div className="roulette-dropped-chips">
                    {droppedColumnChips[card.id].map((chip, index) => (
                        <img
                        key={index}
                        src={chip.chipImage}
                        alt={`Chip ${chip.chipValue}`}
                        className="first-dropped-chip"
                        onClick={() => removeBet(chip,droppedColumnChips,setDroppedColumnChips)}
                        />
                    ))}
                    </div>
                )
                }
          </Number>
        );
    };

    const BetNumbersArea = ({card,onLeave,activeContainer  }) => {
        const { isOver, setNodeRef } = useDroppable({
          id: card.number,
        });
        if (!isOver && onLeave) {
            onLeave(card.number);
        }
        const number = card.number

        const isActive = 
        // Check if activeContainer is a number and matches this number's id
        (typeof activeContainer === 'number' && activeContainer === number) ||
        // Check if activeContainer is a string and this number is in the activeNumbers array
        (typeof activeContainer === 'string' && activeNumbers.includes(number));
    
        //console.log(activeContainer)
        const borderTop = card.borderTop
        return (
          <Number ref={setNodeRef} id={card.number} className={isActive ? 'number-active' : 'number-inactive'}
           key={card.number}  >
            <NumberWrapper style={{background: `${card.color}`}}  >{number}</NumberWrapper>
            <CornerDropArea 
                card={card} 
                droppedCornerChips={droppedCornerChips} 
                setDroppedCornerChips={setDroppedCornerChips} 
            />
            <BorderLeftArea card={card} droppedBorderLeftChips={droppedBorderLeftChips} setDroppedBorderLeftChips={setDroppedBorderLeftChips}/>
            <BorderTopArea card={card} droppedBorderTopChips={droppedBorderTopChips} setDroppedBorderTopChips={setDroppedBorderTopChips}/>
            {
                !droppedChips[number] || droppedChips[number].length === 0 ? (
                    <div></div>
                ) : (
                    <div className="roulette-dropped-chips">
                    {droppedChips[number].map((chip, index) => (
                        <img
                        key={index}
                        src={chip.chipImage}
                        alt={`Chip ${chip.chipValue}`}
                        className="zero-dropped-chip"
                        onClick={() => removeBet(chip,droppedChips,setDroppedChips)}
                        />
                    ))}
                    </div>
                )
                }
          </Number>
        );
      };
    

    

    
    

    

    
    

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor, {
          activationConstraint: {
            distance: 10, // Start dragging after 10px of movement
          },
        })
    );

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

    const handleLeave = (id) => {
        if (activeContainer === id) {
          setActiveContainer(null); 
        }
    };

      const handleDragEnd = (event) => {
        const { over, active } = event;
        const chipValue = active.data.current.chipValue;
        const chipImage = active.data.current.chipImage;
        const avatar = user.user_metadata.avatar_url
        let droppedNumberId = over?.id;
        const allRows = FirstRow.concat(SecondRow).concat(ThirdRow);
        if(over){
            const newBalance = balance - chipValue;
            setBalance(newBalance)
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
        
        // Check if the droppedNumberId is a number
        if (!isNaN(droppedNumberId) && droppedNumberId !== 0 && droppedNumberId !== "00") {
            const item = allRows.find(el => el.number === droppedNumberId);
            const color = item.color
            updateChipsAndBets(droppedNumberId, droppedNumberId, setDroppedChips, (id) => updateAllBets(id, 'Straight', color), 'Straight');
        } else if (droppedNumberId === 0 || droppedNumberId === "00") {
            const item = allRows.find(el => el.number === droppedNumberId);
            const color = item.color
            updateChipsAndBets(droppedNumberId, droppedNumberId, setDroppedChips, (id) => updateAllBets(id, 'Straight', color), 'Straight');
        } else if (droppedNumberId.startsWith('corner')) {
            const item = allRows.find(el => el.cornerLeftId === droppedNumberId);
            console.log(item)
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
    
    const clearAllBets = () => {
        setActiveContainer(null)
        //setBalance(balance + placedBet)
        setAllBets({})
        setPlacedBet(null)
        setDroppedChips({})
        setDroppedCornerChips({})
        setDroppedRowChips({})
        setDroppedLastRowChips({})
        setDroppedColumnChips({})
        setDroppedBorderLeftChips({})
        setDroppedBorderTopChips({})
    }
    


    const removeBet = (chip,elements,updateChipsFn) => {
    
    const id = chip.droppedNumberId
    const value = chip.chipValue
    setBalance(balance + value)
    setPlacedBet(placedBet - value)
    const { [id]: removed, ...updatedElements } = elements;

    // Check if the element was found and removed
    if (removed) {
        for (let key in allBets) {
            // Filter out the items where number is "corner-25" and typeofBet is "corner-4-bet"
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

    const toggleClear = () => {
        setClearBetMenuOpen(!clearBetMenuOpen)
    }

    const item={
        initial: { height: 0, opacity: 0 },
        animate: { height: "100vh", opacity: 1, transition: { duration: 0.7 } },
        exit: { height: 0, opacity: 0, transition: { duration: 0.7 } }
    }

    useEffect(() => {
        console.log(lastBet)
        console.log(lastBetAmount)
    }, [lastBet,lastBetAmount])
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
        setLastBet(allChips)
        setLastBetAmount(placedBet)
        socket?.emit("placeBet", {
            allChips: allChips,
            roomId: activeRoom,
            playerId: myId,
            placedBet: placedBet,
            
        });
        setPlaceBets(false)
        setActiveContainer(null)
        
        } else {
          message.error("There is no bet placed!")
        }
    }

    const repeatBet = () => {
        setAllBets(lastBet)
    }
    

  return (
    <AnimatePresence>
        {placeBets && (
            <motion.div className="menu-container-six" variants={item}
            initial="initial"
            animate="animate"
            exit="exit">  
    <RouletteSection>
         <DndContext onDragEnd={handleDragEnd} sensors={sensors} onDragOver={handleDragOver} onDragStart={handleDragStart}>
            <TopRow>
      
      <BigColumn>
            <Row>
                
            {FirstRow.map((card,index) => {  
                return(
                    <BetNumbersArea key={index} activeContainer={activeContainer}
                        card={card} onLeave={handleLeave} droppedChips={droppedChips} setDroppedChips={setDroppedChips} droppedCornerChips={droppedCornerChips} setDroppedCornerChips={setDroppedCornerChips} 
                        droppedBorderLeftChips={droppedBorderLeftChips} setDroppedBorderLeftChips={setDroppedBorderLeftChips} droppedBorderTopChips={droppedBorderTopChips} setDroppedBorderTopChips={setDroppedBorderTopChips} 
                        removeBet={removeBet} 
                    />
                )
            })}
            </Row>
            <Row>
            {SecondRow.map((card,index) => {
                return(
                    <BetNumbersArea key={index}card={card} activeContainer={activeContainer} onLeave={handleLeave} droppedChips={droppedChips} setDroppedChips={setDroppedChips} droppedCornerChips={droppedCornerChips} setDroppedCornerChips={setDroppedCornerChips} droppedBorderLeftChips={droppedBorderLeftChips} setDroppedBorderLeftChips={setDroppedBorderLeftChips} droppedBorderTopChips={droppedBorderTopChips} setDroppedBorderTopChips={setDroppedBorderTopChips} removeBet={removeBet}  
                    />
                )
            })}
            </Row>
            <Row>
            <div style={{display: 'flex',transform: 'translateX(calc(70vw/26))'}}>
            {ThirdRow.map((card,index) => {
                return(
                    <BetNumbersArea key={index} activeContainer={activeContainer}
                        card={card} onLeave={handleLeave} droppedChips={droppedChips} setDroppedChips={setDroppedChips} droppedCornerChips={droppedCornerChips} setDroppedCornerChips={setDroppedCornerChips} 
                        droppedBorderLeftChips={droppedBorderLeftChips} setDroppedBorderLeftChips={setDroppedBorderLeftChips} droppedBorderTopChips={droppedBorderTopChips} setDroppedBorderTopChips={setDroppedBorderTopChips} 
                        removeBet={removeBet} 
                    />
                )
            })}
            </div>
            </Row>
            <Row>
            <div style={{display: 'flex',transform: 'translateX(calc(70vw/26))'}}>
            {BetPerRows.map((card,index) => {
                return(
                    <BetPerRowsArea activeContainer={activeContainer} card={card} onLeave={handleLeave} key={index} droppedRowChips={droppedRowChips} setDroppedRowChips={setDroppedRowChips}
                    removeBet={removeBet}/>
                )
            })}
            </div>
            </Row>
            <Row>
            <div style={{display: 'flex',transform: 'translateX(calc(70vw/26))'}}>
            {LastRow.map((card,index) => {
                return(
                    <LastRowArea card={card} onLeave={handleLeave} key={index} droppedLastRowChips={droppedLastRowChips} setDroppedLastRowChips={setDroppedLastRowChips}
                    removeBet={removeBet} activeContainer={activeContainer} />
                )
            })}
            </div>
            </Row>
      </BigColumn>
      <SmallColumn>
      <div style={{marginRight: 'auto'}}>
            {BetPerColumns.map((card,index) => {
                return(
                    <BetPerColumnsArea card={card} key={index} onLeave={handleLeave} droppedColumnChips={droppedColumnChips} setDroppedColumnChips={setDroppedColumnChips}
                    removeBet={removeBet}/>
                )
            })}
        </div>
      </SmallColumn>
      </TopRow>
      <BottomRow>
            <SmallBottomColumn>
                <BottomContainerColumn>
                    <RowIcons>
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
                    </RowIcons>
                    <RowIcons>
                        <div style={{width: '100%', height: '100%', overflowX:'scroll', display: 'flex'}}>
                        {latestNumbers.map(el => {
                            return(
                                <SmallNumberWrapper style={{background: `${el.color}`}}>{el.number}</SmallNumberWrapper>
                            )
                        })}
                        <div ref={scrollableDivRef}></div>
                        </div>
                    </RowIcons>
                </BottomContainerColumn>
            </SmallBottomColumn>
            <BigBottomColumn>
                <Chips />
            </BigBottomColumn>
            <SmallBottomColumn>
                {clearBetMenuOpen ? (
                    <BottomContainer></BottomContainer>
                ) : (
                    <BottomContainer>
                        <IconHolder whileTap={{scale: 0.95}}  whileHover={{scale: 1.05}} onClick={sendBet}>
                            <IconWrapper ><IconRound ><img src={placeBet} alt="whatever" /></IconRound></IconWrapper>
                            <IconName >PLACE BET</IconName>
                        </IconHolder>
                        <IconHolder whileTap={{scale: 0.95}}  whileHover={{scale: 1.05}} onClick={repeatBet}>
                            <IconWrapper ><IconRound><img src={repeat} alt="whatever" /></IconRound></IconWrapper>
                            <IconName>REPEAT</IconName>
                        </IconHolder>
                        <IconHolder whileTap={{scale: 0.95}} whileHover={{scale: 1.05}} >
                            <IconWrapper ><IconRound><img src={x2} alt="whatever" /></IconRound></IconWrapper>
                            <IconName>DOUBLE</IconName>
                        </IconHolder>
                        <IconHolder whileTap={{scale: 0.95}}  whileHover={{scale: 1.05}} onClick={clearAllBets}>
                            <IconWrapper whileTap={{scale: 0.95}}><IconRound ><img src={chips} alt="whatever" /><img src={cross} alt="cross" /></IconRound></IconWrapper>
                            <IconName>CLEAR ALL</IconName>
                        </IconHolder>
                        {/* <IconHolder >
                        <BettingText><span>{seconds}</span> seconds left!</BettingText>
                        </IconHolder> */}
                    </BottomContainer> 
                )}
            
            </SmallBottomColumn>
      </BottomRow>
      </DndContext>
    </RouletteSection>
    </motion.div>
        )}
    </AnimatePresence>
  )
}

export default RouletteTable




const LastRowWrapper = styled.div`
    width: calc(70vw * 2/13);
    height: calc(70vw/13);
    //transform: translateX(calc(70vw/26));
    position: relative;
    border: 1px solid ${props => props.theme.text};
    ${props => props.theme.displayFlexCenter};
    color: ${props => props.theme.text};
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
`;

const BetPerRowsWrapper = styled.div`
    width: calc(70vw * 4/13);
    height: calc(70vw/13);
    //transform: translateX(calc(70vw/26));
    position: relative;
    border: 1px solid ${props => props.theme.text};
    ${props => props.theme.displayFlexCenter};
    color: ${props => props.theme.text};
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
`;

const BorderTop = styled.div`
    width: 60%;
    height: 20px;
    background: transparent;
    position: absolute;
    top: -10%;
    left: 20%;
`;

const BorderLeft = styled.div`
    width: 20px;
    height: 60%;
    background: transparent;
    position: absolute;
    top: 20%;
    left: -15%;
`;


const Number = styled.div`
    width: calc(70vw/13);
    height: calc(70vw/13);
    border: 1px solid ${props => props.theme.text};
    position: relative;
    ${props => props.theme.displayFlexColumnCenter};
    color: white;
    font-size: 24px;
    cursor: pointer;
`;

const Zero = styled.div`
    width: calc(70vw/13);
    height: calc(70vw/13 * 1.5);
    border: 1px solid ${props => props.theme.text};
    position: relative;
    ${props => props.theme.displayFlexColumnCenter};
    color: white;
    font-size: 24px;
    cursor: pointer;
`;

const CornerLeft = styled(motion.div)`
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50px;
    //background: aqua;
    top: 0;
    left: 0;
    transform: translate(-50%,-50%);
    z-index: 9000;
`;

const SmallNumberWrapper = styled.div`
    width: 25px;
    height: 25px;
    margin: 0 2px;
    border-radius: 50%;
    flex-shrink: 0;
    ${props => props.theme.displayFlexCenter};
    color: ${props => props.theme.text};
    @media(min-width: 968px){
        width: 40px;
        height: 40px; 
    }
`;

const NumberWrapper = styled.div`
    width: 70%;
    height: 70%;
    border-radius: 50%;
    ${props => props.theme.displayFlexCenter};
    border: 1px solid orange;
    color: ${props => props.theme.text};
`;

const NumberZeroWrapper = styled.div`
    width: 70%;
    height: 50%;
    border-radius: 50%;
    ${props => props.theme.displayFlexCenter};
    border: 1px solid orange;
`;
