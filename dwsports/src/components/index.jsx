import styled from 'styled-components'
import { Button,IconButton } from '@mui/material';
import {motion} from 'framer-motion'
import soccer from '../assets/soccer.png'
import basket from '../assets/basket.png'
import tennis from '../assets/tennis.png'
import cricket from '../assets/cricket.png'
import formula from '../assets/formula.png'

import american from '../assets/rugby.png'
import MMA from '../assets/mma.png'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { styled as styledTwo } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import BJBack from '../assets/bjTable.jpg';
import emptyChip from '../assets/chips/emptyChip.png'
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LanguageIcon from '@mui/icons-material/Language';



export const Language = styled(LanguageIcon)`
    &&&{
        color: ${props => props.theme.text};
    }
`;
export const LightIcon = styled(LightModeIcon)`
    &&&{
        color: ${props => props.theme.text};
    }
`;

export const DarkIcon = styled(DarkModeIcon)`
    &&&{
        color: ${props => props.theme.text};
    }
`;

export const NavIcon = styled.div`
    width: 100%;
    height: 80%;
    display: grid;
    place-items: center;
    img{
        width: 50%;
        display: block;
        object-fit: contain;
    }
`;

export const NavText = styled.div`
    width: 100%;
    height: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text};
    font-size: 10px;
`;

export const NavColumn = styled.div`
    width: 100px;
    height: 90%;
    display: flex;
    flex-direction: column;
    cursor: pointer;
`;

export const Nav = styled.nav`
    width: 100vw;
    height: 80px;
    background: #008080;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: ${({ scrollNavDown }) => (scrollNavDown ? "-100px" : "0")};
    opacity: 0.9;
    transition: 0.5s all ease;
    z-index: 9999;
    padding: 0 30px;
    @media(max-width: 698px){
        display: none;
    }
`;

export const Burguer = styled(MenuOutlinedIcon)`
    &&&{
        color: ${props => props.theme.text};
        font-weight: bold;
    }
`;
export const CloseBurguer = styled(MenuOpenIcon)`
    &&&{
        color: ${props => props.theme.text};
        font-weight: bold;
    }
`;

export const StyledMenu = styled(motion.div)`
    &&&{
    
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 9999;
    }
`;


export const StaggerContainer = styled(motion.div)`
    width: 100%;
    height: 100vh ;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    //padding: 100px 0 50px 0;
`;



export const StaggerImageHolder = styled(motion.div)`
    width: 100%;
    height: 75%;
    ${props => props.theme.displayFlexCenter};
    img{
        width: 15%;
        display: block;
        object-fit: cover;
    }
`;

export const StaggerAvatarName = styled(motion.div)`
    width: 100%;
    height: 25%;
    ${props => props.theme.displayFlexCenter};
    text-shadow: ${props => props.theme.body} -1px 2px,  ${props => props.theme.body} -2px 2px,  ${props => props.theme.body} -3px 3px;
    color: ${props => props.theme.text};
    font-size: 20px;
    text-align: center;
    font-weight: bold;
    transform: translateY(5px);
`;

export const StaggerRow = styled(motion.div)`
    width: 100%;
    height: 70px;
    display: flex;
    flex-direction: column;
    margin: 15px 0;
`;

export const SmartNav = styled.nav`
    width: 100vw;
    height: 80px;
    background: #008080;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: ${({ scrollNavDown }) => (scrollNavDown ? "-100px" : "0")};
    opacity: 0.9;
    transition: 0.5s all ease;
    z-index: 1000;
    padding: 0 20px;
    @media(min-width: 698px){
        display: none;
    }
    img{
        width: 15%;
        display: block;
        object-fit: cover;
    }
`;


export const sportsData = [
    {
        id: 1,
        name: "SOCCER",
        icon: soccer,
        title: "Soccer"
    },
    {
        id: 3,
        name: "BASKETBALL",
        icon: basket,
        title: "Basketball"
    },
    {
        id: 2,
        name: "TENNIS",
        icon: tennis,
        title: "Tennis"
    },
    {
        id: 4,
        name: "CRICKET",
        icon: cricket,
        title: "Cricket"
    },
    {
        id: 5,
        name: "FORMULA 1",
        icon: formula,
        title: "Formula 1"
    },
    {
        id: 6,
        name: "RUGBY",
        icon: american,
        title: "RUGBY"
    },
    {
        id: 7,
        name: "MMA",
        icon: MMA,
        title: "MMA"
    }
]


