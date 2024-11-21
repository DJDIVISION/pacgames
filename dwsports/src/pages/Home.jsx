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
import googleDark from '../assets/logos/googleDark.png'
import googleLight from '../assets/logos/googleLight.png'
import {Link as LinkR} from 'react-router-dom'
import { useAuth, useFetchMessages } from './functions'
import { Button, IconButton } from '@mui/material'
import { message } from 'antd'
import { FantasyState } from '../context/FantasyContext'
import DepositMenu from '../components/menus/DepositMenu'
import { HeroSection, WalletsRow } from '../components/home'
import Hero from '../components/home/Hero'
import back2 from '../assets/backs/back7.jpg'
import back1 from '../assets/backs/back8.jpg'
import back3 from '../assets/backs/back10.png'
import back4 from '../assets/backs/back9.png'
import WalletMenu from '../components/menus/WalletMenu'
import Footer from '../components/Footer/Footer'
import SmartFooter from '../components/Footer/SmartFooter'
import { Burguer,CloseBurguer, DarkIcon, LightIcon, RowerRowBetsCenter, StaggerAvatarName, StaggerContainer, StaggerImageHolder, StaggerRow } from '../components'
import { AbsoluteHomeLeft } from './indexThree'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase/client'




const Home = ({toggleTheme}) => {

  const {depositMenu, setDepositMenu} = FantasyState();
  const {walletMenu, setWalletMenu} = FantasyState();
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDepositExpanded, setIsDepositExpanded] = useState(false)
  const [isWithdrawExpanded, setIsWithdrawExpanded] = useState(false)
  const [t, i18n] = useTranslation("global");
  const {walletBalance,setWalletBalance} = FantasyState();
  const {session, setSession} = FantasyState();
  const {user, setUser} = FantasyState();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    if(session === null){
      setIsExpanded(true)
    }
  }, [session])
  useEffect(() => {
    // Function to check if a session exists
    const checkSession = async () => {
      // Get session from Supabase auth
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setSession(session)
        setUser(session.user); // Set the user state if session exists
        
      } else {
        setUser(null); // Clear the user state if no session
        setSession(null)
      }
    };

    // Call the session checking function
    checkSession();

    // Set up an auth state listener to detect login/logout events
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user); // Set user when signed in
      } else if (event === 'SIGNED_OUT') {
        setUser(null); // Clear user on sign out
      }
    });

    // Cleanup the listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);
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
    if (isExpanded || isDepositExpanded || isWithdrawExpanded) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = ''; // Revert to original overflow
    }

    // Cleanup on unmount
    return () => {
        document.body.style.overflow = '';
    };
}, [isExpanded,isDepositExpanded,isWithdrawExpanded]);

  const isOpen = ()=>{
    setIsExpanded((prev) => !prev);
  }

  const handleGoogleSignIn = async () => {
        
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })

    if (error) {
      console.error('Error with Google sign-in:', error.message)
    } 
    if(data){
        console.error('Google sign-in successful:', data) 
    }
}

  return (
    <motion.div initial="out" animate="in" variants={animationFive} transition={transition}>
      <AnimatePresence>
        {session ? (
          <>
            {isMobile ? (
          <>
            {(isDepositExpanded || isWithdrawExpanded) ? (
              <></>
            ) : (
              <AbsoluteHomeLeft onClick={isOpen}>{isExpanded ? <CloseBurguer /> : <Burguer />}</AbsoluteHomeLeft>
            )}
          </>
        ) : (
          <NavBar key="navbar"
            toggleTheme={toggleTheme}
          />
        )}
            <MenuSection initial={{ height: 0 }} // Initial height
              animate={{ height: isExpanded ? '100vh' : 0 }} // Height transitions between 100px and 300px
              transition={{ type: "spring", stiffness: 300, damping: 40, duration: 1 }}>
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
                    transition={{ delay: 0.7 }}>
                    <StaggerImageHolder><img src={sportsIcon} alt="sports" /></StaggerImageHolder>
                    <StaggerAvatarName>{t("navbar.sports")}</StaggerAvatarName>
                  </StaggerRow></LinkR>
                  <LinkR to="/fantasy"><StaggerRow initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }} >
                    <StaggerImageHolder><img src={fantasy} alt="fantasy" /></StaggerImageHolder>
                    <StaggerAvatarName>{t("navbar.fantasy")}</StaggerAvatarName>
                  </StaggerRow></LinkR>
                  <LinkR to="/partners"><StaggerRow initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }} >
                    <StaggerImageHolder><img src={partners} alt="fantasy" /></StaggerImageHolder>
                    <StaggerAvatarName>OUR PARTNERS</StaggerAvatarName>
                  </StaggerRow></LinkR>
                  <StaggerRow initial={{ opacity: 0, y: 40 }} onClick={() => {setIsDepositExpanded(true);setIsExpanded(false); }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }} >
                    <StaggerImageHolder><img src={deposit} alt="wallet" /></StaggerImageHolder>
                    <StaggerAvatarName>{t("navbar.deposit")}</StaggerAvatarName>
                  </StaggerRow>
                  <StaggerRow initial={{ opacity: 0, y: 40 }} onClick={() => { setIsWithdrawExpanded(true); setIsExpanded(false); }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }} >
                    <StaggerImageHolder><img src={withdraw} alt="wallet" /></StaggerImageHolder>
                    <StaggerAvatarName>{t("navbar.withdraw")}</StaggerAvatarName>
                  </StaggerRow>
                </StaggerContainer>
              ) : (
                <></>
              )}
            </MenuSection> 
            <DepositSection initial={{ height: 0 }} // Initial height
              animate={{ height: isDepositExpanded ? '100vh' : 0 }} // Height transitions between 100px and 300px
              transition={{ type: "spring", stiffness: 300, damping: 40,duration: 0.5 }}>
              {isDepositExpanded ? (
                <StaggerContainer initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.3 },
                    },
                  }}>
                  <DepositMenu isDepositExpanded={isDepositExpanded} setIsDepositExpanded={setIsDepositExpanded} key="depositmenu"/>
                </StaggerContainer>
              ) : (
                <></>
              )}
            </DepositSection> 
            <WithdrawSection initial={{ height: 0 }} // Initial height
              animate={{ height: isWithdrawExpanded ? '100vh' : 0 }} // Height transitions between 100px and 300px
              transition={{ type: "spring", stiffness: 300, damping: 40,duration: 0.5 }}>
              {isWithdrawExpanded ? (
                <StaggerContainer initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.3 },
                    },
                  }}>
                  <WalletMenu isWithdrawExpanded={isWithdrawExpanded} setIsWithdrawExpanded={setIsWithdrawExpanded} key="depositmenu"/>
                </StaggerContainer>
              ) : (
                <></>
              )}
            </WithdrawSection> 
         <Hero />
         
        {isMobile ? (
              <SmartFooter key="smartfooter"/>
            ) : (
              <Footer key="footer"/>
            )}
          </>
        ) : (
      <StaticSection>
              <RowerRowBetsCenter style={{ height: '70px', margin: 'auto' }} onClick={() => handleGoogleSignIn()}><WalletsRow>
                {theme.body === '#202020' ? <img src={googleDark} alt="googleDark" /> : <img src={googleLight} alt="googleLight" />}
              </WalletsRow></RowerRowBetsCenter>
      </StaticSection>
        )}
        </AnimatePresence>
    </motion.div>
  )
}

export default Home

const MenuSection = styled(motion.div)`
  width: 100%;
  height: 100%;
  background-image: url(${back2});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
`;
const DepositSection = styled(motion.div)`
  width: 100%;
  height: 100%;
  background-image: url(${back3});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
`;
const WithdrawSection = styled(motion.div)`
  width: 100%;
  height: 100%;
  background-image: url(${back4});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
`;
const StaticSection = styled.div`
  width: 100vw;
  height: 100vh;
  background-image: url(${back1});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  ${props => props.theme.displayFlexCenter};
  @media(max-width: 498px){
    background-image: url(${back2});
  }
`;
