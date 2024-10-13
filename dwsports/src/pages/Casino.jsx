import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import blackjack from '../assets/blackjack.png'
import texas from '../assets/texas.jpg'
import roulette from '../assets/roulette.jpg'
import {ArrowLeftMiddle} from './index'
import {Link as LinkR} from 'react-router-dom'
import { animationTwo, transition } from '../animations'
 
const Casino = () => {
  return (
    <motion.div initial="out" animate="in" variants={animationTwo} transition={transition}>
    <Section>
        <TopRow>
            <LinkR to="/"><ArrowLeftMiddle /></LinkR>
        </TopRow>
        <Row>
        <LinkR to="/blackjack"><Column>
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
            </Column></LinkR>
        </Row>
        <BottomRow>
            <Column></Column>
            <Column></Column>
        </BottomRow>
    </Section>
    </motion.div>
  )
}

export default Casino

const Section = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${props => props.theme.body};
  ${props => props.theme.displayFlexColumnCenter}
`;

const TopRow = styled.div`
    width: 100vw;
    height: 10vh;
    display: flex;
    position: relative;
`;

const Row = styled.div`
    width: 100%;
    height: 40vh;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 10px 0;
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
    width: 20vw;
    height: 100%;
    ${props => props.theme.displayFlexColumnCenter};
`;

const Icon = styled.div`
    width: 100%;
    height: 80%;
    ${props => props.theme.displayFlexCenter};
    img{
        width: 75%;
        display: block;
        object-fit: cover;
        border-radius: 50%;
    }
`;

const Text = styled.div`
    width: 100%;
    height: 20%;
    ${props => props.theme.displayFlexCenter};
    color: ${props => props.theme.text};
    font-size: 36px;
`;


