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
import partners from '../assets/logos/partners.png'
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

const NavBar = () => {

    const [active, setActive] = useState("menuOne");
    const [scrollNavDown, setScrollNavDown] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate()
    const {depositMenu, setDepositMenu} = FantasyState();
    const [open, setOpen] = useState(false);
    const {walletMenu, setWalletMenu} = FantasyState();
    const [t, i18n] = useTranslation("global");

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
        <LinkR to="/partners"><NavColumn>
            <NavIcon>
                <img src={partners} alt="partners" />
            </NavIcon>
            <NavText>OUR PARTNERS</NavText>
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
