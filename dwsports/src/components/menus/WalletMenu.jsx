import React,{useEffect, useState} from 'react'
import styled from 'styled-components'
import {motion, AnimatePresence} from 'framer-motion'
import { CloseStats,DepositWrapper,DepositBigTitle } from './index' 
import {StyledMenu} from '../../components/index'
import Swal from "sweetalert2";
import  { useTheme } from 'styled-components'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';




const WalletMenu = ({walletMenu,setWalletMenu}) => {

    

   const closeWalletMenu = () => {
    setWalletMenu(!walletMenu)
   }

    const item={
        initial: { height: 0, opacity: 0 },
        animate: { minHeight: '100vh', opacity: 1, transition: { duration: 0.5 } },
        exit: { height: 0, opacity: 0, transition: { duration: 0.5 } }
    } 

    useEffect(() => {
        // Toggle body overflow based on isMenuOpen state
        if (walletMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = ''; // Revert to original overflow
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
        };
    }, [walletMenu]);

  return (
    
    <StyledMenu variants={item}
    initial="initial"
    animate="animate"
    exit="exit" key="styledWallet"
    style={{alignItems: 'center', overflow: 'hidden', paddingTop: '60px'}}>
        <DepositBigTitle style={{border: '1px solid red'}}>CONNECT YOUR WALLET</DepositBigTitle>
     <CloseStats onClick={closeWalletMenu} /> 
            <DepositWrapper>
           <img src={connect} alt="walletConnect" />
           </DepositWrapper>
            <DepositWrapper>
           <TonConnectButton />
           </DepositWrapper>
    </StyledMenu>
    
  )
}

export default WalletMenu

const Image = styled.div`
    width: 100%;

`;
