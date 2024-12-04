import {useState, useEffect} from 'react'
import { motion } from 'framer-motion';
import styled from 'styled-components'
import { BorderLeftArea, BorderTopArea, CornerDropArea } from './DroppableAreas.jsx';
import { TouchSensor, MouseSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';


export const LastRowArea = ({card,droppedLastRowChips,setDroppedLastRowChips,removeBet  }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: card.id,
  });
  const numbers = card.numbers
  const name = card.name 
  
  
  return (
    <LastRowWrapper style={{background: `${card.color}`}} ref={setNodeRef} id={card.id} className="number-inactive" 
     key={card.id}  >
      {
                !droppedLastRowChips[card.id] || droppedLastRowChips[card.id].length === 0 ? (
                    <div><h2>{name}</h2></div>
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

export const BetPerRowsArea = ({card,droppedRowChips,setDroppedRowChips,removeBet }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: card.name,
  });
  
  const name = card.name
  const numbers = card.numbers
  return (
    <BetPerRowsWrapper ref={setNodeRef} id={name} className="number-inactive" key={name}  >
          {
              !droppedRowChips[name] || droppedRowChips[name].length === 0 ? (
                  <div><h2>{name}</h2></div>
              ) : (
                  <div className="roulette-dropped-chips">
                      {droppedRowChips[name].map((chip, index) => (
                          <img
                              key={index}
                              src={chip.chipImage}
                              alt={`Chip ${chip.chipValue}`}
                              className="first-dropped-chip"
                              onClick={() => removeBet(chip, droppedRowChips, setDroppedRowChips)}
                          />
                      ))}
                  </div>
              )
          }
    </BetPerRowsWrapper>
  );
};

export const BetNumbersArea = ({ card,droppedChips,setDroppedChips,droppedCornerChips,setDroppedCornerChips,droppedBorderLeftChips,setDroppedBorderLeftChips,
    droppedBorderTopChips,setDroppedBorderTopChips,activeNumbers,isDateExpanded,removeBet,activeContainer}) => {
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

    const isActive = 
        // Check if activeContainer is a number and matches this number's id
        (typeof activeContainer === 'number' && activeContainer === number) ||
        // Check if activeContainer is a string and this number is in the activeNumbers array
        (typeof activeContainer === 'string' && activeNumbers.includes(number));

  return (
      <ColumnNumber
          
        className={isActive ? 'number-active' : 'number-inactive'}
          
          key={card.number}
      >
          <NumberWrapper style={{ background: `${card.color}` }} ref={setNodeRef} id={card.number}><h2>{number}</h2></NumberWrapper>

          <CornerDropArea 
              card={card}
              droppedCornerChips={droppedCornerChips} 
            setDroppedCornerChips={setDroppedCornerChips} 
            removeBet={removeBet}
              
          />
          <BorderLeftArea 
              card={card}
              droppedBorderLeftChips={droppedBorderLeftChips} setDroppedBorderLeftChips={setDroppedBorderLeftChips}
              removeBet={removeBet}
          />
          <BorderTopArea 
              card={card}
              droppedBorderTopChips={droppedBorderTopChips} setDroppedBorderTopChips={setDroppedBorderTopChips}
              removeBet={removeBet}
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
                        onClick={() => removeBet(chip,droppedChips,setDroppedChips)}
                        />
                    ))}
                    </div>
                )
                }
      </ColumnNumber>
  );
};

export const BetPerColumnsArea = ({card,droppedColumnChips,setDroppedColumnChips,removeBet}) => {
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
                !droppedColumnChips[card.id] || droppedColumnChips[card.id].length === 0 ? (
                    <div><h2>{name}</h2></div>
                ) : (
                    <div className="roulette-dropped-chips">
                    {droppedColumnChips[card.id].map((chip, index) => (
                        <img
                        key={index}
                        src={chip.chipImage}
                        alt={`Chip ${chip.chipValue}`}
                        className="first-dropped-chip"
                        onClick={() => removeBet(chip,droppedColumnChips,setDroppedColumnChips)}
                        />
                    ))}
                    </div>
                )
                }
    </ColumnNumber>
  );
};

