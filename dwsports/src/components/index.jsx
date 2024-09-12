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
    font-size: 16px;
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
    z-index: 1000;
    padding: 0 30px;
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
    exit:{
      opacity:0,
      height:0,
      transition:{
        ease:"easeInOut",
        duration:0.3,
        delay:1
      }
    }
  }


export const SportWrapper = styled(motion.div)`
    width: 150px;
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
    width: 20%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
        display: block;
        width: 120%;
        object-fit: contain;
    }
`;

export const SportName = styled.div`
    width: 80%;
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
    width: 70%;
    height: 60%;
    border: 1px solid ${props => props.theme.text};
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
    border-radius: 10px;
`;

export const BetTeams = styled.div`
    width: 100%;
    height: 40%;
    display: flex;
`;

export const BetTeamsLogo = styled.div`
    width: 100%;
    height: 75%;
    display: grid;
    place-items: center;
`;

export const BetTeamsColumn = styled.div`
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

export const BetTeamsLogoHolder = styled.div`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 1px solid ${props => props.theme.text};
    display: grid;
    place-items: center;
    img{
        width: 75%;
        display: block;
        object-fit: cover;
    }
`;

export const BetTeamsName = styled.div`
    width: 100%;
    height: 25%;
    display: grid;
    place-items: center;
    font-size: 24px;
    color: ${props => props.theme.text};
`;

export const BetBet = styled.div`
    width: 100%;
    height: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: ${props => props.theme.text};
    span{
        margin: 20px;
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
    padding: 10px 20px;
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
    height: 100px;
    display: flex;
    margin-top: 50px;
    align-items: center;
    justify-content: center;
`;

export const BetAmount = styled.div`
    width: 100%;
    height: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
`;

export const BetInput = styled.input.attrs({ type: 'number' })`
    border: 1px solid white; /* White border by default */
    outline: none; /* Remove the default outline */
    padding: 8px; /* Add some padding */
    background-color: transparent; /* Transparent background */
    color: white; /* Text color */
    height: 80%;
    width: 100px;
    font-size: 28px;
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
    border-color: black;
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
    width: 95%;
    height: 80%;
    border: 1px solid white;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    overflow-y: scroll;
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
    height: 10%;
    color: ${props => props.theme.text};
    font-size: 22px;
    display: grid;
    place-items: center;
    background: transparent;
`;

export const StatsStadiumCapacity = styled.div`
    width: 100%;
    height: 5%;
    color: ${props => props.theme.text};
    font-size: 16px;
    display: grid;
    place-items: center;
    background: transparent;
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