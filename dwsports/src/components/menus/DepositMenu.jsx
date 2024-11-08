import React,{useEffect, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import { CloseStats,BetSection,DepositWrapper,LinkInputField,DepositRow,DepositTitle,DepositBigTitle } from './index' 
import {BetInput} from '../../components/index'
import { StyledButton } from '../../pages';
import { TonClient, Address, internal } from '@ton/ton';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";


/* import TonWeb from 'tonweb'; */
import axios from 'axios';
import { FantasyState } from '../../context/FantasyContext';
import { BalanceDisplay, useAuth } from '../../pages/functions';
import { supabase } from '../../supabase/client';
import { message } from 'antd';

import { ethers } from "ethers";
import { EthereumProvider } from "@walletconnect/ethereum-provider";


const DepositMenu = ({depositMenu,setDepositMenu}) => {

    const [amount, setAmount] = useState(0);
    const [tonConnectUI, setOptions] = useTonConnectUI();
    const [transactionStatus, setTransactionStatus] = useState('');
    const [client, setClient] = useState(null);
    const wallet = useTonWallet();
    const {balance, setBalance} = FantasyState();
    const {walletBalance,setWalletBalance} = FantasyState();
    const {provider, setProvider} = FantasyState();
    const {account, setAccount} = FantasyState();
    const [transactionHash, setTransactionHash] = useState(null);
    console.log("balance", balance)
    const {user} = useAuth();
 
    const closeDepositMenu = () => {
        setDepositMenu(false)
    }
    
    const getTokenBalance = async () => {
        const tokenAddress = "0xf09aF67f24b49d5078C9f1F243C55F88af11D746"; // Replace with your token's contract address
      
        // ABI for ERC-20 tokens with `balanceOf` and `decimals`
        const ERC20_ABI = [
          "function balanceOf(address owner) view returns (uint256)",
          "function decimals() view returns (uint8)",
        ];
      
        // Initialize a new ethers.js provider
        const ethersProvider = new ethers.providers.Web3Provider(provider);
        
        // Create a contract instance with ethers.js
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, ethersProvider);
      
        try {
          // Get token balance in Wei
          const balance = await tokenContract.balanceOf(account);
          
          // Get the token's decimal count to format the balance
          const decimals = await tokenContract.decimals();
          const formattedBalance = ethers.utils.formatUnits(balance, decimals);
      
          console.log(`Token balance: ${formattedBalance}`);
          
          setBalance(formattedBalance)
          alert(formattedBalance);
        } catch (error) {
          alert(error)
        }
    };

    useEffect(() => {
        getTokenBalance();
    }, [])

    


    const item={
        initial: { height: 0, opacity: 0 },
        animate: { minHeight: '100vh', opacity: 1, transition: { duration: 0.5 } },
        exit: { height: 0, opacity: 0, transition: { duration: 0.5 } }
    } 

  return (
    <AnimatePresence>
    <motion.div className="menu-container-seven" variants={item}
    initial="initial"
    animate="animate"
    exit="exit">
        <DepositBigTitle>RATIO: 1 SHO - 1 PGZ</DepositBigTitle>
     <CloseStats onClick={closeDepositMenu} /> 
     
        <DepositWrapper>
            <DepositTitle>PACTON'S GAMING ZONE WALLET ADDRESS:</DepositTitle>
            <DepositTitle><LinkInputField disabled={true} value={teamWalletAddress}/></DepositTitle>
            <DepositTitle>YOUR BALANCE: {parseFloat(forma)}<span>TON</span></DepositTitle>
            <DepositTitle>AMOUNT TO DEPOSIT:</DepositTitle>
            <DepositTitle><BetInput style={{borderRadius: '10px'}} value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}/></DepositTitle>
            {/* <DepositRow>
                AMOUNT TO DEPOSIT: <BetInput style={{borderRadius: '10px'}} value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}/>
            </DepositRow> */}
            <DepositTitle>
                <StyledButton onClick={handleSendTransaction}>DEPOSIT</StyledButton>
            </DepositTitle>
            <span>{transactionStatus}</span>
        </DepositWrapper>
        <BalanceDisplay balance={balance}/>
    </motion.div>
    </AnimatePresence>
  )
}

export default DepositMenu
