import React, {useState, useEffect} from 'react'
import {HomeSection,WalletAmount} from './index'
import {motion} from 'framer-motion'
import NavBar from '../components/NavBar'
import { animationOne, animationTwo, transition } from '../animations'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { BetState } from '../context/BetsContext'
import { useAuth, useFetchMessages } from './functions'
import { Button } from '@mui/material'
import { message } from 'antd'
import { FantasyState } from '../context/FantasyContext'
import DepositMenu from '../components/menus/DepositMenu'
import { HeroSection } from '../components/home'
import Hero from '../components/home/Hero'
import SmartNavBar from '../components/SmartNavBar'
import WalletMenu from '../components/menus/WalletMenu'
import Footer from '../components/Footer/Footer'
import SmartFooter from '../components/Footer/SmartFooter'




const Home = ({toggleTheme}) => {

  const {depositMenu, setDepositMenu} = FantasyState();
  const {walletMenu, setWalletMenu} = FantasyState();
  const {walletBalance,setWalletBalance} = FantasyState();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  


  

  return (
    <motion.div initial="out" animate="in" variants={animationOne} transition={transition}>
    {isMobile ? (
          <SmartNavBar key="smartnavbar"
            toggleTheme={toggleTheme} 
          />
        ) : (
          <NavBar key="navbar"
            toggleTheme={toggleTheme}
          />
        )}
      {depositMenu && (
        <DepositMenu depositMenu={depositMenu} setDepositMenu={setDepositMenu} key="depositmenu"/>
      )}
      {walletMenu && (
        <WalletMenu depositMenu={depositMenu} setDepositMenu={setDepositMenu} key="walletMenu"/>
      )}
      
    <Hero />
    {isMobile ? (
          <SmartFooter key="smartfooter"/>
        ) : (
          <Footer key="footer"/>
        )}
    </motion.div>
  )
}

export default Home
