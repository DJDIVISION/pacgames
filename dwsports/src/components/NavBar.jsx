import React, {useState,useEffect} from 'react'
import {Nav,NavColumn,NavIcon,NavText,SmartNav,Burguer,CloseBurguer,StaggerContainer,StaggerRow,
    StaggerAvatarRow,StaggerAvatarHolder,StaggerAvatarName,StaggerImageHolder,TonWrapper,
    CustomIconButton,
    LightIcon,StyledMenu,Language,
    DarkIcon,
    WalletAddressButton
} from './index'

import {Link as LinkR} from 'react-router-dom'
import {motion,AnimatePresence} from 'framer-motion'
import  { useTheme } from 'styled-components'
import sportsIcon from '../assets/sportsIcon.png'
import Swal from "sweetalert2";
import chip from '../assets/chip.png'

import fantasy from '../assets/fantasy.png'
import deposit from '../assets/logos/shoDeposit.png'
import metamask from '../assets/logos/metamask.svg'
import { Avatar, Fab, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client';
import { useAuth } from '../pages/functions'
import { FantasyState } from '../context/FantasyContext';
import DepositMenu from './menus/DepositMenu';
import ES from '../assets/svg/es.png';
import FR from '../assets/svg/fr.png';
import EN from '../assets/svg/uk.png';
import { useTranslation } from 'react-i18next'
import Onboarding from '@metamask/onboarding';
import Web3 from "web3";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import withdraw from '../assets/logos/withdraw.png'

const NavBar = ({toggleTheme}) => {

    const [active, setActive] = useState("menuOne");
    const [scrollNavDown, setScrollNavDown] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate()
    const {depositMenu, setDepositMenu} = FantasyState();
    
    const [open, setOpen] = useState(false);
    /* const userFriendlyAddress = useTonAddress();
    const rawAddress = useTonAddress(false);
    const wallet = useTonWallet();
    const { connected, account } = useTonConnectUI(); */
    const {walletBalance,setWalletBalance} = FantasyState();
    const [error, setError] = useState(null);
    const onboarding = new Onboarding();
    const {walletAddress, setWalletAddress} = FantasyState();
    const {walletMenu, setWalletMenu} = FantasyState();
    const [t, i18n] = useTranslation("global");
    const {provider, setProvider} = FantasyState();
    const {account, setAccount} = FantasyState();

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

    

   

    /* const client = new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    }); */

   /*  useEffect(() => {
        if(wallet){
            const writeData = async () => {
                const updatedData = {
                    name: user.user_metadata.name,
                    avatar: user.user_metadata.avatar_url,
                    email: user.email,
                    walletAddress: wallet.account.address,
                    user_id: user.id
                  }
                  const { data, error } = await supabase
                  .from('user_wallets')
                  .insert([updatedData])
                  if (error) {
                    console.error('Error inserting/updating user session data:', error.message)
                  } else {
                    console.log('User session data saved:', data)
                  }
            }
            const fetchBalance = async () => {
                try {
                    const address = Address.parse(wallet.account.address);
                    setWalletAddress(wallet)
                    const balanceResult = await client.getBalance(address);
                    console.log(balanceResult)
                    const balanceInTON = Number(balanceResult) / 1e9; // Convert nanoTONs to TON
    
                    setWalletBalance(balanceInTON);
                } catch (err) {
                    console.error('Error fetching balance:', err);
                    setError('Failed to fetch balance.');
                }
            };
            writeData();
            fetchBalance();
        }
    }, [wallet]); */
    

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
    
        if (error) {
          console.error('Error logging out:', error.message)
        } else {
          console.log('User logged out successfully')
          // Redirect to the login page or home page
          navigate('/login')
        }
      }

      const isOpen = ()=>{
        setOpen(!open);
      }

    useEffect(() => {
       window.addEventListener('scroll', changeNavDown) 
    }, []);


    const changeNavDown = () => {
        if(window.scrollY >= 50) {
            setScrollNavDown(true); 
            setActive("menuOne");
        } 
        else {
            setScrollNavDown(false)
        }
    }

    

    

  return (
    <>
    <Nav scrollNavDown={scrollNavDown}>
        {user ? (
            <Avatar alt="Image" src={user.user_metadata.avatar_url} sx={{ width: 50, height: 50, marginRight: '5px' }} onClick={handleLogout}/>
        ): (
            <div></div>
        )}
        <LinkR to="/bets"><NavColumn>
            <NavIcon>
                <img src={sportsIcon} alt="sports" />
            </NavIcon>
            <NavText>{t("navbar.sports")}</NavText>
        </NavColumn></LinkR>
        <LinkR to="/fantasy"><NavColumn>
            <NavIcon>
                <img src={fantasy} alt="fantasy" />
            </NavIcon>
            <NavText>{t("navbar.fantasy")}</NavText>
        </NavColumn></LinkR>
        <NavColumn onClick={() => setDepositMenu(true)}>
            <NavIcon>
                <img src={deposit} alt="casino" />
            </NavIcon>
            <NavText>{t("navbar.deposit")}</NavText>
        </NavColumn>
        <NavColumn onClick={() => setWalletMenu(true)}>
            <NavIcon>
                <img src={withdraw} alt="casino" />
            </NavIcon>
            <NavText>{t("navbar.withdraw")}</NavText>
        </NavColumn>
    </Nav>
    
    </>
  )
}

export default NavBar
