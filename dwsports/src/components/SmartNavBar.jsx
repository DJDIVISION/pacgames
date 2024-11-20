import React, {useState,useEffect} from 'react'
import {SmartNav,Burguer,CloseBurguer,StaggerContainer,StaggerRow,
    StaggerAvatarName,StaggerImageHolder,
    LightIcon,StyledMenu,
    DarkIcon
} from './index'
import {Link as LinkR} from 'react-router-dom'
import {AnimatePresence} from 'framer-motion'
import  { useTheme } from 'styled-components'
import sportsIcon from '../assets/sportsIcon.png'

import fantasy from '../assets/fantasy.png'
import deposit from '../assets/logos/shoDeposit.png'
import withdraw from '../assets/logos/withdraw.png'
import partners from '../assets/logos/partners.png'
import { IconButton } from '@mui/material';

import { FantasyState } from '../context/FantasyContext';
import DepositMenu from './menus/DepositMenu';
import ES from '../assets/svg/es.png';
import FR from '../assets/svg/fr.png';
import EN from '../assets/svg/uk.png';
import { useTranslation } from 'react-i18next'

import WalletMenu from './menus/WalletMenu';


const SmartNavBar = ({toggleTheme}) => {

    const languages = [
        {
            icon: <img src={ES} alt="ES" onClick={() => i18n.changeLanguage("es")} />,
            name: 'ES'
        },
        {
            icon: <img src={FR} alt="FR" onClick={() => i18n.changeLanguage("fr")} />,
            name: 'FR'
        },
        {
            icon: <img src={EN} alt="EN" onClick={() => i18n.changeLanguage("en")} />,
            name: 'EN'
        }
    ];
    const [t, i18n] = useTranslation("global");
    const [scrollNavDown, setScrollNavDown] = useState(false);
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const {depositMenu, setDepositMenu} = FantasyState();
    const {walletMenu, setWalletMenu} = FantasyState();
    

    const isOpen = ()=>{
        setOpen(!open);
        
      }

    useEffect(() => {
       window.addEventListener('scroll', changeNavDown) 
    }, []);


    const changeNavDown = () => {
        if(window.scrollY >= 50) {
            setScrollNavDown(true); 
        } 
        else {
            setScrollNavDown(false)
        }
    }

    const item={
        initial: { height: 0, opacity: 0 },
        animate: { height: "100vh", opacity: 1, transition: { duration: 0.5 } },
        exit: { height: 0, opacity: 0, transition: { duration: 0.5 } }
    }

    

  return (
    <SmartNav scrollNavDown={scrollNavDown}>
        <IconButton onClick={isOpen}><Burguer /></IconButton>
        <AnimatePresence>
            {open && (
                <StyledMenu scrollNavDown={scrollNavDown} variants={item} 
                initial="initial"
                animate="animate"
                exit="exit" style={{justifyContent: 'center', }}>
                     <IconButton style={{position: 'absolute', top: '20px', left: '20px'}} onClick={isOpen}><CloseBurguer /></IconButton>
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
                              animate={{ opacity: 1, y: -60 }}
                              transition={{ delay: 0.7 }}>
                              <StaggerImageHolder><img src={sportsIcon} alt="sports" /></StaggerImageHolder>
                              <StaggerAvatarName>{t("navbar.sports")}</StaggerAvatarName>
                          </StaggerRow></LinkR>
                          <LinkR to="/fantasy"><StaggerRow initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: -60 }}
                              transition={{ delay: 0.8 }}>
                              <StaggerImageHolder><img src={fantasy} alt="fantasy" /></StaggerImageHolder>
                              <StaggerAvatarName>{t("navbar.fantasy")}</StaggerAvatarName>
                          </StaggerRow></LinkR>
                          <LinkR to="/partners"><StaggerRow initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: -60 }}
                              transition={{ delay: 0.9 }}>
                              <StaggerImageHolder><img src={partners} alt="fantasy" /></StaggerImageHolder>
                              <StaggerAvatarName>OUR PARTNERS</StaggerAvatarName>
                          </StaggerRow></LinkR>
                          {/* <LinkR to="/casino"><StaggerRow initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: -60 }}
                              transition={{ delay: 1.1 }} >
                              <StaggerImageHolder><img src={chip} alt="casino" /></StaggerImageHolder>
                              <StaggerAvatarName>CASINO</StaggerAvatarName>
                          </StaggerRow></LinkR> */}
                          <StaggerRow initial={{ opacity: 0, y: 40 }} onClick={() => {isOpen(); setDepositMenu(true);}}
                              animate={{ opacity: 1, y: -60 }}
                              transition={{ delay: 1 }} >
                              <StaggerImageHolder><img src={deposit} alt="wallet" /></StaggerImageHolder>
                              <StaggerAvatarName>{t("navbar.deposit")}</StaggerAvatarName>
                          </StaggerRow>
                          <StaggerRow initial={{ opacity: 0, y: 40 }} onClick={() => {isOpen(); setWalletMenu(true);}}
                              animate={{ opacity: 1, y: -60 }}
                              transition={{ delay: 1.1 }} >
                              <StaggerImageHolder><img src={withdraw} alt="wallet" /></StaggerImageHolder>
                              <StaggerAvatarName>{t("navbar.withdraw")}</StaggerAvatarName>
                          </StaggerRow>
                          <StaggerRow initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: -60 }}
                              transition={{ delay: 1.2 }}> 
                          <StaggerImageHolder>
                          {theme.body === '#202020' ? <LightIcon onClick={toggleTheme}/> : <DarkIcon onClick={toggleTheme}/>}
                          </StaggerImageHolder>
                          <StaggerAvatarName>{t("navbar.switch")}</StaggerAvatarName>
                          </StaggerRow>
                      </StaggerContainer>
                </StyledMenu>
            )}
            {depositMenu && (
                <DepositMenu depositMenu={depositMenu} setDepositMenu={setDepositMenu} key="depositmenusmart"/>
            )}
            {walletMenu && (
                <WalletMenu walletMenu={walletMenu} setWalletMenu={setWalletMenu} key="walletMenusmart"/>
            )}
        </AnimatePresence>
    </SmartNav>
  )
}

export default SmartNavBar
