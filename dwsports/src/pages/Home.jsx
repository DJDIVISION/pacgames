import React, {useState, useEffect} from 'react'
import {HomeSection,WalletAmount} from './index'
import {motion,AnimatePresence} from 'framer-motion'
import NavBar from '../components/NavBar'
import styled, { useTheme } from 'styled-components'
import { animationFive, transition } from '../animations'
import sportsIcon from '../assets/sportsIcon.png'
import fantasy from '../assets/fantasy.png'
import deposit from '../assets/logos/shoDeposit.png'
import withdraw from '../assets/logos/withdraw.png'
import partners from '../assets/logos/partners.png'
import {Link as LinkR} from 'react-router-dom'
import { useAuth, useFetchMessages } from './functions'
import { Button, IconButton } from '@mui/material'
import { message } from 'antd'
import { FantasyState } from '../context/FantasyContext'
import DepositMenu from '../components/menus/DepositMenu'
import { HeroSection } from '../components/home'
import Hero from '../components/home/Hero'
import back2 from '../assets/backs/back7.jpg'
import WalletMenu from '../components/menus/WalletMenu'
import Footer from '../components/Footer/Footer'
import SmartFooter from '../components/Footer/SmartFooter'
import { Burguer,CloseBurguer, DarkIcon, LightIcon, StaggerAvatarName, StaggerContainer, StaggerImageHolder, StaggerRow } from '../components'
import { AbsoluteHomeLeft } from './indexThree'
import { useTranslation } from 'react-i18next'




const Home = ({toggleTheme}) => {

  const {depositMenu, setDepositMenu} = FantasyState();
  const {walletMenu, setWalletMenu} = FantasyState();
  const [isExpanded, setIsExpanded] = useState(false)
  const [t, i18n] = useTranslation("global");
  const {walletBalance,setWalletBalance} = FantasyState();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    // Toggle body overflow based on isMenuOpen state
    if (isExpanded) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = ''; // Revert to original overflow
    }

    // Cleanup on unmount
    return () => {
        document.body.style.overflow = '';
    };
}, [isExpanded]);

  const isOpen = ()=>{
    setIsExpanded((prev) => !prev);
  }

  return (
    <motion.div initial="out" animate="in" variants={animationFive} transition={transition}>
      <AnimatePresence>
    {isMobile ? (
          <AbsoluteHomeLeft onClick={isOpen}>{isExpanded ? <CloseBurguer /> : <Burguer />}</AbsoluteHomeLeft>
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
    <MenuSection initial={{ height: 0}} // Initial height
    animate={{ height: isExpanded ? '100vh' : 0}} // Height transitions between 100px and 300px
    transition={{ duration: 0.5 }}>
          {isExpanded ? (
            <StaggerContainer initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.3 },
              },
            }}>
            <LinkR to="/bets"><StaggerRow initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }} onClick={() => setToHide(false)}>
              <StaggerImageHolder><img src={sportsIcon} alt="sports" /></StaggerImageHolder>
              <StaggerAvatarName>{t("navbar.sports")}</StaggerAvatarName>
            </StaggerRow></LinkR>
            <LinkR to="/fantasy"><StaggerRow initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }} onClick={() => setToHide(false)}>
              <StaggerImageHolder><img src={fantasy} alt="fantasy" /></StaggerImageHolder>
              <StaggerAvatarName>{t("navbar.fantasy")}</StaggerAvatarName>
            </StaggerRow></LinkR>
            <LinkR to="/partners"><StaggerRow initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }} onClick={() => setToHide(false)}>
              <StaggerImageHolder><img src={partners} alt="fantasy" /></StaggerImageHolder>
              <StaggerAvatarName>OUR PARTNERS</StaggerAvatarName>
            </StaggerRow></LinkR>
            {/* <LinkR to="/casino"><StaggerRow initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: -60 }}
                              transition={{ delay: 1.1 }} >
                              <StaggerImageHolder><img src={chip} alt="casino" /></StaggerImageHolder>
                              <StaggerAvatarName>CASINO</StaggerAvatarName>
                          </StaggerRow></LinkR> */}
            <StaggerRow initial={{ opacity: 0, y: 40 }} onClick={() => { isOpen(); setDepositMenu(true); setToHide(true) }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }} >
              <StaggerImageHolder><img src={deposit} alt="wallet" /></StaggerImageHolder>
              <StaggerAvatarName>{t("navbar.deposit")}</StaggerAvatarName>
            </StaggerRow>
            <StaggerRow initial={{ opacity: 0, y: 40 }} onClick={() => { isOpen(); setWalletMenu(true); setToHide(true) }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }} >
              <StaggerImageHolder><img src={withdraw} alt="wallet" /></StaggerImageHolder>
              <StaggerAvatarName>{t("navbar.withdraw")}</StaggerAvatarName>
            </StaggerRow>
            <StaggerRow initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}>
              <StaggerImageHolder>
                {theme.body === '#202020' ? <LightIcon onClick={toggleTheme} /> : <DarkIcon onClick={toggleTheme} />}
              </StaggerImageHolder>
              <StaggerAvatarName>{t("navbar.switch")}</StaggerAvatarName>
            </StaggerRow>
          </StaggerContainer>  
          ) : (
            <></>
          )}
    </MenuSection> 
    <Hero />
    {isMobile ? (
          <SmartFooter key="smartfooter"/>
        ) : (
          <Footer key="footer"/>
        )}
        </AnimatePresence>
    </motion.div>
  )
}

export default Home

const MenuSection = styled(motion.div)`
  width: 100%;
  background-image: url(${back2});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;