export const MatchContainer = styled.div`
    width: 70vw;
    height: auto;
    margin-top: 40vh;
    border: 1px solid ${props => props.theme.body};
`;

export const Match = styled.div`
    width: 100%;
    height: 100px;
    margin: 20px 0;
`;




export const MatchColors = styled.div`
    width: 15%;
    height: 100%;
    border: 1px solid orange;
    display: grid;
    place-items: center;
`;

export const MatchColorCircle = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid black;
`;

export const item={
    initial: { height: 0, opacity: 0 },
    animate: { height: "100vh", opacity: 1, transition: { duration: 0.5 } },
    exit: { height: 0, opacity: 0, transition: { duration: 0.5 } }
}


export const SportWrapper = styled(motion.div)`
    width: fit-content;
    height: 50px;
    border: 1px solid ${props => props.theme.text};
    color: ${props => props.theme.text};
    margin: 0 20px;
    display: flex;
    align-items: center;
    border-radius: 10px;
    padding: 10px 15px;
    cursor: pointer;
`;

export const SportIcon = styled.div`
    width: 40px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
        display: block;
        width: 75%;
        object-fit: cover;
    }
`;

export const SportName = styled.div`
    margin: 0 5px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;



export const LeaguesButtonRow = styled(motion.div)`
    width: 90%;
    height: 15vh;
    border: 1px solid ${props => props.theme.text};
    display: flex;
    align-items: center;
    justify-content: space-evenly;
`;

export const LeagueButton = styled(Button)`
    &&&{
        border: 1px solid aqua;
        color: black;
        background: white;
        margin: 0 20px;
        width: fit-content;
    }
`;

export const SportsCarousel = styled(motion.div)`
  cursor: grab;
  height: 15vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  border: 1px solid ${props => props.theme.text};
`;

export const InnerSportsCarousel = styled(motion.div)`
  display: flex;
  align-items: center;
  height: 15vh;
  width: 100%;
`;

export const SportsContainer = styled(motion.div)`
    width: 100vw;
    height: 15vh;
    display: flex;
    align-items: center;
    border: 1px solid red;
    
`;

export const MatchHolder = styled.div`
    width: 80%;
    height: 130px;
    border: 1px solid ${props => props.theme.text};
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px auto;
    border-radius: 10px;
    @media(max-width: 490px){
        width: 95%;
    }
`;

export const BetTeams = styled.div`
    width: 100%;
    height: 60%;
    display: flex;
`;

export const BetTeamsLogo = styled.div`
    width: 50%;
    height: 75%;
    display: flex;
    align-items: center;
    justify-content: center;
    
`;

export const BetTeamsLogoAway = styled.div`
    width: 50%;
    height: 75%;
    display: flex;
    align-items: center;
    justify-content: center;
    
`;

export const BetTeamsHolder = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const BetTeamsColumn = styled.div`
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const BetTeamsLogoHolder = styled.div`
    width: 75px;
    height: 75px;
    border-radius: 50%;
    border: 1px solid ${props => props.theme.text};
    display: grid;
    place-items: center;
    img{
        width: 75%;
        display: block;
        object-fit: cover;
    }
    @media(max-width: 968px){
        width: 60px;
        height: 60px;
    }
    @media(max-width: 698px){
        width: 40px;
        height: 40px;
    }
`;

export const BetTeamsName = styled.div`
    width: 100%;
    height: 25%;
    text-align: center;
    font-size: 20px;
    white-space: nowrap;      /* Prevents text from wrapping to the next line */
  overflow: hidden;         /* Ensures content that overflows the container is hidden */
  text-overflow: ellipsis;
    color: ${props => props.theme.text};
    transform: translateY(5px);
    @media(max-width: 968px){
        font-size: 16px;
        transform: translateY(0px);
    }
`;

export const BetBet = styled.div`
    width: 100%;
    height: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: ${props => props.theme.text};
    span{
        margin: 10px;
    }
    @media(max-width: 968px){
        font-size: 14px;
    }
`;

export const PlayerGrid = styled.div`
    width: 100%;
    height: 70vh;
    display: flex;
    flex-direction: column;
    //grid-template-columns: repeat(2, 40vw);
    border: 1px solid white;
    background-image: url(${BJBack});
    background-repeat: no-repeat;
    background-size: cover;
    padding: 30px;
    position: relative;
