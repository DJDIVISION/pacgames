import React, { useEffect, useState, useRef } from 'react';
import { motion, useTransform, useScroll  } from 'framer-motion';
import styled from 'styled-components'
import pacton from '../assets/pacton_robot_png.png'
import './styles.css'
import google from '../assets/logos/google.jpg'
import discord from '../assets/logos/discord.png'
import xLogo from '../assets/logos/xLogo.png'
import referral from '../assets/logos/referral.png'
import { useAuth } from './functions';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import ShareIcon from '@mui/icons-material/Share';
import { message } from 'antd';
import Ton from '../assets/logos/ton.png'

const Airdrop = () => {

    const ref = useRef(null);
    const [referralOpen, setRefferalOpen] = useState(true)
    const [signInOpen, setSignInOpen] = useState(false)
    const [yourLink, setYourLink] = useState(false)
    const { user } = useAuth(); 

  // Use the useScroll hook to track scroll position
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Define scale, opacity, and position for text
  const textScale = useTransform(scrollYProgress, [0, 0.5], [1.7, 1]);
  const textY = useTransform(scrollYProgress, [0, 0.5], ["3vh", "40vh"]); // Moves downward
  const textOpacity = useTransform(scrollYProgress, [0.4, 0.6], [1, 0]); // Fades out closer to the image
  const imageOpacity = useTransform(scrollYProgress, [0.6, 0.4], [1, 0]); 
  // Define scale and position for image
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.7]);
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

  const clipBoard = () => {
    message.success("Copied to Clipboard!")
  }

  return (
    <>
    <Section ref={ref}>
      {/* Big Text */}
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
        <img src={pacton} alt="background" style={{ width: '100%', height: 'auto', objectFit: 'cover' }}/>
      </motion.div>
      <motion.div
        style={{ scale: imageScale, y: imageY, opacity: imageOpacity, position: 'absolute', top: '52.5%', left: '15%', zIndex: 1,
        }}>
        <WelcomeContainer>
            {referralOpen && (
               <>
               <ContainerTitle></ContainerTitle>
               <ContainerTitle>ENTER A</ContainerTitle>
               <ContainerTitle>REFERRAL LINK</ContainerTitle>
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
  width: 250px;
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
    position: relative;
    height: 160vh; /* Taller than viewport to allow scrolling */
    overflow: hidden;
    text-align: center;
    background: rgb(75,65,230);
    background: linear-gradient(180deg, rgba(244,215,21,1) 0%, rgba(54,70,193,1) 50%, rgba(75,65,230,1) 100%);
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
    ${props => props.theme.pacman};
    font-size: 1.9rem;
`;

const ContainerButtons = styled.div`
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.9rem;
`;


