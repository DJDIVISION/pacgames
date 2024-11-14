import React, { useEffect, useState, useRef } from 'react';
import styled, {useTheme} from 'styled-components'
import { motion, useTransform, useScroll, useAnimation, AnimatePresence } from 'framer-motion';
import {HeroSection, StyledButton} from './index'
import Ton from '../../assets/logos/ton.png'
import Sho from '../../assets/logos/sho.png'
import connect from '../../assets/logos/connect.png'
import { TonConnectButton, TonConnectUIProvider, useTonConnectUI, useTonWallet, useTonAddress } from '@tonconnect/ui-react';
import { getUserBalance, useAuth } from '../../pages/functions';
import { message } from 'antd';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import SendIcon from '@mui/icons-material/Send';
import { Avatar, Button, IconButton } from '@mui/material';
import { supabase } from '../../supabase/client';
import { MiniArrowDown, MiniArrowup, SmallArrowDownFlex, MiniIconButton } from '../../pages';
import { FantasyState } from '../../context/FantasyContext';
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom'
import { RowerSmall,LowRower,RowerRowBets,TeamBetsHolder,AvatarRowBets,WalletsRow } from './index';
import googleDark from '../../assets/logos/googleDark.png'
import googleLight from '../../assets/logos/googleLight.png'
import metamask from '../../assets/logos/metamask.svg'
import Swal from "sweetalert2";

