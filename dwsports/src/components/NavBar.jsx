import React, {useState,useEffect} from 'react'
import {Nav,NavColumn,NavIcon,NavText,SmartNav,Burguer,CloseBurguer,StaggerContainer,StaggerRow,
    StaggerAvatarRow,StaggerAvatarHolder,StaggerAvatarName,StaggerImageHolder,TonWrapper,
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

import chip from '../assets/chip.png'

import fantasy from '../assets/fantasy.png'
import deposit from '../assets/logos/deposit.png'

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

const NavBar = ({toggleTheme}) => {

    const [active, setActive] = useState("menuOne");
    const [scrollNavDown, setScrollNavDown] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate()
    const {depositMenu, setDepositMenu} = FantasyState();
    const [open, setOpen] = useState(false);
    const userFriendlyAddress = useTonAddress();
    const rawAddress = useTonAddress(false);
    const wallet = useTonWallet();
    const { connected, account } = useTonConnectUI();
    const {walletBalance,setWalletBalance} = FantasyState();
    const [error, setError] = useState(null);
    
    const {walletAddress, setWalletAddress} = FantasyState();
    const [t, i18n] = useTranslation("global");

    const client = new TonClient({
        endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
    });

    useEffect(() => {
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
    }, [wallet]);
    

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
        {/* <LinkR to="/airdrop"><NavColumn>
            <NavIcon>
                <img src={pacton} alt="sports" />
            </NavIcon>
            <NavText>AIRDROP</NavText>
        </NavColumn></LinkR> */}
        {/* <LinkR to="/roulette"><NavColumn>
            <NavIcon>
                <img src={roulette} alt="roulette" />
            </NavIcon>
            <NavText>ROULETTE</NavText>
        </NavColumn></LinkR> */}
        <LinkR to="/casino"><NavColumn>
            <NavIcon>
                <img src={chip} alt="casino" />
            </NavIcon>
            <NavText>CASINO</NavText>
        </NavColumn></LinkR>
        <NavColumn onClick={() => setDepositMenu(true)}>
            <NavIcon>
                <img src={deposit} alt="casino" />
            </NavIcon>
            <NavText>{t("navbar.deposit")}</NavText>
        </NavColumn>
        
    </Nav>
    
    </>
  )
}

export default NavBar
