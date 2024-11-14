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
    const {account, setAccount} = FantasyState();
    const [transactionHash, setTransactionHash] = useState(null);
    const [notConnected, setNotConnected] = useState(false)
    const {user} = useAuth();
    const theme = useTheme();
    const navigate = useNavigate()
    const [provider, setProvider] = useState(null);
    const isDesktop = useMediaQuery({ query: '(min-width: 798px)' });
    /* const teamWalletAddress = "0xf09aF67f24b49d5078C9f1F243C55F88af11D746"; */
    console.log(walletBalance)
    const initializeProvider = async () => {
      try {
        if (provider) {
          await provider.disconnect(); // Ensure any previous sessions are disconnected
        }
        const newProvider = await EthereumProvider.init({
          projectId: '87ce01feb918e3377f943f901349cd66',
          chains: [9008],
          rpcMap: {
            9008: 'https://rpc-nodes.shidoscan.com',
          },
          showQrModal: true,
          metadata: {
            name: "PACTON'S GAMING ZONE",
            description: 'A New Era of Gaming and Sports Betting',
            url: "https://pacgames-frontend.onrender.com",
            icons: ['https://i.postimg.cc/J0LFkY8Z/logo.jpg'],
          },
        });
    
        newProvider.on("display_uri", (uri) => console.log("WalletConnect QR Code URI:", uri));
        setProvider(newProvider);
        console.log(newProvider)
      } catch (error) {
        console.error("Error initializing provider:", error);
      }
    };
    
    useEffect(() => {
      initializeProvider();
    }, []);
 
    const closeDepositMenu = () => {
        setDepositMenu(false)
    }

    const sendTokens = async () => {
        const recipientAddress = "0xf09aF67f24b49d5078C9f1F243C55F88af11D746";
        const tokenAddress = "0xf09aF67f24b49d5078C9f1F243C55F88af11D746";

        const web3 = new Web3(provider)
        try {
          setDepositMenu(false);
          
      
          // Show confirmation prompt to user
          message.info("Please confirm the transaction on your wallet");
      
          const ERC20_ABI = [
            {
              constant: false,
              inputs: [{ name: "_to", type: "address" }, { name: "_value", type: "uint256" }],
              name: "transfer",
              outputs: [{ name: "success", type: "bool" }],
              type: "function",
            },
            { constant: true, inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], type: "function" },
          ];
      
          const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
      
          // Get token decimals and convert amount
          const decimals = await tokenContract.methods.decimals().call();
          const decimalsBigInt = BigInt(decimals);
          const str = amount.toString();
          const amountToSend = BigInt(str) * BigInt(10) ** decimalsBigInt;
          
          // Send the transaction
          const transaction = await tokenContract.methods
            .transfer(recipientAddress, amountToSend.toString())
            .send({ from: account })
            .on("transactionHash", (hash) => {
              console.log("Transaction sent with hash:", hash);
              return Swal.fire({
                title: "Transaction Sent",
                text: `Transaction sent with hash: ${hash}`,
                icon: "info",
              });
            })
            .on("receipt", (receipt) => {
              console.log("Transaction confirmed:", receipt);
              setBalance((prevBal) => prevBal + amount);
              setDepositMenu(false);
              writeData();
              return Swal.fire({
                title: "Transaction Confirmed",
                text: "Your balance has been updated.",
                icon: "success",
              });
            })
            .on("error", (error) => {
              if (error.message.includes("User denied transaction")) {
                return Swal.fire({
                  title: "Transaction Rejected",
                  text: "You canceled the transaction.",
                  icon: "error",
                  confirmButtonColor: "#d33",
                  confirmButtonText: "OK",
                });
              } else if (error.message.includes("insufficient funds")) {
                return Swal.fire({
                  title: "Insufficient Funds",
                  text: "You do not have enough tokens or gas for this transaction.",
                  icon: "warning",
                  confirmButtonColor: "#d33",
                  confirmButtonText: "OK",
                });
              } else {
                console.error("Error sending tokens:", error);
                return Swal.fire({
                  title: "Transaction Failed",
                  text: error.message,
                  icon: "error",
                  confirmButtonColor: "#d33",
                  confirmButtonText: "OK",
                });
              }
            });
      
          return transaction; // Return transaction details if needed
      
        } catch (error) {
          console.error("General Error:", error);
          Swal.fire({
            title: "Transaction Failed",
            text: error.message || "An unknown error occurred.",
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: "OK",
          });
        }
        
    }
    
    /* const sendTokens = async () => {
      try {
        setDepositMenu(false);
        
    
        // Show confirmation prompt to user
        message.info("Please confirm the transaction on your wallet");
    
        const recipientAddress = "0xf09aF67f24b49d5078C9f1F243C55F88af11D746";
        const tokenAddress = "0xf09aF67f24b49d5078C9f1F243C55F88af11D746";
    
        let web3 = provider ? new Web3(provider) : new Web3(provider);
    
        const ERC20_ABI = [
          {
            constant: false,
            inputs: [{ name: "_to", type: "address" }, { name: "_value", type: "uint256" }],
            name: "transfer",
            outputs: [{ name: "success", type: "bool" }],
            type: "function",
          },
          { constant: true, inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], type: "function" },
        ];
    
        const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
    
        // Get token decimals and convert amount
        const decimals = await tokenContract.methods.decimals().call();
        const decimalsBigInt = BigInt(decimals);
        const str = amount.toString();
        const amountToSend = BigInt(str) * BigInt(10) ** decimalsBigInt;
    
        // Send the transaction
        const transaction = await tokenContract.methods
          .transfer(recipientAddress, amountToSend.toString())
          .send({ from: account })
          .on("transactionHash", (hash) => {
            console.log("Transaction sent with hash:", hash);
            return Swal.fire({
              title: "Transaction Sent",
              text: `Transaction sent with hash: ${hash}`,
              icon: "info",
            });
          })
          .on("receipt", (receipt) => {
            console.log("Transaction confirmed:", receipt);
            setBalance((prevBal) => prevBal + amount);
            setDepositMenu(false);
            writeData();
            return Swal.fire({
              title: "Transaction Confirmed",
              text: "Your balance has been updated.",
              icon: "success",
            });
          })
          .on("error", (error) => {
            if (error.message.includes("User denied transaction")) {
              return Swal.fire({
                title: "Transaction Rejected",
                text: "You canceled the transaction.",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "OK",
              });
            } else if (error.message.includes("insufficient funds")) {
              return Swal.fire({
                title: "Insufficient Funds",
                text: "You do not have enough tokens or gas for this transaction.",
                icon: "warning",
                confirmButtonColor: "#d33",
                confirmButtonText: "OK",
              });
            } else {
              console.error("Error sending tokens:", error);
              return Swal.fire({
                title: "Transaction Failed",
                text: error.message,
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "OK",
              });
            }
          });
    
        return transaction; // Return transaction details if needed
    
      } catch (error) {
        console.error("General Error:", error);
        Swal.fire({
          title: "Transaction Failed",
          text: error.message || "An unknown error occurred.",
          icon: "error",
          confirmButtonColor: "#d33",
          confirmButtonText: "OK",
        });
      }
    }; */

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
    style={{alignItems: 'center', overflow: 'hidden'}}>
        <DepositBigTitle style={{border: '1px solid red'}}>RATIO: 11620 SHO - 1000 PGZ</DepositBigTitle>
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
