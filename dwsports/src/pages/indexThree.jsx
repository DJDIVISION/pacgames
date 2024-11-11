import styled from "styled-components";
import { motion } from "framer-motion";
import { IconButton } from "@mui/material";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

export const Section = styled.div`
width: 100vw;
height: 100vh;
position: relative;
${props => props.theme.displayFlexColumn}
background: ${props => props.theme.body};
`;

export const BottomRow = styled.div`
width: 100%;
height: 15vh;
position: absolute;
top: 85vh;
left: 0;
color: ${props => props.theme.text};
${props => props.theme.displayFlexCenter}
justify-content: space-around;
text-align: center;
h2{
    font-size: 24px;
}
@media(max-width: 498px){
    height: 10vh;
    width: 100%;  
    top: 90vh;
}
`;

export const IconHolder = styled.div`
position: relative; /* Ensure the parent div is relative */
width: 10%;
height: 100%;
background: #3f3e3e;
color: ${props => props.theme.text};
${props => props.theme.displayFlexCenter};
padding: 5px;
cursor: pointer;
h2{
    font-size: 12px !important;
    font-weight: bold; 
}

&::before {
    content: '';
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 12px solid #3f3e3e; 
    z-index: 1;
}
@media(max-width: 498px){
    height: 100%;
    width: 24%;  
}
`;

export const Container = styled(motion.div)`
    width: 100%;
    ${props => props.theme.displayFlexCenter}
    height: 70vh;
    @media(max-width: 498px){
        height: 80vh;
    }
`;

export const LeagueRow = styled(motion.div)`
width: 100%;
height: 35vh;
padding: 10px;
${props => props.theme.displayFlexCenter}
justify-content: space-around;
@media(max-width: 498px){
    height: 80vh; 
    flex-direction: column;
    overflow-y: auto;
    
}
`;

export const LeagueRowBets = styled(motion.div)`
width: 100%;
height: 35vh;
padding: 10px;
${props => props.theme.displayFlexCenter}
justify-content: space-around;
@media(max-width: 498px){
    height: 85vh; 
    flex-direction: column;
    overflow-y: auto;
}
`;

export const item = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.7 } },
    exit: { opacity: 0, transition: { duration: 0.7 } }
}

export const LeagueHolder = styled(motion.div)`
width: 18%;
height: 95%;
border: 1px solid ${props => props.theme.card};
background: ${props => props.theme.cardTwo};
border-radius: 5px;
cursor: pointer;
@media(max-width: 498px){
    width: 60%; 
    margin: 5px 0;
}
`;

export const AbsoluteIconButton = styled(IconButton)`
&&&{
    position: absolute;
    top: 20px;
    right: 20px;
    padding: 5px;
    background: ${props => props.theme.body};
    scale: 1.2;
    ${props => props.theme.displayFlexCenter}
    box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4, 0 0 100px #03e9f4;
    z-index: 1000;
    @media (max-width: 968px) {
    top: 15px;
    right: 15px;
    scale: 1.2;
    }
}
`;

export const ArrowDown = styled(ArrowCircleLeftIcon)`
    &&&{
        color: ${props => props.theme.text};
        transform: rotate(90deg)
    }
`;
export const ArrowUp = styled(ArrowCircleLeftIcon)`
    &&&{
        color: ${props => props.theme.text};
        transform: rotate(270deg)
    }
`;

export const Title = styled(motion.div)`
width: 100%;
height: 15vh;
color: ${props => props.theme.text};
${props => props.theme.displayFlexCenter}
justify-content: space-around;
text-align: center;
position: relative;
overflow: hidden;
h2{
    font-size: 18px;
    width: 80%;
}
@media(max-width: 498px){
    height: 10vh;
    h2{
        font-size: 14px;
        width: 70%;
    }
}
`;

export const AbsoluteIconButtonLeft = styled(IconButton)`
&&&{
    position: absolute;
    top: 20px;
    left: 20px;
    padding: 5px;
    background: ${props => props.theme.body};
    scale: 1.2;
    ${props => props.theme.displayFlexCenter}
    box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4, 0 0 100px #03e9f4;
    z-index: 1000;
    @media (max-width: 968px) {
    top: 15px;
    left: 15px;
    scale: 1.2;
    }
}
`;

export const TeamCircularRow = styled.div`
width: 100%;
height: 120%;
padding: 10px;
${props => props.theme.displayFlexCenter}
`;

export const TeamRow = styled(motion.div)`
width: 100%;
padding: 20px;
height: 100%;
display: grid;
place-items: center;
grid-template-columns: repeat(4, 1fr); /* 2 columns */
grid-template-rows: repeat(5, 1fr); /* 10 rows */
gap: 10px;
overflow-y: auto;

@media(max-width: 498px){
    grid-template-columns: repeat(1, 1fr);
}
`;

export const TeamHolder = styled(motion.div)`
width: 90%;
min-height: 100px;
border: 1px solid ${props => props.theme.card};
background: ${props => props.theme.cardTwo};
${props => props.theme.displayFlexCenter}
border-radius: 5px;
cursor: pointer;
position: relative;
padding: 10px;
`;

export const TeamBetsHolder = styled(motion.div)`
width: 98%;
border: 1px solid ${props => props.theme.card};
background: ${props => props.theme.cardTwo};
${props => props.theme.displayFlexColumnCenter}
box-shadow: inset 0 0 25px ${props => props.theme.text};
border-radius: 5px;
cursor: pointer;
position: relative;
padding: 10px;
margin: 10px 0;
`;



export const ArrowsHolder = styled(motion.div)`
width: 98%;
height: 60px;
border: 1px solid ${props => props.theme.card};
background: ${props => props.theme.cardTwo};
${props => props.theme.displayFlexCenter}
box-shadow: inset 0 0 25px ${props => props.theme.text};
border-radius: 5px;
cursor: pointer;
position: relative;
padding: 10px;
margin: 10px 0;
`;

export const ArrowIconHolder = styled.div`
    width: 20%;
    height: 100%;
    ${props => props.theme.displayFlexCenter}
`;
export const RoundNameHolder = styled.div`
    width: 60%;
    height: 100%;
    ${props => props.theme.displayFlexCenter}
    h2{
        font-size: 18px;
        color: ${props => props.theme.text};
        font-weight: bold;
    }
`;