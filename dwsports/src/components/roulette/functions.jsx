import React,{useState, useRef, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import { useDroppable } from '@dnd-kit/core'; // Assuming you are using @dnd-kit for drag and drop
import {CornerDropArea,BorderLeftArea,BorderTopArea} from './DroppableAreas';
import {Number,NumberWrapper,NumberZeroWrapper,Zero} from './index'
import {FirstRow, SecondRow, ThirdRow, BetPerRows, LastRow, Zeroes, BetPerColumns, LatestNumbers} from '../../pages/fakeData'

const BetPerRowsWrapper = styled.div`
    width: calc(40vw * 4/12);
    height: calc(40vw/12);
    position: relative;
    border: 1px solid ${props => props.theme.text};
    ${props => props.theme.displayFlexCenter};
    color: ${props => props.theme.text};
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    @media(max-width: 968px){
        font-size: 16px;  
    }
`;

const LastRowWrapper = styled.div`
    width: calc(40vw * 2/12);
    height: calc(40vw/12);
    position: relative;
    border: 1px solid ${props => props.theme.text};
    ${props => props.theme.displayFlexCenter};
    color: ${props => props.theme.text};
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    @media(max-width: 968px){
        font-size: 16px;  
    }
`;

export const BetNumbersArea = ({ card,allDroppedChips,allDroppedCornerChips,allDroppedBorderLeftChips,allDroppedBorderTopChips}) => {
    const { isOver, setNodeRef } = useDroppable({
        id: card.number,
    });

    const number = card.number;

    return (
        <Number
            ref={setNodeRef}
            id={card.number}
            className="number-inactive"

            key={card.number}
        >
            <NumberWrapper style={{ background: `${card.color}` }}>{number}</NumberWrapper>

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
                                src={chip.chipImage}
                                alt={`Chip ${chip.chipValue}`}
                                className="zero-dropped-chip-small"
                            />
                        ))}
                    </div>
                )
            }
        </Number>
    );
};

export const BetPerColumnsArea = ({card,allDroppedColumnChips}) => {
    const { isOver, setNodeRef } = useDroppable({
      id: card.id,
    });
    const name = card.name
    const numbers = card.numbers
    return (
      <Number ref={setNodeRef} id={card.id} className="number-inactive" key={card.id}  >
        {
            !allDroppedColumnChips[card.id] || allDroppedColumnChips[card.id].length === 0 ? (
                <div>{name}</div>
            ) : (
                <div className="roulette-dropped-chips">
                {allDroppedColumnChips[card.id].map((chip, index) => (
                    <img
                    key={index}
                    src={chip.chipImage}
                    alt={`Chip ${chip.chipValue}`}
                    className="roulette-dropped-chip-small"
                    />
                ))}
                </div>
            )
            }
      </Number>
    );
};

export const ZeroesArea = ({card,allDroppedChips }) => {
    const { isOver, setNodeRef } = useDroppable({
      id: card.number,
    });
    
    const number = card.number
    return (
      <Zero ref={setNodeRef} id={card.number} className="number-inactive" key={card.number}  >
        <NumberZeroWrapper style={{background: `${card.color}`}}  >{number}</NumberZeroWrapper>
        {
            !allDroppedChips[number] || allDroppedChips[number].length === 0 ? (
                <div></div>
            ) : (
                <div className="roulette-dropped-chips">
                {allDroppedChips[number].map((chip, index) => (
                    <img
                    key={index}
                    src={chip.chipImage}
                    alt={`Chip ${chip.chipValue}`}
                    className="zero-dropped-chip-small"
                    />
                ))}
                </div>
            )
            }
      </Zero>
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
                <div>{name}</div>
            ) : (
                <div className="roulette-dropped-chips">
                {allDroppedRowChips[name].map((chip, index) => (
                    <img
                    key={index}
                    src={chip.chipImage}
                    alt={`Chip ${chip.chipValue}`}
                    className="first-dropped-chip-small"
                    />
                ))}
                </div>
            )
            }
      </BetPerRowsWrapper>
    );
};

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
                <div>{name}</div>
            ) : (
                <div className="roulette-dropped-chips">
                {allDroppedLastRowChips[card.id].map((chip, index) => (
                    <img
                    key={index}
                    src={chip.chipImage}
                    alt={`Chip ${chip.chipValue}`}
                    className="first-dropped-chip-small"
                    />
                ))}
                </div>
            )
            }
      </LastRowWrapper>
    );
};


