import React, { useEffect, useState, useRef } from 'react';
import { motion, useTransform, useScroll, useInView } from 'framer-motion';
import styled from 'styled-components'
import pacton from '../assets/pacton_robot_png.png'
import google from '../assets/logos/google.jpg'
import discord from '../assets/logos/discord.png'
import xLogo from '../assets/logos/xLogo.png'
import referral from '../assets/logos/referral.png'
import { useAuth } from './functions';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import ShareIcon from '@mui/icons-material/Share';
import { message } from 'antd';
import Ton from '../assets/logos/ton.png'
import { Avatar, Button, IconButton } from '@mui/material';
import { StyledButtonYellow } from '../components';
import { players } from './fakeData';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const AnimatedDiv = ({ children }) => {
    const viewRef = useRef(null);
    const [referrals, serReferrals] = useState(players)

    console.log(referrals)    
    // Hook to check if the div is in view
    const isInView = useInView(viewRef, { once: true });
  
    return (
      <motion.div
        ref={viewRef}
        initial={{ opacity: 0, y: 50,  }}  // Initial state (off-screen)
        animate={isInView ? { opacity: 1, y: 0, } : {}} // Animate when in view
        transition={{ duration: 0.8, ease: "easeOut" }} // Animation properties
        className="animated-div"
      >
        {children}
      </motion.div>
    );
  };