`;

export const ActionButtons = styled(motion.div)`
    width: 30%;
    height: 15vh;
    border: 1px solid ${props => props.theme.MainAccent};
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px;
`;

export const PlayerWrapper = styled.div`
    width: 95%;
    height: 20vh;
    border: 1px solid ${props => props.theme.text};
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    margin: 10px 0;
`;

export const RouletteChipContainer = styled.div`
    width: 100%;
    height: 15vh;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: 1px solid ${props => props.theme.MainAccent};
    border-radius: 10px;
`;


export const ChipContainer = styled.div`
    width: 50%;
    height: 15vh;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border: 1px solid ${props => props.theme.MainAccent};
    border-radius: 10px;
`;

export const ChipBalance = styled.div`
    width: 50%;
    height: 10vh;
    display: flex;
    align-items: center;
    justify-content: space-around;
`;

export const BettingArea = styled.div`
    width: 30%;
    height: 30vh;
    border: 1px solid ${props => props.theme.MainAccent};
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
`;

export const StyledButton = styled(Button)`
    &&&{
        align-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    cursor: pointer;
    border: 1px solid ${props => props.theme.MainAccent};
    border-radius: 0.58vmin;
    color: ${props => props.theme.MainAccent};
    padding: 5px 20px;
    font-size: 1.9vmin;
    text-decoration: none;
    text-transform: uppercase;
    overflow: hidden;
    transition: 0.5s;
    &:hover {
        background: ${props => props.theme.MainAccent};
        color: #fff;
        box-shadow: 0 0 5px ${props => props.theme.MainAccent}, 0 0 25px ${props => props.theme.MainAccent},
        0 0 50px ${props => props.theme.MainAccent}, 0 0 100px ${props => props.theme.MainAccent};
    }
    }
`;

export const StyledButtonBets = styled(Button)`
    &&&{
        align-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    cursor: pointer;
    border: 1px solid ${props => props.theme.text};
    border-radius: 10px;
    color: ${props => props.theme.text};
    padding: 10px 20px;
    font-size: 16px;
    text-decoration: none;
    text-transform: uppercase;
    overflow: hidden;
    transition: 0.5s;
    img{
        width: 50%;
        display: block;
        object-fit: cover;
    }
    &:hover {
        background: ${props => props.theme.MainAccent};
        color: #fff;
        box-shadow: 0 0 5px ${props => props.theme.MainAccent}, 0 0 25px ${props => props.theme.MainAccent},
        0 0 50px ${props => props.theme.MainAccent}, 0 0 100px ${props => props.theme.MainAccent};
    }
    @media(max-width: 968px){
        padding: 5px 10px;
        font-size: 10px;
    }
    @media(max-width: 698px){
        padding: 10px 10px;
        font-size: 14px;
        min-width: 200px;
    }
    }
    
`;

export const StyledButtonYellow = styled(Button)`
    &&&{
        align-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    cursor: pointer;
    border: 1px solid rgba(244,215,21,1);
    border-radius: 0.58vmin;
    color: rgba(244,215,21,1);
    padding: 10px 20px;
    font-size: 1.9vmin;
    text-decoration: none;
    text-transform: uppercase;
    overflow: hidden;
    transition: 0.5s;
    &:hover {
        background: rgba(244,215,21,1);
        color: #fff;
        box-shadow: 0 0 5px rgba(244,215,21,1), 0 0 25px rgba(244,215,21,1),
        0 0 50px rgba(244,215,21,1), 0 0 100px ${props => props.theme.MainAccent};
    }
    }
`;

export const BJStartGame = styled.div`
    width: 30%;
    height: 15vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ChipWrapper = styled.div`
    width: 15%;
    height: 100%;
    border: 1px solid ${props => props.theme.text};
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const PlayerAvatarWrapper = styled.div`
    width: 25%;
    height: 100%;
    border: 1px solid ${props => props.theme.text};
    display: flex;
    flex-direction: column;
`;

export const PlayerBet = styled.div`
    width: 20%;
    height: 100%;
    border: 1px solid ${props => props.theme.text};
    display: flex;
    flex-direction: column;
`;

export const PlayerCardsHolder = styled.div`
    width: 55%;
    height: 100%;
    border: 1px solid red;
    display: flex;
    align-items: center;
    overflow-x: scroll;

    img{
        width: 70px;
        height: 100px;
        margin: 0 10px;
    }
