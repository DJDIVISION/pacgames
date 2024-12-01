import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core'; 



export const CornerDropArea = ({ card, allDroppedCornerChips }) => {
    const { isOver, setNodeRef } = useDroppable({
        id: `corner-${card.number}`, // Unique ID for the corner area
    });
    if(isOver){
       console.log(`corner-${card.number}`) 
    }
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
    if(isOver){
        console.log(`split-${card.number}`) 
     }
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
    if(isOver){
        console.log(`borderTop-${card.number}`) 
     }
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

const CornerLeft = styled(motion.div)`
position: absolute;
width: 20px;
height: 20px;
border-radius: 50px;
//background: aqua;
top: 0;
right: 0;
transform: translate(50%,-50%);
z-index: 9000;
`;

const BorderLeft = styled.div`
    width: 20px;
    height: 60%;
    background: transparent;
    position: absolute;
    top: 20%;
    right: 0%;
    transform: translate(50%,0%);
`;

const BorderTop = styled.div`
width: 70%;
height: 10px;
background: transparent;
position: absolute;
top: -20%;
left: 0%;
transform: translate(25%,0%);
`;
