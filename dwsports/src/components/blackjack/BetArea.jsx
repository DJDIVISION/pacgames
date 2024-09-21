import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {BettingArea} from '../index'

const BetArea = ({droppedChips }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'bet-area',
  });



  return (
    <BettingArea ref={setNodeRef} className="bet-area">
      {droppedChips.length === 0 ? (
        <p>{isOver ? 'Release to place the bet' : 'Drop chips here to place your bet'}</p>
      ) : (
        <div className="dropped-chips">
          {droppedChips.map((chip, index) => (
            <img
              key={index}
              src={chip.chipImage}
              alt={`Chip ${chip.chipValue}`}
              className="dropped-chip"
              style={{margin: '10px 10px', transform: 'scale(0.8)'}}
            />
          ))}
        </div>
      )}
    </BettingArea>
  );
};

export default BetArea;