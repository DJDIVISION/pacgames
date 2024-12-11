import React, {useState} from 'react'
import styled from 'styled-components'
import { motion,AnimatePresence } from 'framer-motion'
import { IconButton } from '@mui/material'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ChatIcon from '@mui/icons-material/Chat';

export const MessagesWrapper = styled.div`
    width: 100%;
    height: 90%;
    padding: 5px 15px;
    overflow-y: scroll;
    border: 1px solid blue;
`;
export const ChatInputWrapper = styled.div`
    width: 100%;
    height: 10%;
    padding: 5px 15px;
    overflow-y: scroll;
    border: 1px solid blue;
`;

export const ChatRoomIcon = styled(ChatIcon)`
    &&&{
        color: white;
        transform: scale(0.85);
    }
`;

export const LatestNumbers = [
    {
        number: 34,
        color: "red" 
    },
    {
        number: 22,
        color: "black"
    },
    {
        number: 23,
        color: "red"
    },
    {
        number: 0,
        color: "green"
    },
    {
        number: 18,
        color: "red"
    },
    {
        number: 17,
        color: "black"
    },
    {
        number: 3,
        color: "red"
    },
    {
        number: 27,
        color: "red"
    },
    {
        number: 3,
        color: "red"
    },
    {
        number: 34,
        color: "red"
    },
    {
        number: 20,
        color: "black"
    },
    {
        number: 19,
        color: "red"
    },
    {
        number: 11,
        color: "black"
    }
]

export const BorderTop = styled.div`
width: 60%;
height: 20px;
background: transparent;
position: absolute;
top: -10%;
left: 20%;
`;

export const BorderLeft = styled.div`
width: 20px;
height: 60%;
background: transparent;
position: absolute;
top: 20%;
left: -15%;
`;

export const BallHolder = styled.div`
    width: 95%;
    height: 20%;
    display: flex;
    align-items: center;
    overflow-x: auto;
`;
export const BalanceHolder = styled.div`
    width: 95%;
    height: 20%;
    display: flex;
    align-items: center;
`;
export const BalanceColumn = styled.div`
    width: calc(100% / 3);
    height: 100%;
    display: flex;
    align-items: center;
`;

export const BetsHolder = styled.div`
    width: 80%;
    height: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
`;

export const BetHolder = styled.div`
  width: 100%;
  min-height: 40px;
  border: 1px solid white;
  border-radius: 10px;
  margin: 5px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(10px);
`;

export const BetNumberHolder = styled.div`
  width: 20%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BetAmount = styled.div`
  width: 40%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: 1px solid grey;
  text-shadow: ${props => props.theme.textShadowTwo};
`;

export const NumberWrapper = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid orange;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: white;
`;

export const LeagueRowBets = styled(motion.div)`
width: 80%;
height: 72.5%;
display: flex;
align-items: center;
`;
export const ZeroRowBets = styled.div`
width: 80%;
height: 20%; 
display: flex;
flex-direction: column;
align-items: center;
`;
export const HalfZeroRowBets = styled.div`
width: 100%;
height: 50%; 
display: flex;
align-items: center;
`;
export const ColumnBets = styled.div`
width: 80%;
height: 7.5%; 
display: flex;
align-items: center;
`;
export const EmptySpace = styled.div`
    width: 40%;
    height: 100%;
    display: flex;
    align-items: center;
`;
export const BigNumberContainer = styled.div`
    width: 40px;
    height: 40px;
    display: flex;
    border-radius: 50%;
    color: white;
    font-size: 18px;
    font-weight: bold;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 10px !important;
    left: 50% !important;
    transform: translate(-50%,0%) !important;
`;
export const SendBetContainer = styled.div`
    width: 140px;
    height: 60px;
    display: flex;
    color: white;
    font-size: 18px;
    font-weight: bold;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 20px;
    left: 10px;
    //transform: translate(-50%,0%);
`;

export const ColumnHolder = styled.div`
width: 60%;
height: 100%; 
display: flex;
align-items: center;
background: rgba(0, 0, 0, 0.6);
backdrop-filter: blur(5px);
`;

export const ZeroHolder = styled.div`
    width: 50%;
    height: 100%;
    border: 1px solid green;
    ${props => props.theme.displayFlexCenter};
`;

export const ChipsHolder = styled(motion.div)`
width: 100%;
height: 10%; 
display: flex;
align-items: center;
justify-content: space-around;
`;

export const RouletteBalance = styled.div`
    width: 100%;
    height: 5%; 
    display: flex;
    align-items: center; 
`;

export const FirstColumn = styled.div`
    width: 20%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(5px);
`;

