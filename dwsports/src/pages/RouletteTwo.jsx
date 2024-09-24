import React,{useEffect, useState} from 'react'
import styled from 'styled-components'
import { RouletteSection,BigColumn,SmallColumn,Row } from './indexTwo'
import {FirstRow, SecondRow, ThirdRow, BetPerRows, LastRow} from './fakeData'
import { motion } from 'framer-motion'
import { DndContext } from '@dnd-kit/core';
import { TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useDroppable } from '@dnd-kit/core';
import Chips from '../components/blackjack/Chips';
import './styles.css'



const RouletteTwo = () => {

    const [placedBet, setPlacedBet] = useState(null);
    const [droppedChips, setDroppedChips] = useState({});
    const [droppedCornerChips, setDroppedCornerChips] = useState({});
    const [droppedBorderLeftChips, setDroppedBorderLeftChips] = useState({});
    const [droppedBorderTopChips, setDroppedBorderTopChips] = useState({});
    const [droppedChipValue, setDroppedChipValue] = useState(null);
    const [droppedCornerChipValue, setDroppedCornerChipValue] = useState(null);
    const [droppedBorderLeftChipValue, setDroppedBorderLeftChipValue] = useState(null);
    const [droppedBorderTopChipValue, setDroppedBorderTopChipValue] = useState(null);
    const [selectedId, setSelectedId] = useState(null)

    console.log(droppedCornerChips)
    console.log(droppedBorderLeftChips)
    console.log(droppedChips)
    console.log(placedBet)

    const getAllRows = () => {
        const allRows = FirstRow.concat(SecondRow).concat(ThirdRow)
        console.log(allRows)
        if(droppedChips){
            const droppedChipsKeys = Object.keys(droppedChips);
            droppedChipsKeys.forEach(chip => {
                document.getElementById(chip).classList.add("cell-active");
            })
        }
        if(droppedCornerChips){
            const droppedChipsKeys = Object.keys(droppedCornerChips);
            droppedChipsKeys.forEach(chip => {
                const filter = allRows.filter(el => el.cornerLeftId === chip)
                console.log(filter);
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
                console.log(filter);
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
                console.log(filter);
                const numbers = filter[0].borderTop
                numbers.forEach(number => {
                    document.getElementById(number).classList.add("cell-active");
                })
            })
        }
    }

    useEffect(() => {
        getAllRows();
    }, [droppedChips,droppedCornerChips,droppedBorderLeftChips,droppedBorderTopChips])

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
                    style={{ margin: '2px', transform: 'scale(0.5)' }}
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
                    style={{ transform: 'scale(0.5)' }}
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
                {droppedBorderTopChips[wrappedId].map((chip, index) => (
                  <img
                    key={index}
                    src={chip.chipImage}
                    alt={`Chip ${chip.chipValue}`}
                    className="borderTop-dropped-chip"
                    style={{ transform: 'scale(0.5)' }}
                  />
                ))}
              </div>
            )}
          </BorderTop>
        );
      };

    const BetNumbersArea = ({card }) => {
        const { isOver, setNodeRef } = useDroppable({
          id: card.number,
        });
        const borderTop = card.borderTop
        const number = card.number
        
        return (
          <Number ref={setNodeRef} onMouseEnter={() => checkSingleNumber(number)} onMouseLeave={() => removeSingleNumber(number)}
           key={card.number} id={card.number} className="number-inactive">
            <CornerDropArea 
                card={card} 
                droppedCornerChips={droppedCornerChips} 
                setDroppedCornerChips={setDroppedCornerChips} 
            />
            <BorderLeftArea card={card} droppedBorderLeftChips={droppedBorderLeftChips} setDroppedBorderLeftChips={setDroppedBorderLeftChips}/>
            <BorderTopArea card={card} droppedBorderTopChips={droppedBorderTopChips} setDroppedBorderTopChips={setDroppedBorderTopChips}/>
            {
                !droppedChips[number] || droppedChips[number].length === 0 ? (
                    <NumberWrapper style={{background: `${card.color}`}}>{number}</NumberWrapper>
                ) : (
                    <div className="roulette-dropped-chips">
                    {droppedChips[number].map((chip, index) => (
                        <img
                        key={index}
                        src={chip.chipImage}
                        alt={`Chip ${chip.chipValue}`}
                        className="roulette-dropped-chip"
                        style={{ margin: '10px 10px', transform: 'scale(0.8)' }}
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
        if(event.over){
            console.log(event.over.id)
        }
      }


    const handleDragEnd = (event) => {
        const { over, active } = event;
        console.log("over", over)
        console.log("active", active)
        // Check if the chip was dropped in the bet area
        const chipValue = active.data.current.chipValue;
        const chipImage = active.data.current.chipImage;
        const droppedNumberId = over.id;
        console.log(droppedNumberId)
        if(!isNaN(droppedNumberId)){
            setDroppedChips((prevChips) => ({
                ...prevChips,
                [droppedNumberId]: [...(prevChips[droppedNumberId] || []), { chipValue, chipImage }],
            }));
            if (chipValue === null) {
                setPlacedBet(chipValue);
                setDroppedChipValue(chipValue);
            } else {
                const oldValue = placedBet
                setPlacedBet(oldValue + chipValue)
                setDroppedChipValue(chipValue);
            }
        } else {
            if (droppedNumberId.startsWith('corner')) {
                setDroppedCornerChips((prevChips) => ({
                    ...prevChips,
                    [droppedNumberId]: [...(prevChips[droppedNumberId] || []), { chipValue, chipImage }],
                }));
                if (chipValue === null) {
                    setPlacedBet(chipValue);
                    setDroppedCornerChipValue(chipValue);
                } else {
                    const oldValue = placedBet
                    setPlacedBet(oldValue + chipValue)
                    setDroppedCornerChipValue(chipValue);
                }
            } else if (droppedNumberId.startsWith('borderLeft')) {
                setDroppedBorderLeftChips((prevChips) => ({
                    ...prevChips,
                    [droppedNumberId]: [...(prevChips[droppedNumberId] || []), { chipValue, chipImage }],
                }));
                if (chipValue === null) {
                    setPlacedBet(chipValue);
                    setDroppedBorderLeftChipValue(chipValue);
                } else {
                    const oldValue = placedBet
                    setPlacedBet(oldValue + chipValue)
                    setDroppedBorderLeftChipValue(chipValue);
                }
            } else if (droppedNumberId.startsWith('borderTop')) {
                setDroppedBorderTopChips((prevChips) => ({
                    ...prevChips,
                    [droppedNumberId]: [...(prevChips[droppedNumberId] || []), { chipValue, chipImage }],
                }));
                if (chipValue === null) {
                    setPlacedBet(chipValue);
                    setDroppedBorderTopChipValue(chipValue);
                } else {
                    const oldValue = placedBet
                    setPlacedBet(oldValue + chipValue)
                    setDroppedBorderTopChipValue(chipValue);
                }
            }
        }
        
        
    };



  return (
    <RouletteSection>
      <SmallColumn></SmallColumn>
      <BigColumn>
            <DndContext onDragEnd={handleDragEnd} sensors={sensors} onDragOver={handleDragOver}>
            <Row>
            {FirstRow.map((card,index) => {
                return(
                    <BetNumbersArea card={card} key={index}/>
                )
            })}
            </Row>
            <Row>
            {SecondRow.map((card,index) => {
                return(
                    <BetNumbersArea card={card} key={index}/>
                )
            })}
            </Row>
            <Row>
            {ThirdRow.map((card,index) => {
                return(
                    <BetNumbersArea card={card} key={index}/>
                )
            })}
            </Row>
            <Row>
            {BetPerRows.map((card,index) => {
                const numbers = card.numbers
                return(
                    <BetPerRowsWrapper onMouseEnter={() => checkRowNumbers(numbers)} onMouseLeave={() => removeRowNumbers(numbers)} className="number-inactive" key={card.numbers}>
                        {card.name}
                    </BetPerRowsWrapper>
                )
            })}
            </Row>
            <Row>
            {LastRow.map((card,index) => {
                const numbers = card.numbers
                const color = card.color
                return(
                    <LastRowWrapper onMouseEnter={() => checkRowNumbers(numbers)} onMouseLeave={() => removeRowNumbers(numbers)} className="number-inactive" key={card.numbers}
                    style={{background: `${color}`}}>
                        {card.name}
                    </LastRowWrapper>
                )
            })}
            </Row>
            <Row>
                <Chips />
            </Row>
            </DndContext>
      </BigColumn>
      <SmallColumn></SmallColumn>
    </RouletteSection>
  )
}

export default RouletteTwo

const LastRowWrapper = styled.div`
    width: calc(70vw * 2/12);
    height: calc(70vw/12);
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
    border: 1px solid ${props => props.theme.text};
    ${props => props.theme.displayFlexCenter};
    color: ${props => props.theme.text};
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
`;

const BorderTop = styled.div`
    width: 85%;
    height: 10px;
    background: transparent;
    position: absolute;
    top: -5px;
    left: 10px;
`;

const BorderLeft = styled.div`
    width: 10px;
    height: 80%;
    background: transparent;
    position: absolute;
    top: 20px;
    left: 0px;
    transform:translate(-50%, -10%);
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

const CornerLeft = styled(motion.div)`
    position: absolute;
    width: 15px;
    height: 15px;
    border-radius: 50px;
    background: aqua;
    top: 0;
    left: 0;
    transform: translate(-50%,-50%);
    &:hover{
        background: yellow;
    }
`;

const NumberWrapper = styled.div`
    width: 70%;
    height: 70%;
    border-radius: 50%;
    ${props => props.theme.displayFlexCenter};
    border: 1px solid orange;
`;
