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
        // Replace with your Infura API key
        const INFURA_API_KEY = "513e757c3e244d1982a1c3854e286141";
    
        // Detect if MetaMask (or any Ethereum wallet) is installed
        if (typeof window.ethereum !== 'undefined') {
            setTitle("Connect your wallet");
            setDescription("To begin, please connect your MetaMask wallet");
            setButton("Connect MetaMask");
            setIcon("warning");
    
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
    
            // Try to switch the network to BNB Chain
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: BNB_CHAIN_PARAMS.chainId }],
                });
                console.log('Successfully connected to Binance Smart Chain');
            } catch (error) {
                if (error.code === 4902) {
                    // Add BNB Chain if not already in MetaMask
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [BNB_CHAIN_PARAMS],
                        });
                        console.log('BNB Chain added to MetaMask and connected');
                    } catch (addError) {
                        console.error('Failed to add BNB Chain to MetaMask:', addError);
                    }
                }
            }
    
            // Listen for chain change events
            window.ethereum.on('chainChanged', (chainId) => {
                console.log('Network changed:', chainId);
            });
    
        } else {
            // If MetaMask is not installed, check for mobile wallet options (WalletConnect)
            const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
    
            if (isMobile) {
                // If on mobile and MetaMask is not installed, offer WalletConnect
                setTitle("You need to Install a Wallet");
                setDescription("We recommend the MetaMask wallet.");
                setButton("Install MetaMask");
                setIcon("warning");
    
                // Optionally, provide an automatic WalletConnect option for mobile users
                setTimeout(() => {
                    connectWalletWithWalletConnect(INFURA_API_KEY); // Call the WalletConnect handler
                }, 2000); // Auto-activate WalletConnect after 2 seconds
            } else {
                // Desktop environment, prompt for MetaMask installation
                setTitle("You need to Install a Wallet");
                setDescription("We recommend the MetaMask wallet.");
                setButton("Install MetaMask");
                setIcon("warning");
            }
        }
    };
    
    // Function to connect to a wallet using WalletConnect (for mobile)
    const connectWalletWithWalletConnect = async (infuraApiKey) => {
        const provider = new WalletConnectProvider({
            rpc: {
                1: `https://mainnet.infura.io/v3/${infuraApiKey}`,  // Ethereum Mainnet RPC URL with Infura API key
            },
            chainId: 1,  // Ethereum Mainnet
        });
    
        try {
            // Enable the WalletConnect provider
            await provider.enable();
    
            // Initialize Web3Provider with WalletConnect
            const web3Provider = new Web3(provider);
    
            // Get the user's address
            const accounts = await web3Provider.eth.getAccounts();
            const userAddress = accounts[0];
    
            console.log(`Connected with WalletConnect, address: ${userAddress}`);
    
            // Update UI to show wallet connected state
            setTitle("Wallet Connected");
            setDescription(`Connected with address: ${userAddress}`);
            setButton("Disconnect");
            setIcon("success");
    
        } catch (error) {
            console.error("Failed to connect with WalletConnect:", error);
            setTitle("Connection Failed");
            setDescription("Please try again.");
            setButton("Retry");
            setIcon("error");
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
