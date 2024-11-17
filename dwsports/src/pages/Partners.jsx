import React from 'react'
import { motion } from 'framer-motion'
import { animationFive,transitionLong } from '../animations'
import styled from 'styled-components'
import back from '../assets/backs/mainBlack.png'
import { AbsoluteIconButtonLeft } from './indexThree'
import { ArrowLeftRelative } from './index'
import { useNavigate } from 'react-router-dom'

const Partners = () => {

    const navigate = useNavigate()

    
  return (
    <motion.div initial="out" animate="in" variants={animationFive} transition={transitionLong}>
        <Section>
        <AbsoluteIconButtonLeft onClick={() => navigate('/')}><ArrowLeftRelative style={{transform: 'translateY(0) rotate(90deg)'}}/></AbsoluteIconButtonLeft>
        </Section>
      
    </motion.div>
  )
}

export default Partners

const Section = styled.div`
    width: 100%;
    height: 150vh;
    background: ${props => props.theme.body};
    
`;
