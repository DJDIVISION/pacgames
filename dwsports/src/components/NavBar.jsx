import React, {useState,useEffect} from 'react'
import {Nav,NavColumn,NavIcon,NavText} from './index'
import {Link as LinkR} from 'react-router-dom'
import TonWalletLogin from './TonConnect';
import sportsIcon from '../assets/sportsIcon.png'
import lottery from '../assets/bingo.png'
import chip from '../assets/chip.png'

const NavBar = () => {

    const [active, setActive] = useState("menuOne");
    const [scrollNavDown, setScrollNavDown] = useState(false);

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
        <NavColumn>
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