const Hero = () => {

    const ref = useRef(null);
    const isMobile = useMediaQuery({ query: '(max-width: 498px)' });
    const [t, i18n] = useTranslation("global");
    const { user } = useAuth(); 
    const theme = useTheme();
    const [disabledInput, setDisabledInput] = useState(false)
    const [referrerValue, setReferrerValue] = useState("")
    const [referrals, setReferrals] = useState([])
    const [isExpanded, setIsExpanded] = useState(false)
    const {balance, setBalance} = FantasyState();
    const {walletAddress, setWalletAddress} = FantasyState();
    const navigate = useNavigate()
    const [date, setDate] = useState(null)
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
    const [expandedProfile, setExpandedProfile] = useState(true);
    const [expandedWallet, setExpandedWallet] = useState(null);
    const [expandedReferrals, setExpandedReferrals] = useState(null);
    const controls = useAnimation();

    const expandDiv = () => {
        setIsExpanded((prev) => !prev);
      }

    const getReferrer = async () => {
        const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id);

        if (error) {
            console.error('Error fetching user data:', error.message);
        } 
        if(data){
            if(data[0].hasReferrer === true){
                setDisabledInput(true)
                setReferrerValue(data[0].referrerLink)
            }
            if(data[0].referralData !== null){
                setReferrals(data[0].referralData.referrals)
            }
            if(data[0].appBalance > 0){
                setBalance(data[0].appBalance)
            }
        }
    }

    

    const getUserBalance = async (id) => {
        
        const { data, error } = await supabase
            .from('users')
            .select('appBalance')
            .eq("id", id)
      
          if (error) {
            console.error('Error fetching teams:', error.message);
            return;
          }
          if (data) {
            setBalance(data[0].appBalance)
          }
    }

    useEffect(() => {
        if(user){
            const signDate = user.last_sign_in_at;
            const date = new Date(signDate);
            const milliseconds = date.getTime();
            const now = Date.now();
            if (now - milliseconds < 5000) {
              storeUserData(user); 
            } else {
              return
            }
          }
        if(user){
            const signDate = user.last_sign_in_at;
            const date = new Date(signDate);
            const locale = date.toLocaleString();
            setDate(locale)
            getReferrer();
            getUserBalance(user.id)
        }
    }, [user])

    const startAnimationSequence = () => {
        controls.start({
            rotateY: [0, 720, 0],
            transition: {
                duration: 6,
                ease: "easeInOut",
            },
        }).then(() => {
            // Pause for 3 seconds after the rotation
            setTimeout(startAnimationSequence, 3000); // Restart after 3 seconds
        });
    };

    useEffect(() => {
        startAnimationSequence();
    }, []);

    function clipboard() {
        var copyText = document.getElementById("referralLink");
        copyText.select();
        copyText.setSelectionRange(0, 99999); 
        navigator.clipboard.writeText(copyText.value);
        message.success("Link copied to clipboard")
    }
    
    const sendLink = async () => {
        if(disabledInput === true){
            message.error(`${t("hero.message1")}`)
            return
        }
        const referral = document.getElementById("referralLink").value;
        const referrer = document.getElementById("referrerLink").value;
    
        if (referral === referrer) {
            message.error(`${t("hero.message2")}`);
            return; // Exit the function early
        }
    
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('referralLink', referrer);
    
        if (error) {
            console.error('Error fetching user data:', error.message);
        } else {
            if (data.length === 0) {
                message.error(`${t("hero.message3")}`);
            } else {
                console.log(data);
    
                // Assume you want to update a jsonb column called `referralData`
                const userId = data[0].id; // Get the user's ID
                const userJsonData = data[0].referralData || {}; // Get existing jsonb data, if any
    
                // Initialize referrals array if it doesn't exist
                userJsonData.referrals = userJsonData.referrals || []; 
    
                // Prepare the updated data structure to add
                const updatedData = {
                    name: user.user_metadata.name,
                    avatar: user.user_metadata.avatar_url,
                    email: user.email,
                    user_id: user.id
                };
    
                // Add the updated data to the referrals array
                userJsonData.referrals.push(updatedData);
    
                // Update the user's jsonb column
                const { error: updateError } = await supabase
                    .from('users')
                    .update({ referralData: userJsonData }) // Update the jsonb column
                    .eq('id', userId); // Identify which user to update
    
                if (updateError) {
                    console.error('Error updating user data:', updateError.message);
                } else {
                    console.log('User data updated successfully:', userJsonData);
                    message.success(`${t("hero.message4")}`);
                }

                const { error: updateReferral } = await supabase
                    .from('users')
                    .update([{ hasReferrer: true, referrerLink: referrer }]) // Update the jsonb column
                    .eq('id', user.id); // Identify which user to update
    
                if (updateReferral) {
                    console.error('Error updating user data:', updateReferral.message);
                } else {
                    console.log(`${t("hero.message5")}`);
                }
                getReferrer();
            }
        }
    };
    
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
    
        if (error) {
          console.error('Error logging out:', error.message)
        } else {
          console.log('User logged out successfully')
          Swal.fire({
            title: "Log out!",
            text: "You have been disconnected",
            icon: "success"
          });
        }
    }

    const toggleProfile = () => {
        setExpandedProfile(!expandedProfile);
    };
    const toggleWallet = () => {
        setExpandedWallet(!expandedWallet);
    };
    const toggleReferrals = () => {
        setExpandedReferrals(!expandedReferrals);
    };

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

    const storeUserData = async (user) => {
        const { id, email, user_metadata } = user;
        const { full_name: name, avatar_url } = user_metadata || {};
        Swal.fire({
            title: "Log in successful",
            text: "Welcome to PacTON Gaming Zone!",
            icon: "success"
          });
        try {
            // Insert or update user login data
            const { error: loginError } = await supabase
                .from('user_logins')
                .upsert([{ user_id: id, email: email, name: name, avatar: avatar_url }]);
    
            if (loginError) throw loginError;
            console.log('User login data saved successfully:', { id, email, name, avatar_url });
        } catch (error) {
            console.error('Error storing user login data:', error.message);
        }
    
        try {
            // Check if user already exists in the users table
            const { data: existingUser, error: fetchError } = await supabase
                .from('users')
                .select('*')
                .eq('id', id)
                .limit(1); // Limit to 1 row to avoid multiple rows error
    
            // Check for errors in fetching
            if (fetchError) {
                console.error('Error checking user existence:', fetchError.message);
                return;
            }
    
            // Check if any users were returned
            if (existingUser.length === 0) {
                // If user does not exist, proceed to save data
                const { data, error } = await supabase
                    .from('users')
                    .upsert([{ 
                        id: id, // Assign the user's ID to the 'id' column
                        email: email, 
                        name: name, 
                        avatar: avatar_url, 
                        referralLink: `PACTONGZ/${id}` 
                    }]);
    
                if (error) {
                    console.error('Error storing user data:', error.message);
                    return;
                }
    
                console.log('User data saved successfully:', data);
                
            } else {
                console.log('User already exists in the database. No data saved:', existingUser);
            }
        } catch (error) {
            console.error('Unexpected error storing user data:', error.message);
        }
    };



    

  return (
    <HeroSection ref={ref}>
      
        <TopHeader>
        <TopText>{t("hero.title")}</TopText>
      <motion.img src={Sho} 
                alt="background" 
                style={{ width: isMobile ? "40%" : '15%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} 
                animate={controls} />
     
        </TopHeader>

              <TeamBetsHolder style={{ margin: '0', width: '90%', margin: '10px 0'}}
                  initial={{ height: '80px' }}
                  animate={{ height: expandedProfile === true ? '300px' : '80px' }}
                  transition={{ duration: 0.5 }}
                  >
                    <MiniIconButton>{expandedProfile === true ? <SmallArrowDownFlex style={{ transform: 'rotate(180deg)' }} onClick={() => toggleProfile()} /> : <SmallArrowDownFlex onClick={() => toggleProfile()} />}</MiniIconButton>
                  <RowerSmall><h2>YOUR PROFILE</h2></RowerSmall>
                  {expandedProfile === true && (
                      <LowRower >
                        {user ? (
                            <>
                                <AvatarRowBets>
                                <Avatar alt="Image" src={user && user.user_metadata.avatar_url} sx={{ width: 50, height: 50 }} />        
                                </AvatarRowBets>
                                <RowerRowBets>
                                <h2>{user && user.user_metadata.full_name}</h2>
                                </RowerRowBets>
                                <RowerRowBets>
                                <h3>{user && user.email}</h3>
                                </RowerRowBets>
                               
                                <RowerRowBets style={{ height: '70px' }}>
                                    <StyledButton onClick={handleLogout}>LOGOUT</StyledButton>
                                </RowerRowBets>
                            </>
                        ) : (
                            <>
                                <AvatarRowBets>
                                <Avatar alt="Image" src={user && user.user_metadata.avatar_url} sx={{ width: 50, height: 50 }} />        
                                </AvatarRowBets>
                                <RowerRowBets></RowerRowBets>
                                <RowerRowBets style={{ height: '70px' }} onClick={() => handleGoogleSignIn()}>
                                {theme.body === '#202020' ? <img src={googleDark} alt="googleDark" /> : <img src={googleLight} alt="googleLight" />}
                                </RowerRowBets>
                                <RowerRowBets></RowerRowBets>
                                <RowerRowBets></RowerRowBets>
                            </>
                            
                        )}
                            
                      </LowRower>
                  )}
              </TeamBetsHolder>

              <TeamBetsHolder style={{ margin: '0', width: '90%', margin: '10px 0'}}
                  initial={{ height: '80px' }}
                  animate={{ height: expandedWallet === true ? '350px' : '80px' }}
                  transition={{ duration: 0.5 }}
                  >
                    <MiniIconButton>{expandedWallet === true ? <SmallArrowDownFlex style={{ transform: 'rotate(180deg)' }} onClick={() => toggleWallet()} /> : <SmallArrowDownFlex onClick={() => toggleWallet()} />}</MiniIconButton>
                  <RowerSmall><h2>YOUR WALLET</h2></RowerSmall>
                  {expandedWallet === true && (
                      <LowRower >
                        {!walletAddress ? (
                            <>
                                <RowerRowBets>
                                <h2>BALANCE: <span>{parseFloat(balance?.toFixed(2))} PGZ</span></h2>
                                </RowerRowBets>
                                <AvatarRowBets><h2>CONNECT YOUR WALLET HERE</h2></AvatarRowBets>
                                <WalletsRow><img src={connect} alt="connect" /></WalletsRow>
                                <WalletsRow><TonConnectButton /></WalletsRow>
                            </>
                        ) : (
                            <>
                            
                            </>
                        )}
                            
                      </LowRower>
                  )}
              </TeamBetsHolder>

              <TeamBetsHolder style={{ margin: '0', width: '90%', margin: '10px 0'}}
                  initial={{ height: '80px' }}
                  animate={{ height: expandedReferrals === true ? '440px' : '80px' }}
                  transition={{ duration: 0.5 }}
                  >
                    <MiniIconButton>{expandedReferrals === true ? <SmallArrowDownFlex style={{ transform: 'rotate(180deg)' }} onClick={() => toggleReferrals()} /> : <SmallArrowDownFlex onClick={() => toggleReferrals()} />}</MiniIconButton>
                  <RowerSmall><h2>YOUR REFERRALS</h2></RowerSmall>
                  {expandedReferrals === true && (
                  <LowRower >
                      <RowerRowBets>
                          <h2>{t("hero.title3")}</h2>
                      </RowerRowBets>
                      <RowerRowBets>
                          <LinkInputField disabled={disabledInput} value={referrerValue} onChange={(e) => setReferrerValue(e.target.value)} id="referrerLink" />
                      </RowerRowBets>
                      <WalletsRow><IconButton onClick={sendLink}><Send /></IconButton></WalletsRow>
                      <RowerRowBets>
                          <h2>{t("hero.title3")}</h2>
                      </RowerRowBets>
                      <RowerRowBets>
                          <LinkInputField disabled={true} id="referralLink" value={`PACTONGZ/${user.id}`} />
                      </RowerRowBets>
                      <WalletsRow><IconButton onClick={clipboard}><CopyClipboard /></IconButton></WalletsRow>
                  </LowRower >
                      
                  )}
              </TeamBetsHolder>
        {/* <Header>
        <ContainerTitle><Avatar onClick={handleLogout} alt="Image" src={user && user.user_metadata.avatar_url} sx={{ width: 50, height: 50 }} /></ContainerTitle>
        <ContainerSamllTitle></ContainerSamllTitle>
        <ContainerSamllTitle>{user && user.email}</ContainerSamllTitle>
        <ContainerSamllTitle></ContainerSamllTitle>
        <ContainerSamllTitle >BALANCE: <span style={{color: 'aqua', margin: '0 5px'}}>{parseFloat(balance?.toFixed(2))} PGZ</span></ContainerSamllTitle>
        
        <ContainerSamllTitle></ContainerSamllTitle>
        <ContainerSamllTitle>{t("hero.title2")}</ContainerSamllTitle>
        <ContainerSamllTitle>{date}</ContainerSamllTitle>
        </Header>
      <Header initial={{ height: '320px' }} // Initial height
                animate={{ height: isExpanded ? 'auto' : '320px' }}
                exit={{ opacity: 0, height: 0 }} // Height transitions between 100px and 300px
                transition={{ duration: 0.5 }} style={{overflow: 'hidden'}} isExpanded={isExpanded}>
            <ContainerButtons>
            <ContainerTitle>{t("hero.title3")}</ContainerTitle>
            
                    {user && <LinkInputField disabled={disabledInput} value={referrerValue} onChange={(e) => setReferrerValue(e.target.value)} id="referrerLink"/>} <IconButton onClick={sendLink}><Send /></IconButton>
            </ContainerButtons>
            <ContainerButtons>
            <ContainerTitle>{t("hero.title4")}</ContainerTitle>
           
                    {user && <LinkInputField disabled={true} id="referralLink" value={`PACTONGZ/${user.id}`}/>} <IconButton onClick={clipboard}><CopyClipboard /></IconButton>
            </ContainerButtons>
            {isExpanded && (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <ContainerTitle>{t("hero.title5")}</ContainerTitle>
                        {referrals?.map((referral) => {
                            console.log(referral)
                            return(
                                <ReferralWrapper>
                                    <SecondRowAvatar><Avatar alt="Image" src={referral.avatar} sx={{ width: 50, height: 50 }} /></SecondRowAvatar>
                                    <ReferralName>{referral.name}</ReferralName>
                                    <ReferralMail>{referral.email}</ReferralMail>
                                </ReferralWrapper>
                            )
                        })}
                    </div>
                )}   
                {(referrals.length > 0 && !isExpanded) && <MiniArrowDown onClick={expandDiv}/> } 
                {(referrals.length > 0 && isExpanded) && <MiniArrowup onClick={expandDiv}/> } 
      </Header> */}
      
    </HeroSection>
  )
}

export default Hero

const ReferralName = styled.div`
    width: 40%;
    height: 100%;
    ${props => props.theme.displayFlex};
    color: rgba(244,215,21,1);
    font-size: 24px;
    text-align: center;
    padding: 0 10px;
    font-weight: bold;
    @media(max-width: 968px){
        font-size: 16px;
        
    }
`;

const ReferralMail = styled.div`
    width: 40%;
    height: 100%;
    ${props => props.theme.displayFlex};
    color: rgba(244,215,21,1);
    font-size: 24px;
    text-align: center;
    padding: 0 10px;
    font-weight: bold;
    white-space: nowrap;      /* Prevents text from wrapping to the next line */
    overflow: hidden;         /* Ensures content that overflows the container is hidden */
    text-overflow: ellipsis;
    @media(max-width: 968px){
        font-size: 16px;
        width: 35%;
    }
`;

const SecondRowAvatar = styled.div`
    width: 20%;
    height: 100%;
    border-right: 1px solid rgba(244,215,21,1);
    ${props => props.theme.displayFlexColumnCenter};
`;

const ReferralWrapper = styled.div`
    width: 90%;
    height: 80px;
    border: 1px solid rgba(244,215,21,1);
    border-radius: 10px;
    ${props => props.theme.displayFlex};
    margin: 10px 0;
`;

const TopHeader = styled.div`
    width: 90%;
    max-height: 220px;
    border: 1px solid rgba(244,215,21,1);
    border-radius: 10px;
    position: relative;
    ${props => props.theme.displayFlexCenter};
    background: ${props => props.theme.card};
    margin: 10px;
    padding: 10px;
    padding-bottom: ${({ isExpanded }) => (isExpanded ? "30px" : "10px")};
    box-shadow: inset 0 0 25px ${props => props.theme.text};
    @media(max-width: 490px){
        min-height: 150px;
    }
`;

const TopText = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    text-align: center;
    color: ${props => props.theme.pacColor};
    font-size: 32px;
    font-weight: bold;
    z-index: 10;
    transform: translate(-50%, -50%);
    @media(max-width: 968px){
        font-size: 18px;
    }
`;

const Header = styled(motion.div)`
    width: 90%;
    min-height: 320px;
    border: 1px solid rgba(244,215,21,1);
    border-radius: 10px;
    position: relative;
    margin: 10px;
    padding: 10px;
    padding-bottom: ${({ isExpanded }) => (isExpanded ? "30px" : "10px")};
    background: ${props => props.theme.cardTwo};
    box-shadow: inset 0 0 25px ${props => props.theme.text};
`;

const ContainerTitle = styled.div`
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: ${props => props.theme.pacColor};
    //${props => props.theme.pacfont};
    font-size: 20px;
    letter-spacing: 3;
    font-weight: bold;
`;

const ContainerSamllTitle = styled.div`
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.pacColor};
    //${props => props.theme.pacfont};
    font-size: 16px;
    letter-spacing: 3;
    font-weight: bold;
`;


const ContainerButtons = styled.div`
    width: 100%;
    height: 150px;
    ${props => props.theme.displayFlexColumn};
`;

const LinkInputField = styled.input`
  padding: 0 15px;
  font-weight: bold;
  border: ${props => props.theme.pacBorder};
  border-radius: 10px;
  outline: none;
  font-size: 14px;
  color: ${props => props.theme.pacColor};
  background-color: transparent;
  box-shadow: -2px 4px 8px rgb(255, 255, 255);
  width: 90%;
  z-index: 1;
  height: 40px;
  text-align: center;
  user-select: none;
`;

const CopyClipboard = styled(ContentCopyRoundedIcon)`
    &&&{
        margin: 10px;
        color: ${props => props.theme.copyIcon};
    }
`;
const Send = styled(SendIcon)`
    &&&{
        margin: 10px;
        color: ${props => props.theme.copyIcon};
    }
`;
