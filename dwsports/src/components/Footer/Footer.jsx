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
                  <Shinobi />
                )}
                {currentPartner === 1 && (
                  <Fren />
                )}
                {currentPartner === 2 && (
                  <svg width="303" height="81" viewBox="0 0 303 81" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M254.665 77.6971V78.1971H255.165H302H302.5V77.6971V68.4591V67.9591H302H265.87V43.5008H293.729H294.229V43.0008V33.7628V33.2628H293.729H265.87V12.2419H301.033H301.533V11.7419V2.50386V2.00386H301.033H255.165H254.665V2.50386V77.6971Z" stroke={`${theme.MainAccent}`}/>
                  <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M202.559 77.8659L202.678 78.1971H203.029H213.771H214.123L214.242 77.8659L241.204 2.67262L241.444 2.00386H240.733H229.992H229.638L229.52 2.33692L208.4 61.9638L187.28 2.33692L187.163 2.00386H186.809H176.067H175.357L175.597 2.67262L202.559 77.8659Z" stroke={`${theme.MainAccent}`}/>
                  <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M97.5007 61.0708L97.5013 61.0719C100.731 66.9864 105.181 71.584 110.849 74.8539L110.851 74.8551C116.521 78.0897 122.982 79.701 130.22 79.701C137.458 79.701 143.918 78.0897 149.588 74.8551L149.59 74.8539C155.258 71.584 159.708 66.9864 162.938 61.0719L162.938 61.0708C166.172 55.1126 167.779 48.117 167.779 40.1005C167.779 32.0846 166.172 25.1066 162.938 19.1839C159.709 13.2336 155.258 8.63499 149.589 5.40028C143.919 2.12949 137.458 0.5 130.22 0.5C122.981 0.5 116.52 2.12945 110.85 5.40016C105.181 8.63475 100.73 13.2331 97.5011 19.1831C94.2672 25.1061 92.66 32.0843 92.66 40.1005C92.66 48.117 94.2673 55.1127 97.5007 61.0708ZM144.387 15.2176L144.39 15.2194C148.174 17.7418 151.013 21.1742 152.91 25.53L152.912 25.5345C154.849 29.8667 155.822 34.7192 155.822 40.1005C155.822 45.4816 154.849 50.3527 152.911 54.7216L152.911 54.7233C151.014 59.0431 148.175 62.4766 144.389 65.0358C140.622 67.5469 135.909 68.8184 130.22 68.8184C124.53 68.8184 119.817 67.5469 116.05 65.0357C112.264 62.4764 109.407 59.0426 107.474 54.7223C105.572 50.3532 104.617 45.4819 104.617 40.1005C104.617 34.7183 105.572 29.8649 107.475 25.5321C109.407 21.1752 112.265 17.7422 116.049 15.2194L116.052 15.2176C119.818 12.6715 124.531 11.3825 130.22 11.3825C135.908 11.3825 140.621 12.6715 144.387 15.2176Z" stroke={`${theme.MainAccent}`}/>
                  <motion.path variants={pathVariants}
          initial="initial"
          animate="animate"
          exit="exit" d="M1.50445 77.6305L1.42837 78.1971H2H12.7419H13.1836L13.2381 77.7588L20.1194 22.4176L40.2297 60.101L40.675 60.9354L41.1137 60.0975L60.8029 22.5006L67.6739 77.7588L67.7284 78.1971H68.1701H78.9119H79.4828L79.4076 77.6312L69.4176 2.43801L69.3599 2.00386H68.922H60.1136H59.8113L59.6708 2.27162L40.561 38.7064L21.24 2.26962L21.0991 2.00386H20.7983H12.0974H11.66L11.6018 2.43731L1.50445 77.6305Z" stroke={`${theme.MainAccent}`}/>
                  </svg>
                )}
                {currentPartner === 3 && (
                  <Ton />
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
