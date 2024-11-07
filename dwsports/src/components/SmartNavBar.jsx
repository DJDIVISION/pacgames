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
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { ethers } from "ethers";



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
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);

    async function connectWallet() {
        // Initialize the provider with your projectId and desired chains
        const provider = await EthereumProvider.init({
          projectId: '87ce01feb918e3377f943f901349cd66', // Replace with your WalletConnect projectId
          chains: [1], // Ethereum Mainnet chainId is 1. Replace with other chains if needed
          showQrModal: true, // Display the QR modal for mobile connection
          metadata: {
            name: 'PACTON',
            description: 'Your app description',
            url: 'https://pacgames-frontend.onrender.com',
            icons: ['https://ibb.co/ggRJJQ0'],
          }
        });
      
        // Handle display_uri event to get the WalletConnect URI (for manual pairing, if needed)
        provider.on('display_uri', (uri) => {
          alert('Display URI:', uri);
          // You can handle custom logic here, such as showing the QR code or handling the URI manually
        });
      
        // Connect the provider (this will open the WalletConnect modal)
        try {
          await provider.connect();
          alert('Connected to wallet!');
          
          // You can also enable and request the accounts after connecting
          await provider.enable();
          
          // Request user accounts
          const accounts = await provider.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0])
          alert('Connected accounts:', accounts);
        } catch (error) {
          alert('Failed to connect wallet:', error);
        }
      
        // Subscribe to events like chain changes and account changes
        provider.on('chainChanged', (chainId) => {
          console.log('Chain changed:', chainId);
        });
      
        provider.on('accountsChanged', (accounts) => {
          console.log('Accounts changed:', accounts);
        });
      
        provider.on('disconnect', () => {
          console.log('Wallet disconnected');
        });
      }

  // Disconnect wallet function
  const disconnectWallet = () => {
    if (provider && provider.disconnect) {
      provider.disconnect();
      setProvider(null);
      setAccount(null);
      console.log("Disconnected from wallet");
    }
  };
    

    /* async function disconnectWallet() {
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
        
    } */

    

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
        alert(window.ethereum)
        if (typeof window.ethereum !== 'undefined') {
            alert('MetaMask is installed!');
        } else {
            alert('MetaMask is not installed. Please install MetaMask to use this app.');
        }
        /* const result = await Swal.fire({
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
      
        return result; */
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
