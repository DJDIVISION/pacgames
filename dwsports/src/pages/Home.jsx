import React, {useState, useEffect} from 'react'
import {HomeSection,StyledButton,WalletAmount} from './index'
import {motion,AnimatePresence} from 'framer-motion'
import NavBar from '../components/NavBar'
import styled, { useTheme } from 'styled-components'
import { animationFive, transition } from '../animations'
import sportsIcon from '../assets/sportsIcon.png'
import fantasy from '../assets/fantasy.png'
import candle from '../assets/logos/candle.png'
import deposit from '../assets/logos/shoDeposit.png'
import withdraw from '../assets/logos/withdraw.png'
import partners from '../assets/logos/partners.png'
import googleDark from '../assets/logos/googleDark.png'
import googleLight from '../assets/logos/googleLight.png'
import {Link as LinkR, useNavigate} from 'react-router-dom'
import { useAuth, useFetchMessages } from './functions'
import { Avatar, Button, IconButton } from '@mui/material'
import { message } from 'antd'
import { FantasyState } from '../context/FantasyContext'
import DepositMenu from '../components/menus/DepositMenu'
import { WalletsRow } from '../components/home'
import Hero from '../components/home/Hero'
import back2 from '../assets/backs/back7.jpg'
import back1 from '../assets/backs/back8.jpg'
import back3 from '../assets/backs/back12.jpg'
import back4 from '../assets/backs/back9.png'
import WalletMenu from '../components/menus/WalletMenu'
import Footer from '../components/Footer/Footer'
import SmartFooter from '../components/Footer/SmartFooter'
import { Burguer,CloseBurguer, DarkIcon, FormWrapper, ImageClicker, LightIcon, RowerInput, RowerRowBetsCenter, RowerSmallCenter, StaggerAvatarName, StaggerContainer, StaggerImageHolder, StaggerRow } from '../components'
import { AbsoluteHomeLeft } from './indexThree'
import { useTranslation } from 'react-i18next'
import { supabase } from '../supabase/client'
import axios from 'axios'
import TelegramLogin from '../components/home/TelegramLogin'
import back10 from '../assets/backs/betsBack.jpg'
import back20 from '../assets/backs/fantasyBack.jpg'
import back30 from '../assets/backs/fantasyText.jpg'
import back40 from '../assets/backs/betsText.jpg'




