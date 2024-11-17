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
import badger from '../assets/logos/badger.png'
import x from "../assets/logos/x.png"
import telegram from "../assets/logos/telegram.png"
import website from "../assets/logos/website.png"
import white from "../assets/logos/white.png"
import buy from "../assets/logos/buy.png"
import bot from "../assets/logos/bot.png"
import hunny from '../assets/logos/hunny.jpg'
import app from "../assets/logos/tapps.png"
import { useMediaQuery } from 'react-responsive'
import Hunny from '../components/svg/Hunny'
import Badger from '../components/svg/Badger'

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
            <SVGTop><Ton /></SVGTop>
            <SVG><motion.img src={ton} alt="fren" style={{ width: isMobile ? "35%" : '15%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} 
                    animate={controlsTwo}/></SVG>
                    <Description><h2>The Open Network (TON) is a decentralized and open internet platform made up of several components. These include: TON Blockchain, TON DNS, TON Storage, and TON Sites. TON Blockchain is the core protocol that connects TON’s underlying infrastructure together to form the greater TON Ecosystem.</h2></Description>
            <Icons>
                <Icon href='https://x.com/ton_blockchain' target="_blank"><img style={{ width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={x} alt="one" /></Icon>
                <Icon href='https://t.me/toncoin' target="_blank"><img style={{ width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={telegram} alt="telegram" /></Icon>
                <Icon href='https://ton.org' target="_blank"><img style={{ width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={website} alt="website" /></Icon>
                <Icon href='https://ton.org/en/buy-toncoin?filters[exchange_groups][slug][$eq]=buy-with-card&pagination[page]=1&pagination[pageSize]=100' target="_blank"><img style={{borderRadius: '50%', width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={buy} alt="white" /></Icon>
            </Icons>
        </Partner>
        <Partner>
            <SVGTop><Shinobi /></SVGTop>
            <SVG><motion.img src={shinobi} alt="shinobi" style={{ width: isMobile ? "25%" : '15%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} 
                    animate={controls}/></SVG>
            <Description><h2>Dive into the world of decentralized finance with SHINOBI's innovative pool and farm mechanics. Earn lucrative rewards by providing liquidity to our dynamic liquidity pools and participating in yield farming opportunities. With APYs reaching up to 200%, our pools and farms offer unparalleled earning potential while promoting liquidity and stability within the SHINOBI ecosystem.</h2></Description>
            <Icons>
                <Icon href='https://x.com/sibonihs?s=21&t=QRHKIh6sLsC1HoUdftHPYQ' target="_blank"><img style={{ width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={x} alt="one" /></Icon>
                <Icon href='https://t.me/SHINOBIPORTAL' target="_blank"><img style={{ width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={telegram} alt="telegram" /></Icon>
                <Icon href='https://sh1nobi.io' target="_blank"><img style={{ width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={website} alt="website" /></Icon>
                <Icon href='https://shinobi-3.gitbook.io/shinobi-revolutionizing-defi-ecosystems-with-shid' target="_blank"><img style={{borderRadius: '50%', width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={white} alt="white" /></Icon>
                <Icon href='https://pool.shido.io/pool/0x4aed39bda730a74874a576b7c0d68e2c641cf912' target="_blank"><img style={{ width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={buy} alt="buy" /></Icon>
            </Icons>
        </Partner>
        <Partner>
            <SVGTop><Fren /></SVGTop>
            <SVG><motion.img src={fren} alt="fren" style={{ width: isMobile ? "25%" : '15%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} 
                    animate={controlsTwo}/></SVG>
                <Description><h2>FREN is a community-oriented token to nurture friendlier Web3 social media. The token is distributed to the first 1,000,000 users signing up in the Fren Telegram app.
                    <br/>FREN is a fair launch, every friend being equal. Tokens can be only received by the airdrop. For more details see Frequently Asked Questions. <br/></h2> </Description>
            <Icons>
                <Icon href='https://x.com/fren_airdrop' target="_blank"><img style={{ width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={x} alt="one" /></Icon>
                <Icon href='https://t.me/frentgnews' target="_blank"><img style={{ width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={telegram} alt="telegram" /></Icon>
                <Icon href='https://fren.tg' target="_blank"><img style={{ width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={website} alt="website" /></Icon>
                <Icon href='https://t.me/FrenTekBot' target="_blank"><img style={{borderRadius: '50%', width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={bot} alt="white" /></Icon>
                <Icon href='https://t.me/FrenTekBot/fren' target="_blank"><img style={{ width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={app} alt="buy" /></Icon>
            </Icons>
        </Partner>
        <Partner>
            <SVGTop><Hunny /></SVGTop>
            <SVG><motion.img src={hunny} alt="fren" style={{ width: isMobile ? "25%" : '15%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} 
                    animate={controlsTwo}/></SVG>
                <Description><h2>🍯 HunnyPlay aims to be the most engaging and fun DeFi destination built on chain. <br/>Top Crypto Casino and iGaming Destination Built Across 7 Blockchains.</h2> </Description>
            <Icons>
                <Icon href='https://twitter.com/HunnyPlay_' target="_blank"><img style={{ width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={x} alt="one" /></Icon>
                <Icon href='https://t.me/HunnyFinanceNews' target="_blank"><img style={{ width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={telegram} alt="telegram" /></Icon>
                <Icon href='https://hunnyplay.io' target="_blank"><img style={{ width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={website} alt="website" /></Icon>
            </Icons>
        </Partner>
        <Partner>
            <SVGTop><Badger /></SVGTop>
            <SVG><motion.img src={badger} alt="fren" style={{ width: isMobile ? "25%" : '15%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} 
                    animate={controlsTwo}/></SVG>
                <Description><h2>Badger Wasteland is a collection of post-apocalyptic life shared through the eyes of our hairy friends. Scavenging for supplies while exploring decimated cityscapes and scorched earth remains are the badgers' primary focus. They also enjoy crafting new tools, repairing weapons and armor, and most of all, lunch! Follow their journey in a brave new world and own a piece of their story.</h2> </Description>
            <Icons>
                <Icon href='https://x.com/BadgerWasteland?t=h2076b9JS02jxW854JZTOQ&s=09' target="_blank"><img style={{ width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={x} alt="one" /></Icon>
                <Icon href='https://t.me/Badger_Wasteland_Chat' target="_blank"><img style={{ width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={telegram} alt="telegram" /></Icon>
                <Icon href='https://getgems.io/badgerwasteland' target="_blank"><img style={{ width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={website} alt="website" /></Icon>
            </Icons>
        </Partner>
        <Partner>
            <SVGTop><Move /></SVGTop>
            <SVG><motion.img src={move} alt="shinobi" style={{borderRadius: '50%', width: isMobile ? "25%" : '15%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} 
                    animate={controls}/></SVG>
                    <Description><h2>Move is the first Telegram mini app that lets you earn tokens by tracking the distance you move. Walk or run, complete tasks, climb the leaderboard to compete with your friends.
                        <br/>Connect with friends, crush fitness goals, and earn $MOVE together!<br/>Explore your city, conquer challenges, and unlock exclusive rewards.</h2></Description>
            <Icons>
            <Icon href='https://x.com/moveonton' target="_blank"><img style={{ width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={x} alt="one" /></Icon>
            <Icon href='https://t.me/MoveOnTonBot' target="_blank"><img style={{ width: isMobile ? "60%" : '25%', height: 'auto', objectFit: 'cover', margin: 'auto', opacity: 1 }} src={telegram} alt="telegram" /></Icon> 
            </Icons>
        </Partner>
        
        </Section>
      
    </motion.div>
  )
}

export default Partners

const Section = styled.div`
    width: 100%;
    height: auto;
    background: ${props => props.theme.body};
    ${props => props.theme.displayFlexColumnCenter};
    justify-content: space-around;
    padding-top: 60px;
`;

const Partner = styled.div`
    width: 90%;
    height: 550px;
    margin: 20px 0;
    border: 2px solid ${props => props.theme.card};
    padding: 10px;
    border-radius: 10px;
    box-shadow: ${props => props.theme.pacBoxShadow}, inset 0 0 25px ${props => props.theme.text};
    @media(min-width: 1024px){
        width: 60%;
        height: 450px;
    }
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
    @media(min-width: 1024px){
        height: 20%;
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
    @media(min-width: 1024px){
        height: 25%;
        transform: translateY(10px);
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
    @media(min-width: 1024px){
        height: 45%;
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