export const ZeroesArea = ({card,droppedChips,activeNumbers,activeContainer,setDroppedChips,removeBet,droppedBorderLeftChips,setDroppedBorderLeftChips }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: card.id,
  });
  const number = card.number
  if(isOver){
    console.log(activeContainer)
  }

  const isActive = 
        // Check if activeContainer is a number and matches this number's id
        (typeof activeContainer === 'number' && activeContainer === number) ||
        // Check if activeContainer is a string and this number is in the activeNumbers array
        (typeof activeContainer === 'string' && activeNumbers.includes(number));
  
  return (
    <Zero   className={isActive ? 'number-active' : 'number-inactive'} id={card.id}  key={card.id}  >
      <NumberZeroWrapper ref={setNodeRef} style={{background: `${card.color}`}}><h2>{number === 100 ? 0 : number === 101 ? "00" : number}</h2></NumberZeroWrapper>
      <BorderLeftArea 
              card={card}
              droppedBorderLeftChips={droppedBorderLeftChips} setDroppedBorderLeftChips={setDroppedBorderLeftChips}
              removeBet={removeBet}
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
                        onClick={() => removeBet(chip,droppedChips,setDroppedChips)}
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

const NumberWrapper = styled.div`
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid orange;
  color: white;
  width: 25px;
  height: 25px;
`;

const Number = styled.div`
    width: 50%;
    height: 50;
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

////////////////////////////////////

const getLastMatchRating = async () => {
  setLoadingRating(true)
  const end = new Date(endDate)
  const now = new Date();
  if (droppedTeamPlayers && now > end) {
      /* console.log(droppedTeamPlayers) */
      const areas = Object.values(droppedTeamPlayers); // Get all areas
      for (const area of areas) {
          for (const player of area) {
              if (player.lastMatchRating === null) {
                  let first = localStorage.getItem(`${player.name}`)
                  if(first === null){
                      await fetchDataFromSupabase(player.leagueName, player.id, player.teamName, "local");
                      // Add a delay between requests if needed
                      await new Promise(resolve => setTimeout(resolve, 500)); 
                      message.success(`Fetching rating for ${player.name}`)
                  } else {
                      /* console.log(first)
                      console.log(`not null for ${player.name}`) */
                      const areas = Object.values(droppedTeamPlayers)
                      for (const area of areas){
                          for (const man of area){
                              if(man.id === player.id){
                                  man.lastMatchRating = parseFloat(parseFloat(first).toFixed(2)) 
                              }
                          }
                      }
                  }
              } else {
                  return
              }
          }
      }
  } else {
      console.log(droppedTeamPlayers)
      const areas = Object.values(droppedTeamPlayers);
      for (const area of areas){
          for (const player of area) {
              //localStorage.removeItem(`${player.name}`)
              let first = localStorage.getItem(`${player.name}`)
                  if(first === null){
                      await fetchDataFromSupabase(player.leagueName, player.id, player.teamName, "finished");
                      // Add a delay between requests if needed
                      await new Promise(resolve => setTimeout(resolve, 500)); 
                      message.success(`Fetching rating for ${player.name}`)
                  } else {
                      const areas = Object.values(droppedTeamPlayers)
                      for (const area of areas){
                          for (const man of area){
                              if(man.id === player.id){
                                  man.lastMatchRating = parseFloat(parseFloat(first).toFixed(2)) 
                              }
                          }
                      }
              }
              if(player.lastMatchRating === null){
                  player.lastMatchRating = 0
              }
              localStorage.removeItem(`${player.name}`)
              setStartAgain(true)
          }
      }
      
  }
  setDroppedTeamPlayers(droppedTeamPlayers)
  setTeamAverage(getAveragePlayerRating())
  setLoadingRating(false)
}


/* useEffect(() => {
  if(gameStarted && openStatsMenu){
      getLastMatchRating()
  }
}, [gameStarted,openStatsMenu]) */
