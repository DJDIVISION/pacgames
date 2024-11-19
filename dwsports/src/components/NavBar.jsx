import React, {useState,useEffect} from 'react'
import {Nav,NavColumn,NavIcon,NavText
} from './index'

import {Link as LinkR} from 'react-router-dom'
import sportsIcon from '../assets/sportsIcon.png'
import partners from '../assets/logos/partners.png'
import fantasy from '../assets/fantasy.png'
import deposit from '../assets/logos/shoDeposit.png'
import { Avatar, Fab, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client';
import { useAuth } from '../pages/functions'
import { FantasyState } from '../context/FantasyContext';
import { useTranslation } from 'react-i18next'
import withdraw from '../assets/logos/withdraw.png'

const NavBar = () => {

    const [active, setActive] = useState("menuOne");
    const [scrollNavDown, setScrollNavDown] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate()
    const {depositMenu, setDepositMenu} = FantasyState();
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
