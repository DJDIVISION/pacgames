import React, {useState,useEffect} from 'react'
import {Nav,NavColumn,NavIcon,NavText} from './index'
import {Link as LinkR} from 'react-router-dom'
/* import TonWalletLogin from './TonConnect'; */
import sportsIcon from '../assets/sportsIcon.png'
import lottery from '../assets/bingo.png'
import chip from '../assets/chip.png'
import pacton from '../assets/pacton_robot_png.png'
import roulette from '../assets/chips/roulette.png'
import axios from 'axios'
import { message } from 'antd';
import { BetState } from '../context/BetsContext';
import { Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client';
import { useAuth } from '../pages/functions'

const NavBar = () => {

    const [active, setActive] = useState("menuOne");
    const [scrollNavDown, setScrollNavDown] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate()

    useEffect(() => {
        console.log(user)
    }, [user])

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

    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/players/squads',
        params: {team: '45'},
        headers: {
          'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
    }; 

    const fetchData = async () => {
        try {
            const response = await axios.request(options);
            console.log(response.data);
            localStorage.setItem("everton", JSON.stringify(response.data))
            message.success("data fetched!")
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
       window.addEventListener('scroll', changeNavDown) 
    }, []);

    let animate = {};
    if(active === "menuOne") animate = { opacity: 0, y: '-100vh' };
    else if (active === "menuTwo") animate = {  opacity: 1, y: 0 };

    const Switch = () => {
        if(active === "menuOne"){
            setActive("menuTwo");
        } else if(active === "menuTwo"){
            setActive("menuOne");
        }
    }

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
        {/* <LinkR to="/airdrop"><NavColumn>
            <NavIcon>
                <img src={pacton} alt="sports" />
            </NavIcon>
            <NavText>AIRDROP</NavText>
        </NavColumn></LinkR> */}
        <LinkR to="/roulette"><NavColumn >
            <NavIcon>
                <img src={roulette} alt="sports" />
            </NavIcon>
            <NavText>ROULETTE</NavText>
        </NavColumn></LinkR>
        <LinkR to="/blackjack"><NavColumn>
            <NavIcon>
                <img src={chip} alt="sports" />
            </NavIcon>
            <NavText>CASINO</NavText>
        </NavColumn></LinkR>
      
    </Nav>
  )
}

export default NavBar
