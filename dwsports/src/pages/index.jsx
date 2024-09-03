import styled from 'styled-components'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { motion } from 'framer-motion';
import AnalyticsIcon from '@mui/icons-material/Analytics';


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
        z-index: 9000;
    }
`;

export const ArrowLeft = styled(KeyboardArrowDownIcon)`
    &&&{
        color: ${props => props.theme.text};
        scale: 2;
        position: absolute;
        top: 30px;
        left: 20px;
        z-index: 9000;
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
        z-index: 9000;
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
    height: 150px;
    border: 1px solid ${props => props.theme.text};
    display: flex;
    border-radius: 10px;
    margin-left: auto;
    margin-right: auto;
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
    background-color: ${({ isSelected }) => (isSelected ? 'green' : 'initial')};
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
    justify-content: center;
    font-size: 18px;
`;

export const MatchTeam = styled.div`
    width: 100%;
    height: 20%;
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
        width: 25%;
        display: block;
        object-fit: contain;
    }
`;

export const HomeSection = styled.div`
    width: 100vw;
    height: 200vh;
    background: ${props => props.theme.body};
    display: flex;
    flex-direction: column;
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



