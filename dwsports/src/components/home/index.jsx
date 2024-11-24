import styled from 'styled-components'
import { motion } from 'framer-motion';
import { Button } from '@mui/material';
import back from '../../assets/backs/back9.jpg'
export const HeroSection = styled.div`
    width: 100%;
    min-height: 100vh;
    background: ${props => props.theme.body};
    ${props => props.theme.displayFlexColumn};
    padding: 10px;
    background-image: url(${back});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    overflow: hidden
    img{
        width: 100%;
        display: block;
        object-fit: cover;
    }
    @media(max-width: 498px){
        
    }
`;

export const LowRower = styled.div`
    width: 100%;
    height: 100%;
    ${props => props.theme.displayFlexColumn};
    overflow-y: auto !important;
`;

export const TeamBetsHolderHidden = styled(motion.div)`
    width: 98%;
    background: ${props => props.theme.cardTwo};
    ${props => props.theme.displayFlexColumnCenter}
    border-radius: 10px;
    cursor: pointer;
    position: relative;
    padding: 10px;
    margin: 10px 0;
`;


export const TeamBetsHolder = styled(motion.div)`
    width: 50%;
    border: 3px solid ${props => props.theme.MainAccent};
    background: ${props => props.theme.cardTwo};
    ${props => props.theme.displayFlexColumnCenter}
    
    border-radius: 10px;
    cursor: pointer;
    position: relative;
    padding: 10px;
    margin: 20px 0;
    box-shadow: ${props => props.theme.pacBoxShadow}, inset 0 0 25px ${props => props.theme.text};
    h2{
        color: ${props => props.theme.text};
        font-size: 18px;
        font-weight: bold;
    }
    @media(max-width: 498px){
        width: 90%;
    }
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

export const RowerRowBets = styled.div`
    width: 100%;
    height: 50px;
    ${props => props.theme.displayFlexCenter};
    h2{
        font-size: 18px;
        color: ${props => props.theme.text};
    }
    span{
        font-size: 18px;
        color: ${props => props.theme.MainAccent};
    }
    h3{
        font-size: 14px;
        color: ${props => props.theme.text};
    }
`;

export const LanguagesRow = styled.div`
    width: 100%;
    height: 70px;
    ${props => props.theme.displayFlexCenter};
    justify-content: space-around;
`;

export const LanguageHolder = styled.div`
    width: 25%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
    img{
        width: 50%;
        display: block;
        object-fit: cover;
    }
`;


export const WalletsRow = styled.div`
    width: 200px;
    height: 100%;
    border-radius: 8px;
    border: 1px solid white;
    ${props => props.theme.displayFlexCenter};
    background: rgba(0,0,0,0.2);
    backdrop-filter: blur(10px);
    margin: 15px 0;
    //box-shadow: inset 0 0 25px ${props => props.theme.text};
    img{
        width: 80%;
        display: block;
        object-fit: cover;
        
    }
`;
export const IconsRow = styled.div`
    width: 30%;
    height: 70px;
    border-radius: 8px;
    ${props => props.theme.displayFlexCenter};
    background: ${props => props.theme.body};
    margin: 15px 0;
    box-shadow: inset 0 0 25px ${props => props.theme.text};
    img{
        width: 80%;
        display: block;
        object-fit: cover;
        
    }
`;

export const AvatarRowBets = styled.div`
    width: 100%;
    height: 50px;
    ${props => props.theme.displayFlexCenter};
    h2{
        font-size: 18px;
        color: ${props => props.theme.text};
    }
    span{
        font-size: 18px;
        color: ${props => props.theme.pacColor};
    }
    h3{
        font-size: 14px;
        color: ${props => props.theme.text};
    }
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
    padding: 5px 15px;
    font-size: 16px;
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