export const FirstCell = styled.div`
    width: 100%;
    height: calc(100% / 6);
    border: 1px solid white;
`;



export const ArrowDown = styled(ArrowCircleLeftIcon)`
    &&&{
        color: white;
        transform: rotate(90deg)
    }
`;
export const ArrowUp = styled(ArrowCircleLeftIcon)`
    &&&{
        color: white;
        transform: rotate(270deg)
    }
`;

export const AbsoluteIconButton = styled(IconButton)`
&&&{
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 5px;
    background: ${props => props.theme.body};
    scale: 1.2;
    ${props => props.theme.displayFlexCenter}
    box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4, 0 0 100px #03e9f4;
    z-index: 1000;
    @media (max-width: 968px) {
    top: 15px;
    right: 15px;
    scale: 1.2;
    }
}
`;
export const AbsoluteIconButtonLeft = styled(IconButton)`
&&&{
    position: absolute;
    top: 20px;
    left: 20px;
    padding: 5px;
    background: ${props => props.theme.body};
    scale: 1.2;
    ${props => props.theme.displayFlexCenter}
    box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4, 0 0 100px #03e9f4;
    z-index: 1000;
    @media (max-width: 968px) {
    top: 15px;
    left: 15px;
    scale: 1.2;
    }
}
`;

export const Title = styled(motion.div)`
width: 100vw;
border: 1px solid blue;
justify-content: space-around;
text-align: center;
display: flex;
align-items: center;
overflow-x: auto;
`;

export const Section = styled.div`
width: 100vw;
height: 100vh;
position: relative;
display: flex;
align-items: center;
flex-direction: column;
background: #3c3c3c;
overflow: hidden;
`;

export const Container = styled(motion.div)`
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const RouletteContainer = styled(motion.div)`
  width: 325px;
  height: 325px;
  border-radius: 50%;
  position: relative;
  filter: drop-shadow(0, 0, 5px aqua);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-4.736deg);
  &:before{
    content: "";
    position: absolute;
    top: 0px;
    width: 20px;
    height: 30px;
    background: aqua;
    clip-path: polygon(50% 0%, 65% 50%, 50% 100%, 35% 50%);
    transform: translate(70%, -50%) rotate(4deg);
    /* @media(max-width: 968px){
      transform: translate(50%, -0%) rotate(4deg);
      height: 30px;
      top: 5px;
    } */
  }
`;

export const Span = styled.span`
  --i: ${(props) => props.index};
  position: absolute;
  left: calc(50% - 1px);
  width: 2px;
  height: 100%;
  background: ${props => props.theme.MainAccent};
  transform: rotate(calc(9.4736deg * var(--i)));
`;

export const Number = styled.div`
  position: absolute;
  inset: 0px;
  rotate: 5deg;
  /* @media(max-width: 968px){
    inset: 0;
  } */
`;

export const NumberSpan = styled.div`
  position: absolute;
  inset: 5px;
  --i: ${(props) => props.index};
  transform: rotate(calc(9.4736deg * var(--i)));
  text-align: center;
  font-size: 16px;
  //text-shadow: white 0px 0px,  white 1px 1px;

  //color:${props => props.theme.MainAccent}; 
  //filter: drop-shadow(0 0 5px aqua);
  /* @media(max-width: 968px){
    font-size: 12px;
    inset: 2px;
    } */
`;

export const SpinButton = styled.div`
  position: absolute;
  inset: 120px;
  background: ${props => props.theme.MainAccent};
  border-radius: 50%;
  filter: drop-shadow(0 0 5px aqua);
  z-index: 5000;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  /* @media(max-width: 968px){
    inset: 80px;
  } */
  img{
    transform: rotate(4.67deg) translateY(-3px);
    width: 100%;
  }
`;

export const Wheel = styled(motion.div)`
  position: absolute; 
  width: 100%;
  height: 100%;
  border: 5px solid ${props => props.theme.MainAccent};
  //filter: drop-shadow(0 0 5px white);
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(0,212,255,1) 0%, rgba(9,9,121,1) 50%, rgba(0,212,255,1) 100%);
  overflow: hidden;
  //transform: rotate(-4.7368deg);
`;

export const WheelContainer = styled(motion.div)`
    width: 100%;
    min-height: 55%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
`;
export const TableContainer = styled(motion.div)`
    width: 100%;
    min-height: 45%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
`;


export const SmallNumberWrapper = styled.div`
    min-width: 40px;
    min-height: 40px;
    margin: 0 2px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    @media(min-width: 968px){
        width: 40px;
        height: 40px; 
    }
`;
