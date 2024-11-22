import React, { useState, useEffect } from 'react'
import { motion,AnimatePresence,useAnimation  } from 'framer-motion'
import {useInView} from "react-intersection-observer";
import styled, {useTheme} from 'styled-components'
import {SmartButtonWrapper,Partners,X,Telegram,Bot,Website,Cart,TopSmartRowThree,TopSmartRow,BottomRow,TopSmartRowTwo, SmartFooterSection, Design, Paper, App, StyledIconButton} from './index'
import x from "../../assets/logos/x.png"
import telegram from "../../assets/logos/telegram.png"
import website from "../../assets/logos/website.png"
import white from "../../assets/logos/white.png"
import buy from "../../assets/logos/buy.png"
import brands from '../../assets/logos/brand.png'
import bot from "../../assets/logos/bot.png"
import apps from "../../assets/logos/tapps.png"
import Shinobi from '../svg/Shinobi';
import Fren from '../svg/Fren';
import Ton from '../svg/Ton';
import Move from '../svg/Move';
import Hunny from '../svg/Hunny';
import Badger from '../svg/Badger';
import Toncula from '../svg/Toncula';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';



const SmartFooter = () => {

    const [currentPartner, setCurrentPartner] = useState(0);
  const [showingPartner, setShowingPartner] = useState(true);
  const [activePartner, setActivePartner] = useState(null)
  const theme = useTheme();

  

  const {ref, inView} = useInView();

  const animation = useAnimation();

  useEffect(() => {
      if(inView){
          animation.start({
              opacity: 1, pathLength: 1, 
              transition: {
                  duration: 2, ease: "easeInOut", delay: 0
              }
          });
      }
      if(!inView){
          animation.start({
              opacity: 0, pathLength: 0
          })
      }
  }, [inView])

  useEffect(() => {
        const interval = setInterval(() => {
          setShowingPartner(false); 
      
          setTimeout(() => {
            setCurrentPartner((prev) => {
              const nextPartnerIndex = (prev + 1) % Partners.length;
              setActivePartner(Partners[nextPartnerIndex]); 
              return nextPartnerIndex; 
            });
            setShowingPartner(true); 
          }, 500);
        }, 5000); 
      
        return () => clearInterval(interval); 
      }, []);

  const variants = {
    initial: { opacity: 0, },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 2 } },
  };
  const variantsTwo = {
    initial: { scale: 0, y:-10 },
    animate: { scale: 1,y:-10,  transition: { duration: 0.25 } },
    exit: { scale: 0,y:-10,  transition: { duration: 0.25 } },
  };
  const variantsThree = {
    initial: { scale: 0,  },
    animate: { scale: 1,  transition: { duration: 0.25 } },
    exit: { scale: 0,  transition: { duration: 0.25 } },
  };

  

  return (
    <SmartFooterSection>
        <AnimatePresence>
            {showingPartner && (
                <motion.div key={currentPartner}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ position: "absolute", width: "100%", height: '100%', textAlign: "center", display: 'flex', flexDirection: 'column' }}>
                   <Stack sx={{ width: '100%', color: theme.MainAccent }} spacing={2}>
                    <LinearProgress color="secondary" />
                  </Stack>
                    <TopSmartRow><motion.div variants={variantsThree}
          initial="initial" style={{display: 'flex', alignItems: 'center', width: '100%'}}
          animate="animate"
          exit="exit"><h2>OUR PARTNERS</h2></motion.div></TopSmartRow>
          <TopSmartRowTwo>
                {currentPartner === 0 && (
                  <Ton />
                )}
                {currentPartner === 1 && (
                        <Shinobi />
                )}
                {currentPartner === 2 && (
                  <Fren />
                )}
                {currentPartner === 3 && (
                  <Move />
                )}
                {currentPartner === 4 && (
                  <Hunny />
                )}
                {currentPartner === 5 && (
                  <Badger />
                )}
                {currentPartner === 6 && (
                  <Toncula />
                )}
              </TopSmartRowTwo>
              <TopSmartRowThree>
              <motion.img src={Partners[currentPartner].logo} alt={Partners[currentPartner].logo} variants={variantsTwo}
                initial="initial"
                animate="animate"
                exit="exit" style={{borderRadius: '50%'}}/>
              </TopSmartRowThree>
              <TopSmartRowTwo>
                {(activePartner?.twitter !== null) ? (
                     <SmartButtonWrapper href={`${activePartner?.twitter}`} target="_blank"><motion.div variants={variantsTwo}
                     initial="initial"
                     animate="animate"
                     exit="exit"><StyledIconButton><X /></StyledIconButton></motion.div></SmartButtonWrapper>   
                ) : (
                        ""
                )}
                {(activePartner?.telegram !== null) ? (
                     <SmartButtonWrapper href={`${activePartner?.telegram}`} target="_blank"><motion.div variants={variantsTwo}
                     initial="initial"
                     animate="animate"
                     exit="exit"><StyledIconButton><Telegram /></StyledIconButton></motion.div></SmartButtonWrapper>   
                ) : (
                     ""   
                )}
                {(activePartner?.website !== null) ? (
                      <SmartButtonWrapper href={`${activePartner?.website}`} target="_blank"><motion.div variants={variantsTwo}
                      initial="initial"
                      animate="animate"
                      exit="exit"><StyledIconButton><Website /></StyledIconButton></motion.div></SmartButtonWrapper>  
                ) : (
                        ""
                )}
                {(activePartner?.whitepaper !== null) ? (
                      <SmartButtonWrapper href={`${activePartner?.whitepaper}`} target="_blank"><motion.div variants={variantsTwo}
                      initial="initial"
                      animate="animate"
                      exit="exit"><StyledIconButton><Paper /></StyledIconButton></motion.div></SmartButtonWrapper>  
                ) : (
                        ""
                )}
                {(activePartner?.buy !== null) ? (
                    <SmartButtonWrapper href={`${activePartner?.buy}`} target="_blank"><motion.div variants={variantsTwo}
                    initial="initial"
                    animate="animate"
                    exit="exit"><StyledIconButton><Cart /></StyledIconButton></motion.div></SmartButtonWrapper>    
                ) : (
                     ""   
                )}
                {(activePartner?.bot !== null) ? (
                       <SmartButtonWrapper href={`${activePartner?.bot}`} target="_blank"><motion.div variants={variantsTwo}
                       initial="initial"
                       animate="animate"
                       exit="exit"><StyledIconButton><Bot /></StyledIconButton></motion.div></SmartButtonWrapper> 
                ) : (
                        ""
                )}
                {(activePartner?.app !== null) ? (
                    <SmartButtonWrapper href={`${activePartner?.app}`} target="_blank"><motion.div variants={variantsTwo}
                    initial="initial"
                    animate="animate"
                    exit="exit"><StyledIconButton><App /></StyledIconButton></motion.div></SmartButtonWrapper>    
                ) : (
                        ""
                )}
                {(activePartner?.brand !== null) ? (
                    <SmartButtonWrapper href={`${activePartner?.brand}`} target="_blank"><motion.div variants={variantsTwo}
                    initial="initial"
                    animate="animate"
                    exit="exit"><StyledIconButton><Design /></StyledIconButton></motion.div></SmartButtonWrapper>    
                ) : (
                        ""
                )}
              </TopSmartRowTwo>
                </motion.div>
            )}
        </AnimatePresence>
    </SmartFooterSection>
  )
}

export default SmartFooter
