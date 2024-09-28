import React from 'react';
import { useDroppable } from '@dnd-kit/core'; 
import { BorderLeft, BorderTop, CornerLeft } from './index';


export const CornerDropArea = ({ card, droppedCornerChips, setDroppedCornerChips,checkCornerLeft,removeCornerLeft,removeBet }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: `corner-${card.number}`, // Unique ID for the corner area
    });
    const cornerLeft = card.cornerLeft;
    
    return (
        <CornerLeft
            ref={setNodeRef}
            id={`corner-${card.number}`}
            onMouseEnter={() => checkCornerLeft(cornerLeft)}
            onMouseLeave={() => removeCornerLeft(cornerLeft)}
        >
            {droppedCornerChips[card.cornerLeftId]?.length > 0 && (
                <div className="corner-chips">
                    {droppedCornerChips[card.cornerLeftId].map((chip, index) => (
                        <img
                            key={index}
                            src={chip.chipImage}
                            alt={`Chip ${chip.chipValue}`}
                            className="corner-dropped-chip"
                            onClick={() => removeBet(chip, droppedCornerChips, setDroppedCornerChips)}
                        />
                    ))}
                </div>
            )}
        </CornerLeft>
    );
};

export const BorderLeftArea = ({ card,droppedBorderLeftChips,setDroppedBorderLeftChips,checkBorderLeft,removeBorderLeft,removeBet }) => {
    const { isOver, setNodeRef } = useDroppable({
      id: `split-${card.number}`, // Unique ID for the corner area
    });
    const borderLeft = card.borderLeft
    const wrappedId = "split-"+card.number
    return (
        <BorderLeft ref={setNodeRef} id={`split-${card.number}`} onMouseEnter={() => checkBorderLeft(borderLeft)} onMouseLeave={() => removeBorderLeft(borderLeft)}>
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

export const BorderTopArea = ({ card, droppedBorderTopChips, setDroppedBorderTopChips,checkBorderTop,removeBorderTop,removeBet }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: `borderTop-${card.number}`, // Unique ID for the border-top area
    });

    return (
        <BorderTop
            ref={setNodeRef}
            id={`borderTop-${card.number}`}
            onMouseEnter={() => checkBorderTop(card.borderTop)}
            onMouseLeave={() => removeBorderTop(card.borderTop)}
        >
            {droppedBorderTopChips[card.borderTopId]?.length > 0 && (
                <div className="border-top-chips">
                    {droppedBorderTopChips[card.borderTopId].map((chip, index) => (
                        <img
                            key={index}
                            src={chip.chipImage}
                            alt={`Chip ${chip.chipValue}`}
                            className="borderTop-dropped-chip"
                            onClick={() => removeBet(chip, droppedBorderTopChips, setDroppedBorderTopChips)}
                        />
                    ))}
                </div>
            )}
        </BorderTop>
    );
};