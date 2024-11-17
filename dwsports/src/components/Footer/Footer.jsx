import React, { useState, useEffect } from 'react'
import { motion,AnimatePresence,useAnimation  } from 'framer-motion'
import {useInView} from "react-intersection-observer";
import styled, {useTheme} from 'styled-components'
import {FooterSection,Partners,Logo,Column,TopRow,BottomRow, ButtonWrapper} from './index'
import x from "../../assets/logos/x.png"
import telegram from "../../assets/logos/telegram.png"
import website from "../../assets/logos/website.png"
import white from "../../assets/logos/white.png"
import buy from "../../assets/logos/buy.png"
import bot from "../../assets/logos/bot.png"
import apps from "../../assets/logos/tapps.png"
import Shinobi from '../svg/Shinobi';
import Ton from '../svg/Ton';
import Fren from '../svg/Fren';
import Hunny from '../svg/Hunny';

const Footer = () => {

  const [currentPartner, setCurrentPartner] = useState(0);
  const [showingPartner, setShowingPartner] = useState(true);
  const [activePartner, setActivePartner] = useState(null)
  const theme = useTheme();


  console.log(activePartner)

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
      setShowingPartner(false); // Hide the partner for 1 second
  
      setTimeout(() => {
        setCurrentPartner((prev) => {
          const nextPartnerIndex = (prev + 1) % Partners.length; // Get the next partner index
          setActivePartner(Partners[nextPartnerIndex]); // Update active partner
          console.log(Partners[nextPartnerIndex]); // Log the active partner
          return nextPartnerIndex; // Update state with the next index
        });
        setShowingPartner(true); // Show the next partner
      }, 500); // 1-second blank delay
    }, 5000); // Total cycle time
  
    return () => clearInterval(interval); // Cleanup on unmount
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
    
    <FooterSection>
      <AnimatePresence>
        {showingPartner && (
          <motion.div
          key={currentPartner}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ position: "absolute", width: "100%", height: '100%', textAlign: "center", display: 'flex', alignItems: 'center' }}
        >
            <Logo>
              <motion.img src={Partners[currentPartner].logo} alt={Partners[currentPartner].logo} variants={variantsTwo}
          initial="initial"
          animate="animate"
          exit="exit" style={{borderRadius: '50%'}}/>
            </Logo>
            <Column ref={ref}>
            <TopRow><motion.div variants={variantsTwo}
          initial="initial" style={{display: 'flex', alignItems: 'center', width: '100%'}}
          animate="animate"
          exit="exit"><h2>OUR PARTNERS</h2></motion.div></TopRow>
              <TopRow>
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
              </TopRow>
              <BottomRow>
                {activePartner?.twitter !== null && (
                  <ButtonWrapper href={`${activePartner?.twitter}`} target="_blank"><motion.div variants={variantsTwo}
                  initial="initial"
                  animate="animate"
                  exit="exit"><img src={x} alt="x" /></motion.div></ButtonWrapper>
                )}
                {activePartner?.telegram !== null && (
                  <ButtonWrapper href={`${activePartner?.telegram}`} target="_blank"><motion.div variants={variantsTwo}
                  initial="initial"
                  animate="animate"
                  exit="exit"><img src={telegram} alt="x" /></motion.div></ButtonWrapper>
                )}
                {activePartner?.website !== null && (
                  <ButtonWrapper href={`${activePartner?.website}`} target="_blank"><motion.div variants={variantsTwo}
                  initial="initial"
                  animate="animate"
                  exit="exit"><img src={website} alt="x" /></motion.div></ButtonWrapper>
                )}
                {activePartner?.whitepaper !== null && (
                  <ButtonWrapper href={`${activePartner?.whitepaper}`} target="_blank"><motion.div variants={variantsTwo}
                  initial="initial"
                  animate="animate"
                  exit="exit"><img src={white} alt="x" style={{width: '70%', borderRadius: '50%'}}/></motion.div></ButtonWrapper>
                )}
                {activePartner?.buy !== null && (
                  <ButtonWrapper href={`${activePartner?.buy}`} target="_blank"><motion.div variants={variantsTwo}
                  initial="initial"
                  animate="animate"
                  exit="exit"><img src={buy} alt="x"/></motion.div></ButtonWrapper>
                )}
                {activePartner?.bot !== null && (
                        <ButtonWrapper href={`${activePartner?.bot}`} target="_blank"><motion.div variants={variantsTwo}
                        initial="initial"
                        animate="animate"
                        exit="exit"><img src={bot} alt="x"/></motion.div></ButtonWrapper>
                )}
                {activePartner?.app !== null && (
                        <ButtonWrapper href={`${activePartner?.app}`} target="_blank"><motion.div variants={variantsTwo}
                        initial="initial"
                        animate="animate"
                        exit="exit"><img src={apps} alt="x"/></motion.div></ButtonWrapper>
                )}
              </BottomRow>
            </Column>
        </motion.div>
        )}
      </AnimatePresence>
      {/* {Partners.map((partner) => {
        return(
          <AnimatePresence>
           <motion.div
          key={currentPartner}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ position: "absolute", width: "100%", textAlign: "center", display: 'flex', alignItems: 'center' }}
        >
          {showingPartner && (
            <>
            <Logo>
              <motion.img src={Partners[currentPartner].logo} alt={Partners[currentPartner].logo} />
            </Logo>
            <Column>
              HELLO BITCHES!!!
            </Column>
           </>
          )}
          </motion.div>
          </AnimatePresence>
        )
        
      })} */}
    </FooterSection>
    
  )
}

export default Footer
