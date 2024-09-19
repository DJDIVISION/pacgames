import styled from 'styled-components'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { motion } from 'framer-motion';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import GroupsIcon from '@mui/icons-material/Groups';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StadiumIcon from '@mui/icons-material/Stadium';
import ReduceCapacityIcon from '@mui/icons-material/ReduceCapacity';
import SportsIcon from '@mui/icons-material/Sports';
import HistoryIcon from '@mui/icons-material/History';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { Button,IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDown from '@mui/icons-material/VolumeDown';




export const BettingTimer = styled.div`
width: 50%;
height: 30vh;
display: flex;
align-items: center;
justify-content: center;
border: 1px solid ${props => props.theme.MainAccent};
`;

export const BettingText = styled.div`
    font-size: 24px;
    color: ${props => props.theme.text};
    span{
        color:${props => props.theme.MainAccent};
        font-size: 36px;
        margin: 0 5px;
    }
`;

export const ButtonHoverAbsolute = styled(IconButton)`
    &&&{
        position: absolute;
        top: 30px;
        right: 30px;
        z-index: 5000;
        &:hover{
            box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4, 0 0 100px #03e9f4;
            background: transparent;
        }
    }
`;

export const VolumeIcon = styled(VolumeUpIcon)`
    &&&{
        color: ${props => props.theme.text};
        scale: 1.5;
        background: transparent;
    }
`;

export const VolumeDownIcon = styled(VolumeDown)`
    &&&{
        color: ${props => props.theme.text};
        scale: 1.5;
        background: transparent;
    }
`;

export const Disconnect = styled(ExitToAppIcon)`
    &&&{
        color: ${props => props.theme.text};
        scale: 1.5;
        background: transparent;
    }
`;

export const ChatRoomIcon = styled(ChatIcon)`
    &&&{
        color: ${props => props.theme.MainAccent};
        /* position: absolute;
        top: 50px;
        left: 50px; */
        //scale: 1.5;
    }
    
`;

export const DealerCard = styled(motion.div)`
    height: 150px;
    width: 100px;
    margin: 0 5px;
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
        color: #ffffff;
        box-shadow: 0 0 5px ${props => props.theme.MainAccent}, 0 0 25px ${props => props.theme.MainAccent},
        0 0 50px ${props => props.theme.MainAccent}, 0 0 100px ${props => props.theme.MainAccent};
        font-weight: bold;
    }
    }
`;


export const ReadMore = styled(ReadMoreIcon)`
    &&&{
        color: ${props => props.theme.text}; 
        display: flex;
        scale: 0.8;
    }
`;

export const Foundation = styled(HistoryIcon)`
    &&&{
        color: ${props => props.theme.text}; 
        display: flex;
        scale: 1.2;
    }
`;

export const Coach = styled(SportsIcon)`
    &&&{
        color: ${props => props.theme.text}; 
        display: flex;
        scale: 1.2;
    }
`;

export const Capacity = styled(ReduceCapacityIcon)`
    &&&{
        color: ${props => props.theme.text}; 
        display: flex;
        scale: 1.2;
    }
`;

export const Stadium = styled(StadiumIcon)`
    &&&{
        color: ${props => props.theme.text}; 
        display: flex;
        scale: 1.2;
    }
`;


export const AgeAverage = styled(CalendarTodayIcon)`
    &&&{
        color: ${props => props.theme.text}; 
        display: flex;
        scale: 1.2;
    }
`;

export const TeamMembers = styled(GroupsIcon)`
    &&&{
        color: ${props => props.theme.text}; 
        display: flex;
        scale: 1.8;
    }
`;

export const Row = styled.div`
    width: 100%;
    height: 50%;
    display: flex;
`;

export const TeamStatsRow = styled.div`
    width: 100%;
    height: 200px;
    display: flex;
`;


export const StatsIcon = styled(AnalyticsIcon)`
    &&&{
        color: ${props => props.theme.text}; 
        border: 1px solid white;
        display: flex;
        margin-right: auto;
        margin-left: -100px;
    }
`;

export const BetSection = styled.div`
    width: 100vw;
    height: 100vh;
    background: ${props => props.theme.body};
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const ArrowDown = styled(KeyboardArrowDownIcon)`
    &&&{
        color: ${props => props.theme.text};
        scale: 2;
        position: absolute;
        top: 30px;
        left: 20px;
    }
`;

export const MiniArrowDown = styled(KeyboardArrowDownIcon)`
    &&&{
        color: ${props => props.theme.text};
        position: absolute;
        bottom: 10px;
        right: 10px;
    }
`;

export const MiniArrowup = styled(KeyboardArrowDownIcon)`
    &&&{
        color: ${props => props.theme.text};
        position: absolute;
        bottom: 10px;
        right: 10px;
        transform: rotate(180deg);
    }
`;

export const ArrowLeft = styled(KeyboardArrowDownIcon)`
    &&&{
        color: ${props => props.theme.text};
        scale: 2;
        position: absolute;
        top: 30px;
        left: 20px;
        transform: rotate(90deg);
    }
`;

export const ArrowUp = styled(KeyboardArrowDownIcon)`
    &&&{
        color: ${props => props.theme.text};
        scale: 2;
        position: absolute;
        top: 30px;
        left: 20px;
        transform: rotate(180deg);
    }
`;

export const SportsButtonRow = styled(motion.div)`
    width: 90%;
    height: 15vh;
    border: 1px solid ${props => props.theme.text};
    display: flex;
    align-items: center;
    justify-content: space-evenly;
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

export const MatchWrapper = styled.div`
    width: 100%;
    height: 150px;
    display: flex;
    align-items: center;
    margin: 30px 0;
`;

export const Match = styled.div`
    width: 70%;
    height: ${({ expandedId }) => (expandedId ? 'auto' : '150px')};
    
    display: flex;
    border-radius: 10px;
    margin-left: auto;
    margin-right: auto;
    position: relative;
`;

export const LeftColumn = styled.div`
    width: 70%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const RightColumn = styled.div`
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0;
`;

export const AccordionTitle = styled.div`
    width: 100%;
    height: 50px;
    color: ${props => props.theme.text};
    font-size: 18px;
    padding: 0 10px;
    display: flex;
    align-items: center;
`;

export const RecentForm = styled.div`
    width: 60%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;
`;

export const BorderedMatch = styled.div`
    width: 90%;
    height: 150px;
    border: 1px solid ${props => props.theme.text};
    display: flex;
    align-items: center;
    border-radius: 10px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
`;

export const BorderedPlayer = styled.div`
    width: 90%;
    height: 150px;
    border: 1px solid ${props => props.theme.text};
    display: flex;
    align-items: center;
    border-radius: 10px;
    margin-left: auto;
    margin-top: 10vh;
`;

export const SmallBorderedMatch = styled.div`
    width: 40%;
    height: 180px;
    border: 1px solid ${props => props.theme.text};
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 10px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 30px;
`;

export const SmallBorderedMatchRight = styled.div`
    width: 90%;
    height: 140px;
    border: 1px solid ${props => props.theme.text};
    display: flex;
    align-items: center;
    border-radius: 10px;
    margin: 10px auto 10px auto;
`;

export const Column = styled.div`
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const ColumnIcon = styled.div`
    width: 100%;
    height: 50%;
    display: grid;
    place-items: center;
    
`;

export const SmallColumnText = styled.div`
    width: 100%;
    height: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c2c2c2;
    font-size: 12px;
`;

export const ArrivalsTitle = styled.div`
    width: 100%;
    height: 30%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #c2c2c2;
    font-size: 16px;
`;

export const ArrivalsText = styled.div`
    width: 100%;
    height: 70%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    color: ${props => props.theme.text};
    font-size: 18px;
`;

export const BigColumnText = styled.div`
    width: 100%;
    height: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text};
    font-size: 18px;
`;

export const BetWrapper = styled.div`
    width: 100vw;
    height: auto;
    position: absolute;
    top: 15vh;
    background-color: ${props => props.theme.body};
    
`;

export const OddsColumn = styled.div`
    width: 33%;
    height: 100%;
    display: flex;
    border: 1px solid ${props => props.theme.text};
    background-color: ${({ isSelected, isSelectedTwo }) => (isSelected || isSelectedTwo ? 'green' : 'initial')};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
    
    span{
        font-size: 14px;
        color: #c3c3c3;
        margin-right: 5px;
        background: transparent;
    }
    &:last-child {
        border-right: none;
    }
`;




export const MatchColumn = styled.div`
    width: 33%;
    height: 100%;
    display: flex;
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
`;

export const MatchTeam = styled.div`
    width: 100%;
    height: 30%;
    color: ${props => props.theme.text};
    font-size: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const MatchDate = styled.div`
    width: 100%;
    height: 20%;
    color: ${props => props.theme.text};
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
`;
export const MatchTime = styled.div`
    width: 100%;
    height: 30%;
    color: ${props => props.theme.text};
    font-size: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
`;
export const MatchOdds = styled.div`
    width: 100%;
    height: 30%;
    color: ${props => props.theme.text};
    border-right: 1px solid ${props => props.theme.text};
    font-size: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
`;


export const MatchLogo = styled.div`
    width: 100%;
    height: 70%;
    display: flex;
    align-items: center;
    justify-content: center;
    img{
        width: 35%;
        display: block;
        object-fit: contain;
    }
`;

export const TeamStatsLogo = styled.div`
    width: 20%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid white;
    img{
        width: 75%;
        display: block;
        object-fit: contain;
    }
`;

export const TeamStatsWrapper = styled.div`
    width: 40%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 15px;
    border: 1px solid red;
`;

export const TeamStatsName = styled.div`
    width: 100%;
    height: 33%;
    color: white;
    font-size: 38px;
    padding: 0 10px; 
`;

export const TeamStatsRating = styled.div`
    width: 100%;
    height: 33%;
    color: white;
    font-size: 20px;
    padding: 0 10px; 
    display: flex;
    align-items: center;
    strong{
        font-size: 24px;
        
    }
    span{
        width: 20px;
        height: 30px;
        background: green;
        border: 1px solid black;
        margin-left: 5px;
        transform: translateY(-2px);
    }
`;

export const TeamRatingTitle = styled.div`
    width: 150px;
    height: 100%;
    display: flex;
    align-items: center;
`;

export const TeamRating = styled.div`
    width: 70px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const TeamRatingCard = styled.div`
    width: 20%;
    height: 100%;
    border: 1px solid red;
    //padding: 0 10px; 
    display: flex;
    align-items: center;
`;

export const TeamStatCountry = styled.div`
    width: 100%;
    height: 33%;
    color: white;
    font-size: 38px;
    padding: 0 10px;
    display: flex;
`;

export const StatsCountryAvatar = styled.div`
    width: 10%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
`;

export const StatsCountryLocation = styled.div`
    width: 60%;
    height: 100%;
    display: flex;
    align-items: center;
    //padding: 0 10px;
    color: ${props => props.theme.text};
    font-size: 18px;
`;

export const HomeSection = styled.div`
    width: 100vw;
    height: 200vh;
    background: ${props => props.theme.body};
    display: flex;
    flex-direction: column;
`;

export const TeamStatsSection = styled.div`
    width: 100vw;
    min-height: 100vh;
    background: ${props => props.theme.body};
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const BlackJackTitle = styled.div`
    width: 100%;
    height: 40vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 98px;
    border: 1px solid white;
`;



export const BlackJackColumn = styled.div`
    width: 25%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text};
    font-size: 24px;
    flex-direction: column;
    border: 1px solid blue;
    padding: 5px;
