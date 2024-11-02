import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Button,IconButton } from '@mui/material';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

export const ButtonHoverAbsolute = styled(IconButton)`
    &&&{
        position: absolute;
        top: 30px;
        right: 30px;
    }
  &&&:hover{
    box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4, 0 0 100px #03e9f4;
    background: transparent;
  }
`;

export const VolumeIcon = styled(VolumeUpIcon)`
    &&&{
        color: ${props => props.theme.text};
        scale: 1.5;
        background: transparent;
    }
`;

export const GridItem = styled.div`
  height: 50%;
  text-align: center;
  font-size: 14pxem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const JoinButton = styled.div`
    width: 15%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-left: 0.5px solid ${props => props.theme.MainAccent};
`;

export const GameProgressText = styled.div`
    width: 13.5%;
    height: 100%;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    color: ${props => props.theme.text};
    border-left: 0.5px solid ${props => props.theme.MainAccent};
`;

export const GameProgressRound = styled.div`
    width: 4%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text};
    transform: translateX(-10%);
`;

export const GameProgressCircle = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 0.5px solid ${props => props.theme.MainAccent};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.MainAccent};
    font-size: 14px;
    font-weight: bold;
`;

export const PlayersOnline = styled.div`
    width: 30%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: ${props => props.theme.text};
    font-size: 18px;
    border-left: 0.5px solid ${props => props.theme.MainAccent};
`;

export const PlayerHolder = styled.div`
    width: 20%;
    height: 100%;
    display: flex;
    flex-direction: column;
`;

export const PlayerAvatar = styled.div`
    width: 100%;
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const PlayerUser = styled.div`
    width: 100%;
    height: 20%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text};
    font-size: 14px;
    font-weight: bold;
    transform: translateY(-50%);
`;

export const RoomAvailable = styled.div`
    width: 15%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text};
    font-size: 18px;
    border-left: 0.5px solid ${props => props.theme.MainAccent};
    @media(max-width:698px){
        font-size: 14px;
    }
`;

export const RoomNumber = styled.div`
    width: 7.5%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const NumberWrapper = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${props => props.theme.MainAccent};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
`;

export const RoomWrapper = styled(motion.div)`
    width: 95%;
    min-height: 60px !important;
    border: 0.5px solid ${props => props.theme.MainAccent};
    border-radius: 10px;
    display: flex;
    align-items: center;
    margin: 5px 0;
    background: ${props => props.theme.body};
`;

export const Tab = styled.div`
    width: 30%;
    height: 100%;
    border: 1px solid aqua;
    color: ${props => props.theme.text};
    font-size: 18px;
    background: ${({ activeBackground }) => (activeBackground ? "orange" : "transparent")};
    display: flex;
    align-items: center;
    padding: 0 10px;
`;

export const TabWrapper = styled.div`
    width: 100%;
    height: 10%;
    display: flex;
    align-items: center;
    @media(max-width:498px){
        width: 180%;
    }
`;

export const FilterContainer = styled(motion.div)`
    width: 100%;
    height: 90%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgb(95, 91, 83);
    padding: 20px 0;
    border: 1px solid aqua;
    overflow-y: scroll;
    @media(max-width:498px){
        width: 180%;
    }
`;

export const BlackSection = styled.div`
    width: 100vw;
    min-height: 100vh;
    background: ${props => props.theme.body};
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    
`;

export const BlackSectionSmart = styled.div`
    width: 100vw;
    min-height: 100vh;
    background: ${props => props.theme.body};
    ${props => props.theme.displayFlexColumnCenter};
    ${props => props.theme.dosisWhite};
    @media screen and (min-width: 468px){
    display: none;
    }
`;

export const WelcomeTitle = styled.div`
    width: 100%;
    height: 20vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text};
    font-size: 64px;
    @media screen and (max-width: 768px){
        height: 10vh;
        font-size: 34px;
    }
`;

export const Tabs = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
    @media(max-width: 768px){
            height: 90vh;
    }
    @media(max-width: 498px){
        overflow-x: scroll;
        padding: 20px;
    }
`;

export const TabsContainer = styled.div`
    width: 80%;
    height: 90%;
  @media screen and (max-width: 768px){
    width: 90%;
  }
  @media(max-width: 498px){
    width: 180%;
}
`;

export const Disconnect = styled(ExitToAppIcon)`
    &&&{
        color: ${props => props.theme.text};
        scale: 1.5;
        background: transparent;
    }
`;

export const PlayerGridLoading = styled.div`
    width: 100%;
    height: 70vh;
    display: grid;
    place-items: center;
    border: 1px solid white;
    padding: 30px;
    position: relative;
`;

export const LoadingText = styled.div`
    width: 300px;
    height: 10vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props=> props.theme.text};
    font-size: 24px;
    text-align: center;
`;

export const LogOutContainer = styled.div`
    width: 100%;
    height: 10vh;
    display: flex;
    margin-bottom: auto;
    align-items: center;
    justify-content: flex-end;
    padding: 0 30px;
`;

export const LogOutText = styled.div`
    color: ${props=> props.theme.text};
    font-size: 16px; 
    margin: 0 20px;
`;

export const BlackJackCards = styled(motion.div)`
    width: 100%;
    height: 70%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 1px solid red;
    @media(max-width: 498px){
        flex-direction: column;
    }
`;

export const UserAvatar = styled.div`
    
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 2px solid aqua;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const UserChipSum = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: red;
    position: absolute;
    top: 7.5%;
    left: 60%;
    transform: translate(-25%, -25%);
    color: ${props => props.theme.body};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
    @media(max-width: 968px){
        width: 30px;
        height: 30px;
        font-size: 12px;
    }
`;

export const EmptyCardLine = styled.div`
    width: 100%;
    height: 15%;
    color: ${props => props.theme.text};
    font-size: 26px;
    display: flex; 
    align-items: center;
    justify-content: center;
    font-weight: bold;
    @media(max-width: 968px){
        font-size: 14px;
    }
`;

export const CardHolder = styled.div`
    width: 100%;
    height: 55%;
    font-size: 26px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const SportsCarousel = styled(motion.div)`
  cursor: grab;
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  
`;

export const InnerSportsCarousel = styled(motion.div)`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 0;
`;

export const Card = styled.div`
    min-width: 10%;
    height: 80%;
    background: white;
    margin-left: 20px;
    /* @media(max-width: 968px){
        min-width: 42.5%;
        height: 75%;
    } */
`;
