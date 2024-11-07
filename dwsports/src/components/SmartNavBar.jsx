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
import Onboarding from '@metamask/onboarding';
import detectEthereumProvider from '@metamask/detect-provider';
import WalletConnectProvider from "@walletconnect/client";
import Web3 from 'web3';
import fantasy from '../assets/fantasy.png'
import deposit from '../assets/logos/deposit.png'
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
    const onboarding = new Onboarding();
    const [title, setTitle] = useState(null)
    const [description, setDescription] = useState(null)
    const [icon, setIcon] = useState(null)
    const [button, setButton] = useState(null)
    const [connectedAccount, setConnectedAccount] = useState(null)

    async function disconnectWallet() {
        setConnectedAccount(null)
        Swal.fire({
            title: "Disconnected!",
            text: "Your Wallet is now disconnected",
            icon: "success"
          });
        if (window.ethereum) {
            window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
        
    }

    

    const onClickInstallMetaMask = async () => {
        console.log(title)
        if(title === "You need to Install a Wallet"){
            onboarding.startOnboarding();
        } else if(title === "Connect your wallet") {
            const provider = await detectEthereumProvider();
            if (provider && provider.isMetaMask) {
                console.log('MetaMask is installed!');
                try {
                    const accounts = await provider.request({ method: 'eth_requestAccounts' });
                    console.log('Connected account:', accounts[0]);
                    setConnectedAccount(accounts[0])
                    Swal.fire({
                        title: "Connected!",
                        text: "Your Wallet is now connected",
                        icon: "success"
                      });
                } catch (error) {
                    console.error('User denied account access:', error);
                }
            }
        }
    }

    const checkMetamask = async () => {
        const result = await Swal.fire({
            title: title,
            text: description,
            icon: icon,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: button
          }).then((result) => {
            if (result.isConfirmed) {
                onClickInstallMetaMask();
            }
          });
      
        return result;
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

    const checkForWallet = async () => {
        const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
        alert("Is Mobile: " + isMobile); // Alert to check if it's mobile
    
        // Checking for MetaMask
        if (typeof window.ethereum !== 'undefined') {
            alert("MetaMask is available");
    
            // If it's mobile, you can proceed with connecting MetaMask
            if (isMobile) {
                alert("MetaMask detected on Mobile");
    
                // Change UI or provide instruction to connect
                setTitle("Connect your wallet");
                setDescription("Please connect your MetaMask wallet.");
                setButton("Connect MetaMask");
                setIcon("warning");
    
                // Example for BNB Chain
                const BNB_CHAIN_PARAMS = {
                    chainId: '0x38', // 56 in hexadecimal for Binance Smart Chain mainnet
                    chainName: 'Binance Smart Chain',
                    nativeCurrency: {
                        name: 'Binance Coin',
                        symbol: 'BNB',
                        decimals: 18,
                    },
                    rpcUrls: ['https://bsc-dataseed.binance.org/'], // Mainnet RPC URL
                    blockExplorerUrls: ['https://bscscan.com'],
                };
    
                try {
                    alert("Attempting to switch to BNB Chain..."); // Alert before attempting to switch
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: BNB_CHAIN_PARAMS.chainId }],
                    });
                    alert('Successfully connected to Binance Smart Chain');
                } catch (error) {
                    if (error.code === 4902) {
                        // If BNB chain is not added, add it
                        alert("BNB Chain not found. Trying to add BNB Chain...");
                        try {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [BNB_CHAIN_PARAMS],
                            });
                            alert('BNB Chain added to MetaMask and connected');
                        } catch (addError) {
                            alert('Failed to add BNB Chain to MetaMask: ' + addError.message);
                        }
                    } else {
                        alert('Error while switching to Binance Smart Chain: ' + error.message);
                    }
                }
    
                // Listen for chain change
                window.ethereum.on('chainChanged', (chainId) => {
                    alert('Network changed: ' + chainId); // Alert when the network changes
                });
    
            } else {
                // For desktop, no specific action is needed other than detecting MetaMask
                alert("MetaMask detected on Desktop");
            }
    
        } else {
            // MetaMask is not detected, suggest installation
            alert("MetaMask is not detected. Prompting user to install it.");
    
            // Provide instructions to open MetaMask manually on mobile
            if (isMobile) {
                alert("Please open the MetaMask app and make sure it's connected.");
            }
    
            setTitle("You need to Install a Wallet");
            setDescription("We recommend the MetaMask wallet.");
            setButton("Install MetaMask");
            setIcon("warning");
    
            // Provide fallback option to connect via WalletConnect if MetaMask is not available
            alert("Alternatively, use WalletConnect to connect your wallet.");
        }
    };

    useEffect(() => {
        checkForWallet();
    }, [])

    

    

  return (
    <SmartNav scrollNavDown={scrollNavDown}>
        <IconButton onClick={isOpen}><Burguer /></IconButton>
        {/* <TonConnectButton /> */}
        {connectedAccount === null ? <img src={metamask} alt="metamask" onClick={checkMetamask}/> : <WalletAddressButton onClick={disconnectMetamask}>{connectedAccount}</WalletAddressButton>}
        <AnimatePresence>
            {open && (
                <StyledMenu scrollNavDown={scrollNavDown} variants={item} 
                initial="initial"
                animate="animate"
                exit="exit">
                     <IconButton onClick={isOpen}><CloseBurguer /></IconButton>
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
                              transition={{ delay: 0.9 }} >
                              <StaggerImageHolder><img src={fantasy} alt="fantasy" /></StaggerImageHolder>
                              <StaggerAvatarName>{t("navbar.fantasy")}</StaggerAvatarName>
                          </StaggerRow></LinkR>
                          <LinkR to="/casino"><StaggerRow initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: -60 }}
                              transition={{ delay: 1.1 }} >
                              <StaggerImageHolder><img src={chip} alt="casino" /></StaggerImageHolder>
                              <StaggerAvatarName>CASINO</StaggerAvatarName>
                          </StaggerRow></LinkR>
                          <StaggerRow initial={{ opacity: 0, y: 40 }} onClick={() => setDepositMenu(true)}
                              animate={{ opacity: 1, y: -60 }}
                              transition={{ delay: 1.3 }} >
                              <StaggerImageHolder><img src={deposit} alt="fantasy" /></StaggerImageHolder>
                              <StaggerAvatarName>{t("navbar.deposit")}</StaggerAvatarName>
                          </StaggerRow>
                          <StaggerRow initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: -60 }}
                              transition={{ delay: 1.5 }}> 
                          <StaggerImageHolder>
                          {theme === 'dark' ? <LightIcon onClick={toggleTheme}/> : <DarkIcon onClick={toggleTheme}/>}
                          </StaggerImageHolder>
                          <StaggerAvatarName>{t("navbar.switch")}</StaggerAvatarName>
                          </StaggerRow>
                      </StaggerContainer>
                </StyledMenu>
            )}
        </AnimatePresence>
    </SmartNav>
  )
}

export default SmartNavBar