const Airdrop = () => {

    const ref = useRef(null);
    const [referralOpen, setRefferalOpen] = useState(true)
    const [signInOpen, setSignInOpen] = useState(false)
    const [yourLink, setYourLink] = useState(false)
    const { user } = useAuth(); 
    const [isExpanded, setIsExpanded] = useState(false)

  // Use the useScroll hook to track scroll position
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Define scale, opacity, and position for text
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1.7, 1]);
  const imageTopScale = useTransform(scrollYProgress, [0, 0.5], [1.2, 0.9]);
  const textY = useTransform(scrollYProgress, [0, 0.5], ["3vh", "40vh"]); // Moves downward
  const textOpacity = useTransform(scrollYProgress, [0.4, 0.6], [1, 0]); // Fades out closer to the image
  const imageOpacity = useTransform(scrollYProgress, [0.6, 0.4], [1, 0]); 
  // Define scale and position for image
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.65]);
  const imageY = useTransform(scrollYProgress, [0, 1], [10, 50]);

  const askLink = () => {
    setRefferalOpen(false)
    setSignInOpen(true)
  }

  const signIn = () => {
    setSignInOpen(false)
    setRefferalOpen(false)
    setYourLink(true)
  }

  console.log(user)

  const clipBoard = () => {
    message.success("Copied to Clipboard!")
  }

  const expandDiv = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <>
    <Section ref={ref}>
      {/* Big Text */}
      <motion.div 
        style={{ scale: imageTopScale, y: textY, opacity: textOpacity, position: 'absolute', top: '-12.5%', left: '70%', zIndex: 1, 
        }}>
        <motion.img src={Ton} alt="background" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} animate={{
          y: [-60, 100, -60],  // Moves 20px down and back to 0
          scale: [0.9, 1.1, 0.9],  // Moves 20px down and back to 0
        }}
        transition={{
          duration: 6,  // Time to complete one full loop (up and down)
          ease: "easeInOut",  // Smooth easing
          repeat: Infinity,   // Loop the animation infinitely
        }}/>
      </motion.div>
      <Header
        style={{
          scale: textScale,
          y: textY,
          opacity: textOpacity,
          position: 'relative',
          zIndex: 2,
          margin: 0,
          fontSize: '4rem',
        }}
      >
        <p>WELCOME TO THE</p> PACTON AIRDROP
      </Header>

      {/* Image with parallax effect */}
      <motion.div
        style={{ scale: imageScale, y: imageY, opacity: imageOpacity, position: 'absolute', top: '45%', left: '60%', zIndex: 1,
        }}>
        <motion.img src={pacton} alt="background" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} /* animate={{  // Moves 20px down and back to 0
          scale: [0.8, 1, 0.8],  // Moves 20px down and back to 0
        }}
        transition={{
          duration: 10,  // Time to complete one full loop (up and down)
          ease: "easeInOut",  // Smooth easing
          repeat: Infinity,   // Loop the animation infinitely
        }} *//>
      </motion.div>
      <motion.div
        style={{ scale: imageScale, y: imageY, opacity: imageOpacity, position: 'absolute', top: '52.5%', left: '15%', zIndex: 1,
        }}>
        <WelcomeContainer>
            {referralOpen && (
               <>
               <ContainerTitle>ENTER A</ContainerTitle>
               <ContainerTitle>REFERRAL</ContainerTitle>
               <ContainerTitle>LINK</ContainerTitle>
               <ContainerButtons>
                   <InputField />
               </ContainerButtons>
               <ContainerButtons>
               <ContainerTitle>OR GET YOURS</ContainerTitle>
               </ContainerButtons>
               <ContainerButtons>
               <GoogleButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.975 }} onClick={askLink}>
                       <GoogleLogo><img src={referral} alt="" /></GoogleLogo>
                       <GoogleText>GET LINK</GoogleText>
                   </GoogleButton>
               </ContainerButtons>
               </>
            )}
            {signInOpen && (
                <>
                <ContainerTitle>SIGN IN</ContainerTitle>
                <ContainerTitle>TO GET YOUR</ContainerTitle>
                <ContainerTitle>REFERRAL LINK</ContainerTitle>
                <ContainerButtons>
                    <GoogleButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.975 }} onClick={signIn}>
                        <GoogleLogo><img src={google} alt="" style={{width: '60%'}}/></GoogleLogo>
                        <GoogleText>SIGN IN WITH GOOGLE</GoogleText>
                    </GoogleButton>
                </ContainerButtons>
                <ContainerButtons>
                <GoogleButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.975 }} onClick={signIn}>
                        <GoogleLogo><img src={discord} alt="" /></GoogleLogo>
                        <GoogleText>SIGN IN WITH DISCORD</GoogleText>
                    </GoogleButton>
                </ContainerButtons>
                <ContainerButtons>
                <GoogleButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.975 }} onClick={signIn}>
                        <GoogleLogo><img src={xLogo} alt="" /></GoogleLogo>
                        <GoogleText>SIGN IN WITH X</GoogleText>
                    </GoogleButton>
                </ContainerButtons>
                </>
            )}
            {yourLink && (
                <>
                <ContainerTitle>THIS IS </ContainerTitle>
                <ContainerTitle>YOUR</ContainerTitle>
                <ContainerTitle>REFERRAL LINK</ContainerTitle>
                <ContainerButtons>
                        <LinkInputField disabled={true} value={`PACTON/${user.id}`}/>
                </ContainerButtons>
                <ContainerButtons>
                <GoogleButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.975 }} onClick={clipBoard}>
                        <GoogleLogo><CopyClipboard /></GoogleLogo>
                        <GoogleText>COPY TO CLIPCOARD</GoogleText>
                    </GoogleButton>
                </ContainerButtons>
                <ContainerButtons>
                <GoogleButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.975 }} onClick={signIn}>
                        <GoogleLogo><ShareBlueIcon /></GoogleLogo>
                        <GoogleText>SHARE YOUR LINK</GoogleText>
                    </GoogleButton>
                </ContainerButtons>
                </>
            )}
        </WelcomeContainer>
      </motion.div>

      {/* Placeholder content to add scrolling */}
      <div className="content">
        <p></p>
        <div className="filler" />
      </div>
    
    </Section>
    <SectionTwo>
        <AnimatedDiv><TitleTwo>YOUR PROFILE</TitleTwo></AnimatedDiv>

        <motion.div
                initial={{ height: 240, border: '3px solid rgba(244,215,21,1)', borderRadius: '10px' }} // Initial height
                animate={{ height: isExpanded ? 'auto' : 240 }} // Height transitions between 100px and 300px
                transition={{ duration: 0.5 }} // Duration of the animation
                className="expandable-smalldiv"
                style={{
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid white'
                }}
              >
                <SecondRow>
                <SecondRowAvatar>
                <Avatar alt="Image" src={user?.user_metadata.avatar_url} sx={{ width: 50, height: 50 }} />
                </SecondRowAvatar>
                <SecondRowName>PARENT LINK</SecondRowName>
                <MyReferralParent>
                    <BigLinkInputField disabled={true} />
                </MyReferralParent>
                <SecondRowButton><StyledButtonYellow>LINK PARENT</StyledButtonYellow></SecondRowButton>
                </SecondRow>
                <ThirdRow>
                <ThirdRowSocials></ThirdRowSocials>
                <ThirdRowCount>REFERRALS COUNT: <span>{players.length}</span></ThirdRowCount>
                <ThirdRowArrow><IconButton onClick={expandDiv}><ArrowDown /></IconButton></ThirdRowArrow>
                </ThirdRow>
                {/* {!isExpanded && <MiniArrowDown onClick={toggleExpand}></MiniArrowDown>}
                {isExpanded && <MiniArrowup onClick={toggleExpand}></MiniArrowup>}
                <AccordionTitle>SUMMARY</AccordionTitle> */}
                {isExpanded && (
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        {players?.map((player) => {
                            return(
                                <ReferralWrapper>
                                    <SecondRowAvatar><Avatar alt="Image" src={player.photo} sx={{ width: 50, height: 50 }} /></SecondRowAvatar>
                                    <ReferralName>NAME: {player.name}</ReferralName>
                                    <ReferralName>PLAYER REFERRALS: {player.age}</ReferralName>
                                </ReferralWrapper>
                            )
                        })}
                    </div>
                )}
            </motion.div>
       
    
    </SectionTwo>
    </>
  )
}



