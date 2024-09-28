import React,{useState, useRef, useCallback, useEffect} from 'react';
import { useDroppable } from '@dnd-kit/core'; // Assuming you are using @dnd-kit for drag and drop
import {CornerDropArea,BorderLeftArea,BorderTopArea} from './DroppableAreas';
import {Number,NumberWrapper,NumberZeroWrapper,Zero,BetPerRowsWrapper,LastRowWrapper} from './index'
import {FirstRow, SecondRow, ThirdRow, BetPerRows, LastRow, Zeroes, BetPerColumns, LatestNumbers} from '../../pages/fakeData'

export const BetNumbersArea = ({ card,onLeave,droppedChips,setDroppedChips,droppedCornerChips,setDroppedCornerChips, droppedBorderLeftChips, setDroppedBorderLeftChips, droppedBorderTopChips, setDroppedBorderTopChips,
    checkSingleNumber,removeSingleNumber,removeBet,checkCornerLeft,removeCornerLeft,checkBorderLeft,removeBorderLeft,
    checkBorderTop,removeBorderTop
}) => {
    const { isOver, setNodeRef } = useDroppable({
        id: card.number,
    });

    if (!isOver && onLeave) {
        onLeave(card.number);
    }

    const number = card.number;

    return (
        <Number
            ref={setNodeRef}
            id={card.number}
            className="number-inactive"
            onMouseEnter={() => checkSingleNumber(number)}
            onMouseLeave={() => removeSingleNumber(number)}
            key={card.number}
        >
            <NumberWrapper style={{ background: `${card.color}` }}>{number}</NumberWrapper>

            <CornerDropArea 
                card={card}
                droppedCornerChips={droppedCornerChips}
                setDroppedCornerChips={setDroppedCornerChips}
                checkCornerLeft={checkCornerLeft}
                removeCornerLeft={removeCornerLeft}
                removeBet={removeBet}
            />
            <BorderLeftArea 
                card={card}
                droppedBorderLeftChips={droppedBorderLeftChips}
                setDroppedBorderLeftChips={setDroppedBorderLeftChips}
                checkBorderLeft={checkBorderLeft}
                removeBorderLeft={removeBorderLeft}
            />
            <BorderTopArea 
                card={card}
                droppedBorderTopChips={droppedBorderTopChips}
                setDroppedBorderTopChips={setDroppedBorderTopChips}
                checkBorderTop={checkBorderTop}
                removeBorderTop={removeBorderTop}
            />

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
                                onClick={() => removeBet(chip, droppedChips, setDroppedChips)}
                            />
                        ))}
                    </div>
                )
            }
        </Number>
    );
};

export const BetPerColumnsArea = ({card,onLeave,droppedColumnChips,setDroppedColumnChips,checkColumnNumbers,removeColumnNumbers,removeBet}) => {
    const { isOver, setNodeRef } = useDroppable({
      id: card.id,
    });
    if (!isOver && onLeave) {
        onLeave(card.id);
    }
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

export const ZeroesArea = ({card,onLeave,droppedChips,setDroppedChips,checkSingleNumber,removeSingleNumber,removeBet  }) => {
    const { isOver, setNodeRef } = useDroppable({
      id: card.number,
    });
    if (!isOver && onLeave) {
        onLeave(card.number);
    }
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

export const BetPerRowsArea = ({card,onLeave,droppedRowChips,setDroppedRowChips,checkRowNumbers,removeRowNumbers,removeBet  }) => {
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

export const LastRowArea = ({card,droppedLastRowChips,setDroppedLastRowChips,removeBet  }) => {
    const { isOver, setNodeRef } = useDroppable({
      id: card.id,
    });
    const numbers = card.numbers
    const name = card.name
    /* useEffect(() => {
        console.log(numbers)
    },[numbers]) */
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
