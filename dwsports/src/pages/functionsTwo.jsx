import {useState, useEffect} from 'react'
import { motion } from 'framer-motion';
import styled from 'styled-components'
import { BorderLeftArea, BorderTopArea, CornerDropArea } from './DroppableAreas.jsx';
import { TouchSensor, MouseSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';


export const LastRowArea = ({card,allDroppedLastRowChips  }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: card.id,
  });
  const numbers = card.numbers
  const name = card.name 
  
  
  return (
    <LastRowWrapper style={{background: `${card.color}`}} ref={setNodeRef} id={card.id} className="number-inactive" 
     key={card.id}  >
      {
          !allDroppedLastRowChips[card.id] || allDroppedLastRowChips[card.id].length === 0 ? (
              <div><h2>{name}</h2></div>
          ) : (
              <div className="roulette-dropped-chips">
              {allDroppedLastRowChips[card.id].map((chip, index) => (
                  <img
                  key={index}
                  src={chip.avatar}
                  alt={`Chip ${chip.avatar}`}
                  className="first-dropped-chip-small"
                  />
              ))}
              </div>
          )
          }
    </LastRowWrapper>
  );
};

export const BetPerRowsArea = ({card,allDroppedRowChips }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: card.name,
  });
  
  const name = card.name
  const numbers = card.numbers
  return (
    <BetPerRowsWrapper ref={setNodeRef} id={name} className="number-inactive" key={name}  >
      {
          !allDroppedRowChips[name] || allDroppedRowChips[name].length === 0 ? (
              <div><h2>{name}</h2></div>
          ) : (
              <div className="roulette-dropped-chips">
              {allDroppedRowChips[name].map((chip, index) => (
                  <img
                  key={index}
                  src={chip.avatar}
                  alt={`Chip ${chip.avatar}`}
                  className="first-dropped-chip-small"
                  />
              ))}
              </div>
          )
          }
    </BetPerRowsWrapper>
  );
};

export const BetNumbersArea = ({ card,allDroppedChips,allDroppedCornerChips,allDroppedBorderLeftChips,allDroppedBorderTopChips,activeNumbers,isDateExpanded}) => {
  const { isOver, setNodeRef } = useDroppable({
      id: card.number,
  });
  if(isOver){
    console.log(card.number) 
 }
  const number = card.number;

  const variants = {
    expanded: {
        width: '30px',
        height: '30px'
    },
    collapsed: {
        width: '25px',
        height: '25px'
    },
};

  return (
      <ColumnNumber
          ref={setNodeRef}
          id={card.number}
          className={activeNumbers.includes(number) ? 'number-active' : 'number-inactive'}

          key={card.number}
      >
          <NumberWrapper style={{ background: `${card.color}` }} initial="expanded" key="#1"
        animate={isDateExpanded ? "collapsed" : "expanded"} 
        variants={variants}
        transition={{ type: 'tween', ease: 'linear', duration: 0.4 }}><h2>{number}</h2></NumberWrapper>

          <CornerDropArea 
              card={card}
              allDroppedCornerChips={allDroppedCornerChips}
              
          />
          <BorderLeftArea 
              card={card}
              allDroppedBorderLeftChips={allDroppedBorderLeftChips}
            
          />
          <BorderTopArea 
              card={card}
              allDroppedBorderTopChips={allDroppedBorderTopChips}
              
          />

          {
              !allDroppedChips[number] || allDroppedChips[number].length === 0 ? (
                  <div></div>
              ) : (
                  <div className="roulette-dropped-chips">
                      {allDroppedChips[number].map((chip, index) => (
                          <img
                              key={index}
                              src={chip.avatar}
                              alt={`Chip ${chip.chipValue}`}
                              className="zero-dropped-chip-small"
                          />
                      ))}
                  </div>
              )
          }
      </ColumnNumber>
  );
};

export const BetPerColumnsArea = ({card,allDroppedColumnChips}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: card.id,
  });

  if(isOver){
    console.log("now")
  }
  const name = card.name
  const numbers = card.numbers
  return (
    <ColumnNumber ref={setNodeRef} id={card.id} className="number-inactive" key={card.id}  >
      {
          !allDroppedColumnChips[card.id] || allDroppedColumnChips[card.id].length === 0 ? (
              <div><h2>{name}</h2></div>
          ) : (
              <div className="roulette-dropped-chips">
              {allDroppedColumnChips[card.id].map((chip, index) => (
                  <img
                  key={index}
                  src={chip.avatar}
                  alt={`Chip ${chip.avatar}`}
                  className="roulette-dropped-chip-small"
                  />
              ))}
              </div>
          )
          }
    </ColumnNumber>
  );
};

export const ZeroesArea = ({card,allDroppedChips }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: card.id,
  });

  
  
  const number = card.number
  return (
    <Zero ref={setNodeRef} id={card.id} className="number-inactive" key={card.id}  >
      <NumberZeroWrapper  style={{background: `${card.color}`}}  ><h2>{number}</h2></NumberZeroWrapper>
      {
          !allDroppedChips[number] || allDroppedChips[number].length === 0 ? (
              <div></div>
          ) : (
              <div className="roulette-dropped-chips">
              {allDroppedChips[number].map((chip, index) => (
                  <img
                  key={index}
                  src={chip.avatar}
                  alt={`Chip ${chip.avatar}`}
                  className="zero-dropped-chip-small"
                  />
              ))}
              </div>
          )
          }
    </Zero>
  );
};

const NumberZeroWrapper = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid white;
  color: white;
`;

const Zero = styled.div`
  width: 50%;
  height: 100%;
  border: 1px solid white;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  h2{
      color: white;
      font-size: 16px;
    }
`;

const NumberWrapper = styled(motion.div)`
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid orange;
  color: white;
`;

const Number = styled.div`
    width: 100%;
    height: calc(100%/12);
    border: 1px solid white;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    h2{
      color: white;
      font-size: 16px;
      transform: rotate(90deg);
    }
    cursor: pointer;
    @media(max-width: 968px){
    font-size: 14px; 
    }
`;
const ColumnNumber = styled.div`
    width: 100%;
    height: 100%;
    border: 1px solid white;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    h2{
      color: white;
      font-size: 16px;
    }
    cursor: pointer;
    @media(max-width: 968px){
    font-size: 14px; 
    }
`;

const LastRowWrapper = styled.div`
    width: 100%;
    height: calc(100%/6);
    position: relative;
    border: 1px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    h2{
      color: white;
      font-size: 16px;
      transform: rotate(90deg);
    }
    cursor: pointer;
    @media(max-width: 968px){
        font-size: 16px;  
    }
`;

const BetPerRowsWrapper = styled.div`
    width: 100%;
    height: calc(100%/3);
    position: relative;
    border: 1px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    h2{
      color: white;
      font-size: 16px;
      transform: rotate(90deg);
    }
    cursor: pointer;
    @media(max-width: 968px){
        font-size: 16px;  
    }
`;

