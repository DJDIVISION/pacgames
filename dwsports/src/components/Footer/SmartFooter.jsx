import React, { useState, useEffect } from 'react'
import { motion,AnimatePresence,useAnimation  } from 'framer-motion'
import {useInView} from "react-intersection-observer";
import styled, {useTheme} from 'styled-components'
import {SmartButtonWrapper,Partners,Logo,TopSmartRowThree,TopSmartRow,BottomRow,TopSmartRowTwo, SmartFooterSection} from './index'
import x from "../../assets/logos/x.png"
import telegram from "../../assets/logos/telegram.png"
import website from "../../assets/logos/website.png"
import white from "../../assets/logos/white.png"
import buy from "../../assets/logos/buy.png"
import bot from "../../assets/logos/bot.png"
import apps from "../../assets/logos/tapps.png"
import Shinobi from '../svg/Shinobi';
import Fren from '../svg/Fren';
import Ton from '../svg/Ton';
import Move from '../svg/Move';



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
    animate: { opacity: 1, transition: { duration: 2 } },
    exit: { opacity: 0, transition: { duration: 2 } },
  };
  const variantsTwo = {
    initial: { scale: 0, },
    animate: { scale: 1, transition: { duration: 0.25 } },
    exit: { scale: 0, transition: { duration: 0.25 } },
  };
  const pathVariants = {
    initial: { pathLength: 0, },
    animate: { pathLength: 1, transition: { duration: 1, ease: "easeInOut" } },
    exit: { pathLength: 0, transition: { duration: 0.50, ease: "easeInOut", } },
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
                    <TopSmartRow><motion.div variants={variantsTwo}
          initial="initial" style={{display: 'flex', alignItems: 'center', width: '100%'}}
          animate="animate"
          exit="exit"><h2>OUR PARTNERS</h2></motion.div></TopSmartRow>
          <TopSmartRowTwo>
                {currentPartner === 0 && (
                  <Shinobi />
                )}
                {currentPartner === 1 && (
                        <Fren />
                )}
                {currentPartner === 2 && (
                  <Move />
                )}
                {currentPartner === 3 && (
                  <Ton />
                )}
              </TopSmartRowTwo>
              <TopSmartRowThree>
              <motion.img src={Partners[currentPartner].logo} alt={Partners[currentPartner].logo} variants={variantsTwo}
                initial="initial"
                animate="animate"
                exit="exit" style={{borderRadius: '50%'}}/>
              </TopSmartRowThree>
              <TopSmartRowTwo style={{transform: 'translateY(-10px)'}}>
                {(activePartner?.twitter !== null) ? (
                     <SmartButtonWrapper href={`${activePartner?.twitter}`} target="_blank"><motion.div variants={variantsTwo}
                     initial="initial"
                     animate="animate"
                     exit="exit"><img src={x} alt="x" /></motion.div></SmartButtonWrapper>   
                ) : (
                        ""
                )}
                {(activePartner?.telegram !== null) ? (
                     <SmartButtonWrapper href={`${activePartner?.telegram}`} target="_blank"><motion.div variants={variantsTwo}
                     initial="initial"
                     animate="animate"
                     exit="exit"><img src={telegram} alt="x" /></motion.div></SmartButtonWrapper>   
                ) : (
                     ""   
                )}
                {(activePartner?.website !== null) ? (
                      <SmartButtonWrapper href={`${activePartner?.website}`} target="_blank"><motion.div variants={variantsTwo}
                      initial="initial"
                      animate="animate"
                      exit="exit"><img src={website} alt="x" /></motion.div></SmartButtonWrapper>  
                ) : (
                        ""
                )}
                {(activePartner?.whitepaper !== null) ? (
                      <SmartButtonWrapper href={`${activePartner?.whitepaper}`} target="_blank"><motion.div variants={variantsTwo}
                      initial="initial"
                      animate="animate"
                      exit="exit"><img src={white} alt="x" style={{width: '70%', borderRadius: '50%'}}/></motion.div></SmartButtonWrapper>  
                ) : (
                        ""
                )}
                {(activePartner?.buy !== null) ? (
                    <SmartButtonWrapper href={`${activePartner?.buy}`} target="_blank"><motion.div variants={variantsTwo}
                    initial="initial"
                    animate="animate"
                    exit="exit"><img src={buy} alt="x"/></motion.div></SmartButtonWrapper>    
                ) : (
                     ""   
                )}
                {(activePartner?.bot !== null) ? (
                       <SmartButtonWrapper href={`${activePartner?.bot}`} target="_blank"><motion.div variants={variantsTwo}
                       initial="initial"
                       animate="animate"
                       exit="exit"><img src={bot} alt="x"/></motion.div></SmartButtonWrapper> 
                ) : (
                        ""
                )}
                {(activePartner?.app !== null) ? (
                    <SmartButtonWrapper href={`${activePartner?.app}`} target="_blank"><motion.div variants={variantsTwo}
                    initial="initial"
                    animate="animate"
                    exit="exit"><img src={apps} alt="x"/></motion.div></SmartButtonWrapper>    
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
