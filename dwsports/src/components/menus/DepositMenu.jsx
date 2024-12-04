import React,{useEffect, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import { CloseStats,BetSection,DepositWrapper,LinkInputField,SmallDepositTitle,DepositTitle,DepositBigTitle,BalanceWrapper, DepositTokenRow, TokenColumn, TokenHolder, LogoHolder, TokenNameHolder, DepositTokenFrom, DepositTokenToken, SmallLogoHolder, InputHolder, InputInput, DepositTokenRowSmall, SmallDepositWrapper, FromTitle } from './index' 
import {BetInput, StyledMenu} from '../../components/index'
import { StyledButton } from '../../pages';

import Swal from "sweetalert2";
import  { useTheme } from 'styled-components'
import { useNavigate } from 'react-router-dom'
/* import TonWeb from 'tonweb'; */
import axios from 'axios';
import { FantasyState } from '../../context/FantasyContext';
import {  useAuth } from '../../pages/functions';
import { supabase } from '../../supabase/client';
import { message } from 'antd';
import { Navigate } from 'react-router-dom';
import { ethers } from "ethers";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import Web3 from "web3";
import { useMediaQuery } from 'react-responsive';
import Toncula from '../../assets/logos/toncula.jpg'
import Ton from '../../assets/logos/ton.png'
import Sho from '../../assets/logos/sho.png'
import PGZ from '../../assets/logos/pgz.png'
import { toast } from 'react-toastify';
import TonWeb from 'tonweb'
import { Address, beginCell, internal, storeMessageRelaxed, toNano } from '@ton/ton';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { mnemonicToKeyPair } from "tonweb-mnemonic";
import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";
import { TonConnect } from "@tonconnect/sdk";
const DepositMenu = ({isDepositExpanded,setIsDepositExpanded}) => {



  const getTONPrice = () => {
    const tonPrice = localStorage.getItem("tonPrice")
    console.log(tonPrice)
    if(tonPrice === null){
      const options = {
        method: 'GET',
        headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-3qkmGTgTWXenAouD9JshQYt6'}
      };
      
      fetch('https://api.coingecko.com/api/v3/coins/the-open-network', options)
        .then(res => res.json())
        .then(res => {
          setTonPrice(res.market_data.current_price.usd)
          localStorage.setItem("tonPrice", JSON.stringify(res.market_data.current_price.usd))
          console.log("coming from api")
        })
        .catch(err => console.error(err));
    } else {
      setTonPrice(JSON.parse(tonPrice))
      console.log("coming from local")
    }
    
  }

  useEffect(() => {
    getTONPrice();
  }, [])

    const tokens = [
      { name: 'SHO', logo: Sho, ratio: '7040' },
      { name: 'TON', logo: Ton, ratio: '0.189893' },
      { name: 'TNcula', logo: Toncula, ratio: '0.189893' }
    ];
    const [activeToken, setActiveToken] = useState("SHO");
    const [selectedToken, setSelectedToken] = useState(tokens[0])
    const [amount, setAmount] = useState(0);
    const [tonAmount, setTonAmount] = useState(0)
    const [tonculaAmount, setTonculaAmount] = useState(0)
    const [tonConnectUI, setOptions] = useTonConnectUI();
    const [transactionStatus, setTransactionStatus] = useState('');
    const [client, setClient] = useState(null);
    const wallet = useTonWallet();
    const {balance, setBalance} = FantasyState();
    const {walletBalance,setWalletBalance} = FantasyState();
    const {metaMaskWalletAddress, setMetaMaskWalletAddress} = FantasyState();
    const {tonWalletAddress, setTonWalletAddress} = FantasyState();
    const {tonculaWalletBalance,setTonculaWalletBalance} = FantasyState();
    const [transactionHash, setTransactionHash] = useState(null);
    const [notConnected, setNotConnected] = useState(false)
    const {user} = useAuth();
    const theme = useTheme();
    const navigate = useNavigate()
    const [provider, setProvider] = useState(null);
    const isDesktop = useMediaQuery({ query: '(min-width: 1100px)' });
    const [tonPrice, setTonPrice] = useState(null)
    const [shoPrice, setShoPrice] = useState(0.0001408)
    const [tonculaPrice, setTonculaPrice] = useState(0.0002357)
    const [senderWalletAddress, setSenderWalletAddress] = useState(null)
    const [recipientWalletAddress, setRecipientWalletAddress] = useState(null)
    
    
    const closeDepositMenu = () => {
      setIsDepositExpanded(false)
    }

    const sendTokens = async () => {
      const tokenAddress = "0xf09aF67f24b49d5078C9f1F243C55F88af11D746";
      const recipientAddress = "0x75a8AC284299e362830c49615459EeD8f66C0265";
      if (typeof window.ethereum === 'undefined') {
        console.log('MetaMask is not installed');
        return;
      }
      if(amount === 0){
        toast('Please enter any amount of SHO');
        return
      }
      if(isDesktop){
          const web3 = new Web3(window.ethereum);
          try {
            // Request user connection to MetaMask
            await window.ethereum.request({ method: 'eth_requestAccounts' });
    
            // Get the current account
            const accounts = await web3.eth.getAccounts();
            const sender = accounts[0];
    
            // Define the ABI for the ERC-20 token contract (limited to 'transfer')
            const erc20Abi = [
              {
                constant: false,
                inputs: [{ name: "_to", type: "address" }, { name: "_value", type: "uint256" }],
                name: "transfer",
                outputs: [{ name: "success", type: "bool" }],
                type: "function",
              },
              { constant: true, inputs: [], name: "decimals", outputs: [{ name: "", type: "uint8" }], type: "function" },
            ];
    
            // Create a contract instance for the token
            const tokenContract = new web3.eth.Contract(erc20Abi, tokenAddress);
    
            // Convert the amount to the token's decimal format (default 18 decimals)
            const decimals = await tokenContract.methods.decimals().call();
          const decimalsBigInt = BigInt(decimals);
          const str = amount.toString();
          const amountToSend = BigInt(str) * BigInt(10) ** decimalsBigInt;
          
          // Send the transaction
          const transaction = await tokenContract.methods
            .transfer(recipientAddress, amountToSend.toString())
            .send({ from: metaMaskWalletAddress })
            .on("transactionHash", (hash) => {
              console.log("Transaction sent with hash:", hash);
              return Swal.fire({
                title: "Transaction Sent",
                text: `Transaction sent with hash: ${hash}`,
                icon: "info",
              })
            })
            .on("receipt", (receipt) => {
              console.log("Transaction confirmed:", receipt);
              setBalance((prevBal) => prevBal + amount);
              closeDepositMenu()
              writeData((1000 * amount / (1/shoPrice)),amount,"SHO",metaMaskWalletAddress,shoPrice);
              return Swal.fire({
                title: "Transaction Confirmed",
                text: "Your balance has been updated.",
                icon: "success",
              })
            })
            .on("error", (error) => {
              if (error.message.includes("User denied transaction")) {
                return Swal.fire({
                  title: "Transaction Rejected",
                  text: "You canceled the transaction.",
                  icon: "error",
                  confirmButtonColor: "#d33",
                  confirmButtonText: "OK",
                })
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
      
          return transaction; 
        } catch (error) {
          console.error("General Error:", error)
          Swal.fire({
            title: "Transaction Failed",
            text: error.message || "An unknown error occurred.",
            icon: "error",
            confirmButtonColor: "#d33",
            confirmButtonText: "OK",
          });
        }
          
      } 
      else {
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
        const web3 = new Web3(newProvider)
        try {
          closeDepositMenu();
          
      
          // Show confirmation prompt to user
          toast("Please confirm the transaction on your wallet");
      
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
            .send({ from: metaMaskWalletAddress })
            .on("transactionHash", (hash) => {
              console.log("Transaction sent with hash:", hash);
              return Swal.fire({
                title: "Transaction Sent",
                text: `Transaction sent with hash: ${hash}`,
                icon: "info",
              })
            })
            .on("receipt", (receipt) => {
              console.log("Transaction confirmed:", receipt);
              setBalance((prevBal) => prevBal + amount);
              closeDepositMenu()
              writeData((1000 * amount / (1/shoPrice)),amount,"SHO",metaMaskWalletAddress,shoPrice);
              return Swal.fire({
                title: "Transaction Confirmed",
                text: "Your balance has been updated.",
                icon: "success",
              })
            })
            .on("error", (error) => {
              if (error.message.includes("User denied transaction")) {
                return Swal.fire({
                  title: "Transaction Rejected",
                  text: "You canceled the transaction.",
                  icon: "error",
                  confirmButtonColor: "#d33",
                  confirmButtonText: "OK",
                })
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
        
    }

    const writeData = async (balance,amount,token,address,price) => {
        const newBalance = balance
        const gpz = (1000 * amount / (1/price))
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
            setBalance(lastBalance)
            console.log(lastBalance)
            const updatedData = {
                name: user.user_metadata.name,
                avatar: user.user_metadata.avatar_url,
                email: user.email,
                walletAddress: address,
                user_id: user.id,
                amount: amount,
                token: token,
                date: dateNow,
                gpz: gpz
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

    const handleSendTransaction = () => {
      // Transaction details based on tonConnectUI structure
      if(tonAmount > 0){
        closeDepositMenu()
          
      
          // Show confirmation prompt to user
        toast('Please confirm the transaction \n on your wallet');
      const myTransaction = {
          validUntil: Math.floor(Date.now() / 1000) + 60, // Transaction expiration in 60 seconds
          messages: [
              {
                  address: 'UQDrPy40C4Aea1jXRJqDRkNwg2apTNyVAx39gu7VEJeAgp7g', // Recipient Address
                  amount: (tonAmount * 1e9).toString(), // Amount in nanoTONs, here 1.5 TON
              },
          ],
      };
      try {
          tonConnectUI.sendTransaction(myTransaction)
              .then(() => {
                  setTransactionStatus('Transaction sent successfully.');
                  writeData((1000 * tonAmount / (1/tonPrice)),tonAmount,"TON",tonWalletAddress,tonPrice);
                  return Swal.fire({
                    title: "Transaction Confirmed",
                    text: "Your balance has been updated.",
                    icon: "success",
                  })
              })
              .catch(error => {
                  console.error('Transaction failed:', error);
                  if(error.message.includes("User rejects the action")){
                    return Swal.fire({
                      title: "Transaction Rejected",
                      text: "You have rejected the transaction",
                      icon: "error",
                    })
                  }
                  setTransactionStatus(`Transaction failed: ${error.message}`);
              });
      } catch (error) {
          console.error('Transaction initiation failed:', error);
          setTransactionStatus(`Transaction initiation failed: ${error.message}`);
      }
      } else {
        toast('Please enter any amount of TON');
        return
      }
    };

    

      async function fetchJettonWalletAddress(jettonMasterAddress, ownerWalletAddress) {
        const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', { apiKey: '481d4304fa46d936c86c12e75e678243252bfcef2e71941ae1bbb986411d2b5c' }));
        console.log(tonweb)
        try {
          const jettonMinter = new TonWeb.token.jetton.JettonMinter(tonweb.provider, {
            address: jettonMasterAddress
          });
          const jettonWalletAddress = await jettonMinter.getJettonWalletAddress(
            new TonWeb.utils.Address(ownerWalletAddress)
          );
          const recipientWalletAddress = await jettonMinter.getJettonWalletAddress(
            new TonWeb.utils.Address("UQDrPy40C4Aea1jXRJqDRkNwg2apTNyVAx39gu7VEJeAgp7g")
          );
          const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
            address: jettonWalletAddress
          });
          /* const jettonData = await jettonWallet.getData();
          if (jettonData.jettonMinterAddress.toString(false) !== jettonMinter.address.toString(false)) {
            throw new Error('Jetton minter address from jetton wallet does not match the expected minter address');
          } */
          setSenderWalletAddress(jettonWalletAddress.toString(true, true, true))
          setRecipientWalletAddress(recipientWalletAddress.toString(true, true, true))
          console.log('Jetton wallet address:', jettonWalletAddress.toString(true, true, true));
          console.log('recipientWalletAddress wallet address:', recipientWalletAddress.toString(true, true, true));
          const masterAddress = jettonWalletAddress.toString(true, true, true)
          fetchJettonBalance(masterAddress,tonweb)
        } catch (error) {
          console.error('Error fetching jetton wallet address:', error);
        }
      }

      async function fetchJettonBalance(walletAddress,tonweb) {
        try {
          const jettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, { address: walletAddress });
          const data = await jettonWallet.getData();
  
          console.log('Jetton balance:', data.balance.toString());
          setTonculaWalletBalance(parseFloat(data.balance.toString() / 1e9).toFixed(2))
          console.log('Jetton owner address:', data.ownerAddress.toString(true, true, true));
        } catch (error) {
          console.error('Error fetching jetton balance:', error);
        }
      }

      const fetchTonculaBalance = () => {
        const jettonMasterAddress = "EQAt98Gs26LGMvdMJAUkUEPvHj7YSY8QaP40jLIN07M0ideh";
        fetchJettonWalletAddress(jettonMasterAddress,tonWalletAddress);
      }

      async function transferJettons() {
        const recipientWalletAddress = "EQA7lxWJ3NWRuZY0y0hm-X-XA-6br-z4zuxEKNayOaoruSEx"
        const jettonMasterAddress = "EQAt98Gs26LGMvdMJAUkUEPvHj7YSY8QaP40jLIN07M0ideh";
        const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC', { apiKey: 'my-api-key' }));
        try {
            // Initialize sender's JettonWallet instance
            const senderJettonWallet = new TonWeb.token.jetton.JettonWallet(tonweb.provider, {
                address: senderWalletAddress
            });
            console.log(senderJettonWallet)
    
            // Specify the amount to transfer in nanoton
            const amountInNanoton = BigInt(tonculaAmount * 1e9);

            /* const transferBody = await senderJettonWallet.createTransferBody({
              toAddress: recipientWalletAddress, // Jetton wallet address of the recipient
              amount: amountInNanoton, // Amount to transfer
              forwardAmount: BigInt(0), // Forward TON to recipient (optional, usually 0)
              payload: null // Optional payload
            }) */

            const wallet = tonweb.wallet.create({
              publicKey: tonWalletKeyPair.publicKey
            });

            console.log(wallet)
  
          const seqno = await wallet.getSeqno();
  
          // Send the transaction
          const sendResult = await wallet.transfer({
              secretKey: tonWalletKeyPair.secretKey, // Sender's secret key
              toAddress: senderWalletAddress, // Sender's jetton wallet address
              amount: TonWeb.utils.toNano(0.05), // TON for gas fees
              seqno: seqno,
              payload: transferBody
          });
  
          console.log('Jetton transfer initiated:', sendResult);
    
            // Perform the transfer
            
        } catch (error) {
            console.error('Error transferring jettons:', error);
        }
    }
    

      useEffect(() => {
        if(activeToken === "TNcula"){
          fetchTonculaBalance();
        }
      }, [activeToken])

    const item={
        initial: { opacity: 0 },
        animate: {  opacity: 1, transition: {  duration: 1, delay: 0.5 } },
        exit: { opacity: 0, transition: { duration: 1, delay: 0.5 } }
    } 

    const handleButtonClick = (token) => {
      setActiveToken(token.name)
      setSelectedToken(token)
    }

    useEffect(() => {
      if(activeToken === "Tncula"){
        
      }
    })

  return (
    
    <StyledMenu variants={item}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{alignItems: 'center', overflow: 'hidden', paddingTop: '80px', zIndex: 1000}}>
        <DepositBigTitle>Select the token <br/> you want to deposit</DepositBigTitle>
     <CloseStats onClick={closeDepositMenu} /> 
      <DepositBigTitle>
        {tokens.map((token) => {
          return(
        <TokenColumn>
        <TokenHolder disabled={activeToken === token.name} 
        onClick={() => handleButtonClick(token)}
        style={{
          boxShadow: activeToken === token.name ? `${theme.pacBoxShadow}` : ``,
          border: activeToken === token.name ? `1px solid ${theme.MainAccent}` : ``,
        }}>
          <LogoHolder><img src={token.logo} alt="" style={{borderRadius: '50%'}}/></LogoHolder>
          <TokenNameHolder><h2 style={{
          color: activeToken === token.name ? `${theme.MainAccent}` : `${theme.text}`,
        }}>{token.name}</h2></TokenNameHolder>
        </TokenHolder>
        </TokenColumn>
          )
        })}
      </DepositBigTitle>
        {(tonPrice && activeToken === "TON") &&  (
        <DepositWrapper>
          <DepositTokenRow>
            <DepositTokenFrom><h2>From:</h2></DepositTokenFrom>
            <DepositTokenToken>
              <SmallLogoHolder><img src={selectedToken.logo} alt="" /></SmallLogoHolder>
              <SmallLogoHolder><h2>{selectedToken.name}</h2></SmallLogoHolder>
              <InputHolder><InputInput type="number" placeholder='0.0' onChange={(e) => setTonAmount(e.target.value)}></InputInput></InputHolder>
            </DepositTokenToken>
          </DepositTokenRow>
          <DepositTokenRow>
            <DepositTokenFrom><h2>To:</h2></DepositTokenFrom>
            <DepositTokenToken>
              <SmallLogoHolder><img src={PGZ} alt="" /></SmallLogoHolder>
              <SmallLogoHolder><h2>PGZ</h2></SmallLogoHolder>
              <InputHolder><InputInput type="number" disabled={true} defaultValue="0.0" value={parseFloat((1000 * tonAmount / (1/tonPrice)).toFixed(2))}></InputInput></InputHolder>
            </DepositTokenToken>
          </DepositTokenRow>
        </DepositWrapper>
        )}
        {(shoPrice && activeToken === "SHO") &&  (
        <DepositWrapper>
          <DepositTokenRow>
            <DepositTokenFrom><h2>From:</h2></DepositTokenFrom>
            <DepositTokenToken>
              <SmallLogoHolder><img src={selectedToken.logo} alt="" /></SmallLogoHolder>
              <SmallLogoHolder><h2>{selectedToken.name}</h2></SmallLogoHolder>
              <InputHolder><InputInput type="number" placeholder='0.0' onChange={(e) => setAmount(e.target.value)}></InputInput></InputHolder>
            </DepositTokenToken>
          </DepositTokenRow>
          <DepositTokenRow>
            <DepositTokenFrom><h2>To:</h2></DepositTokenFrom>
            <DepositTokenToken>
              <SmallLogoHolder ><img src={PGZ} alt="" /></SmallLogoHolder>
              <SmallLogoHolder><h2>PGZ</h2></SmallLogoHolder>
              <InputHolder><InputInput type="number" disabled={true} value={1000 * amount / (1/shoPrice)}></InputInput></InputHolder>
            </DepositTokenToken>
          </DepositTokenRow>
        </DepositWrapper>
        )}
        {(tonculaPrice && activeToken === "TNcula") &&  (
        <DepositWrapper>
          <DepositTokenRow>
            <DepositTokenFrom>
              <FromTitle><h2>From:</h2></FromTitle>
              <FromTitle style={{padding: '0 0 0 25px'}}>{tonWalletAddress ? <h2>{tonculaWalletBalance} TNcula</h2> : <h2>Connect Your Wallet</h2>}</FromTitle>
            </DepositTokenFrom>
            <DepositTokenToken >
              <SmallLogoHolder><img src={selectedToken.logo} alt="" style={{borderRadius: '50%', width: '60%'}}/></SmallLogoHolder>
              <SmallLogoHolder><h2>{selectedToken.name}</h2></SmallLogoHolder>
              <InputHolder><InputInput type="number" placeholder='0.0' onChange={(e) => setTonculaAmount(e.target.value)}></InputInput></InputHolder>
            </DepositTokenToken>
          </DepositTokenRow>
          <DepositTokenRow>
            <DepositTokenFrom><h2>To:</h2></DepositTokenFrom>
            <DepositTokenToken>
              <SmallLogoHolder ><img src={PGZ} alt="" /></SmallLogoHolder>
              <SmallLogoHolder><h2>PGZ</h2></SmallLogoHolder>
              <InputHolder><InputInput type="number" disabled={true} value={1000 * tonculaAmount / (1/tonculaPrice)}></InputInput></InputHolder>
            </DepositTokenToken>
          </DepositTokenRow>
        </DepositWrapper>
        )}
        {(tonPrice && activeToken === "TON") && (
          <DepositWrapper>
            <DepositTokenRowSmall>
            <h2>Current TON Price: <br/><span>{tonPrice} USDT</span></h2>
            </DepositTokenRowSmall>
            <DepositTokenRowSmall><StyledButton style={{fontSize: '18px'}} onClick={handleSendTransaction}>DEPOSIT</StyledButton></DepositTokenRowSmall>
          </DepositWrapper>
        )}
        {(tonPrice && activeToken === "SHO") && (
          <DepositWrapper>
            <DepositTokenRowSmall>
            <h2>Current SHO Price: <br/><span>{shoPrice} USDT</span></h2>
            </DepositTokenRowSmall>
            <DepositTokenRowSmall><StyledButton onClick={sendTokens} style={{fontSize: '18px'}}>DEPOSIT</StyledButton></DepositTokenRowSmall>
          </DepositWrapper>
        )}
        {(tonculaPrice && activeToken === "TNcula") && (
          <DepositWrapper>
            <DepositTokenRowSmall>
            <h2>Current TNcula Price: <br/><span>{tonculaPrice} USDT</span></h2>
            </DepositTokenRowSmall>
            <DepositTokenRowSmall><StyledButton onClick={transferJettons /* () => tonConnectUI.sendTransaction(myTransaction) */} style={{fontSize: '18px'}}>DEPOSIT</StyledButton></DepositTokenRowSmall>
          </DepositWrapper>
        )}
        <DepositWrapper>
        <DepositTokenRowSmall>
            <h2>If you find any trouble with your deposit, you can always do it manually in our bot.</h2>
            </DepositTokenRowSmall>
            <DepositTokenRowSmall><a href="https://t.me/PactonGamingZoneBot" target="_blank"><StyledButton>GO TO BOT</StyledButton></a></DepositTokenRowSmall>
        </DepositWrapper>
    </StyledMenu>
    
  )
}

export default DepositMenu