`;

export const PlayerCard = styled(motion.div)`
    width: 60px;
    height: 100px;
    margin: 0 10px;
`;

export const PlayerAvatar = styled.div`
    width: 100%;
    height: 80%;
    display: grid;
    place-items: center;
`;

export const PlayerChip = styled.div`
    width: 100%;
    height: 50%;
    display: grid;
    place-items: center;
    background-image: url(${emptyChip});
    background-position: center;
    background-repeat: no-repeat;
    background-size: 60%;
    color: ${props => props.theme.body};
    font-weight: bold;
    font-size: 18px;
`;

export const PlayerAvatarName = styled.div`
    width: 100%;
    height: 20%;
    color: ${props => props.theme.text};
    display: grid;
    place-items: center;
    font-size: 22px;
    font-weight: bold;
    transform: translateY(-10px);
`;

export const CurrentBetText = styled.div`
    width: 100%;
    height: 25%;
    color: ${props => props.theme.text};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
`;

export const Switcher = styled.div`
    width: 100%;
    min-height: 140px;
    display: flex;
    flex-direction: column;
    margin-top: 50px;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    @media(max-width:698px){
        margin-top: 0px;
    }
`;

export const BalanceAmount = styled.div`
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: ${props => props.theme.text};
    span{
        color: ${props => props.theme.MainAccent};
        margin: 0 5px;
    }
    @media(max-width: 490px){
        height: 40px;
        font-size: 18px;
    }
`;

export const BetAmount = styled.div`
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: ${props => props.theme.text};
    @media(max-width: 698px){
        height: 40px;
        font-size: 12px;
    }
`;

export const PossibleWinningsAmount = styled.div`
    width: 100%;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: ${props => props.theme.text};
    span{
        color: green;
        font-weight: bold;
        margin: 10px;
        font-size: 32px;
        transform: translateY(-2px);
    }
    @media(max-width: 490px){
        font-size: 16px;
        span{
            font-size: 26px; 
        }
    }
`;

export const BetInput = styled.input.attrs({ type: 'number' })`
    border: 1px solid white; /* White border by default */
    outline: none; /* Remove the default outline */
    padding: 8px; /* Add some padding */
    background-color: transparent; /* Transparent background */
    color: white; /* Text color */
    height: 40px;
    border-radius: 10px;
    width: 150px;
    font-size: 22px;
    margin: 0 20px;
    text-align: center;
    /* Remove the arrows in WebKit browsers */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }

    /* Change border color to black on focus */
    &:focus {
    border-color: gold;
    }
`;

export const CloseStats = styled(HighlightOffIcon)`
  &&&{
    position: fixed;
    top: 30px;
    left: 30px;
    transform: scale(1.8);
    background: transparent;
    z-index: 9999;
    outline: none;
    color: ${props => props.theme.text};
  }
`;


export const StatsSection = styled.div`
    width: 100vw;
    height: 100vh;
    display: grid;
    place-items: center;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
`;

export const StatsWrapper = styled.div`
    min-width: 350px;
    max-height: 140px;
    border: 1px solid white;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    margin: 10px;
    ${props => props.theme.displayFlexCenter};
    box-shadow: inset 0 0 25px ${props => props.theme.text};
`;

export const BetConatiner = styled.div`
    width: 100%;
    height: calc(85vh - 80px);
    ${props => props.theme.displayFlexColumn};
    overflow-y: scroll;
    position: relative;
    @media(max-width: 968px){
        height: 80vh;
        padding-bottom: 80px;
    }
`;

export const TopTeamStatsRow = styled.div`
    width: 100%;
    min-height: 30px;
    ${props => props.theme.displayFlexCenter};
`;
export const TeamStatsRow = styled.div`
    width: 100%;
    min-height: 60px;
    ${props => props.theme.displayFlexCenter};
`;
export const Rower = styled.div`
    width: 100%;
    height: 130px;
    ${props => props.theme.displayFlexCenter};
`;
export const LeagueRower = styled.div`
    width: 100%;
    min-height: 60px;
    ${props => props.theme.displayFlexCenter};
`;
export const LeagueRowerScroll = styled.div`
    width: 100%;
    min-height: 60px;
    overflow-x: auto;
    ${props => props.theme.displayFlexCenter};
`;
export const LeagueWrapper = styled.div`
    height: 60px;
    ${props => props.theme.displayFlexCenter};
