import styled from "styled-components";
import { motion } from "framer-motion";
import { IconButton } from "@mui/material";
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import field from '../assets/lineups/vertField.png' 

export const BuyPlayerName = styled.div`
width: 100%;
height: 20%;
${props => props.theme.displayFlexCenter}
h2{
    color: ${props => props.theme.text};
    font-size: 24px;
    font-weight: bold; 
}
span{
    color: ${props => props.theme.pacColor};
    font-size: 24px;
    font-weight: bold;  
}
`;

export const BuyPlayerAvatar = styled.div`
    width: 100%;
    height: 60%;
    ${props => props.theme.displayFlexCenter}
`;

export const BuyPlayerHolder = styled.div`
width: 100%;
height: 30%;
${props => props.theme.displayFlexColumn}
margin: 20px 0;
`;

export const BigTeamName = styled.div`
width: 70%;
height: 15%;
text-align: center;
${props => props.theme.displayFlexCenter}
padding: 10px;
text-align: center;
position: relative;
h2{
    color: ${props => props.theme.text};
    font-size: 20px;
    font-weight: bold;
}
`;

export const MyTeamRow = styled(motion.div)`
width: 100%;
height: 85%;
position: relative;
${props => props.theme.displayFlexCenter}
padding: 0px;
text-align: center;
h2{
    color: ${props => props.theme.MainAccent};
    font-size: 20px;
    font-weight: bold; 
}
`;

export const PlayerDroppingArea = styled.div`
width: 50px;
height: 50px;
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

${props => props.theme.displayFlexCenter};
padding: 5px;
cursor: pointer;
a{
    text-decoration: none;
}
h2{
    font-size: 12px !important;
    font-weight: bold; 
    color: ${props => props.theme.text};
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

export const MyPlayerContainer = styled.div`
width: 60%;
height: 87.5%;
padding: 10px;
${props => props.theme.displayFlexColumn};
overflow-y: auto;
@media(max-width: 968px){
    grid-template-columns: repeat(2, 1fr);
    height: 85%;
}
@media(max-width: 498px){
    grid-template-columns: repeat(1, 1fr);
    width: 100%;
}
`;

export const MyPlayerRow = styled.div`
width: 100%;
height: auto;
display: grid;
grid-template-columns: repeat(4, 1fr);
`;

export const MyPlayer = styled.div`
    width: 100px;
    height: 100px;
    ${props => props.theme.displayFlexColumn}
`;

export const AbsoluteDivLeft = styled.div`
    width: 130px;
    height: 50px;
    position: absolute;
    border-radius: 10px;
    border: 1px solid ${props => props.theme.text};
    background: ${props => props.theme.body};
    backdrop-filter: blur(10px);
    top: 10px;
    left: 20px;
    z-index: 50;
    text-align: center;
    ${props => props.theme.displayFlexCenter};
    h3{
        color: white;
        font-size: 14px;
        font-weight: bold;
    }
`;

export const AbsoluteDivRight = styled.div`
width: 130px;
height: 50px;
position: absolute;
top: 10px;
right: 10px;
border-radius: 10px;
border: 1px solid ${props => props.theme.text};
background: ${props => props.theme.body};
backdrop-filter: blur(10px);
z-index: 50;
${props => props.theme.displayFlexCenter};
h3{
    color: ${props => props.theme.text};
    font-size: 14px;
    font-weight: bold;
}
`;

export const FieldWrapper = styled.div`
width: 80%;
height: 420px;
position: relative;
background-image: url(${field});
background-position: center;
background-size: cover;
background-repeat: no-repeat;
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

export const MyPlayersRow = styled(motion.div)`
width: 100%;
height: 15%;
overflow: hidden;
display: flex;
align-items: center;
text-align: center;
margin-top: 30px;
padding: 5px;
h2{
    color: ${props => props.theme.MainAccent};
    font-size: 20px;
    font-weight: bold; 
}
`;

