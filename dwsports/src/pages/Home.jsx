import React from 'react'
import {HomeSection} from './index'
import {motion} from 'framer-motion'
import NavBar from '../components/NavBar'
import { animationOne, animationTwo, transition } from '../animations'


const Home = () => {



  return (
    <motion.div initial="out" animate="in" variants={animationTwo} transition={transition}>
    <HomeSection>
      <NavBar />
    </HomeSection>
    </motion.div>
  )
}

export default Home
