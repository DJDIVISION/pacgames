import styled from 'styled-components'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { motion } from 'framer-motion';
import BJBack from '../assets/bjTable.jpg';
import ChatIcon from '@mui/icons-material/Chat';
import BG from '../assets/roulette-bg.png'
import { IconButton } from '@mui/material';

export const SmallColumn = styled.div`
  width: 7.5vw;
  height: 100%;
  padding-top: 50px;
  ${props => props.theme.displayFlexColumn};
  @media(max-width: 968px){
    padding-top: 30px;
  }
`;

export const TopRow = styled.div`
  width: 100%;
  height: 75%;
  ${props => props.theme.displayFlexCenter};
`;

export const BottomRow = styled.div`
  width: 100%;
  height: 25%;
  ${props => props.theme.displayFlexCenter};
`;

export const BigColumn = styled.div`
  width: 70%;
  height: 100%;
  position: relative;
  ${props => props.theme.displayFlexColumn};
  padding-top: 50px;
  @media(max-width: 968px){
    padding-top: 30px;
  }
`;

export const Row = styled.div`
  ${props => props.theme.displayFlexCenter};
`;

export const SmallBottomColumn = styled.div`
  width: 35%;
  height: 100%;
  padding: 10px;
  ${props => props.theme.displayFlexCenter};
`;

export const BigBottomColumn = styled.div`
  width: 30%;
  height: 100%;
  ${props => props.theme.displayFlexCenter};
  padding: 10px;
`;

export const BottomContainer = styled.div`
    width: 100%;
    height: 18vh;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px;
`;

export const BottomContainerColumn = styled.div`
    width: 100%;
    height: 18vh;
    ${props => props.theme.displayFlexColumn};
    border-radius: 10px;
`;

export const BottomContainerRow = styled.div`
    width: 33%;
    height: 9vh;
    ${props => props.theme.displayFlexCenter};
`;

export const SmallIconHolder = styled.div`
  width: 40%;
  height: 100%;
  ${props => props.theme.displayFlexCenter};
  img{
      width: 75%;
      display: block;
      object-fit: cover;
    }
`;

export const BetNumberHolder = styled.div`
  width: 20%;
  height: 100%;
  ${props => props.theme.displayFlexCenter};
`;

export const BetAmount = styled.div`
  width: 40%;
  height: 100%;
  ${props => props.theme.displayFlexCenter};
  color: ${props => props.theme.text};
  border: 1px solid grey;
`;

export const BetNumber = styled.div`
  width: 30px;
  height: 30px;
  ${props => props.theme.displayFlexCenter};
`;

export const BigTextWinnings = styled.div`
  width: 100%;
  height: 100%;
  color: ${props => props.theme.text};
  font-size: 20px;
  ${props => props.theme.displayFlexCenter};
  font-weight: bold;
  text-align: center;
  //transform: translateY(-30px);
  @media(min-width: 968px){
    font-size: 18px;
  }
`;

export const SmallTextHolder = styled.div`
  min-width: 90%;
  height: 80px;
  color: ${props => props.theme.text};
  font-size: 32px;
  ${props => props.theme.displayFlexCenter};
  font-weight: bold;
  text-align: center;
  transform: translateX(10px);
  @media(min-width: 968px){
    font-size: 18px;
    
  }
`;

export const RouletteMainRow = styled.div`
  width: 30%;
  height: 100%;
  ${props => props.theme.displayFlexCenter};
`;

export const BigTextHolder = styled.div`
  width: fit-content;
  height: 10vh;
  padding: 0 10px;
  color: ${props => props.theme.text};
  font-size: 18px;
  ${props => props.theme.displayFlexCenter};
  font-weight: bold;
  @media(min-width: 968px){
    font-size: 18px;
    
  }
`;

export const BigTextHolderSlots = styled.div`
  width: 18vw;
  height: 10vh;
  padding: 0 10px;
  border: 1px solid aqua;
  color: ${props => props.theme.text};
  border-radius: 10px;
  font-size: 22px;
  ${props => props.theme.displayFlexCenter};
  font-weight: bold;
  @media(min-width: 968px){
    font-size: 22px;
    
  }
`;

