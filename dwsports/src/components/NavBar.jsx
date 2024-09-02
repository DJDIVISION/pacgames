import React, {useState,useEffect} from 'react'
import {Nav,NavColumn,NavIcon,NavText} from './index'
import {Link as LinkR} from 'react-router-dom'
import TonWalletLogin from './TonConnect';
import sportsIcon from '../assets/sportsIcon.png'
import lottery from '../assets/bingo.png'
import chip from '../assets/chip.png'
import axios from 'axios'
import { message } from 'antd';

const NavBar = () => {

    const [active, setActive] = useState("menuOne");
    const [scrollNavDown, setScrollNavDown] = useState(false);

    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/players/squads',
        params: {team: '41'},
        headers: {
          'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
    }; 

    const fetchData = async () => {
        try {
            const response = await axios.request(options);
            console.log(response.data);
            localStorage.setItem("southhampton", JSON.stringify(response.data))
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
        <LinkR to="/bets"><NavColumn>
            <NavIcon>
                <img src={sportsIcon} alt="sports" />
            </NavIcon>
            <NavText>SPORTS</NavText>
        </NavColumn></LinkR>
        <NavColumn onClick={fetchData}>
            <NavIcon>
                <img src={lottery} alt="sports" />
            </NavIcon>
            <NavText>LOTTERY</NavText>
        </NavColumn>
        <NavColumn>
            <NavIcon>
                <img src={chip} alt="sports" />
            </NavIcon>
            <NavText>CASINO</NavText>
        </NavColumn>
      <TonWalletLogin />
    </Nav>
  )
}

export default NavBar
