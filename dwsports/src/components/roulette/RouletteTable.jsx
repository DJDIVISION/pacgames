import React,{useEffect, useState, useRef} from 'react'
import styled from 'styled-components'
import { RouletteSection,BigColumn,SmallColumn,Row,TopRow,BottomRow,BigBottomColumn,SmallBottomColumn,
    BottomContainer,IconHolder,IconWrapper,IconName,IconRound,BottomContainerColumn,RowIcons,BottomContainerRow,
    SmallIconHolder,SmallTextHolder,BettingText
 } from '../../pages/indexTwo'
import {FirstRow, SecondRow, ThirdRow, BetPerRows, LastRow, Zeroes, BetPerColumns, LatestNumbers} from '../../pages/fakeData'
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
import { BalanceDisplay,PlacedBetDisplay,NumbersBetDisplay } from '../../pages/functions';
import { BetState } from '../../context/BetsContext'






const RouletteTable = ({setPlaceBets,placeBets,activeRoom,myId,socket,placedBet,setPlacedBet,
    allBets,setAllBets,droppedChips,setDroppedChips,droppedCornerChips,setDroppedCornerChips,droppedRowChips,setDroppedRowChips,
    droppedLastRowChips,setDroppedLastRowChips,droppedColumnChips,setDroppedColumnChips,droppedBorderLeftChips,setDroppedBorderLeftChips,
    droppedBorderTopChips,setDroppedBorderTopChips,lastBet,setLastBet
}) => {

    
    
    const [selectedId, setSelectedId] = useState(null)
    const [activeContainer, setActiveContainer] = useState(null)
    const [clearBetMenuOpen, setClearBetMenuOpen] = useState(false)
    const [seconds, setSeconds] = useState(null);
    const intervalRef = useRef(null);
    const [dragged, isDragged] = useState(false)
    const {balance, setBalance} = BetState();

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

    const getAllRows = () => {
        const allRows = FirstRow.concat(SecondRow).concat(ThirdRow)
        if(droppedChips){
            const droppedChipsKeys = Object.keys(droppedChips);
            droppedChipsKeys.forEach(chip => {
                document.getElementById(chip).style.filter = `drop-shadow(0 0 5px aqua);`
                
            })
        }
        if(droppedCornerChips){
            const droppedChipsKeys = Object.keys(droppedCornerChips);
            droppedChipsKeys.forEach(chip => {
                const filter = allRows.filter(el => el.cornerLeftId === chip)
                const numbers = filter[0].cornerLeft
                numbers.forEach(number => {
                    document.getElementById(number).classList.add("cell-active");
                })
            })
        }
        if(droppedBorderLeftChips){
            const droppedChipsKeys = Object.keys(droppedBorderLeftChips);
            droppedChipsKeys.forEach(chip => {
                const filter = allRows.filter(el => el.borderLeftId === chip)
                const numbers = filter[0].borderLeft
                numbers.forEach(number => {
                    document.getElementById(number).classList.add("cell-active");
                })
            })
        }
        if(droppedBorderTopChips){
            const droppedChipsKeys = Object.keys(droppedBorderTopChips);
            droppedChipsKeys.forEach(chip => {
                console.log(chip)
                const filter = allRows.filter(el => el.borderTopId === chip)
                const numbers = filter[0].borderTop
                numbers.forEach(number => {
                    document.getElementById(number).classList.add("cell-active");
                })
            })
        }
        if(droppedRowChips){
            const droppedChipsKeys = Object.keys(droppedRowChips);
            droppedChipsKeys.forEach(chip => {
                const filter = BetPerRows.filter(el => el.name === chip)
                const numbers = filter[0].numbers
                numbers.forEach(number => {
                    document.getElementById(number).classList.add("cell-active");
                })
            })
        }
        if(droppedLastRowChips){
            const droppedChipsKeys = Object.keys(droppedLastRowChips);
            droppedChipsKeys.forEach(chip => {
                const filter = LastRow.filter(el => el.id === chip)
                const numbers = filter[0].numbers
                numbers.forEach(number => {
                    document.getElementById(number).classList.add("cell-active");
                })
            })
        }
        if(droppedColumnChips){
            const droppedChipsKeys = Object.keys(droppedColumnChips);
            droppedChipsKeys.forEach(chip => {
                const filter = BetPerColumns.filter(el => el.id === chip)
                const numbers = filter[0].numbers
                numbers.forEach(number => {
                    document.getElementById(number).classList.add("cell-active");
                })
            })
        }
        if(activeContainer){
            if(!isNaN(activeContainer)){
                checkSingleNumber(activeContainer)
            } else {
                if (activeContainer.startsWith('corner')){
                    const filter = allRows.filter(el => el.cornerLeftId === activeContainer);
                    checkCornerLeft(filter[0].cornerLeft)
                } else if (activeContainer.startsWith('split')){
                    const filter = allRows.filter(el => el.borderLeftId === activeContainer);
                    checkBorderLeft(filter[0].borderLeft)
                } else if (activeContainer.startsWith('borderT')){
                    const filter = allRows.filter(el => el.borderTopId === activeContainer);
                    checkBorderTop(filter[0].borderTop)
                } else if((activeContainer.startsWith('1') || activeContainer.startsWith('2') || activeContainer.startsWith('3'))){
                    const filter = BetPerRows.filter(el => el.name === activeContainer);
                    const numbers = filter[0].numbers
                    checkRowNumbers(numbers)
                } else if(['first', 'last', 'EVEN', 'ODD', 'black', 'red'].some(prefix => activeContainer.startsWith(prefix))){
                    const filter = LastRow.filter(el => el.id === activeContainer);
                    const numbers = filter[0].numbers
                    checkRowNumbers(numbers)
                } else if(activeContainer.startsWith('column')){
                    const filter = BetPerColumns.filter(el => el.id === activeContainer);
                    const numbers = filter[0].numbers
                    checkColumnNumbers(numbers)
                }
            }
        } else if(activeContainer === null){
            console.log("null")
            
        }
    };

    useEffect(() => {
        getAllRows();
    }, [droppedChips,droppedCornerChips,droppedBorderLeftChips,droppedBorderTopChips,activeContainer,droppedRowChips,
        droppedLastRowChips,droppedColumnChips
    ])

    
    const CornerDropArea = ({ card }) => {
        const { isOver, setNodeRef } = useDroppable({
          id: `corner-${card.number}`, // Unique ID for the corner area
        });
        const cornerLeft = card.cornerLeft
        return (
            <CornerLeft ref={setNodeRef} id={`corner-${card.number}`} onMouseEnter={() => checkCornerLeft(cornerLeft)} onMouseLeave={() => removeCornerLeft(cornerLeft)}>
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
          id: `borderLeft-${card.number}`, // Unique ID for the corner area
        });
        const borderLeft = card.borderLeft
        const wrappedId = "borderLeft-"+card.number
        return (
            <BorderLeft ref={setNodeRef} id={`borderLeft-${card.number}`} onMouseEnter={() => checkBorderLeft(borderLeft)} onMouseLeave={() => removeBorderLeft(borderLeft)}>
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
        return (
            <BorderTop ref={setNodeRef} id={`borderTop-${card.number}`} onMouseEnter={() => checkBorderTop(borderTop)} onMouseLeave={() => removeBorderTop(borderTop)}>
            {/* Display chips if there are any */}
            {droppedBorderTopChips[wrappedId]?.length > 0 && (
              <div className="corner-chips">
                {droppedBorderTopChips[`borderTop-${card.number}`].map((chip, index) => (
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

      const ZeroesArea = ({card,onLeave  }) => {
        const { isOver, setNodeRef } = useDroppable({
          id: card.number,
        });
        if (!isOver && onLeave) {
            onLeave(card.number);
          }
        const borderTop = card.borderTop
        const number = card.number
        return (
          <Zero ref={setNodeRef} id={card.number} className="number-inactive"  onMouseEnter={() => checkSingleNumber(number)} onMouseLeave={() => removeSingleNumber(number)}
           key={card.number}  >
            <NumberZeroWrapper style={{background: `${card.color}`}}  >{number}</NumberZeroWrapper>
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
          <BetPerRowsWrapper ref={setNodeRef} id={name} className="number-inactive"  onMouseEnter={() => checkRowNumbers(numbers)} onMouseLeave={() => removeRowNumbers(numbers)}
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
            onLeave(card.name);
          }
        const name = card.name
        const numbers = card.numbers
        return (
          <LastRowWrapper style={{background: `${card.color}`}} ref={setNodeRef} id={card.id} className="number-inactive"  onMouseEnter={() => checkRowNumbers(numbers)} onMouseLeave={() => removeRowNumbers(numbers)}
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
          <Number ref={setNodeRef} id={card.id} className="number-inactive"  onMouseEnter={() => checkColumnNumbers(numbers)} onMouseLeave={() => removeColumnNumbers(numbers)}
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
                        className="roulette-dropped-chip"
                        onClick={() => removeBet(chip,droppedColumnChips,setDroppedColumnChips)}
                        />
                    ))}
                    </div>
                )
                }
          </Number>
        );
    };

    const BetNumbersArea = ({card,onLeave  }) => {
        const { isOver, setNodeRef } = useDroppable({
          id: card.number,
        });
        if (!isOver && onLeave) {
            onLeave(card.number);
          }
        const borderTop = card.borderTop
        const number = card.number
        return (
          <Number ref={setNodeRef} id={card.number} className="number-inactive"  onMouseEnter={() => checkSingleNumber(number)} onMouseLeave={() => removeSingleNumber(number)}
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
    

    


    

    

    const checkCornerLeft = (cornerLeft) => {
        cornerLeft.forEach(el => {
            const item = document.getElementById(el)
            item.classList.add('number-active')
            
        })
    }
    const removeCornerLeft = (cornerLeft) => {
        cornerLeft.forEach(el => {
            const item = document.getElementById(el)
            item.classList.remove('number-active')
            
        })
    }
    const checkBorderLeft = (borderLeft) => {
        borderLeft.forEach(el => {
            const item = document.getElementById(el)
            item.classList.add('number-active')
            
        })
    }
    const removeBorderLeft = (borderLeft) => {
        borderLeft.forEach(el => {
            const item = document.getElementById(el)
            item.classList.remove('number-active')
            
        })
    }
    const checkBorderTop = (borderTop) => {
        borderTop.forEach(el => {
            const item = document.getElementById(el)
            item.classList.add('number-active')
            
        })
    }
    const removeBorderTop = (borderTop) => {
        borderTop.forEach(el => {
            const item = document.getElementById(el)
            item.classList.remove('number-active')
            
        })
    }
    const checkRowNumbers = (numbers) => {
        numbers.forEach(el => {
            const item = document.getElementById(el)
            item.classList.add('number-active')
            
        })
    }
    const removeRowNumbers = (numbers) => {
        numbers.forEach(el => {
            const item = document.getElementById(el)
            item.classList.remove('number-active')
            
        })
    }
    const checkColumnNumbers = (numbers) => {
        numbers.forEach(el => {
            const item = document.getElementById(el)
            item.classList.add('number-active')
            
        })
    }
    const removeColumnNumbers = (numbers) => {
        numbers.forEach(el => {
            const item = document.getElementById(el)
            item.classList.remove('number-active')
            
        })
    }
    const checkSingleNumber = (number) => {
        const item = document.getElementById(number)
        item.classList.add('number-active')
    }
    const removeSingleNumber = (number) => {
        const item = document.getElementById(number)
        item.classList.remove('number-active')
    }

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor, {
          activationConstraint: {
            distance: 10, // Start dragging after 10px of movement
          },
        })
    );

    const handleDragOver = (event) => {
        const { over } = event;
        console.log(over)
        if (over) {
          setActiveContainer(over.id);
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
        let droppedNumberId = over?.id;
        const allRows = FirstRow.concat(SecondRow).concat(ThirdRow);
        const newBalance = balance - chipValue;
        setBalance(newBalance)
        // Function to update the chips and placed bets
        const updateChipsAndBets = (numberId,droppedNumberId, updateChipsFn, updateBetFn, betType) => {
            updateChipsFn((prevChips) => ({
                ...prevChips,
                [droppedNumberId]: [...(prevChips[droppedNumberId] || []), { chipValue, chipImage, betType, numberId, droppedNumberId }],
            }));
            console.log("numberId", numberId)
            console.log("droppedNumberId", droppedNumberId)
            const oldValue = placedBet;
            setPlacedBet(oldValue + chipValue);
            updateBetFn(numberId, betType, droppedNumberId);
        };
    
        const updateAllBets = (numberId, betType) => {
            setAllBets((prevBets) => {
                const existingBets = prevBets[numberId] || [];
                const existingBetIndex = existingBets.findIndex((bet) => bet.typeofBet === betType);
                let updatedBets;
                if (existingBetIndex !== -1) {
                    updatedBets = existingBets.map((bet, index) =>
                        index === existingBetIndex ? { ...bet, amount: bet.amount + chipValue, number: droppedNumberId } : bet
                    );
                } else {
                    updatedBets = [...existingBets, { amount: chipValue, typeofBet: betType, number: droppedNumberId }];
                }
    
                return {
                    ...prevBets,
                    [numberId]: updatedBets,
                };
            });
        };
    
        // Check if the droppedNumberId is a number
        if (!isNaN(droppedNumberId)) {
            updateChipsAndBets(droppedNumberId, droppedNumberId, setDroppedChips, (id) => updateAllBets(id, 'Straight'), 'Straight');
        } else if (droppedNumberId.startsWith('corner')) {
            const item = allRows.find(el => el.cornerLeftId === droppedNumberId);
            const numbers = item?.cornerLeft || [];
            if(numbers.length === 4){
                numbers.forEach((numberId) => {
                    updateChipsAndBets(numberId,droppedNumberId, setDroppedCornerChips, (id) => updateAllBets(id, `Corner`), `Corner`);
                })
            } else if(numbers.length === 6){
                numbers.forEach((numberId) => {
                    updateChipsAndBets(numberId,droppedNumberId, setDroppedCornerChips, (id) => updateAllBets(id, `Six Line`), `Six Line`);
                })
            }
        } else if (droppedNumberId.startsWith('split')) {
            console.log(droppedNumberId)
            const item = allRows.find(el => el.borderLeftId === droppedNumberId);
            const numbers = item?.borderLeft || [];
            numbers.forEach((numberId) => {
                updateChipsAndBets(numberId,droppedNumberId, setDroppedBorderLeftChips, (id) => updateAllBets(id, `Split`), `Split`);
            })
        } else if (droppedNumberId.startsWith('borderTop')) {
            const item = allRows.find(el => el.borderTopId === droppedNumberId);
            console.log(item)
            const numbers = item?.borderTop || [];
            console.log(numbers)
            if(numbers.length === 2){
                numbers.forEach((numberId) => {
                    updateChipsAndBets(numberId,droppedNumberId, setDroppedBorderTopChips, (id) => updateAllBets(id, `Split`), `Split`);
                }) 
            } else if(numbers.length === 3){
                numbers.forEach((numberId) => {
                    updateChipsAndBets(numberId,droppedNumberId, setDroppedBorderTopChips, (id) => updateAllBets(id, `Street`), `Street`);
                }) 
            }
        } else if (droppedNumberId.startsWith('1') || droppedNumberId.startsWith('2') || droppedNumberId.startsWith('3')) {
            const item = BetPerRows.find(el => el.name === droppedNumberId);
            const numbers = item?.numbers || [];
            numbers.forEach((numberId) => {
                updateChipsAndBets(numberId,droppedNumberId, setDroppedRowChips, (id) => updateAllBets(id, `Dozen`), `Dozen`);
            })
        } else if (droppedNumberId === "first-18") {
            const item = LastRow.find(el => el.id === droppedNumberId);
            const numbers = item?.numbers || [];
            numbers.forEach((numberId) => {
                updateChipsAndBets(numberId,droppedNumberId, setDroppedLastRowChips, (id) => updateAllBets(id, `Low (1-18)`), `Low (1-18)`);
            })
        } else if (droppedNumberId === "last-18") {
            const item = LastRow.find(el => el.id === droppedNumberId);
            const numbers = item?.numbers || [];
            numbers.forEach((numberId) => {
                updateChipsAndBets(numberId,droppedNumberId, setDroppedLastRowChips, (id) => updateAllBets(id, `High (19-36)`), `High (19-36)`);
            })
        } else if (droppedNumberId === "EVEN") {
            const item = LastRow.find(el => el.id === droppedNumberId);
            const numbers = item?.numbers || [];
            numbers.forEach((numberId) => {
                updateChipsAndBets(numberId,droppedNumberId, setDroppedLastRowChips, (id) => updateAllBets(id, `Even`), `Even`);
            })
        } else if (droppedNumberId === "ODD") {
            const item = LastRow.find(el => el.id === droppedNumberId);
            const numbers = item?.numbers || [];
            numbers.forEach((numberId) => {
                updateChipsAndBets(numberId,droppedNumberId, setDroppedLastRowChips, (id) => updateAllBets(id, `Odd`), `Odd`);
            })
        } else if (droppedNumberId === "blacks") {
            const item = LastRow.find(el => el.id === droppedNumberId);
            const numbers = item?.numbers || [];
            numbers.forEach((numberId) => {
                updateChipsAndBets(numberId,droppedNumberId, setDroppedLastRowChips, (id) => updateAllBets(id, `Blacks`), `Blacks`);
            })
        } else if (droppedNumberId === "reds") {
            const item = LastRow.find(el => el.id === droppedNumberId);
            const numbers = item?.numbers || [];
            numbers.forEach((numberId) => {
                updateChipsAndBets(numberId,droppedNumberId, setDroppedLastRowChips, (id) => updateAllBets(id, `Reds`), `Reds`);
            })
        } else if (droppedNumberId.startsWith('column')) {
            const item = BetPerColumns.find(el => el.id === droppedNumberId);
            const numbers = item?.numbers || [];
            numbers.forEach((numberId) => {
                updateChipsAndBets(numberId,droppedNumberId, setDroppedColumnChips, (id) => updateAllBets(id, `Column`), `Column`);
            })
        }
    }; 
    
    const clearAllBets = () => {
        setActiveContainer(null)
        setBalance(balance + placedBet)
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

    const sendBet =  () => {
      if (placedBet > 0) {
        console.log("bet sended")
        socket?.emit("placeBet", {
            playerBets: allBets,
            roomId: activeRoom,
            playerId: myId,
            placedBet: placedBet,
            droppedChips: droppedChips,
            droppedCornerChips: droppedCornerChips,
            droppedRowChips: droppedRowChips,
            droppedLastRowChips: droppedLastRowChips,
            droppedColumnChips: droppedColumnChips,
            droppedBorderLeftChips: droppedBorderLeftChips,
            droppedBorderTopChips: droppedBorderTopChips
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
         <DndContext onDragEnd={handleDragEnd} sensors={sensors} onDragOver={handleDragOver}>
            <TopRow>
      <SmallColumn>
        <div style={{marginLeft: 'auto'}}>
            {Zeroes.map((card,index) => {
                return(
                    <ZeroesArea card={card} key={index} onLeave={handleLeave} droppedChips={droppedChips} setDroppedChips={setDroppedChips}
                    checkSingleNumber={checkSingleNumber} removeSingleNumber={removeSingleNumber} removeBet={removeBet}/>
                )
            })}
        </div>
      </SmallColumn>
      <BigColumn>
            <Row>
            {FirstRow.map((card,index) => {  
                return(
                    <BetNumbersArea key={index}
                        card={card} onLeave={handleLeave} droppedChips={droppedChips} setDroppedChips={setDroppedChips} droppedCornerChips={droppedCornerChips} setDroppedCornerChips={setDroppedCornerChips} 
                        droppedBorderLeftChips={droppedBorderLeftChips} setDroppedBorderLeftChips={setDroppedBorderLeftChips} droppedBorderTopChips={droppedBorderTopChips} setDroppedBorderTopChips={setDroppedBorderTopChips} 
                        checkSingleNumber={checkSingleNumber} removeSingleNumber={removeSingleNumber} removeBet={removeBet} checkCornerLeft={checkCornerLeft} removeCornerLeft={removeCornerLeft} 
                        checkBorderLeft={checkBorderLeft} removeBorderLeft={removeBorderLeft} checkBorderTop={checkBorderTop} removeBorderTop={removeBorderTop}
                    />
                )
            })}
            </Row>
            <Row>
            {SecondRow.map((card,index) => {
                return(
                    <BetNumbersArea key={index}card={card} onLeave={handleLeave} droppedChips={droppedChips} setDroppedChips={setDroppedChips} droppedCornerChips={droppedCornerChips} setDroppedCornerChips={setDroppedCornerChips} droppedBorderLeftChips={droppedBorderLeftChips} setDroppedBorderLeftChips={setDroppedBorderLeftChips} droppedBorderTopChips={droppedBorderTopChips} setDroppedBorderTopChips={setDroppedBorderTopChips} checkSingleNumber={checkSingleNumber} removeSingleNumber={removeSingleNumber} removeBet={removeBet} checkCornerLeft={checkCornerLeft} removeCornerLeft={removeCornerLeft} checkBorderLeft={checkBorderLeft} removeBorderLeft={removeBorderLeft} checkBorderTop={checkBorderTop} removeBorderTop={removeBorderTop} 
                    />
                )
            })}
            </Row>
            <Row>
            {ThirdRow.map((card,index) => {
                return(
                    <BetNumbersArea key={index}
                        card={card} onLeave={handleLeave} droppedChips={droppedChips} setDroppedChips={setDroppedChips} droppedCornerChips={droppedCornerChips} setDroppedCornerChips={setDroppedCornerChips} 
                        droppedBorderLeftChips={droppedBorderLeftChips} setDroppedBorderLeftChips={setDroppedBorderLeftChips} droppedBorderTopChips={droppedBorderTopChips} setDroppedBorderTopChips={setDroppedBorderTopChips} 
                        checkSingleNumber={checkSingleNumber} removeSingleNumber={removeSingleNumber} removeBet={removeBet} checkCornerLeft={checkCornerLeft} removeCornerLeft={removeCornerLeft} 
                        checkBorderLeft={checkBorderLeft} removeBorderLeft={removeBorderLeft} checkBorderTop={checkBorderTop} removeBorderTop={removeBorderTop}
                    />
                )
            })}
            </Row>
            <Row>
            {BetPerRows.map((card,index) => {
                return(
                    <BetPerRowsArea card={card} onLeave={handleLeave} key={index} droppedRowChips={droppedRowChips} setDroppedRowChips={setDroppedRowChips}
                    checkRowNumbers={checkRowNumbers} removeRowNumbers={removeRowNumbers} removeBet={removeBet}/>
                )
            })}
            </Row>
            <Row>
            {LastRow.map((card,index) => {
                return(
                    <LastRowArea card={card} key={index} droppedLastRowChips={droppedLastRowChips} setDroppedLastRowChips={setDroppedLastRowChips}
                    removeBet={removeBet} activeContainer={activeContainer} checkRowNumbers={checkRowNumbers} removeRowNumbers={removeRowNumbers}/>
                )
            })}
            </Row>
      </BigColumn>
      <SmallColumn>
      <div style={{marginRight: 'auto'}}>
            {BetPerColumns.map((card,index) => {
                return(
                    <BetPerColumnsArea card={card} key={index} onLeave={handleLeave} droppedColumnChips={droppedColumnChips} setDroppedColumnChips={setDroppedColumnChips}
                    checkColumnNumbers={checkColumnNumbers} removeColumnNumbers={removeColumnNumbers} removeBet={removeBet}/>
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
                        {LatestNumbers.map(el => {
                            return(
                                <SmallNumberWrapper style={{background: `${el.color}`}}>{el.number}</SmallNumberWrapper>
                            )
                        })}
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
                        <IconHolder whileTap={{scale: 0.95}} onClick={sendBet}>
                            <IconWrapper ><IconRound style={{backgroundImage: `url(${placeBet})`, backgroundPosition: 'center',
                        backgroundSize: 'cover'}}></IconRound></IconWrapper>
                            <IconName >PLACE BET</IconName>
                        </IconHolder>
                        <IconHolder whileTap={{scale: 0.95}} onClick={repeatBet}>
                            <IconWrapper ><IconRound style={{backgroundImage: `url(${repeat})`, backgroundPosition: 'center',
                        backgroundSize: 'cover'}}></IconRound></IconWrapper>
                            <IconName>REPEAT</IconName>
                        </IconHolder>
                        <IconHolder whileTap={{scale: 0.95}}>
                            <IconWrapper ><IconRound style={{backgroundImage: `url(${x2})`, backgroundPosition: 'center',
                        backgroundSize: 'cover'}}></IconRound></IconWrapper>
                            <IconName>DOUBLE</IconName>
                        </IconHolder>
                        <IconHolder whileTap={{scale: 0.95}} onClick={clearAllBets}>
                            <IconWrapper whileTap={{scale: 0.95}}><IconRound style={{backgroundImage: `url(${chips})`, backgroundPosition: 'center',
                        backgroundSize: 'cover'}}><img src={cross} alt="cross" /></IconRound></IconWrapper>
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
    width: calc(70vw * 2/12);
    height: calc(70vw/12);
    position: relative;
    border: 1px solid ${props => props.theme.text};
    ${props => props.theme.displayFlexCenter};
    color: ${props => props.theme.text};
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
`;

const BetPerRowsWrapper = styled.div`
    width: calc(70vw * 4/12);
    height: calc(70vw/12);
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
    width: calc(70vw/12);
    height: calc(70vw/12);
    border: 1px solid ${props => props.theme.text};
    position: relative;
    ${props => props.theme.displayFlexColumnCenter};
    color: white;
    font-size: 24px;
    cursor: pointer;
`;

const Zero = styled.div`
    width: calc(70vw/12);
    height: calc(70vw/12 * 1.5);
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
