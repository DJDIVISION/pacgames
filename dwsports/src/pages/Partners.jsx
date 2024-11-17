import React, {useEffect} from 'react'
import { motion, useAnimation } from 'framer-motion'
import { animationFive,transitionLong } from '../animations'
import styled from 'styled-components'

import { AbsoluteIconButtonLeft } from './indexThree'
import { ArrowLeftRelative } from './index'
import { useNavigate } from 'react-router-dom'
import Shinobi from '../components/svg/Shinobi'
import Fren from '../components/svg/Fren'
import Move from '../components/svg/Move'
import Ton from '../components/svg/Ton'
import shinobi from '../assets/logos/shinobi.png'
import ton from '../assets/logos/ton.png'
import move from '../assets/logos/move.jpg'
import fren from '../assets/logos/fren.png'
import x from "../assets/logos/x.png"
import telegram from "../assets/logos/telegram.png"
import website from "../assets/logos/website.png"
import white from "../assets/logos/white.png"
import buy from "../assets/logos/buy.png"
import bot from "../assets/logos/bot.png"
import apps from "../assets/logos/tapps.png"
import { useMediaQuery } from 'react-responsive'

const Partners = () => {

    const navigate = useNavigate()
    const controls = useAnimation();
    const controlsTwo = useAnimation();
    const isMobile = useMediaQuery({ query: '(max-width: 498px)' });

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
    const startAnimationSequenceTwo = () => {
        controlsTwo.start({
            rotateY: [0, -720, 0],
            transition: {
                duration: 6,
                ease: "easeInOut",
            },
        }).then(() => {
            // Pause for 3 seconds after the rotation
            setTimeout(startAnimationSequenceTwo, 3000); // Restart after 3 seconds
        });
    };

    useEffect(() => {
        startAnimationSequence();
        startAnimationSequenceTwo();
    }, []);


  return (
    <motion.div initial="out" animate="in" variants={animationFive} transition={transitionLong}>
        <Section>
        <AbsoluteIconButtonLeft onClick={() => navigate('/')}><ArrowLeftRelative style={{transform: 'translateY(0) rotate(90deg)'}}/></AbsoluteIconButtonLeft>
        <Partner>
            <SVGTop><Shinobi /></SVGTop>
            <SVG><motion.img src={shinobi} alt="shinobi" style={{ width: isMobile ? "25%" : '40%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} 
                    animate={controls}/></SVG>
            <Description><h2>Dive into the world of decentralized finance with SHINOBI's innovative pool and farm mechanics. Earn lucrative rewards by providing liquidity to our dynamic liquidity pools and participating in yield farming opportunities. With APYs reaching up to 200%, our pools and farms offer unparalleled earning potential while promoting liquidity and stability within the SHINOBI ecosystem.</h2></Description>
            <Icons>
                <Icon href='https://x.com/sibonihs?s=21&t=QRHKIh6sLsC1HoUdftHPYQ' target="_blank"><img style={{ width: isMobile ? "50%" : '75%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={x} alt="one" /></Icon>
                <Icon href='https://t.me/SHINOBIPORTAL' target="_blank"><img style={{ width: isMobile ? "50%" : '75%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={telegram} alt="telegram" /></Icon>
                <Icon href='https://sh1nobi.io' target="_blank"><img style={{ width: isMobile ? "50%" : '75%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={website} alt="website" /></Icon>
                <Icon href='https://shinobi-3.gitbook.io/shinobi-revolutionizing-defi-ecosystems-with-shid' target="_blank"><img style={{borderRadius: '50%', width: isMobile ? "50%" : '75%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={white} alt="white" /></Icon>
                <Icon href='https://pool.shido.io/pool/0x4aed39bda730a74874a576b7c0d68e2c641cf912' target="_blank"><img style={{ width: isMobile ? "50%" : '75%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={buy} alt="buy" /></Icon>
            </Icons>
        </Partner>
        <Partner>
            <SVGTop><Fren /></SVGTop>
            <SVG><motion.img src={fren} alt="fren" style={{ width: isMobile ? "25%" : '40%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} 
                    animate={controlsTwo}/></SVG>
        </Partner>
        <Partner>
            <SVGTop><Move /></SVGTop>
            <SVG><motion.img src={move} alt="shinobi" style={{borderRadius: '50%', width: isMobile ? "25%" : '40%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} 
                    animate={controls}/></SVG>
        </Partner>
        <Partner>
            <SVGTop><Ton /></SVGTop>
            <SVG><motion.img src={ton} alt="fren" style={{ width: isMobile ? "25%" : '40%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} 
                    animate={controlsTwo}/></SVG>
        </Partner>
        </Section>
      
    </motion.div>
  )
}

export default Partners

const Section = styled.div`
    width: 100%;
    height: 340vh;
    background: ${props => props.theme.body};
    ${props => props.theme.displayFlexColumnCenter};
    justify-content: space-around;
    padding-top: 60px;
`;

const Partner = styled.div`
    width: 90%;
    height: 80vh;
    margin: 10px 0;
    border: 2px solid ${props => props.theme.card};
    padding: 10px;
    border-radius: 10px;
    box-shadow: ${props => props.theme.pacBoxShadow}, inset 0 0 25px ${props => props.theme.text};
`;

const SVGTop = styled.div`
    width: 80%;
    height: 15%;
    margin: auto;
    ${props => props.theme.displayFlexCenter};
    img{
        width: 30%;
        display: block;
        object-fit: cover;
    }
`;


const SVG = styled.div`
    width: 100%;
    height: 20%;
    ${props => props.theme.displayFlexCenter};
    img{
        display: block;
        object-fit: cover;
    }
`;
const Description = styled.div`
    width: 90%;
    height: 55%;
    ${props => props.theme.displayFlexCenter};
    margin: auto;
    text-align: center;
    line-height: 1.4;
    h2{
        font-size: 16px;
        color: ${props => props.theme.text}; 
        text-shadow: ${props => props.theme.textShadowTwo};
    }
`;
const Icons = styled.div`
    width: 90%;
    height: 10%;
    ${props => props.theme.displayFlexCenter};
    justify-content: space-around;
    margin: auto;
`;

const Icon = styled.a`
    width: 20%;
    height: 100%;
    ${props => props.theme.displayFlexCenter}; 
    img{
        display: block;
        object-fit: cover;
    }
`;
