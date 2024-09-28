import React from 'react';
import { useDroppable } from '@dnd-kit/core'; 
import { BorderLeft, BorderTop, CornerLeft } from './index';


export const CornerDropArea = ({ card, droppedCornerChips, setDroppedCornerChips }) => {
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

export const BorderLeftArea = ({ card,droppedBorderLeftChips,setDroppedBorderLeftChips }) => {
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

export const BorderTopArea = ({ card, droppedBorderTopChips, setDroppedBorderTopChips }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: `border-top-${card.number}`, // Unique ID for the border-top area
    });

    return (
        <BorderTop
            ref={setNodeRef}
            id={`border-top-${card.number}`}
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
                            className="border-top-dropped-chip"
                            onClick={() => removeBet(chip, droppedBorderTopChips, setDroppedBorderTopChips)}
                        />
                    ))}
                </div>
            )}
        </BorderTop>
    );
};