export default Airdrop

const CopyClipboard = styled(ContentCopyRoundedIcon)`
    &&&{
        color: rgb(75,65,230);
    }
`;

const ShareBlueIcon = styled(ShareIcon)`
    &&&{
        color: rgb(75,65,230);
    }
`;

const InputField = styled.input`
  padding: 0 15px;
  border: ${props => props.theme.pacBorder};
  border-radius: 10px;
  outline: none;
  font-size: 16px;
  color: ${props => props.theme.pacColor};
  background-color: transparent;
  box-shadow: ${props => props.theme.pacBoxShadow};
  width: 300px;
  z-index: 4000;
  height: 40px;
`;

const BigLinkInputField = styled.input`
  padding: 0 15px;
  border: ${props => props.theme.pacBorder};
  border-radius: 10px;
  outline: none;
  font-size: 13px;
  color: ${props => props.theme.pacColor};
  background-color: transparent;
  box-shadow: ${props => props.theme.pacBoxShadow};
  width: 90%;
  z-index: 4000;
  height: 40px;
`;

const LinkInputField = styled.input`
  padding: 0 15px;
  border: ${props => props.theme.pacBorder};
  border-radius: 10px;
  outline: none;
  font-size: 13px;
  color: ${props => props.theme.pacColor};
  background-color: transparent;
  box-shadow: ${props => props.theme.pacBoxShadow};
  width: 300px;
  z-index: 4000;
  height: 40px;
`;

const GoogleButton = styled(motion.div)`
    width: 250px;
    height: 40px;
    //border: ${props => props.theme.pacBorder};
    border-radius: 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
    box-shadow: ${props => props.theme.pacBoxShadow};
`;

const GoogleLogo = styled.div`
    width: 50px;
    height: 40px;
    border-right: ${props => props.theme.pacBorder};
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.pacColor};
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    img{
        width: 75%;
        object-fit: contain;
        display: block;
        border-radius: 50%;
    }
`;

const GoogleText = styled.div`
    width: 200px;
    height: 40px;
    color: ${props => props.theme.pacColor};
    font-weight: bold;
    font-size: 16px;
    display: flex;
    align-items: center;
    padding: 5px;
    justify-content: center;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    background: rgb(75,65,230);
    background: linear-gradient(90deg, rgba(75,65,230,1) 0%, rgba(52,68,191,1) 50%, rgba(30,45,159,1) 100%);
`;

const Section = styled.div`
    position: relative;
    height: 160vh; /* Taller than viewport to allow scrolling */
    overflow: hidden;
    text-align: center;
    background: rgb(75,65,230);
    background: linear-gradient(180deg, rgba(75,65,230,1) 0%, rgba(54,70,193,1) 50%, rgba(244,215,21,1) 100%);
`;
const SectionTwo = styled.div`
    min-height: 160vh; /* Taller than viewport to allow scrolling */
    overflow: hidden;
    background: rgb(75,65,230);
    display: flex;
    align-items: center;
    ${props => props.theme.displayFlexColumn};
    background: linear-gradient(180deg, rgba(244,215,21,1) 0%, rgba(54,70,193,1) 50%, rgba(75,65,230,1) 100%);
`;