export const EurosTextHolder = styled.div`
  width: 50%;
  height: 100%;
  padding: 0 10px;
  color: gold;
  font-size: 24px;
  ${props => props.theme.displayFlexColumnCenter};
  font-weight: bold;
  span{
    font-weight: bold;
  }
  @media(max-width: 968px){
    font-size: 16px;
    width: 175px;
  }
`;

export const RouletteMainIcon = styled.div`
  width: 20%;
  height: 10vh;
  ${props => props.theme.displayFlexCenter};
  img{
    width: 80%;
    display: block;
    object-fit: cover;
  }
`;

export const RowIcons = styled.div`
  width: 100%;
  height: 50%;
  ${props => props.theme.displayFlexCenter};
`;

export const IconHolder = styled(motion.div)`
  width: 20%;
  height: 90%;
  ${props => props.theme.displayFlexColumnCenter};
  border: 0.5px solid #c3c3c3;
  border-radius: 6px;
`;

export const BettingText = styled.div`
    font-size: 16px;
    color: ${props => props.theme.text};
    text-align: center;
    line-height: 1.2;
    span{
        color:${props => props.theme.MainAccent};
        font-size: 18px;
        margin: 0 5px;
    }
    @media(min-width: 968px){
      font-size: 22px;
      span{
        font-size: 24px;
      }
    }
`;

export const IconWrapper = styled.div`
  width: 100%;
  height: 70%;
  ${props => props.theme.displayFlexCenter};
  position: relative;
`;

export const IconRound = styled.div`
  width: 90%;
  height: 90%;
  ${props => props.theme.displayFlexCenter};
  position: relative;
  img{
    width: 75%;
    display: block;
    object-fit: cover;
  }
  img:nth-of-type(2) {
    position: absolute;
    top: 20px;
    left: 20px;
    transform: scale(0.8);
    @media(max-width:968px){
      transform: scale(0.6);
    }
  }

`;

export const IconName = styled.div`
  width: 100%;
  height: 30%;
  ${props => props.theme.displayFlexCenter};
  color: ${props => props.theme.text};
  font-size: 16px;
  font-weight: bold;
  @media(max-width: 968px){
    font-size: 12px;
  }
`;

//************************ */

export const RouletteTableContainer = styled.div`
  width: 50vw;
  height: 100%;
  ${props => props.theme.displayFlexCenter};
  padding: 5px;
`;

export const SmallNumberWrapper = styled.div`
    min-width: 25px;
    min-height: 25px;
    margin: 0 2px;
    border-radius: 50%;
    ${props => props.theme.displayFlexCenter};
    color: ${props => props.theme.text};
    @media(min-width: 968px){
        width: 30px;
        height: 30px; 
    }
`;

export const BigWinningsContainer = styled.div`
  width: 100%;
  height: 30%;
  ${props => props.theme.displayFlexCenter};

`;

export const BigNumberContainer = styled.div`
  width: 100%;
  height: 70%;
  ${props => props.theme.displayFlexCenter};

`;

export const BigNumberHolder = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 1px solid ${props => props.theme.MainAccent};
  padding: 30px;
  background-color: ${(props) => props.bgcolor};
   color:  ${props => props.theme.text};
   ${props => props.theme.displayFlexCenter};
   font-weight: bold;
   font-size: 54px;
   @media(max-width: 968px){
    width: 100px;
    height: 100px;
   }
`;

export const SmallTableColumnRight = styled.div`
  width: 25vw;
  height: 60%;
  ${props => props.theme.displayFlexColumnCenter};
  padding: 5px;
  position: relative;
`;


export const SmallTableColumn = styled.div`
  width: 25vw;
  height: 60%;
  
  padding: 10px;
  overflow-y: scroll;
  display: grid;
  place-content: center;
  grid-template-columns: repeat(9, 1fr); /* 10 equal columns */
  column-gap: 1px; /* Column gap (horizontal spacing) */
  row-gap: 5px;
  @media(max-width: 968px){
    grid-template-columns: repeat(7, 1fr); /* 10 equal columns */
    transform: translateX(10px);
  }
