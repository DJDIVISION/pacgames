import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { animationFive, transition } from '../animations'

const Texas = () => {
  return (
    <motion.div initial="out" animate="in" variants={animationFive} transition={transition}>
    <Section>
      texas
    </Section>
    </motion.div>
  )
}

export default Texas

const Section = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${props => props.theme.body};
  ${props => props.theme.displayFlexColumnCenter}
`;
