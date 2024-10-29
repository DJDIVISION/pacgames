import React, {useState,useEffect} from 'react'
import {Nav,NavColumn,NavIcon,NavText,SmartNav,Burguer,CloseBurguer,StaggerContainer,StaggerRow,
    StaggerAvatarRow,StaggerAvatarHolder,StaggerAvatarName,StaggerImageHolder,TonWrapper
} from './index'
import { TonConnectButton, TonConnectUIProvider, useTonConnectUI, useTonWallet, useTonAddress } from '@tonconnect/ui-react';
import { TonClient, Address } from '@ton/ton';
import {Link as LinkR} from 'react-router-dom'
import {motion,AnimatePresence} from 'framer-motion'

import sportsIcon from '../assets/sportsIcon.png'
import lottery from '../assets/bingo.png'
import chip from '../assets/chip.png'
import pacton from '../assets/pacton_robot_png.png'
import roulette from '../assets/chips/roulette.png'
import fantasy from '../assets/fantasy.png'
import deposit from '../assets/logos/deposit.png'
import axios from 'axios'
import { message } from 'antd';
import { BetState } from '../context/BetsContext';
import { Avatar, Fab, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client';
import { useAuth } from '../pages/functions'
import { FantasyState } from '../context/FantasyContext';

const NavBar = () => {

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

    const item={
        initial: { height: 0, opacity: 0 },
        animate: { height: "100vh", opacity: 1, transition: { duration: 0.5 } },
        exit: { height: 0, opacity: 0, transition: { duration: 1 } }
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
            <NavText>SPORTS</NavText>
        </NavColumn></LinkR>
        <LinkR to="/fantasy"><NavColumn>
            <NavIcon>
                <img src={fantasy} alt="fantasy" />
            </NavIcon>
            <NavText>FANTASY</NavText>
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
            <NavText>DEPOSIT</NavText>
        </NavColumn>
        
    </Nav>
    <SmartNav scrollNavDown={scrollNavDown}>
    <IconButton onClick={isOpen}><Burguer /></IconButton>
    <TonConnectButton />
    {open && (
        <AnimatePresence>
        <motion.div className="menu-container" scrollNavDown={scrollNavDown} variants={item}
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
                <StaggerAvatarRow initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }} style={{color: 'white'}}>
                       {user ? (
                        <>
                        <StaggerAvatarHolder>
                        <Avatar alt="Image" src={user.user_metadata.avatar_url} sx={{ width: 80, height: 80 }} onClick={handleLogout}/>
                        </StaggerAvatarHolder>
                        <StaggerAvatarName>{user.user_metadata.name}</StaggerAvatarName>
                        </>
                    ): (
                        <div></div>
                    )} 
                          </StaggerAvatarRow>
                          <LinkR to="/bets"><StaggerRow initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7 }} style={{ color: 'white' }}>
                              <StaggerImageHolder><img src={sportsIcon} alt="sports" /></StaggerImageHolder>
                              <StaggerAvatarName>SPORTS</StaggerAvatarName>
                          </StaggerRow></LinkR>
                          <LinkR to="/fantasy"><StaggerRow initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.9 }} style={{ color: 'white' }}>
                              <StaggerImageHolder><img src={fantasy} alt="fantasy" /></StaggerImageHolder>
                              <StaggerAvatarName>FANTASY FOOTBALL</StaggerAvatarName>
                          </StaggerRow></LinkR>
                          <LinkR to="/casino"><StaggerRow initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1.1 }} style={{ color: 'white' }}>
                              <StaggerImageHolder><img src={chip} alt="casino" /></StaggerImageHolder>
                              <StaggerAvatarName>CASINO</StaggerAvatarName>
                          </StaggerRow></LinkR>
                          {/* <StaggerRow initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1.3 }} style={{ color: 'white' }}>
                              <StaggerImageHolder><img src={deposit} alt="casino" /></StaggerImageHolder>
                              <StaggerAvatarName>DEPOSIT</StaggerAvatarName>
                          </StaggerRow>
                          <StaggerRow initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 1.5 }} style={{ color: 'white' }}>
                             
                          </StaggerRow> */}
                      </StaggerContainer>
                  </motion.div>
                  </AnimatePresence>
        )}
        </SmartNav>
    </>
  )
}

export default NavBar