`;

export const WholeColumn = styled.div`
    width: 70%;
    height: 60%;
    border: 1px solid ${props => props.theme.MainAccent};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(10px);
    flex-direction: column;
`;

export const ColumnMedium = styled.div`
    width: 100%;
    height: 35%;
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
`;

export const ColumnTitle = styled.div`
    width: 100%;
    height: 15%;
    display: flex;
    align-items: center;
    padding: 0 10px;
    background: transparent;
    color: ${props=> props.theme.text};
    font-size: 14px;
    transform: translateY(5px);
`;


export const ColumnTopBig = styled.div`
    width: 100%;
    height: 70%;
    
    display: flex;
    align-items: center;
    justify-content: center;
    
    background: transparent;
`;
export const ColumnTopSmall = styled.div`
    width: 100%;
    height: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: ${props => props.theme.MainAccent};
    background: transparent;
    text-shadow: ${props => props.theme.body} -1px 2px,  ${props => props.theme.body} -2px 2px,  ${props => props.theme.body} -3px 3px;
    transform: translateY(-20%);
    
    span{
        margin-left: 10px;
        font-weight: bold;
    }
`;

export const BlackJackBigColumn = styled.div`
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const RouletteSection = styled.div`
    width: 100vw;
    min-height: 100vh;
    background: ${props => props.theme.body};
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const LoginSection = styled.div`
    width: 100vw;
    height: 100vh;
    background: ${props => props.theme.body};
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const GoogleButton = styled(motion.div)`
    width: 200px;
    height: 50px;
    border: 1px solid white;
    border-radius: 10px;
    display: flex;
    cursor: pointer;
`;

export const GoogleLogo = styled.div`
    width: 50px;
    height: 50px;
    border-right: 1px solid white;
    img{
        width: 100%;
        object-fit: cover;
        display: block;
    }
`;

export const GoogleText = styled.div`
    width: 150px;
    height: 50px;
    color: white;
    font-size: 16px;
    display: flex;
    align-items: center;
    padding: 5px;
`;



