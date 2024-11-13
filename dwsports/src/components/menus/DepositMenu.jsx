import React,{useEffect, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import { CloseStats,BetSection,DepositWrapper,LinkInputField,SmallDepositTitle,DepositTitle,DepositBigTitle,BalanceWrapper } from './index' 
import {BetInput, StyledMenu} from '../../components/index'
import { StyledButton } from '../../pages';
import { TonClient, Address, internal } from '@ton/ton';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";
import Swal from "sweetalert2";
import  { useTheme } from 'styled-components'
import { useNavigate } from 'react-router-dom'
/* import TonWeb from 'tonweb'; */
import axios from 'axios';
import { FantasyState } from '../../context/FantasyContext';
import { BalanceDisplay, useAuth } from '../../pages/functions';
import { supabase } from '../../supabase/client';
import { message } from 'antd';
import { Navigate } from 'react-router-dom';
import { ethers } from "ethers";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import Web3 from "web3";
import { useMediaQuery } from 'react-responsive';

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
    const [notConnected, setNotConnected] = useState(false)
    const {user} = useAuth();
    const theme = useTheme();
    const navigate = useNavigate()
    const isDesktop = useMediaQuery({ query: '(min-width: 798px)' });
    /* const teamWalletAddress = "0xf09aF67f24b49d5078C9f1F243C55F88af11D746"; */
    console.log(walletBalance)
    /* useEffect(() => {
      if(walletBalance === null){
        setNotConnected(true)
      }
    }, [walletBalance]) */
 
    const closeDepositMenu = () => {
        setDepositMenu(false)
    }
    
    const sendTokens = async () => {
      setDepositMenu(false)
      const newProvider = await EthereumProvider.init({
        projectId: '87ce01feb918e3377f943f901349cd66', // Replace with your WalletConnect projectId
        chains: [9008],
        rpcMap: {
            9008: 'https://rpc-nodes.shidoscan.com', // Add the RPC URL here
          }, // Ethereum Mainnet chainId is 1
        showQrModal: true, // This will show the QR modal for mobile connection
        metadata: {
          name: "PACTON'S GAMING ZONE",
          description: 'A New Era of Gaming and Sports Betting',
          url: "https://pacgames-frontend.onrender.com",
          icons: ['https://i.postimg.cc/XJPDxF3H/Group-2.png'],
        },
      })
        message.info("Please confirm the transaction on your wallet")
        const recipientAddress = "0xf09aF67f24b49d5078C9f1F243C55F88af11D746"
        const tokenAddress = "0xf09aF67f24b49d5078C9f1F243C55F88af11D746";
        // Initialize Web3 with the provider
        let web3
        if(!provider){
          web3 = new Web3(newProvider)
        } else {
          web3 = new Web3(provider)
        }
      
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
          }).on('sent', sent => {
            console.log('Sent:', sent);
            
          })
          .on("transactionHash", (hash) => {
            console.log("Transaction sent with hash:", hash);
            Swal.fire({
              title: "Transaction Sent",
              text: `"Transaction sent with hash:" ${hash}`,
              icon: "info"
            });
          })
          .on("receipt", (receipt) => {
            console.log("Transaction confirmed:", receipt);
            
          })
          .on('confirmation', confirmation => {
            console.log('Confirmation:', confirmation);
            setBalance((prevBal) => prevBal + amount)
            setDepositMenu(false)
            writeData();
            Swal.fire({
              title: "Transaction Confirmed",
              text: "Your balance has been updated.",
              icon: "success"
            });
            process.exit(0);
            
          })
          .on("error", (error) => {
            console.error("Transaction error:", error);
            Swal.fire({
              title: "Transaction Failed",
              text: error.message,
              icon: "error"
            });
          });
          
          console.log(`Transaction successful:`, transaction);
          return transaction; // Return transaction details if needed
        } catch (error) {
          console.log(error.message)
          
          if (error.message.includes("User denied transaction")) {
            console.log("Transaction rejected by user.");
            Swal.fire({
              title: "Transaction Rejected",
              text: "You canceled the transaction.",
              icon: "error",
              confirmButtonColor: "#d33",
              confirmButtonText: "OK"
            });
          } else if (error.message.includes("insufficient funds")) {
            console.error("Insufficient funds for transaction:", error);
            Swal.fire({
              title: "Insufficient Funds",
              text: "You do not have enough tokens or gas for this transaction.",
              icon: "warning",
              confirmButtonColor: "#d33",
              confirmButtonText: "OK"
            });
          } else {
            // Generic error message for other issues
            console.error("Error sending tokens:", error);
            Swal.fire({
              title: "Transaction Failed",
              text: error.message,
              icon: "error",
              confirmButtonColor: "#d33",
              confirmButtonText: "OK"
            });
          }
        }
      };

      const writeData = async () => {
        const newBalance = (amount / 11620 * 1000)
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            console.log('data:', data)
            const userJsonData = data[0].deposits || {}; 
            const userJsonBalance = data[0].appBalance
            userJsonData.deposits = userJsonData.deposits || []; 
            console.log(userJsonData)
            const dateNow = new Date();
            const lastBalance = userJsonBalance + newBalance
            console.log(lastBalance)
            const updatedData = {
                name: user.user_metadata.name,
                avatar: user.user_metadata.avatar_url,
                email: user.email,
                walletAddress: account,
                user_id: user.id,
                amount: amount,
                token: "SHO",
                date: dateNow
            }
            userJsonData.deposits.push(updatedData);
            const { error: updateError } = await supabase
                    .from('users')
                    .update({ deposits: userJsonData, appBalance: lastBalance }) // Update the jsonb column
                    .eq('id', user.id); // Identify which user to update
    
                if (updateError) {
                    console.error('Error updating user data:', updateError.message);
                } else {
                    console.log('User data updated successfully:', userJsonData);
                }
          }
    }

    


    const item={
        initial: { height: 0, opacity: 0 },
        animate: { minHeight: '100vh', opacity: 1, transition: { duration: 0.5 } },
        exit: { height: 0, opacity: 0, transition: { duration: 0.5 } }
    } 

    useEffect(() => {
        // Toggle body overflow based on isMenuOpen state
        if (depositMenu) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = ''; // Revert to original overflow
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
        };
    }, [depositMenu]);

  return (
    
    <StyledMenu variants={item}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
        <DepositBigTitle>RATIO: 11620 SHO - 1000 PGZ</DepositBigTitle>
     <CloseStats onClick={closeDepositMenu} /> 
     
        {notConnected ? (
          <DepositTitle>YOU HAVE TO CONNECT OR FUND YOUR WALLET FIRST</DepositTitle>
        ) : (
          <DepositWrapper>
            <DepositTitle>PACTON'S GAMING ZONE WALLET ADDRESS:</DepositTitle>
            <DepositTitle><LinkInputField disabled={true} value="0x75a8AC284299e362830c49615459EeD8f66C0265"/></DepositTitle>
            <SmallDepositTitle>SHO BALANCE IN WALLET: {parseFloat(walletBalance)}<span>SHO</span></SmallDepositTitle>
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
        )}
    </StyledMenu>
    
  )
}

export default DepositMenu