const Home = ({toggleTheme}) => {

  const {depositMenu, setDepositMenu} = FantasyState();
  const {walletMenu, setWalletMenu} = FantasyState();
  const [isExpanded, setIsExpanded] = useState(false)
  const [isDepositExpanded, setIsDepositExpanded] = useState(false)
  const [isWithdrawExpanded, setIsWithdrawExpanded] = useState(false)
  const [t, i18n] = useTranslation("global");
  const {walletBalance,setWalletBalance} = FantasyState();
  const {session, setSession} = FantasyState();
  const {currentUser, setCurrentUser} = FantasyState();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const {admin, isAdmin} = FantasyState();
  const [login, setLogin] = useState(true)
  const [register, setRegister] = useState(false)
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [profileImage, setProfileImage] = useState(null)
  const images = [back1, back2];
  const navigate = useNavigate();
  
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
        setCurrentUser(session.user);
        if(session.user.email === "bodegaflamenca666@gmail.com"){
          isAdmin(true)
        }
        
      } else {
        setCurrentUser(null); // Clear the user state if no session
        setSession(null)
      }
    };

    // Call the session checking function
    checkSession();

    // Set up an auth state listener to detect login/logout events
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setCurrentUser(session.user); // Set user when signed in
      } else if (event === 'SIGNED_OUT') {
        setCurrentUser(null); // Clear user on sign out
        setSession(null)
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
    });
  
    if (error) {
      console.error('Error with Google sign-in:', error.message);
      return;
    }
  
    if (data) {
      // Access the session and user
      const { session, user } = data;
  
      if (user) {
        console.log('Authenticated user:', user); // Contains user details like id, email, etc.
        setCurrentUser(user)
        console.log(user)
      }
  
      if (session) {
        console.log('Session information:', session); // Contains access token and other session details
      }
  
      console.log('Google sign-in successful:', data); 
    }
  };

  const handleSendMessage = async () => {
    const message = ""

    try {
      
      const response = await axios.post('http://localhost:8080/send-message', { message });
      
      if (response.data.success) {
        console.log('Message sent successfully!');
      } else {
        console.log('Failed to send message');
      }
    } catch (error) {
      console.log('Error sending message');
    }
  };

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
            toggleTheme={toggleTheme} isDepositExpanded={isDepositExpanded} setIsDepositExpanded={setIsDepositExpanded} isWithdrawExpanded={isWithdrawExpanded} setIsWithdrawExpanded={setIsDepositExpanded}
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
                  <LinkR to="/crypto-prediction"><StaggerRow initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }} >
                    <StaggerImageHolder><img src={candle} alt="fantasy" style={{width: '50%'}}/></StaggerImageHolder>
                    <StaggerAvatarName>PredicTON</StaggerAvatarName>
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
                  <StaggerRow initial={{ opacity: 0, y: 40 }} onClick={() => {navigate('/newroulette') /* setIsWithdrawExpanded(true); setIsExpanded(false); */ }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }} >
                    <StaggerImageHolder><img src={withdraw} alt="wallet" /></StaggerImageHolder>
                    <StaggerAvatarName>{t("navbar.withdraw")}</StaggerAvatarName>
                  </StaggerRow>
                  {admin && <LinkR to="/admin"><StaggerRow initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }} >
                    <Avatar alt="Image" src={currentUser && currentUser?.user_metadata?.avatar_url} sx={{margin: 'auto', width: 50, height: 50 }} /> 
                    <StaggerAvatarName>ADMIN</StaggerAvatarName>
                  </StaggerRow></LinkR>}
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
              <>
              {isDepositExpanded && (
                <DepositMenu isDepositExpanded={isDepositExpanded} setIsDepositExpanded={setIsDepositExpanded}/>
              )}
              {isWithdrawExpanded && (
                <WalletMenu isWithdrawExpanded={isWithdrawExpanded} setIsWithdrawExpanded={setIsWithdrawExpanded}/>
              )}
              <Footer key="footer"/>
              </>
            )}
          </>
        ) : (
      <StaticSection>
            <Container>
              <ImageHolder>

              </ImageHolder>
              <RowerRowImage></RowerRowImage>
              <RowerRowBetsCenter></RowerRowBetsCenter>
              <RowerRowBetsCenter onClick={() => handleGoogleSignIn()}><WalletsRow>
                {theme.body === '#202020' ? <img src={googleDark} alt="googleDark" /> : <img src={googleLight} alt="googleLight" />}
              </WalletsRow></RowerRowBetsCenter>
              <RowerRowBetsCenter >
              </RowerRowBetsCenter>
             {/*  <RowerRowBetsCenter>{login ? <h2>EMAIL LOG IN</h2> : <h2>REGISTER</h2>}</RowerRowBetsCenter>
              {login ? (
                <>
                <FormWrapper>
              
                <RowerSmallCenter><h3>Email</h3></RowerSmallCenter>
                <RowerInput type="email" required placeholder="Enter your email" />
                <RowerSmallCenter><h3>Password</h3></RowerSmallCenter>
                <RowerInput type="password" required placeholder="Enter your password" />
                <RowerSmallCenter style={{height: '20px'}}></RowerSmallCenter>
                <RowerSmallCenter><StyledButton style={{fontSize: '16px', padding: '5px 15px'}}>LOG IN</StyledButton></RowerSmallCenter>
                </FormWrapper>
                <RowerSmallCenter onClick={() => setLogin(false)} style={{transform: 'translateY(10px)'}}><h3>REGISTER HERE</h3></RowerSmallCenter>
                </>
              ) : (
                <>
                <FormWrapper style={{minHeight: '60vh'}}>
                <RowerSmallCenter><h3>Avatar</h3></RowerSmallCenter>
              <RowerSmallCenter style={{height: '50px'}}>
                <ImageClicker>
                    {profileImage ? (
                      <h3>IMAGE</h3>
                    ) : (
                      <h3>CLICK TO ADD</h3>
                    )}
                </ImageClicker>
              </RowerSmallCenter>
              <RowerSmallCenter><h3>Email</h3></RowerSmallCenter>
              <RowerInput type="email" required placeholder="Enter your email" />
              
              
              <RowerSmallCenter><h3>Password</h3></RowerSmallCenter>
              <RowerInput type="password" required placeholder="Enter your password" />
              <RowerSmallCenter style={{height: '20px'}}></RowerSmallCenter>
              <RowerSmallCenter><StyledButton style={{fontSize: '16px', padding: '5px 15px'}}>REGISTER</StyledButton></RowerSmallCenter>
              
              </FormWrapper>
              <RowerSmallCenter onClick={() => setLogin(true)} style={{transform: 'translateY(10px)'}}><h3>LOG IN HERE</h3></RowerSmallCenter>
              
              </>
              )} */}
              </Container>
      </StaticSection>
        )}
        
        </AnimatePresence>
    </motion.div>
  )
}

export default Home

const RowerRowImage = styled.div`
    width: 150px;
    min-height: 100px;
    ${props => props.theme.displayFlexCenter};
    margin: 5px 0;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    animation: other 20s infinite;
    border-radius: 10px;
    margin: 30px 0;
          @keyframes other {
              0% {
              background-image: url(${back40});
              }
              50% {
              background-image: url(${back30});
              }
              100% {
              background-image: url(${back40});
              }
          }
    
`;

const Container = styled.div`
    width: 80vw;
    height: 80vh;
    ${props => props.theme.displayFlexColumn};
    justify-content: space-around;
`;

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
  ${props => props.theme.displayFlexColumn};
  justify-content: space-around;
  @media(max-width: 498px){
    background-image: url(${back2});
  }
`;

const ImageHolder = styled.div`
  width: 80%;
  min-height: 50vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  animation: backgroundChange 20s infinite;
  img{
    border-radius: 10px;
  }
        @keyframes backgroundChange {
            0% {
            background-image: url(${back10});
            }
            50% {
            background-image: url(${back20});
            }
            100% {
            background-image: url(${back10});
            }
        }
`;
