import React from 'react'
import styled from 'styled-components'
import jail from '../../assets/jail.png'
import parking from '../../assets/parking.png'
import arrowLeft from '../../assets/arrowLeft.png'

const Board = () => {
  return (
    <GameBoard>
        <FirstRow>
            <Square><img src={parking} alt="parking" style={{transform: 'rotate(145deg)'}}/></Square>
            <Vertical><VerticalCard></VerticalCard><VerticalHeaderTop style={{background: '#f53030'}}></VerticalHeaderTop></Vertical>
            <Vertical></Vertical>
            <Vertical><VerticalCard></VerticalCard><VerticalHeaderTop style={{background: '#f53030'}}></VerticalHeaderTop></Vertical>
            <Vertical><VerticalCard></VerticalCard><VerticalHeaderTop style={{background: '#f53030'}}></VerticalHeaderTop></Vertical>
            <Vertical></Vertical>
            <Vertical><VerticalCard></VerticalCard><VerticalHeaderTop style={{background: '#f2f530'}}></VerticalHeaderTop></Vertical>
            <Vertical></Vertical>
            <Vertical><VerticalCard></VerticalCard><VerticalHeaderTop style={{background: '#f2f530'}}></VerticalHeaderTop></Vertical>
            <Vertical><VerticalCard></VerticalCard><VerticalHeaderTop style={{background: '#f2f530'}}></VerticalHeaderTop></Vertical>
            <Square><img src={jail} alt="jail" style={{transform: 'rotate(180deg)'}}/></Square>
        </FirstRow>
        <Row>
          <Horizontal><HorizontalCard></HorizontalCard><HorizontalHeader style={{background: '#f5a030'}}></HorizontalHeader></Horizontal>
          <Empty></Empty>  
          <Horizontal><HorizontalHeaderRight style={{background: '#307410'}}></HorizontalHeaderRight><HorizontalCard></HorizontalCard></Horizontal>
        </Row>
        <Row>
          <Horizontal><HorizontalCard></HorizontalCard><HorizontalHeader style={{background: '#f5a030'}}></HorizontalHeader></Horizontal>
          <Empty></Empty>  
          <Horizontal><HorizontalHeaderRight style={{background: '#307410'}}></HorizontalHeaderRight><HorizontalCard></HorizontalCard></Horizontal>
        </Row>
        <Row>
          <Horizontal></Horizontal>
          <Empty></Empty>  
          <Horizontal></Horizontal>
        </Row>
        <Row>
          <Horizontal><HorizontalCard></HorizontalCard><HorizontalHeader style={{background: '#f5a030'}}></HorizontalHeader></Horizontal>
          <Empty></Empty>  
          <Horizontal><HorizontalHeaderRight style={{background: '#307410'}}></HorizontalHeaderRight><HorizontalCard></HorizontalCard></Horizontal>
        </Row>
        <Row>
          <Horizontal></Horizontal>
          <Empty></Empty>  
          <Horizontal></Horizontal>
        </Row>
        <Row>
          <Horizontal><HorizontalCard></HorizontalCard><HorizontalHeader style={{background: '#f530a3'}}></HorizontalHeader></Horizontal>
          <Empty></Empty>  
          <Horizontal></Horizontal>
        </Row>
        <Row>
          <Horizontal><HorizontalCard></HorizontalCard><HorizontalHeader style={{background: '#f530a3'}}></HorizontalHeader></Horizontal>
          <Empty></Empty>  
          <Horizontal><HorizontalHeaderRight style={{background: '#101f74'}}></HorizontalHeaderRight><HorizontalCard></HorizontalCard></Horizontal>
        </Row>
        <Row>
          <Horizontal></Horizontal>
          <Empty></Empty>  
          <Horizontal></Horizontal>
        </Row>
        <Row>
          <Horizontal><HorizontalCard></HorizontalCard><HorizontalHeader style={{background: '#f530a3'}}></HorizontalHeader></Horizontal>
          <Empty></Empty>  
          <Horizontal><HorizontalHeaderRight style={{background: '#101f74'}}></HorizontalHeaderRight><HorizontalCard></HorizontalCard></Horizontal>
        </Row>
        <FirstRow>
            <Square></Square>
            <Vertical><VerticalHeader style={{background: '#47a6ff'}}></VerticalHeader><VerticalCard></VerticalCard></Vertical>
            <Vertical><VerticalHeader style={{background: '#47a6ff'}}></VerticalHeader><VerticalCard></VerticalCard></Vertical>
            <Vertical></Vertical>
            <Vertical><VerticalHeader style={{background: '#47a6ff'}}></VerticalHeader><VerticalCard></VerticalCard></Vertical>
            <Vertical></Vertical>
            <Vertical></Vertical>
            <Vertical><VerticalHeader style={{background: '#7e453b'}}></VerticalHeader><VerticalCard></VerticalCard></Vertical>
            <Vertical></Vertical>
            <Vertical><VerticalHeader style={{background: '#7e453b'}}></VerticalHeader><VerticalCard></VerticalCard></Vertical>
            <Square><img src={arrowLeft} alt="arrowLeft" style={{transform: 'rotate(180deg)'}}/></Square>
        </FirstRow>
    </GameBoard>
  )
}

export default Board

const GameBoard = styled.div`
    width: 95vh;
    height: 95vh;
    border: 2px solid black;
`;

const FirstRow = styled.div`
    width: 100%;
    height: calc(100% / 13 * 2);
    border: 1px solid white;
    display: flex;
`;

const Row = styled.div`
    width: 100%;
    height: calc(100% / 13);
    display: flex;
`;

const Empty = styled.div`
   width: calc(100% / 13 * 9); 
   
`

const Square = styled.div`
    width: calc(100% / 13 * 2);
    height: 100%;
`;

const Vertical = styled.div`
    width: calc(100% / 13);
    height: 100%;
    border: 1px solid white;
    ${props => props.theme.displayFlexColumn};
`;

const VerticalHeader = styled.div`
    width: 100%;
    height: 25%;
    border-bottom: 1px solid white;
`;

const VerticalHeaderTop = styled.div`
    width: 100%;
    height: 25%;
    border-top: 1px solid white;
`;

const HorizontalHeader = styled.div`
    width: 25%;
    height: 100%;
    border-left: 1px solid white;
`;

const HorizontalHeaderRight = styled.div`
    width: 25%;
    height: 100%;
    border-right: 1px solid white;
`;

const HorizontalCard = styled.div`
    width: 75%;
    height: 100%;
`;

const VerticalCard = styled.div`
    width: 100%;
    height: 75%;
`;

const Horizontal = styled.div`
    width: calc(100% / 13 * 2);
    height: 100%;
    border: 1px solid white;
    ${props => props.theme.displayFlexCenter}
`;
