import styled from 'styled-components'
import { motion } from 'framer-motion';
import { Button } from '@mui/material';
import back from '../../assets/backs/back2.jpg'
export const HeroSection = styled.div`
    width: 100%;
    height: auto;
    background: ${props => props.theme.body};
    ${props => props.theme.displayFlexColumn};
    padding: 10px;
    background-image: url(${back});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    img{
        width: 100%;
        display: block;
        object-fit: cover;
    }
`;

export const LowRower = styled.div`
    width: 100%;
    height: 100%;
    ${props => props.theme.displayFlexColumn};
    overflow-y: auto !important;
`;

export const TeamBetsHolder = styled(motion.div)`
    width: 98%;
    border: 3px solid ${props => props.theme.MainAccent};
    background: ${props => props.theme.cardTwo};
    ${props => props.theme.displayFlexColumnCenter}
    
    border-radius: 10px;
    cursor: pointer;
    position: relative;
    padding: 10px;
    margin: 10px 0;
    box-shadow: ${props => props.theme.pacBoxShadow}, inset 0 0 25px ${props => props.theme.text};
    h2{
        color: ${props => props.theme.text};
        font-size: 18px;
        font-weight: bold;
    }
    &:focus, &:focus-visible, *:focus, *:focus-visible {
        outline: none !important;
        box-shadow: none !important;
        background: transparent !important;
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
    img{
        width: 75%;
        display: block;
        object-fit: cover;
    }
`;
export const WalletsRow = styled.div`
    width: 200px;
    height: 70px;
    border-radius: 8px;
    ${props => props.theme.displayFlexCenter};
    background: ${props => props.theme.body};
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