`;
export const SmallRower = styled.div`
    width: 100%;
    height: 100px;
    ${props => props.theme.displayFlex};
`;

export const PlayerTeamLogo = styled.div`
width: 30px;
height: 30px;
border-radius: 50%;
position: absolute;
top: 0px;
left: 0px;
z-index: 10;
@media(max-width: 490px){
    width: 25px;
    height: 25px;
    top: -5px;
    left: -5px;
}
`;

export const SmallAvatar = styled.div`
    width: 20%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
    text-align: center;
    position: relative;
    h2{
        font-size: 10px;
        color: white;
    }
    span{
        font-size: 18px;
        color: white; 
    }
`;
export const SmallAvatarTwo = styled.div`
    width: 20%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
    text-align: center;
    h2{
        font-size: 16px;
        color: white;
    }
    span{
        font-size: 18px;
        color: white; 
    }
`;
export const SmallPlayerName = styled.div`
    width: 40%;
    height: 100%;
    text-align: center;
    ${props => props.theme.displayFlexColumnCenter};
    h2{
        font-size: 14px !important;
        color: white;
    }
`;
export const SmallSmallPlayerName = styled.div`
    width: 20%;
    height: 100%;
    text-align: center;
    ${props => props.theme.displayFlexCenter};
    h2{
        font-size: 12px !important;
        color: white;
    }
`;

export const RowerColumn = styled.div`
    width: 100%;
    height: 130px;
    ${props => props.theme.displayFlexColumn};
`;

export const RowerSmall = styled.div`
    width: 100%;
    height: 60px;
    ${props => props.theme.displayFlexCenter};
    h2{
        color: ${props => props.theme.MainAccent};
        font-size: 20px;
        font-weight: bold;
        text-shadow: ${props => props.theme.textShadowTwo};
    }
`;

export const MiniRower = styled.div`
    width: 100%;
    height: 33%;
    ${props => props.theme.displayFlexCenter};
    h2{
        color: ${props => props.theme.text};
        font-size: 20px;
        font-weight: bold;
    }
`;
export const MiniRowerType = styled.div`
    width: 60%;
    height: 100%;
    ${props => props.theme.displayFlexColumn};
    h2{
        color: ${props => props.theme.text};
        font-size: 20px;
        font-weight: bold;
    }
`;
export const MiniRowerAmount = styled.div`
    width: 40%;
    height: 100%;
    ${props => props.theme.displayFlexColumn};
    span{
        color: ${props => props.theme.MainAccent};
        font-size: 20px;
        font-weight: bold;
    }
`;

export const LowRower = styled.div`
    width: 100%;
    height: 100%;
    ${props => props.theme.displayFlexColumn};
    overflow-y: auto !important;
`;


export const RowerRowBet = styled.div`
    width: 100%;
    min-height: 50px;
    border: 1px solid ${props => props.theme.text};
    border-radius: 8px;
    ${props => props.theme.displayFlexCenter};
    margin: 5px 0;
    background-color: ${({ isSelected, isSelectedTwo }) => (isSelected || isSelectedTwo ? 'green' : 'initial')};
    h2{
        font-size: 14px;
        color: ${props => props.theme.text};
        text-shadow: ${props => props.theme.textShadowTwo};
        width: 80%;
    }
`;
export const BigRowBet = styled.div`
    width: 100%;
    height: auto;
    border: 1px solid ${props => props.theme.text};
    ${props => props.theme.displayFlexColumn};
    margin: 10px 0;
`;
export const TopRowBet = styled.div`
    width: 100%;
    height: 25px;
    ${props => props.theme.displayFlexCenter};
    h2{
        font-size: 16px;
        color: ${props => props.theme.MainAccent}; 
    }
`;
export const BottomRowBet = styled.div`
    width: 100%;
    min-height: 35px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(33%, 1fr));
    justify-content: center;
`;
export const BetHolder = styled.div`
    min-width: 33.3%;
    min-height: 35px;
    border: 1px solid white;
    ${props => props.theme.displayFlexCenter};
    background-color: ${({ isSelected, isSelectedTwo }) => (isSelected || isSelectedTwo ? 'green' : 'initial')};
    h2{
        font-size: 12px !important;
        color: ${props => props.theme.text}; 
    }
`;

export const RowerRow = styled.div`
    width: 100%;
    min-height: 50px;
    ${props => props.theme.displayFlexCenter};
    margin: 5px 0;
    position: relative;
