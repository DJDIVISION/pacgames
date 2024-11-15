import React,{useEffect, useState} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import { CloseStats,BetSection,DepositWrapper,LinkInputField,SmallDepositTitle,DepositTitle,DepositBigTitle,BalanceWrapper, DepositTokenRow, TokenColumn, TokenHolder, LogoHolder, TokenNameHolder, DepositTokenFrom, DepositTokenToken, SmallLogoHolder, InputHolder, InputInput, DepositTokenRowSmall } from './index' 
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
import Ton from '../../assets/logos/ton.png'
import Sho from '../../assets/logos/sho.png'
import PGZ from '../../assets/logos/pgz.png'
import { toast } from 'react-toastify';

const DepositMenu = ({depositMenu,setDepositMenu}) => {

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
      { name: 'TON', logo: Ton, ratio: '0.189893' }
    ];
    const [activeToken, setActiveToken] = useState("SHO");
    const [selectedToken, setSelectedToken] = useState(tokens[0])
    const [amount, setAmount] = useState(0);
    const [tonAmount, setTonAmount] = useState(0)
    const [tonConnectUI, setOptions] = useTonConnectUI();
    const [transactionStatus, setTransactionStatus] = useState('');
    const [client, setClient] = useState(null);
    const wallet = useTonWallet();
    const {balance, setBalance} = FantasyState();
    const {walletBalance,setWalletBalance} = FantasyState();
    const {metaMaskWalletAddress, setMetaMaskWalletAddress} = FantasyState();
    const [transactionHash, setTransactionHash] = useState(null);
    const [notConnected, setNotConnected] = useState(false)
    const {user} = useAuth();
    const theme = useTheme();
    const navigate = useNavigate()
    const [provider, setProvider] = useState(null);
    const isDesktop = useMediaQuery({ query: '(min-width: 798px)' });
    const [tonPrice, setTonPrice] = useState(null)
    const [shoPrice, setShoPrice] = useState(0.0001408)
    
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
      } catch (error) {
        console.error("Error initializing provider:", error);
      }
    };
    
    /* useEffect(() => {
      initializeProvider();
    }, []); */
 
    const closeDepositMenu = () => {
        setDepositMenu(false)
    }

    const sendTokens = async () => {
        const recipientAddress = "0x75a8AC284299e362830c49615459EeD8f66C0265";
        const tokenAddress = "0xf09aF67f24b49d5078C9f1F243C55F88af11D746";
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
          setDepositMenu(false);
          
      
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
              setDepositMenu(false);
              writeData();
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
        const newBalance = (amount / 7040 * 1000)
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
                walletAddress: metaMaskWalletAddress,
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

    const handleButtonClick = (token) => {
      setActiveToken(token.name)
      setSelectedToken(token)
    }

  return (
    
    <StyledMenu variants={item}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{alignItems: 'center', overflow: 'hidden', paddingTop: '80px'}}>
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
          <LogoHolder><img src={token.logo} alt="" /></LogoHolder>
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
              <LogoHolder style={{ width: '20%' }}><img src={PGZ} alt="" /></LogoHolder>
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
              <LogoHolder style={{ width: '20%' }}><img src={PGZ} alt="" /></LogoHolder>
              <SmallLogoHolder><h2>PGZ</h2></SmallLogoHolder>
              <InputHolder><InputInput type="number" disabled={true} value={1000 * amount / (1/shoPrice)}></InputInput></InputHolder>
            </DepositTokenToken>
          </DepositTokenRow>
          {/* <DepositTitle>PACTON'S GAMING ZONE WALLET ADDRESS:</DepositTitle>
          <DepositTitle><LinkInputField disabled={true} value="0x75a8AC284299e362830c49615459EeD8f66C0265"/></DepositTitle>
          <SmallDepositTitle>SHO BALANCE IN WALLET: {parseFloat(walletBalance)}<span>SHO</span></SmallDepositTitle>
          <DepositTitle>AMOUNT TO DEPOSIT:</DepositTitle>
          <DepositTitle><BetInput style={{borderRadius: '10px'}} value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}/></DepositTitle>
          <DepositTitle>
              <StyledButton onClick={sendTokens} style={{fontSize: '18px'}}>DEPOSIT</StyledButton>
          </DepositTitle>
          <span>{transactionStatus}</span> */}
        </DepositWrapper>
        )}
        {(tonPrice && activeToken === "TON") && (
          <DepositWrapper>
            <DepositTokenRowSmall>
            <h2>Current TON Price: <br/><span>{tonPrice} USDT</span></h2>
            </DepositTokenRowSmall>
            <DepositTokenRowSmall><StyledButton style={{fontSize: '18px'}}>DEPOSIT</StyledButton></DepositTokenRowSmall>
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
    </StyledMenu>
    
  )
}

export default DepositMenu