export const MyPlayersInnerRow = styled(motion.div)`
width: auto;
height: 100%;
${props => props.theme.displayFlex}


h2{
    color: ${props => props.theme.MainAccent};
    font-size: 20px;
    font-weight: bold; 
}
`;

export const MyTeamPlayerHolder = styled.div`
    width: 60px;
    height: 100%;
    margin: 0 10px;
    ${props => props.theme.displayFlexColumn}
`;

export const MyTeamAvatar = styled.div`
    width: 100%;
    height: 70%;
    ${props => props.theme.displayFlexCenter}
    position: relative;
`;

export const MyTeamName = styled.div`
    width: 100%;
    height: 30%;
    ${props => props.theme.displayFlexCenter}
    h2{
        color: ${props => props.theme.text};
        font-size: 12px;
        font-weight: bold;  
        transform: translateY(-3px);
    }
`;

export const PlayerTeamRating = styled.div`
width: 30px;
height: 30px;
border-radius: 50%;
${props => props.theme.displayFlexCenter};
z-index: 1000;
position: absolute; 
bottom: 0;
right: 0;
font-size: 14px;
font-weight: bold;
@media(max-width: 968px){
    font-size: 14px; 
    width: 30px;
    height: 30px;
}
@media(max-width: 490px){
    font-size: 12px; 
    width: 25px;
    height: 25px;
    bottom: -5px;
    right: -5px;
}
`;

export const MyPlayerAvatar = styled.div`
    width: 100%;
    height: 70%;
    ${props => props.theme.displayFlexCenter}
    position: relative;
`;

export const MyPlayerName = styled.div`
width: 100%;
height: 20%;
${props => props.theme.displayFlexCenter}
text-align: center;
h2{
    color: ${props => props.theme.text};
    font-size: 12px;
    font-weight: bold; 
    transform: translateY(-5px);
}
`;

export const SellPlayerRow = styled.div`
width: 70%;
height: 15%;
${props => props.theme.displayFlexCenter}
padding: 10px;
text-align: center;
h2{
    color: ${props => props.theme.MainAccent};
    font-size: 16px;
    font-weight: bold; 
}
`;

export const PlayerTeamLogoValue = styled.div`
    h2{
        color: gold;
        font-size: 14px;
    }
    position: absolute;
    top: 0px;
    right: 5px;
    z-index: 10;
    @media(max-width: 490px){
        width: 25px;
        height: 25px;
        top: -5px;
        right: 10px;
    }
`;

export const PlayerTeamLogoShort = styled.div`
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
    top: 5px;
    left: 5px;
}
`;

export const PlayerTeamRatingShort = styled.div`
width: 30px;
height: 30px;
border-radius: 50%;
${props => props.theme.displayFlexCenter};
z-index: 1000;
position: absolute; 
bottom: 0;
right: 0;
font-size: 14px;
font-weight: bold;
@media(max-width: 968px){
    font-size: 14px; 
    width: 30px;
    height: 30px;
}
@media(max-width: 490px){
    font-size: 12px; 
    width: 25px;
    height: 25px;
    bottom: 5px;
    right: 5px;
}
`;

export const MyPlayerPosition = styled.div`
    width: 100%;
    height: 40px;
    ${props => props.theme.displayFlex}
    padding: 20px;
    h2{
        color: ${props => props.theme.MainAccent};
        font-size: 16px;
        font-weight: bold; 
    }
`;

export const MyBalanceRow = styled.div`
width: 100%;
height: 5%;
${props => props.theme.displayFlexCenter}
padding: 20px;
text-align: center;
h2{
    color: ${props => props.theme.MainAccent};
    font-size: 20px;
    font-weight: bold; 
}
span{
    margin: 0 5px;
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
    height: 100%; 
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
text-align: center;
h2{
    color: white;
    font-size: 18px;
}
@media(max-width: 498px){
    height: 85vh; 
    flex-direction: column;
    overflow-y: auto !important;
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
user-select: none;
border: 1px solid ${props => props.theme.card};
background: ${props => props.theme.cardTwo};
border-radius: 5px;
cursor: pointer;
position: relative;
@media(max-width: 498px){
    width: 60%; 
    margin: 5px 0;
}
`;