`;
export const RowerRowScroll = styled.div`
    width: 100%;
    min-height: 50px;
    ${props => props.theme.displayFlexCenter};
    margin: 5px 0;
    overflow-x: auto;
    position: relative;
`;
export const MiniRowerRow = styled.div`
    width: 100%;
    height: 50px;
    ${props => props.theme.displayFlexCenter};
`;

export const RowerRowBets = styled.div`
    width: 100%;
    min-height: 50px;
    ${props => props.theme.displayFlex};
    margin: 5px 0;
    
    h2{
        font-size: 12px;
        color: ${props => props.theme.text};
    }
`;

export const RowerRowBetsCenter = styled.div`
    width: 100%;
    height: 60px;
    ${props => props.theme.displayFlexCenter};
    margin: 5px 0;
    h2{
        font-size: 20px;
        color: ${props => props.theme.text};
    }
`;
export const RowerInput = styled.input`
    width: 100%;
    height: 50px;
    ${props => props.theme.displayFlexCenter};
    margin: 5px 0;
    border: 1px solid #c3c3c3;
    background: transparent;
    border-radius: 5px;
    padding: 10px;
    font-size: 16px;
    color: ${props => props.theme.MainAccent};
    &:focus{
        outline: none;
    }
`;

export const ImageClicker = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid ${props => props.theme.card};
    ${props => props.theme.displayFlexCenter};
    background: #3c3c3c;
    text-align: center;
    h3{
        font-size: 10px !important;
        width: 80%;
        color: white;
    }
`;

export const RowerSmallCenter = styled.div`
    width: 100%;
    height: 40px;
    ${props => props.theme.displayFlexCenter};
    margin: 5px 0;
    h2{
        color: white;
        font-size: 20px;
    }
    h3{
        color: white;
        font-size: 16px;
    }
`;

export const FormWrapper = styled.div`
    width: 90%;
    min-height: 50vh;
    border: 2px solid white;
    border-radius: 10px;
    padding: 10px;
    ${props => props.theme.displayFlexColumn};
    background: rgba(0,0,0,0.2);
    backdrop-filter: blur(10px);
`;

export const AbsoluteScore = styled.h2`
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 14px;
    color: ${props => props.theme.text};
    transform: translate(-50%, -50%);
`;

export const RowerFirstEvent = styled.div`
    width: 30%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
    text-align: center;
    color: ${props => props.theme.text};
    h2{
        font-size: 12px !important;
        color: ${props => props.theme.text};
    }
    img{
        display: block;
        width: 25%;
        object-fit: cover;
    }
`;

export const RowerRowEvent = styled.div`
    width: 15%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
    position: relative;
    h2{
        font-size: 14px;
        z-index: 3;
        color: ${props => props.theme.text};
        text-shadow: ${props => props.theme.textShadowTwo};
    }
    h3{
        font-size: 18px;
        color: ${props => props.theme.text};
        text-shadow: ${props => props.theme.textShadowTwo};
    }
    h4{
        font-size: 14px;
        color: ${props => props.theme.text};
        text-shadow: ${props => props.theme.textShadowTwo};
    }
    img{
        width: 50%;
    }
    
`;
export const RowerRowEventLong = styled.div`
    width: 20%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
    position: relative;
    h2{
        font-size: 36px;
        z-index: 3;
        color: ${props => props.theme.text};
        text-shadow: ${props => props.theme.textShadowTwo};
    }
    h3{
        font-size: 18px;
        color: ${props => props.theme.text};
        text-shadow: ${props => props.theme.textShadowTwo};
    }
    h4{
        font-size: 14px;
        color: ${props => props.theme.text};
        text-shadow: ${props => props.theme.textShadowTwo};
    }
    img{
        width: 75%;
    }
`;

export const RowerNameEvent = styled.div`
    width: 32.5%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
    position: relative;
    text-align: center;
    h2{
        font-size: 14px;
        color: ${props => props.theme.text};
        text-shadow: ${props => props.theme.textShadowTwo};
    }
`;
export const RowerLongNameEvent = styled.div`
    width: 40%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
    position: relative;
    text-align: center;
    h2{
        font-size: 14px;
        color: ${props => props.theme.text};
        text-shadow: ${props => props.theme.textShadowTwo};
    }
`;

