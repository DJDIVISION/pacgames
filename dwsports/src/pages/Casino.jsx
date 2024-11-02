import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import blackjack from '../assets/blackjack.png'
import texas from '../assets/texas.jpg'
import roulette from '../assets/roulette.jpg'
import {Link as LinkR} from 'react-router-dom'
import { animationTwo, transition } from '../animations'
import { FantasyState } from '../context/FantasyContext'
import { IconButton } from '@mui/material'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
 
const Casino = () => {

    const {balance, setBalance} = FantasyState();
    console.log(balance)

  return (
    <motion.div initial="out" animate="in" variants={animationTwo} transition={transition}>
    <Section>
        <LinkR to="/"><AbsoluteIconButton><ArrowLeft /></AbsoluteIconButton></LinkR> 
        <TopRow>
            YOUR CASINO BALANCE: <span>{balance} TGZ</span>
        </TopRow>
        <Row>
        <Column><LinkR to="/blackjack"><Icon><img src={blackjack} alt="blackjack" /></Icon></LinkR><Text><h2>BlackJack</h2></Text></Column>
        <Column><LinkR to="/texas"><Icon><img src={texas} alt="texas" /></Icon></LinkR><Text><h2>Texas Hold'em</h2></Text></Column>
        <Column><LinkR to="/roulette"><Icon><img src={roulette} alt="roulette" /></Icon></LinkR><Text><h2>American Roulette</h2></Text></Column>
        {/* <LinkR to="/blackjack"><Column>
                <Icon><img src={blackjack} alt="blackjack" /></Icon>
                <Text>BlackJack</Text>
            </Column></LinkR>
            <LinkR to="/texas"> <Column>
                <Icon><img src={texas} alt="texas" /></Icon>
                <Text>Texas Hold'em</Text>
            </Column></LinkR>
            <LinkR to="/roulette"><Column>
                <Icon><img src={roulette} alt="roulette" /></Icon>
                <Text>American Roulette</Text>
            </Column></LinkR> */}
        </Row>
    </Section>
    </motion.div>
  )
}

export default Casino

const ArrowLeft = styled(ArrowCircleLeftIcon)`
    &&&{
        color: ${props => props.theme.text};
    }
`;

const AbsoluteIconButton = styled(IconButton)`
    &&&{
        position: absolute;
        top: 30px;
        left: 30px;
        padding: 5px;
        background: ${props => props.theme.body};
        scale: 1.5;
        box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4, 0 0 100px #03e9f4;
        @media (max-width: 968px) {
        top: 15px;
        left: 15px;
        scale: 1.2;
        }
    }
`;

const Section = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${props => props.theme.body};
  ${props => props.theme.displayFlexColumn}
  position: relative;
`;

const TopRow = styled.div`
    width: 100vw;
    height: 20vh;
    ${props => props.theme.displayFlexCenter}
    color: ${props => props.theme.text};
    font-size: 32px;
    span{
        color: ${props => props.theme.MainAccent};
        margin: 5px;
    }
    @media(max-width: 698px){
        width: 80%;
        font-size: 24px;
    }
`;

const Row = styled.div`
    width: 100%;
    height: 40vh;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 10vh;
    @media(max-width: 698px){
        flex-direction: column;
        width: 100%;
        justify-content: center;
        height: 90vh;
        margin-top: 0;
    }
`;



const BottomRow = styled.div`
    width: 70%;
    height: 40vh;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 10px 0;
`;

const Column = styled.div`
    width: 33%;
    height: 100%;
    ${props => props.theme.displayFlexColumnCenter};
    @media(max-width: 698px){
        width: 100%;
        height: 33%;
    }
`;

const Icon = styled.div`
    width: 100%;
    height: 80%;
    ${props => props.theme.displayFlexCenter};
    img{
        width: 40%;
        display: block;
        object-fit: cover;
        border-radius: 50%;
    }
`;

const Text = styled.div`
    width: 100%;
    height: 20%;
    ${props => props.theme.displayFlexCenter};
    h2{
        color: ${props => props.theme.text};
        font-size: 36px;
    }
    @media(max-width: 698px){
        h2{
            font-size: 32px;
            transform: translateY(-20px);
        }
    }
`;