`;


export const NumberWrapper = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border:1px solid orange;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: ${props => props.theme.text};
`;

export const LatestRolls = styled.div`
  border: 1px solid blue;
  width: 100%;
  height: 30%;
  ${props => props.theme.displayFlexCenter}
`;

export const BalanceWrapper = styled.div`
  border: 1px solid blue;
  width: 100%;
  height: 30%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PlayerBetsWrapper = styled.div`
  border: 1px solid orange;
  width: 100%;
  height: 40%;
  display: flex;
  align-items: center;
  
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
  font-size: 20px;
  //color:${props => props.theme.MainAccent}; 
  //filter: drop-shadow(0 0 5px aqua);
  @media(max-width: 968px){
    font-size: 12px;
    inset: 2px;
    }
`;

export const SpinButton = styled.div`
  position: absolute;
  inset: 100px;
  background: ${props => props.theme.MainAccent};
  border-radius: 50%;
  filter: drop-shadow(0 0 5px aqua);
  z-index: 5000;
  cursor: pointer;
  ${props => props.theme.displayFlexCenter}; 
  @media(max-width: 968px){
    inset: 80px;
  }
  img{
    transform: rotate(4.67deg) translateY(-3px);
  }
`;

export const Number = styled.div`
  position: absolute;
  inset: -10px;
  rotate: 5deg;
  @media(max-width: 968px){
    inset: 0;
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
max-height: 100vh;
overflow: hidden;
background: ${props => props.theme.body};
${props => props.theme.displayFlexColumn};
`;

export const RouletteColumn = styled.div`
width: 40%;
height: 100%;
${props => props.theme.displayFlexCenter};
padding: 20px;
`;

export const RouletteSmallColumn = styled.div`
  width: 30%;
  height: 100%;
  ${props => props.theme.displayFlexColumn};
  //border: 1px solid white;
  padding: 10px;
  overflow-y: scroll;
`;

export const BetsWrapper = styled.div`
  width: 100%;
  height: 80%;
  ${props => props.theme.displayFlexColumn};
  border: 1px solid white;
  padding: 10px;
  overflow-y: scroll;

`;

export const BetsBalances = styled.div`
  width: 100%;
  height: 20%;
  ${props => props.theme.displayFlexCenter};
`;

export const BetHolder = styled.div`
  width: 80%;
  min-height: 40px;
  border: 1px solid ${props => props.theme.MainAccent};
  border-radius: 10px;
  margin: 5px 50px 5px 0;
  ${props => props.theme.displayFlexCenter};
`;


export const RouletteRow = styled.div`
  width: 100%;
  height: 60vh;
  ${props => props.theme.displayFlexCenter};
`;

export const StyledAbsolute = styled(IconButton)`
  &&&{
    box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4, 0 0 100px #03e9f4;
    background: transparent;
    position: absolute;
    top: 30px;
    right: 30px;
    z-index: 9000;
    @media(max-width: 968px){
      transform: scale(0.8);
      top: 10px;
      left: 10px;
    }
  }
`;


export const RouletteContainer = styled(motion.div)`
  width: 25vw;
  height: 25vw;
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
    height: 30px;
    background: ${props => props.theme.MainAccent};
    clip-path: polygon(50% 0%, 65% 50%, 50% 100%, 35% 50%);
    transform: translate(70%, -50%) rotate(4deg);
    @media(max-width: 968px){
      transform: translate(50%, -70%) rotate(4deg);
      height: 30px;
      top: 5px;
    }
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
width: 100%;
height: 40vh;
${props => props.theme.displayFlexCenter};
`;

export const RouletteWrapper = styled.div`
  width: 880px;
  height: 20vh;
  border-bottom: 1px solid #c3c3c3;
  position: relative;
  overflow: hidden;
`;

export const ChatRoomIcon = styled(ChatIcon)`
  &&&{
    color: ${props => props.theme.text};
    @media (max-width: 968px) {
            scale: 1;
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