export const RowerRowEventTop = styled.div`
    width: 15%;
    height: 100%;
    ${props => props.theme.displayFlexColumn};
    h3{
        font-size: 34px;
        z-index: 3;
        color: ${props => props.theme.text};
        text-shadow: ${props => props.theme.textShadowTwo};
    }
`;


export const RowerTeamEvent = styled.div`
    width: 5%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
    h2{
        font-size: 14px;
        color: ${props => props.theme.text};
    }
    img{
        display: block;
        width: 400%;
        object-fit: cover;
    }
`;

export const RowerRowName = styled.div`
    width: 40%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
    h2{
        font-size: 14px !important;
        color: ${props => props.theme.text};
    }
`;


export const SmallStatsWrapper = styled(motion.div)`
    width: 60%;
    min-height: ${props => (props.expanded ? "330px" : "130px")};
    border: 1px solid white;
    border-radius: 10px;
    background: ${props => props.theme.cardTwo};
    backdrop-filter: blur(10px);
    margin: 10px 0;
    ${props => props.theme.displayFlexColumn};
    @media(max-width:968px){
        width: 70%; 
    }
    @media(max-width:698px){
        width: 90%; 
    }
`;

export const TeamLogo = styled.div`
    width: 30%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
`;

export const StatsPlayers = styled.div`
    width: 80%;
    height: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const Wrapper = styled.div`
    display: flex;
    width: 100%;
`;

export const StatsStadium = styled.div`
    width: 100%;
    height: 15%;
    color: ${props => props.theme.text};
    font-size: 22px;
    display: grid;
    place-items: center;
    background: transparent;
    @media(max-width: 968px){
        font-size: 18px;
    }
    @media(max-width: 698px){
        font-size: 16px;
    }
`;

export const StatsStadiumCapacity = styled.div`
    width: 100%;
    height: 5%;
    color: ${props => props.theme.text};
    font-size: 16px;
    display: grid;
    place-items: center;
    background: transparent;
    @media(max-width: 698px){
        font-size: 12px;
    }
`;

export const StatPlayer = styled.div`
    width: 95%;
    height: 40px;
    border: 1px solid black;
    margin: 5px 0;
    display: flex;
    align-items: center;
`;


export const PlayerPicture = styled.div`
    width: 5%;
    height: 100%;
    border: 1px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text};
`;

export const PlayerBigPicture = styled.div`
    width: 7.5%;
    height: 100%;
    border: 1px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text};
`;

export const PlayerName = styled.div`
    width: 20%;
    height: 100%;
    border: 1px solid white;
    display: flex;
    align-items: center;
    padding: 0 5px;
    font-size: 14px;
    color: ${props => props.theme.text};
`;

export const PlayerPosition = styled.div`
    width: 15%;
    height: 100%;
    border: 1px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5px;
    font-size: 14px;
    color: ${props => props.theme.text};
`;

export const PlayerNumber = styled.div`
    width: 10%;
    height: 100%;
    border: 1px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text};
`;

export const PlayerDisplay = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #353035;
    display: grid;
    place-items: center;
    color: ${props => props.theme.text};
`;

export const Column = styled.div`
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const AntSwitch = styledTwo(Switch)(({ theme }) => ({
    width: 56,
    height: 32,
    padding: 0,
    display: 'flex',
    '&:active': {
      '& .MuiSwitch-thumb': {
        width: 30,
      },
      '& .MuiSwitch-switchBase.Mui-checked': {
        transform: 'translateX(18px)',
      },
    },
    '& .MuiSwitch-switchBase': {
      padding: 4,
      '&.Mui-checked': {
        transform: 'translateX(24px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: '#1890ff',
          ...theme.applyStyles('dark', {
            backgroundColor: '#177ddc',
          }),
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: '0 4px 8px 0 rgb(0 35 11 / 20%)',
      width: 24,
      height: 24,
      borderRadius: 12,
      transition: theme.transitions.create(['width'], {
        duration: 200,
      }),
    },
    '& .MuiSwitch-track': {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: 'rgba(0,0,0,.25)',
      boxSizing: 'border-box',
      ...theme.applyStyles('dark', {
        backgroundColor: 'rgba(255,255,255,.35)',
      }),
    },
  }));

  export const MatchLineUp = styled.div`
    width: 70%;
    height: 350px;
    border: 1px solid white;
    display: flex;
    margin: 10px auto;
    img{
        width: 100%;
        display: block;
        object-fit: contain;
    }
  `;