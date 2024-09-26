import React,{useEffect, useState} from 'react'
import styled from 'styled-components'
import { RouletteSection,BigColumn,SmallColumn,Row,TopRow,BottomRow,BigBottomColumn,SmallBottomColumn,
    BottomContainer,IconHolder,IconWrapper,IconName,IconRound,BottomContainerColumn,RowIcons
 } from './indexTwo'
import {FirstRow, SecondRow, ThirdRow, BetPerRows, LastRow, Zeroes, BetPerColumns} from './fakeData'
import { motion } from 'framer-motion'
import { DndContext } from '@dnd-kit/core';
import { TouchSensor, MouseSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import Chips from '../components/roulette/Chips';
import './styles.css'
import blueChip from '../assets/chips/blue-chip.png'
import chips from '../assets/chips/poker-chips.png'
import cross from '../assets/chips/delete.png'
import repeat from '../assets/chips/repeat.png'
import x2 from '../assets/chips/x2.png'




const RouletteTwo = () => {

    const [placedBet, setPlacedBet] = useState(null);
    const [droppedChips, setDroppedChips] = useState({});
    const [droppedCornerChips, setDroppedCornerChips] = useState({});
    const [droppedRowChips, setDroppedRowChips] = useState({});
    const [droppedLastRowChips, setDroppedLastRowChips] = useState({});
    const [droppedColumnChips, setDroppedColumnChips] = useState({});
    const [droppedBorderLeftChips, setDroppedBorderLeftChips] = useState({});
    const [droppedBorderTopChips, setDroppedBorderTopChips] = useState({});
    const [selectedId, setSelectedId] = useState(null)
    const [activeContainer, setActiveContainer] = useState(null)
    const [allBets, setAllBets] = useState({})

    

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
                } else if (activeContainer.startsWith('borderL')){
                    const filter = allRows.filter(el => el.borderLeftId === activeContainer);
                    checkBorderLeft(filter[0].borderLeft)
                } else if (activeContainer.startsWith('borderT')){
                    const filter = allRows.filter(el => el.borderTopId === activeContainer);
                    checkBorderTop(filter[0].borderTop)
                } else if((activeContainer.startsWith('1') || activeContainer.startsWith('2') || activeContainer.startsWith('3'))){
                    console.log(activeContainer)
                    const filter = BetPerRows.filter(el => el.name === activeContainer);
                    const numbers = filter[0].numbers
                    console.log("12 numbers",numbers)
                    checkRowNumbers(numbers)
                } else if(['first', 'last', 'EVEN', 'ODD', 'black', 'red'].some(prefix => activeContainer.startsWith(prefix))){
                    const filter = LastRow.filter(el => el.id === activeContainer);
                    const numbers = filter[0].numbers
                    console.log("last row",numbers)
                    checkRowNumbers(numbers)
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
                        />
                    ))}
                    </div>
                )
                }
          </Number>
        );
    };

    const removeBet = (droppedChips,chip,number) => {
        setDroppedChips((prevDroppedChips) => {
            const updatedDroppedChips = { ...prevDroppedChips };
            delete updatedDroppedChips[number];  // Remove the entry for the specific number
            return updatedDroppedChips;
          });
    }
      

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
                        onClick={() => removeBet(droppedChips,chip,number)}
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
    
        // Function to update the chips and placed bets
        const updateChipsAndBets = (numberId,droppedNumberId, updateChipsFn, updateBetFn, betType) => {
            console.log("droppedID", droppedNumberId)
            updateChipsFn((prevChips) => ({
                ...prevChips,
                [droppedNumberId]: [...(prevChips[droppedNumberId] || []), { chipValue, chipImage }],
            }));
            const oldValue = placedBet;
            setPlacedBet(oldValue + chipValue);
    
            updateBetFn(numberId, betType);
        };
    
        const updateAllBets = (numberId, betType) => {
            setAllBets((prevBets) => {
                const existingBets = prevBets[numberId] || [];
                const existingBetIndex = existingBets.findIndex((bet) => bet.typeofBet === betType);
    
                let updatedBets;
                if (existingBetIndex !== -1) {
                    updatedBets = existingBets.map((bet, index) =>
                        index === existingBetIndex ? { ...bet, amount: bet.amount + chipValue } : bet
                    );
                } else {
                    updatedBets = [...existingBets, { amount: chipValue, typeofBet: betType }];
                }
    
                return {
                    ...prevBets,
                    [numberId]: updatedBets,
                };
            });
        };
    
        // Check if the droppedNumberId is a number
        if (!isNaN(droppedNumberId)) {
            updateChipsAndBets(droppedNumberId, droppedNumberId, setDroppedChips, (id) => updateAllBets(id, 'straight'), 'straight');
        } else if (droppedNumberId.startsWith('corner')) {
            const item = allRows.find(el => el.cornerLeftId === droppedNumberId);
            const numbers = item?.cornerLeft || [];
            numbers.forEach((numberId) => {
                updateChipsAndBets(numberId,droppedNumberId, setDroppedCornerChips, (id) => updateAllBets(id, `corner-${numbers.length}-bet`), `corner-${numbers.length}-bet`);
            })
        } else if (droppedNumberId.startsWith('borderLeft')) {
            const item = allRows.find(el => el.borderLeftId === droppedNumberId);
            const numbers = item?.borderLeft || [];
            numbers.forEach((numberId) => {
                updateChipsAndBets(numberId,droppedNumberId, setDroppedBorderLeftChips, (id) => updateAllBets(id, `borderLeft`), `borderLeft`);
            })
        } else if (droppedNumberId.startsWith('borderTop')) {
            const item = allRows.find(el => el.borderTopId === droppedNumberId);
            const numbers = item?.borderTop || [];
            numbers.forEach((numberId) => {
                updateChipsAndBets(numberId,droppedNumberId, setDroppedBorderTopChips, (id) => updateAllBets(id, `borderTop`), `borderTop`);
            })
        } else if (droppedNumberId.startsWith('1') || droppedNumberId.startsWith('2') || droppedNumberId.startsWith('3')) {
            console.log(droppedNumberId)
            const item = BetPerRows.find(el => el.name === droppedNumberId);
            const numbers = item?.numbers || [];
            numbers.forEach((numberId) => {
                updateChipsAndBets(numberId,droppedNumberId, setDroppedRowChips, (id) => updateAllBets(id, `12-numbers-bet`), `12-numbers-bet`);
            })
        } else if (['first', 'last', 'EVEN', 'ODD', 'black', 'red'].some(prefix => droppedNumberId.startsWith(prefix))) {
            console.log(droppedNumberId)
            const item = LastRow.find(el => el.id === droppedNumberId);
            const numbers = item?.numbers || [];
            numbers.forEach((numberId) => {
                updateChipsAndBets(numberId,droppedNumberId, setDroppedLastRowChips, (id) => updateAllBets(id, `last-row-bet`), `last-row-bet`);
            })
        } else if (droppedNumberId.startsWith('column')) {
            const item = BetPerColumns.find(el => el.id === droppedNumberId);
            const numbers = item?.numbers || [];
            numbers.forEach((numberId) => {
                updateChipsAndBets(numberId,droppedNumberId, setDroppedColumnChips, (id) => updateAllBets(id, `column-bet`), `column-bet`);
            })
        }
    }; 

    
    const clearAllBets = () => {
        /* const cells = document.querySelectorAll('.cell-active')
        cells.classList.remove('cell-active') */
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

    console.log(allBets)


  return (
    <RouletteSection>
         <DndContext onDragEnd={handleDragEnd} sensors={sensors} onDragOver={handleDragOver}>
            <TopRow>
      <SmallColumn>
        <div style={{marginLeft: 'auto'}}>
            {Zeroes.map((card,index) => {
                return(
                    <ZeroesArea card={card} key={index} onLeave={handleLeave}/>
                )
            })}
        </div>
      </SmallColumn>
      <BigColumn>
           
            <Row>
            
            {FirstRow.map((card,index) => {
                return(
                    <BetNumbersArea card={card} key={index} onLeave={handleLeave}/>
                )
            })}
            </Row>
            <Row>
            {SecondRow.map((card,index) => {
                return(
                    <BetNumbersArea card={card} key={index} onLeave={handleLeave}/>
                )
            })}
            </Row>
            <Row>
            {ThirdRow.map((card,index) => {
                return(
                    <BetNumbersArea card={card} key={index} onLeave={handleLeave}/>
                )
            })}
            </Row>
            <Row>
            {BetPerRows.map((card,index) => {
                return(
                    <BetPerRowsArea card={card} onLeave={handleLeave} key={index} />
                )
            })}
            </Row>
            <Row>
            {LastRow.map((card,index) => {
                return(
                    <LastRowArea card={card} onLeave={handleLeave} key={index} />
                )
            })}
            </Row>
            
            
      </BigColumn>
      <SmallColumn>
      <div style={{marginRight: 'auto'}}>
            {BetPerColumns.map((card,index) => {
                return(
                    <BetPerColumnsArea card={card} key={index} onLeave={handleLeave}/>
                )
            })}
        </div>
      </SmallColumn>
      </TopRow>
      <BottomRow>
            <SmallBottomColumn>
                <BottomContainerColumn>
                    <RowIcons>

                    </RowIcons>
                </BottomContainerColumn>
            </SmallBottomColumn>
            <BigBottomColumn>
                <Chips />
            </BigBottomColumn>
            <SmallBottomColumn>
            <BottomContainer>
            <IconHolder whileTap={{scale: 0.95}}>
                    <IconWrapper ><IconRound style={{backgroundImage: `url(${repeat})`, backgroundPosition: 'center',
                backgroundSize: 'cover'}}></IconRound></IconWrapper>
                    <IconName>REPEAT</IconName>
                </IconHolder>
                <IconHolder whileTap={{scale: 0.95}}>
                    <IconWrapper ><IconRound style={{backgroundImage: `url(${x2})`, backgroundPosition: 'center',
                backgroundSize: 'cover'}}></IconRound></IconWrapper>
                    <IconName>DOUBLE</IconName>
                </IconHolder>
                <IconHolder whileTap={{scale: 0.95}}>
                    <IconWrapper ><IconRound style={{backgroundImage: `url(${blueChip})`, backgroundPosition: 'center',
                backgroundSize: 'cover'}}><img src={cross} alt="cross" /></IconRound></IconWrapper>
                    <IconName>CLEAR BET</IconName>
                </IconHolder>
                <IconHolder whileTap={{scale: 0.95}} onClick={clearAllBets}>
                    <IconWrapper whileTap={{scale: 0.95}}><IconRound style={{backgroundImage: `url(${chips})`, backgroundPosition: 'center',
                backgroundSize: 'cover'}}><img src={cross} alt="cross" /></IconRound></IconWrapper>
                    <IconName>CLEAR ALL</IconName>
                </IconHolder>
            </BottomContainer>
            </SmallBottomColumn>
      </BottomRow>
      </DndContext>
    </RouletteSection>
  )
}

export default RouletteTwo

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

const NumberWrapper = styled.div`
    width: 70%;
    height: 70%;
    border-radius: 50%;
    ${props => props.theme.displayFlexCenter};
    border: 1px solid orange;
`;

const NumberZeroWrapper = styled.div`
    width: 70%;
    height: 50%;
    border-radius: 50%;
    ${props => props.theme.displayFlexCenter};
    border: 1px solid orange;
`;
