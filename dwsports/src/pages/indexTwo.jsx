import styled from 'styled-components'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { motion } from 'framer-motion';
import BJBack from '../assets/bjTable.jpg';
import ChatIcon from '@mui/icons-material/Chat';

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