export const  AbsoluteChart = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    right: 0%;
    transform: translate(-50%,-50%);
    background: ${props => props.theme.cardTwo};
    border: 1px solid ${props => props.theme.card};
    padding: 3px;
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

export const AddIcon = styled(AddCircleOutlineIcon)`
    &&&{
        color: ${props => props.theme.text};
        transform: scale(1.4);
        margin: 0 10px;
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

${props => props.theme.displayFlexCenter}
justify-content: space-around;
text-align: center;
position: relative;
overflow: hidden;
h2{
    font-size: 18px;
    width: 80%;
    color: ${props => props.theme.text};
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
export const AbsoluteHomeLeft = styled(IconButton)`
&&&{
    position: absolute;
    top: 25px;
    left: 25px;
    padding: 5px;
    scale: 1.2;
    ${props => props.theme.displayFlexCenter}
    box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4, 0 0 100px #03e9f4;
    z-index: 1000;
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
text-align: center;
h3{
    width: 60%;
    color: ${props => props.theme.text};
    font-size: 18px;
    font-weight: bold;
}
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

export const LiveBetIcon = styled.div`
    position: absolute;
    border: 1px solid ${props => props.theme.card};
    top: 0px;
    right: 0px;
    width: 40px;
    height: 40px;
    background: ${props => props.theme.body};
    border-radius: 50%;
    transform: translate(25%,-25%);
    color: ${props => props.theme.MainAccent};
    ${props => props.theme.displayFlexCenter};
    font-size: 14px;
    font-weight: bold;
    box-shadow: inset 0 0 25px ${props => props.theme.text};
    text-shadow: ${props => props.theme.textShadowTwo};
`;

export const TeamBetsHolder = styled(motion.div)`
width: 98%;
border: 2px solid ${props => props.theme.card};
background: ${props => props.theme.cardTwo};
${props => props.theme.displayFlexColumnCenter}
box-shadow: inset 0 0 25px ${props => props.theme.text};
border-radius: 10px;
cursor: pointer;
position: relative;
padding: 10px;
margin: 10px 0;
h2{
    color: ${props => props.theme.text};
    font-size: 18px;
    font-weight: bold;
}
`;

export const TeamBetsHolderBlur = styled(motion.div)`
width: 98%;
border: 2px solid ${props => props.theme.card};
background: rgba(0,0,0,0.7);
backdrop-filter: blur(5px);
${props => props.theme.displayFlexColumnCenter}
box-shadow: inset 0 0 25px ${props => props.theme.text};
border-radius: 10px;
cursor: pointer;
position: relative;
padding: 10px;
margin: 10px 0;
h2{
    color: ${props => props.theme.text};
    font-size: 18px;
    font-weight: bold;
}
`;



export const CurrentBetHolder = styled(motion.div)`
width: 98%;
height: 100px;
border: 1px solid ${props => props.theme.card};
background: ${props => props.theme.cardTwo};
${props => props.theme.displayFlexCenter}
box-shadow: ${(props) => props.boxShadow};
border-radius: 5px;
cursor: pointer;
position: relative;
padding: 10px;
margin: 5px 0;
`
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

export const CurrentBetLogoHolder = styled.div`
    width: 15%;
    height: 100%;
    ${props => props.theme.displayFlexCenter}
    img{
        width: 75%;
    }
    h2{
        font-size: 14px;
        color: ${props => props.theme.text};
        font-weight: bold;
    }
`;
export const CurrentBetNameHolder = styled.div`
    width: 80%;
    height: 100%;
    ${props => props.theme.displayFlexColumn}
`;
export const CurrentBetRow = styled.div`
    width: 100%;
    height: 50%;
    ${props => props.theme.displayFlexCenter}
    h2{
        font-size: 14px;
        color: ${props => props.theme.text};
        font-weight: bold;
    }
`;