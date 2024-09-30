import React from 'react';
import { useDroppable } from '@dnd-kit/core'; 
import { BorderLeft, BorderTop, CornerLeft } from './index';


export const CornerDropArea = ({ card, allDroppedCornerChips }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: `corner-${card.number}`, // Unique ID for the corner area
    });
    const cornerLeft = card.cornerLeft;
    
    return (
        <CornerLeft
            ref={setNodeRef}
            id={`corner-${card.number}`}
        >
            {allDroppedCornerChips[card.cornerLeftId]?.length > 0 && (
                <div className="corner-chips">
                    {allDroppedCornerChips[card.cornerLeftId].map((chip, index) => (
                        <img
                            key={index}
                            src={chip.avatar}
                            alt={`Chip ${chip.chipValue}`}
                            className="corner-dropped-chip-small"
                        />
                    ))}
                </div>
            )}
        </CornerLeft>
    );
};

export const BorderLeftArea = ({ card,allDroppedBorderLeftChips }) => {
    const { isOver, setNodeRef } = useDroppable({
      id: `split-${card.number}`, // Unique ID for the corner area
    });
    const borderLeft = card.borderLeft
    const wrappedId = "split-"+card.number
    return (
        <BorderLeft ref={setNodeRef} id={`split-${card.number}`}>
        {/* Display chips if there are any */}
        {allDroppedBorderLeftChips[wrappedId]?.length > 0 && (
          <div className="corner-chips">
            {allDroppedBorderLeftChips[wrappedId].map((chip, index) => (
              <img
                key={index}
                src={chip.avatar}
                alt={`Chip ${chip.chipValue}`}
                className="borderLeft-dropped-chip-small"
              />
            ))}
          </div>
        )}
      </BorderLeft>
    );
};

export const BorderTopArea = ({ card, allDroppedBorderTopChips }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: `borderTop-${card.number}`, // Unique ID for the border-top area
    });

    return (
        <BorderTop
            ref={setNodeRef}
            id={`borderTop-${card.number}`}
        >
            {allDroppedBorderTopChips[card.borderTopId]?.length > 0 && (
                <div className="border-top-chips">
                    {allDroppedBorderTopChips[card.borderTopId].map((chip, index) => (
                        <img
                            key={index}
                            src={chip.avatar}
                            alt={`Chip ${chip.chipValue}`}
                            className="borderTop-dropped-chip-small"
                        />
                    ))}
                </div>
            )}
        </BorderTop>
    );
};