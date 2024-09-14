import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Button,IconButton } from '@mui/material';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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
    height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    perspective: 1200px;
`;

export const UserAvatar = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: orange;
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
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: red;
    position: absolute;
    top: 10%;
    left: 55%;
    transform: translate(-25%, -25%);
    color: ${props => props.theme.body};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
`;

export const EmptyCardLine = styled.div`
    width: 100%;
    height: 50px;
    color: ${props => props.theme.text};
    font-size: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
`;

export const CardHolder = styled.div`
    width: 100%;
    height: 70%;
    font-size: 26px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const SportsCarousel = styled(motion.div)`
  cursor: grab;
  height: 200px;
  width: 180px;
  overflow: hidden;
  display: flex;
  align-items: center;
`;

export const InnerSportsCarousel = styled(motion.div)`
  display: flex;
  align-items: center;
  height: 200px;
  width: 180px;
`;

export const Card = styled(motion.div)`
    min-width: 110px;
    min-height: 160px;
    margin: 0 10px;
    transform: ${({ activePlayer }) => (activePlayer ? "scale(0.9)" : "scale(1)")};
`;
