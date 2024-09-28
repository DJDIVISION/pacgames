import React from 'react';
import { useDroppable } from '@dnd-kit/core'; // Assuming you are using @dnd-kit for drag and drop
import Number from './Number'; // Import the Number component
import {CornerDropArea,BorderLeftArea,BorderTopArea} from './DroppableAreas';
import {Number,NumberWrapper} from './index'

const BetNumbersArea = ({ card, onLeave, droppedChips, setDroppedChips, droppedCornerChips, setDroppedCornerChips, droppedBorderLeftChips, setDroppedBorderLeftChips, droppedBorderTopChips, setDroppedBorderTopChips,
    onLeave, checkSingleNumber, removeSingleNumber, removeBet}) => {
    const { isOver, setNodeRef } = useDroppable({
        id: card.number,
    });

    if (!isOver && onLeave) {
        onLeave(card.number);
    }

    const borderTop = card.borderTop;
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
            />
            <BorderLeftArea 
                card={card}
                droppedBorderLeftChips={droppedBorderLeftChips}
                setDroppedBorderLeftChips={setDroppedBorderLeftChips}
            />
            <BorderTopArea 
                card={card}
                droppedBorderTopChips={droppedBorderTopChips}
                setDroppedBorderTopChips={setDroppedBorderTopChips}
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

export default BetNumbersArea;