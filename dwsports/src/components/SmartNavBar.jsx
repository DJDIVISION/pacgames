import React, {useState,useEffect} from 'react'
import {Nav,NavColumn,NavIcon,NavText,SmartNav,Burguer,CloseBurguer,StaggerContainer,StaggerRow,
    StaggerAvatarRow,StaggerAvatarHolder,StaggerAvatarName,StaggerImageHolder,TonWrapper,WalletAddressButton,
    CustomIconButton,
    LightIcon,StyledMenu,Language,
    DarkIcon
} from './index'
import { TonConnectButton, TonConnectUIProvider, useTonConnectUI, useTonWallet, useTonAddress } from '@tonconnect/ui-react';
import { TonClient, Address } from '@ton/ton';
import {Link as LinkR} from 'react-router-dom'
import {motion,AnimatePresence} from 'framer-motion'
import  { useTheme } from 'styled-components'
import sportsIcon from '../assets/sportsIcon.png'
import metamask from '../assets/logos/metamask.svg'
import chip from '../assets/chip.png'

import fantasy from '../assets/fantasy.png'
import deposit from '../assets/logos/shoDeposit.png'
import Swal from "sweetalert2";
import { Avatar, Fab, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client';
import { useAuth } from '../pages/functions'
import { FantasyState } from '../context/FantasyContext';
import DepositMenu from './menus/DepositMenu';
import ES from '../assets/svg/es.png';
import FR from '../assets/svg/fr.png';
import EN from '../assets/svg/uk.png';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDial from '@mui/material/SpeedDial';
import { useTranslation } from 'react-i18next'
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { ethers } from "ethers";
import Web3 from "web3";


const SmartNavBar = ({toggleTheme}) => {

    const languages = [
        {
            icon: <img src={ES} alt="ES" onClick={() => i18n.changeLanguage("es")} />,
            name: 'ES'
        },
        {
            icon: <img src={FR} alt="FR" onClick={() => i18n.changeLanguage("fr")} />,
            name: 'FR'
        },
        {
            icon: <img src={EN} alt="EN" onClick={() => i18n.changeLanguage("en")} />,
            name: 'EN'
        }
    ];
    const [t, i18n] = useTranslation("global");
    const [scrollNavDown, setScrollNavDown] = useState(false);
    const [open, setOpen] = useState(false);
    const theme = useTheme();
    const {depositMenu, setDepositMenu} = FantasyState();
    const [title, setTitle] = useState(null)
    const [description, setDescription] = useState(null)
    const [icon, setIcon] = useState(null)
    const [button, setButton] = useState(null)
    const {provider, setProvider} = FantasyState();
    const {account, setAccount} = FantasyState();
    const {balance, setBalance} = FantasyState();
    const {walletBalance,setWalletBalance} = FantasyState();
    const { user } = useAuth(); 
    const connectWallet = async () => {
        try {
          // Initialize the provider with the WalletConnect projectId and chainId
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
          });
    
          // Handle QR code URI display event
          newProvider.on('display_uri', (uri) => {
            console.log('Display URI:', uri);
          });
    
          // Connect to WalletConnect (this will display the QR code on mobile)
          await newProvider.connect();
          setProvider(newProvider); // Store the provider in state
    
          // Request user accounts after successful connection
          await newProvider.enable();
          const accounts = await newProvider.request({ method: "eth_requestAccounts" });
          if (accounts && accounts.length > 0) {
            setAccount(accounts[0]); 
            getTokenBalance(accounts[0], newProvider);
            const updatedData = {
              name: user.user_metadata.name,
              avatar: user.user_metadata.avatar_url,
              email: user.email,
              walletAddress: accounts[0],
              user_id: user.id
            }
            const { data, error } = await supabase
            .from('user_wallets')
            .insert([updatedData])
            if (error) {
              console.error('Error inserting/updating user session data:', error.message)
            } else {
              console.log('User session data saved:', data)
              Swal.fire({
                title: "Wallet Connected!",
                text: "Your Wallet is now connected",
                icon: "success"
              });
            }
            
          }
    
          console.log("Connected account:", accounts[0]);
        } catch (error) {
          console.error("Error connecting wallet:", error);
        }
      };

      const getTokenBalance = async (account, provider) => {
        if (!provider) {
          console.error("Provider is undefined.");
          return;
        }
      
        // Wrap the WalletConnect provider with Web3
        const web3 = new Web3(provider);
      
        const tokenAddress = "0xf09aF67f24b49d5078C9f1F243C55F88af11D746"; // Replace with your token's contract address
      
        // ERC-20 ABI for balanceOf and decimals
        const ERC20_ABI = [
            { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "type": "function" },
            { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "type": "function" }
          ];
        
          // Create the contract instance
          const tokenContract = new web3.eth.Contract(ERC20_ABI, tokenAddress);
        
          try {
            // Get balance and decimals
            const balance = await tokenContract.methods.balanceOf(account).call();
            const decimals = await tokenContract.methods.decimals().call();
        
            // Convert balance and decimals to BigInt for precise calculation
            const balanceBigInt = BigInt(balance);
            const decimalsBigInt = BigInt(decimals);
            const factor = BigInt(10) ** decimalsBigInt; // Equivalent to 10^decimals
        
            // Format balance to a human-readable format (divide by the decimals factor)
            const formattedBalance = balanceBigInt / factor;
            console.log(`Token balance for ${tokenAddress}: ${formattedBalance.toString()}`);
            setWalletBalance(formattedBalance.toString())
            return formattedBalance.toString(); // Return as string to avoid BigInt issues elsewhere
          } catch (error) {
            console.error("Error fetching token balance:", error);
          }
    };

    const writeData = async () => {
        const { data, error } = await supabase
          .from('users')
          .select('deposits')
          .eq('id', user.id)
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            console.log('data:', data)
            const userJsonData = data[0].deposits || {}; 
            userJsonData.deposits = userJsonData.deposits || []; 
            console.log(userJsonData)
            const updatedData = {
                name: user.user_metadata.name,
                avatar: user.user_metadata.avatar_url,
                email: user.email,
                walletAddress: account,
                user_id: user.id,
                amount: amount,
                token: "SHO"
            }
            userJsonData.deposits.push(updatedData);
            const { error: updateError } = await supabase
                    .from('users')
                    .update({ deposits: userJsonData }) // Update the jsonb column
                    .eq('id', user.id); // Identify which user to update
    
                if (updateError) {
                    console.error('Error updating user data:', updateError.message);
                } else {
                    console.log('User data updated successfully:', userJsonData);
                }
          }
    }

      
    
      // Function to disconnect the wallet
      const disconnectWallet = async () => {
        try {
          if (provider) {
            await provider.disconnect(); // Disconnect the WalletConnect session
            setProvider(null); // Clear the provider from state
            setAccount(null); // Clear the account address from state
            console.log("Disconnected from wallet");
          }
        } catch (error) {
          console.error("Error disconnecting wallet:", error);
        }
        Swal.fire({
            title: "Wallet Disconnected!",
            text: "Your Wallet is now disconnected",
            icon: "success"
          });
      };


    const disconnectMetamask = async () => {
        const result = await Swal.fire({
            title: "Disconnect MetaMask",
            text: "Click the button to disconnect your wallet",
            icon: icon,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Disconnect MetaMask"
          }).then((result) => {
            if (result.isConfirmed) {
                disconnectWallet();
            }
          });
      
        return result;
      };

      



    const isOpen = ()=>{
        setOpen(!open);
      }

    useEffect(() => {
       window.addEventListener('scroll', changeNavDown) 
    }, []);


    const changeNavDown = () => {
        if(window.scrollY >= 50) {
            setScrollNavDown(true); 
        } 
        else {
            setScrollNavDown(false)
        }
    }

    const item={
        initial: { height: 0, opacity: 0 },
        animate: { height: "100vh", opacity: 1, transition: { duration: 0.5 } },
        exit: { height: 0, opacity: 0, transition: { duration: 0.5 } }
    }

    useEffect(() => {
        // Toggle body overflow based on isMenuOpen state
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = ''; // Revert to original overflow
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = '';
        };
    }, [open]);


  return (
    <SmartNav scrollNavDown={scrollNavDown}>
        <IconButton onClick={isOpen}><Burguer /></IconButton>
        {/* <TonConnectButton /> */}
        {account === null ? <img src={metamask} alt="metamask" onClick={connectWallet}/> : <WalletAddressButton onClick={disconnectMetamask}>{account}</WalletAddressButton>}
        <AnimatePresence>
            {open && (
                <StyledMenu scrollNavDown={scrollNavDown} variants={item} 
                initial="initial"
                animate="animate"
                exit="exit" style={{justifyContent: 'center'}}>
                     <IconButton style={{position: 'absolute', top: '20px', left: '20px'}} onClick={isOpen}><CloseBurguer /></IconButton>
                     <StaggerContainer initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.3 },
                            },
                        }}>
                          <LinkR to="/bets"><StaggerRow initial={{ opacity: 0, y: 40 }} 
                              animate={{ opacity: 1, y: -60 }}
                              transition={{ delay: 0.7 }} >
                              <StaggerImageHolder><img src={sportsIcon} alt="sports" /></StaggerImageHolder>
                              <StaggerAvatarName>{t("navbar.sports")}</StaggerAvatarName>
                          </StaggerRow></LinkR>
                          <LinkR to="/fantasy"><StaggerRow initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: -60 }}
                              transition={{ delay: 0.8 }} >
                              <StaggerImageHolder><img src={fantasy} alt="fantasy" /></StaggerImageHolder>
                              <StaggerAvatarName>{t("navbar.fantasy")}</StaggerAvatarName>
                          </StaggerRow></LinkR>
                          {/* <LinkR to="/casino"><StaggerRow initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: -60 }}
                              transition={{ delay: 1.1 }} >
                              <StaggerImageHolder><img src={chip} alt="casino" /></StaggerImageHolder>
                              <StaggerAvatarName>CASINO</StaggerAvatarName>
                          </StaggerRow></LinkR> */}
                          <StaggerRow initial={{ opacity: 0, y: 40 }} onClick={() => {isOpen(); setDepositMenu(true);}}
                              animate={{ opacity: 1, y: -60 }}
                              transition={{ delay: 0.9 }} >
                              <StaggerImageHolder><img src={deposit} alt="fantasy" /></StaggerImageHolder>
                              <StaggerAvatarName>{t("navbar.deposit")}</StaggerAvatarName>
                          </StaggerRow>
                          <StaggerRow initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: -60 }}
                              transition={{ delay: 1 }}> 
                          <StaggerImageHolder>
                          {theme === 'dark' ? <LightIcon onClick={toggleTheme}/> : <DarkIcon onClick={toggleTheme}/>}
                          </StaggerImageHolder>
                          <StaggerAvatarName>{t("navbar.switch")}</StaggerAvatarName>
                          </StaggerRow>
                      </StaggerContainer>
                </StyledMenu>
            )}
            {depositMenu && (
                <DepositMenu depositMenu={depositMenu} setDepositMenu={setDepositMenu}/>
            )}
        </AnimatePresence>
    </SmartNav>
  )
}

export default SmartNavBar