const TitleTwo = styled.div`
    min-width: 50%;
    min-height: 10%;
    ${props => props.theme.pacfontBlue};
    ${props => props.theme.displayFlex};
    margin-top: 150px;
    margin-bottom: 60px;
    font-size: 4rem;
`;


const SecondRow = styled.div`
    width: 100%;
    height: 100px;
    border-bottom: 1px solid rgba(244,215,21,1);
    ${props => props.theme.displayFlex};
    
`;

const ThirdRow = styled.div`
    width: 100%;
    height: 140px;
    ${props => props.theme.displayFlex};
    border-bottom: 1px solid rgba(244,215,21,1);
`;

const ReferralWrapper = styled.div`
    width: 90%;
    height: 80px;
    border: 1px solid rgba(244,215,21,1);
    border-radius: 10px;
    ${props => props.theme.displayFlex};
    margin: 10px 0;
`;

export const ReferralName = styled.div`
    width: 40%;
    height: 100%;
    border: 1px solid rgba(244,215,21,1);
    ${props => props.theme.displayFlex};
    color: rgba(244,215,21,1);
    font-size: 24px;
    padding: 0 20px;
`;

const SecondRowAvatar = styled.div`
    width: 10%;
    height: 100%;
    border-right: 1px solid rgba(244,215,21,1);
    ${props => props.theme.displayFlexColumnCenter};
`;

const SecondRowName = styled.div`
    width: 20%;
    height: 100%;
    border-right: 1px solid rgba(244,215,21,1);
    ${props => props.theme.displayFlexColumnCenter};
    ${props => props.theme.pacfont};
    font-size: 1.2rem;
`;

const ThirdRowSocials = styled.div`
    width: 60%;
    height: 100%;
    border-right: 1px solid rgba(244,215,21,1);
    ${props => props.theme.displayFlexColumnCenter};
    ${props => props.theme.pacfont};
    font-size: 1.2rem;
`;

const ArrowDown = styled(KeyboardArrowDownIcon)`
    &&&{
        color:rgba(244,215,21,1);
        scale: 2;
    }
`;

const ThirdRowCount = styled.div`
    width: 30%;
    height: 100%;
    border-right: 1px solid rgba(244,215,21,1);
    ${props => props.theme.displayFlexColumnCenter};
    ${props => props.theme.pacfont};
    font-size: 1.2rem;
    span{
        font-family: 'Dosis';
        font-size: 62px;
    }
`;

const ThirdRowArrow = styled.div`
    width: 10%;
    height: 100%;
    ${props => props.theme.displayFlexColumnCenter};
`;

const SecondRowButton = styled.div`
    width: 20%;
    height: 100%;
    border-right: 1px solid rgba(244,215,21,1);
    ${props => props.theme.displayFlexColumnCenter};
    font-size: 1.2rem;
`;

const MyReferralParent = styled.div`
    width: 50%;
    height: 100%;
    border-right: 1px solid rgba(244,215,21,1);
    ${props => props.theme.displayFlexColumnCenter};
    
    ${props => props.theme.displayFlex};

`;

const Header = styled(motion.div)`
    ${props => props.theme.pacfont};
    margin-top: 0vh;
    text-shadow: ${props => props.theme.body} -2px 3px,  ${props => props.theme.body} -3px 3px,  ${props => props.theme.body} -4px 3px;
    p{
        ${props => props.theme.pacman};
        font-size: 2.5rem;
        margin-bottom: 3rem;
    }
`;

const WelcomeContainer = styled.div`
    width: 400px;
    height: 320px;
    border: 3px solid rgba(244,215,21,1);
    border-radius: 10px;
    -webkit-box-shadow: -11px 10px 15px -1px rgba(0,0,0,0.75);
    -moz-box-shadow: -11px 10px 15px -1px rgba(0,0,0,0.75);
    box-shadow: -11px 10px 15px -1px rgba(0,0,0,0.75);
    display: flex;
    flex-direction:column;
    align-items: center;
`;

const ContainerTitle = styled.div`
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    ${props => props.theme.pacfont};
    font-size: 1.9rem;
    letter-spacing: 3;
`;

const ContainerButtons = styled.div`
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.9rem;
`;


