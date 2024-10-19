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
import {  styled as styledTwo, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings';

export const PlayerSettingsIcon = styled(DisplaySettingsIcon)`
    &&&{
            color: ${props =>props.theme.text}
        }
`;

export const SearchIconButton = styled(SearchIcon)`
    &&&{
        color: ${props =>props.theme.text}
    }
`;

export const Search = ({setIsSearchExpanded,isSearchExpanded,playerToFind,setPlayerToFind}) => {
    return(
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', width: '100%' }}>
        <SearchIconButton/>
        <TextField autoComplete='off' onChange={(e) => {setIsSearchExpanded(true);setPlayerToFind(e.target.value)}} value={playerToFind} fullWidth id="input-with-sx" label="Search by name" variant="filled" slotProps={{
            input: {
                style: {
                    color: 'white'
                }
            },
            inputLabel: {
                style: {
                    color: 'white'
                }
            }
        }}/>
      </Box>
    )
}
  


export const BallColumn = styled.div`
    width: 20%;
    height: 100%;
    ${props => props.theme.displayFlexColumn};
    position: relative;
`;

export const CountryBall = styled(motion.div)`
    width: 80%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
`;

export const CountryBallText = styled(motion.div)`
    width: 80%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
    color: ${props => props.theme.text};
    font-weight: bold;
    text-transform: uppercase;
`;

export const PlayersContainer = styled.div`
    height: 75vh;
    width: 100%;
    ${props => props.theme.displayFlexColumnCenter};
    overflow-y: scroll;
`;

export const PokerNavBar = styled.div`
    height: 17.5vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
`;

export const TopPokerNavBar = styled.div`
    height: 10vh;
    width: 100%;
    display: flex;
    align-items: center;
    //justify-content: space-around;
`;

export const PlayerDroppingArea = styled.div`
    width: 65px;
    height: 65px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2cf5fcac;
    @media(max-width: 968px){
        width: 40px;
        height: 40px; 
    }
`;

export const DraggContainer = styled.div`
    height: 70vh;
    width: 100%;
    
    ${props => props.theme.displayFlexCenter};
    position: relative;
    @media(max-width: 968px){}
`;

export const TeamsCarousel = styled(motion.div)`
  
  height: 95%;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
`;

export const InnerTeamsCarousel = styled(motion.div)`
  display: flex;
  align-items: center;
  height: 95%;
  width: 100%;
  overflow-x: scroll;
`;

export const TeamWrapper = styled.div`
    width: auto;
    height: 50px;
    border: 0.5px solid white;
    cursor: pointer;
    border-radius: 10px;
    margin: 5px 10px;
    padding: 5px 15px 5px 5px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    @media(max-width:968px){
        height: 40px;
    }
`;

export const ArrowWrapper = styled.div`
    width: 100%;
    height: 10%;
    ${props => props.theme.displayFlex};
    
`;

export const SearchBar = styled(motion.div)`
    width: 45%;
    height: 10;
    padding: 10px;
    padding-right: ${({ isSearchExpanded }) => (isSearchExpanded ? "70px" : "10px")};
`;

export const ArrowBar = styled(motion.div)`
    width: 55%;
    height: 100%;
    ${props => props.theme.displayFlex};
`;
export const ArrowWrapperColumn = styled.div`
    width: 25%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
    transform: translateX(20px);
`;
export const ArrowWrapperColumnSmall = styled.div`
    width: 7.5%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
`;

export const PlayerWrapper = styled(motion.div)`
    width: 87.5%;
    min-height: 80px;
    border: 0.5px solid white;
    border-radius: 10px;
    margin: 10px 15px;
    ${props => props.theme.displayFlexCenter};
    align-items: center;
    padding: 5px;
    @media(max-width:968px){
        min-height: 40px;
    }
`;

export const PlayerAvatar = styled.div`
    width: 15%;
    position: relative;
    ${props => props.theme.displayFlexCenter};
`;

export const PlayerShirtHolder = styled.div`
    width: 15%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
    color: white;
    font-weight: bold;
    @media(max-width:968px){
        font-size: 14px;
    }
`;


export const PlayerValue = styled.div`
    width: 20%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
    color: gold;
    font-weight: bold;
    @media(max-width:968px){
        font-size: 14px;
    }
`;

export const PlayerInput = styled.input`
    width: 20%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
`;

export const PlayerShirt = styled.div`
    width: 25px;
    height: 25px;
    border-radius: 50%;
    ${props => props.theme.displayFlexCenter};
    background: lightblue;
    z-index: 1000;
    position: absolute; 
    top: 0;
    left: 0;
    transform: translate(-20%,-20%);
    color: ${props => props.theme.body};
    font-size: 12px;
    font-weight: bold;
    @media(max-width: 968px){
        width: 15px;
        height: 15px;
    }
`;

export const PlayerTeamLogo = styled.div`
    width: 25px;
    height: 25px;
    border-radius: 50%;
    ${props => props.theme.displayFlexCenter};
    z-index: 1000;
    position: absolute; 
    top: 0;
    left: 0;
    @media(max-width: 968px){
        
        width: 15px;
        height: 15px;
    }
`;
export const PlayerTeamCross = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    ${props => props.theme.displayFlexCenter};
    z-index: 1000;
    position: absolute; 
    top: 0%;
    right: 0%;
    @media(max-width: 968px){
        top: 40%;
        right: -10%;
    }
`;


export const PlayerRating = styled.div`
    width: 35px;
    height: 35px;
    border-radius: 50%;
    color: black;
    ${props => props.theme.displayFlexCenter};
`;

export const PlayerName = styled.div`
    width: 25%;
    padding: 5px;
    height: 100%;
    ${props => props.theme.displayFlex};
    color: ${props => props.theme.text};
    font-size: 18px;
    @media(max-width:968px){
        font-size: 14px;
    }
`;

export const PlayerPosition = styled.div`
    width: 20%;
    padding: 5px;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
    color: ${props => props.theme.text};
    font-size: 18px;
    @media(max-width:968px){
        font-size: 14px;
    }
`;

export const TeamLogo = styled.div`
    min-width: 40px;
    height: 100%;
`;
export const TeamName = styled.div`
    width: fit-content;
    padding: 0 5px;
    height: 100%;
    color: white;
    font-size: 16px;
    font-weight: bold;
    ${props => props.theme.displayFlexCenter};
    @media(max-width:968px){
        font-size: 14px;
    }
`;

export const TopPlayerHolder = styled.div`
    width: calc(100% / 11);
    height: 100%;
    position: relative;
    ${props => props.theme.displayFlexColumn};
`;

export const TopPlayerText = styled.div`
    width: 100%;
    height: 40%;
    position: relative;
    color: white;
    font-size: 14px;
    ${props => props.theme.displayFlexCenter};
    text-align: center;
    line-height: 0.9;
    @media(max-width: 968px){
        font-size: 10px;
    }
`;

export const Formation = styled.div`
    position: absolute;
    top: 10%;
    left: 10%;
    width: 12.5%;
    height: 7.5%;
    ${props => props.theme.displayFlexCenter};
    color: ${props => props.theme.text};
    font-size: 32px;
    font-weight: bold;
    @media(max-width: 968px){
        font-size: 24px;
    }
`;


export const LeftPokerColumn = styled.div`
  width: 65vw;
  height: 100%;
  ${props => props.theme.displayFlexColumn};
  padding-top: 0px;
  position: relative;
  overflow: visible; 
  z-index: 1;
`;

export const TopPokerColumn = styled.div`
  width: 65vw;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 10px;
  position: relative;
  overflow: visible; 
  z-index: 1;
`;

export const WrapperLeftColumn = styled.div`
  width: 65vw;
  height: 75vh;
  ${props => props.theme.displayFlexColumn};
  padding-top: 0px;
  position: relative;
  overflow: visible; 
  z-index: 1;
`;

export const WrapperRightColumn = styled.div`
  width: 35vw;
  height: 75vh;
  ${props => props.theme.displayFlexColumn};
  padding-top: 0px;
  position: relative;
  overflow: visible; 
  z-index: 1;
`;

export const RightPokerColumn = styled.div`
  width: 40vw;
  height: 100%;
  ${props => props.theme.displayFlexCenter};
  padding-top: 0px;
  overflow-y: scroll;
  overflow-x: hidden;
  position: relative;
  z-index: 1;
`;

export const BigColumn = styled.div`
  width: 40vw;
  height: 100%;
  position: relative;
  ${props => props.theme.displayFlexColumn};
  padding-top: 0px;
  border: 1px solid white;
  @media(max-width: 968px){
    
  }
`;

export const SmallColumn = styled.div`
width: 5vw;
height: 100%;   
${props => props.theme.displayFlexColumn};                                                                         
@media(max-width: 968px){
  
}
`;


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
        z-index: 100;
        &:hover{
            box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4, 0 0 100px #03e9f4;
            background: transparent;
        }
        @media (max-width: 968px) {
        top: 20px;
        right: 20px;
        }
        @media (max-width: 768px) {
        top: 15px;
        right: 15px;
        }
    }
    
`;

export const ButtonHoverAbsoluteLeft = styled(IconButton)`
    &&&{
        position: absolute;
        top: 30px;
        left: 30px;
        z-index: 5000;
        padding: 10px;
        background: ${props => props.theme.body};
        box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4, 0 0 100px #03e9f4;
        &:hover{
            
            //background: transparent;
        }
        @media (max-width: 968px) {
        top: 10px;
        left: 10px;
        scale: 0.8;
        }
    }
    
`;

export const VolumeIcon = styled(VolumeUpIcon)`
    &&&{
        color: ${props => props.theme.text};
        scale: 1.5;
        background: transparent;
        @media (max-width: 968px) {
            scale: 1.2;
        }
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

export const DealerResult = styled.div`
    color: ${props => props.theme.MainAccent};
    font-size: 24px;
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
    padding: 5px 10px;
    font-size: 20px;
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
    @media(max-width: 968px){
        font-size: 14px;
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

export const ArrowDownRelative = styled(KeyboardArrowDownIcon)`
    &&&{
        color: ${props => props.theme.text};
        scale: 1.5;
        transform: translateY(10%);
        cursor: pointer;
        &:hover{
            color: gold;
            transition: 0.6 all ease-in-out;
        }
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
        z-index: 5000;
    }
`;

export const ArrowLeftMiddle = styled(KeyboardArrowDownIcon)`
    &&&{
        color: ${props => props.theme.text};
        scale: 2;
        position: absolute;
        top: 50%;
        left: 20px;
        transform: rotate(90deg);
    }
`;

export const ArrowRightMiddle = styled(KeyboardArrowDownIcon)`
    &&&{
        color: ${props => props.theme.text};
        scale: 2;
        position: absolute;
        top: 50%;
        right: 20px;
        transform: rotate(270deg);
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
    initial: { height: 0, opacity: 0 },
    animate: { height: "100vh", opacity: 1, transition: { duration: 0.5 } },
    exit: { height: 0, opacity: 0, transition: { duration: 0.5 } }
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
    border: 1px solid red;
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
    padding: 5px;
`;

export const WholeColumn = styled.div`
    width: 70%;
    height: 80%;
    border: 1px solid ${props => props.theme.MainAccent};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(10px);
    flex-direction: column;
    margin-left: 10px;
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
        margin-right: 5px;
    }
    @media(max-width: 968px){
        font-size: 20px; 
    }
`;

export const BlackJackBigColumn = styled.div`
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
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



