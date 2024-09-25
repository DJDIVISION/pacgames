import styled from 'styled-components'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { motion } from 'framer-motion';
import BJBack from '../assets/bjTable.jpg';
import ChatIcon from '@mui/icons-material/Chat';
import BG from '../assets/roulette-bg.png'

export const SmallColumn = styled.div`
  width: 15%;
  height: 100%;
  padding-top: 80px;
  ${props => props.theme.displayFlexColumn};
`;

export const BigColumn = styled.div`
  width: 70%;
  height: 100%;
  position: relative;
  ${props => props.theme.displayFlexColumn};
  padding-top: 80px;
`;

export const Row = styled.div`
  ${props => props.theme.displayFlexCenter};
`;

//************************ */

export const RouletteTableContainer = styled.div`
  width: 50%;
  height: 100%;
  ${props => props.theme.displayFlexColumnCenter}
`;

export const TableItem = styled.div`
  width: 20%;
  height: 40px;
`;


export const Wheel = styled(motion.div)`
  position: absolute; 
  width: 100%;
  height: 100%;
  border: 3px solid ${props => props.theme.MainAccent};
  filter: drop-shadow(0 0 5px aqua);
  border-radius: 50%;
  overflow: hidden;
  //transform: rotate(-4.7368deg);
`;

export const NumberSpan = styled.div`
  position: absolute;
  inset: 10px;
  --i: ${(props) => props.index};
  transform: rotate(calc(9.4736deg * var(--i)));
  text-align: center;
  font-size: 24px;
  //color:${props => props.theme.MainAccent}; 
  //filter: drop-shadow(0 0 5px aqua);
`;

export const SpinButton = styled.div`
  position: absolute;
  inset: 200px;
  background: ${props => props.theme.MainAccent};
  border-radius: 50%;
  filter: drop-shadow(0 0 5px aqua);
  z-index: 5000;
  cursor: pointer;
`;

export const Number = styled.div`
  position: absolute;
  inset: 0;
  rotate: 5deg;
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

export const RouletteWrap = styled.div`
    width: 400px;
    height: 400px;
    position: relative;
    left:5px;
    top:5px;
    background: #000000 url(${BG}) top center no-repeat;
    background-size: contain;
    border-radius: 50%;
    margin: 0 auto;
`;

export const Selector = styled.div`
  width:5px;
  background:grey;
  left:50%;
  height:100%;
  transform:translate(-50%,0%);
  position:absolute;
  z-index:1000;
  border: 1px solid red;
`;

export const RouletteSection = styled.div`
width: 100vw;
height: 100vh;
background: ${props => props.theme.body};
display: flex;
justify-content: center;
align-items: center;
`;

export const RouletteColumn = styled.div`
width: 40%;
height: 100%;
${props => props.theme.displayFlexCenter};
border: 1px solid white;
`;


export const RouletteContainer = styled(motion.div)`
  width: 38vw;
  height: 38vw;
  border-radius: 50%;
  position: relative;
  border: 3px solid ${props => props.theme.MainAccent};
  filter: drop-shadow(0, 0, 5px aqua);
  ${props => props.theme.displayFlexCenter};
  transform: rotate(-4.736deg);
  &:before{
    content: "";
    position: absolute;
    top: 0px;
    width: 20px;
    height: 50px;
    background: ${props => props.theme.MainAccent};
    clip-path: polygon(50% 0%, 65% 50%, 50% 100%, 35% 50%);
    transform: translate(110%, -50%) rotate(4deg);
  }
`;

export const NumberCard = styled.div`
  position: absolute;
  width: 50px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.color};
  color: white;
  font-size: 18px;
  transform: translate(-50%, -50%);
`;

export const BettingColumn = styled.div`
width: 60%;
height: 100%;
${props => props.theme.displayFlexColumnCenter};
`;

export const RouletteWrapper = styled.div`
  width: 880px;
  height: 20vh;
  border-bottom: 1px solid #c3c3c3;
  position: relative;
  overflow: hidden;
  border: 1px solid red;
`;

export const ChatRoomIcon = styled(ChatIcon)`
  &&&{
    color: ${props => props.theme.text};
    @media (max-width: 968px) {
            scale: 1.2;
        }
  }
`;

export const BlackJackSection = styled.div`
    width: 100vw;
    height: 100vh;
    background: ${props => props.theme.body};
    display: flex;
    flex-direction: column;
    align-items: center;
    background-image: url(${BJBack});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    @media screen and (max-width: 468px){
      display: none;
    }
`;

export const BlackJackSectionSmart = styled.div`
    &&&{
      width: 100vw;
    min-height: 100vh;
    background: ${props => props.theme.body};
    ${props => props.theme.displayFlexColumnCenter};
    ${props => props.theme.dosisWhite};
    @media screen and (min-width: 468px){
    display: none;
    }
  }
`;

export const BlackJackTitle = styled(motion.div)`
  width: 100%;
  height: 30%;
  display: flex;
  align-items: center;
  //justify-content: center;
  color: ${props => props.theme.text};
  font-size: 98px;
  position: relative;
  
`;

export const BlackJackBigColumn = styled.div`
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 25vw;
`;

export const ActionButtons = styled(motion.div)`
  width: 100%;
  height: 0%;
  border: 1px solid ${props => props.theme.MainAccent};
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-around;
`;