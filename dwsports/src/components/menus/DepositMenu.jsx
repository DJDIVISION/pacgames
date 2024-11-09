import React,{useEffect, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import { CloseStats,BetSection,DepositWrapper,LinkInputField,DepositRow,DepositTitle,DepositBigTitle,BalanceWrapper } from './index' 
import {BetInput, StyledMenu} from '../../components/index'
import { StyledButton } from '../../pages';
import { TonClient, Address, internal } from '@ton/ton';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";
import Swal from "sweetalert2";
import  { useTheme } from 'styled-components'
/* import TonWeb from 'tonweb'; */
import axios from 'axios';
import { FantasyState } from '../../context/FantasyContext';
import { BalanceDisplay, useAuth } from '../../pages/functions';
import { supabase } from '../../supabase/client';
import { message } from 'antd';

import { ethers } from "ethers";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import Web3 from "web3";

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
    const theme = useTheme();
    /* const teamWalletAddress = "0xf09aF67f24b49d5078C9f1F243C55F88af11D746"; */
 
    const closeDepositMenu = () => {
        setDepositMenu(false)
    }
    
    const sendTokens = async () => {
        if (!provider) {
          console.error("Provider is undefined.");
          return;
        }
        message.info("Please accept the transaction on your wallet", [5])
        const recipientAddress = "0x75a8AC284299e362830c49615459EeD8f66C0265"
        const tokenAddress = "0xf09aF67f24b49d5078C9f1F243C55F88af11D746";
        // Initialize Web3 with the provider
        const web3 = new Web3(provider);
      
        // ERC-20 ABI with only the transfer function
        const ERC20_ABI = [
          {
            "constant": false,
            "inputs": [
              { "name": "_to", "type": "address" },
              { "name": "_value", "type": "uint256" }
            ],
            "name": "transfer",
            "outputs": [{ "name": "success", "type": "bool" }],
            "type": "function"
          },
          { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "type": "function" }
        ];
      
        // Create the token contract instance
        const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
      
        try {
          // Get the token's decimal places
          const decimals = await tokenContract.methods.decimals().call();
          const decimalsBigInt = BigInt(decimals);
            const str = amount.toString();
          // Convert the amount to the correct token denomination
          const amountToSend = BigInt(str) * BigInt(10) ** decimalsBigInt;
      
          // Send the transaction
          const transaction = await tokenContract.methods.transfer(recipientAddress, amountToSend.toString()).send({
            from: account
          });
          setBalance(amount)
          console.log(`Transaction successful:`, transaction);
          const result = await Swal.fire({
            title: "Transaction approved",
            text: "Your balance has been updated",
            icon: "success",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "OK"
          }).then((result) => {
            if (result.isConfirmed) {
                setDepositMenu(false)
            }
          });
          return transaction; // Return transaction details if needed
        } catch (error) {
          console.error("Error sending tokens:", error);
        }
      };

    


    const item={
        initial: { height: 0, opacity: 0 },
        animate: { minHeight: '100vh', opacity: 1, transition: { duration: 0.5 } },
        exit: { height: 0, opacity: 0, transition: { duration: 0.5 } }
    } 

  return (
    
    <StyledMenu variants={item}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
        <DepositBigTitle>RATIO: 1 SHO - 1 PGZ</DepositBigTitle>
     <CloseStats onClick={closeDepositMenu} /> 
     
        <DepositWrapper>
            <DepositTitle>PACTON'S GAMING ZONE WALLET ADDRESS:</DepositTitle>
            <DepositTitle><LinkInputField disabled={true} value="0x75a8AC284299e362830c49615459EeD8f66C0265"/></DepositTitle>
            <DepositTitle>YOUR BALANCE: {parseFloat(walletBalance)}<span>SHO</span></DepositTitle>
            <DepositTitle>AMOUNT TO DEPOSIT:</DepositTitle>
            <DepositTitle><BetInput style={{borderRadius: '10px'}} value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}/></DepositTitle>
            {/* <DepositRow>
                AMOUNT TO DEPOSIT: <BetInput style={{borderRadius: '10px'}} value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}/>
            </DepositRow> */}
            <DepositTitle>
                <StyledButton onClick={sendTokens} style={{fontSize: '18px'}}>DEPOSIT</StyledButton>
            </DepositTitle>
            <span>{transactionStatus}</span>
        </DepositWrapper>
        <BalanceWrapper><h2>YOUR BALANCE: {balance} PGZ</h2></BalanceWrapper>
    </StyledMenu>
    
  )
}

export default DepositMenu
