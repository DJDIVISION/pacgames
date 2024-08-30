import React, {useEffect,useState,useRef} from 'react'
import {sportsData,SportsCarousel,InnerSportsCarousel, SportIcon, SportName, SportWrapper,item} from './index'
import axios from 'axios'
import {motion} from 'framer-motion'
import { BetState } from '../context/BetsContext'
import logo1 from '../assets/laliga.png'
import premier from '../assets/premier.png'
import serie from '../assets/serieA.png'

const Leagues = () => {

    const {activeSportMenu, setActiveSportMenu} = BetState();
    const {activeCountryMenu, setActiveCountryMenu} = BetState();
    const {activeLeaguesMenu, setActiveLeaguesmenu} = BetState();
    const {activeSport, setActiveSport} = BetState();
    const {activeCountry, setActiveCountry} = BetState();
    const {activeLeague, setActiveLeague} = BetState();
    const [availableLeagues, setAvailableLeagues] = useState([])
    const [loading, setLoading] = useState(false)
    

    const getLeagues = () => {
        if(activeCountry === "Spain"){
            const str = localStorage.getItem("laLiga")
            if(str === null){
                return
            } else {
                const json = JSON.parse(str)
                availableLeagues.push("La Liga")
            }
        }
    }

    useEffect(() => {
        getLeagues();
    }, [])


  return (
    <motion.div className="menu-container-four" variants={item}
          initial={{height:0,opacity:0}}
          animate={{height:'100%', opacity:1}}
          transition={{duration:.5}}
          exit="exit">
            
                 {activeCountry === "Spain" && (
                    <SportWrapper>
                    <SportIcon><img src={logo1} alt="Spain" /></SportIcon>
                    <SportName>LA LIGA</SportName>
                </SportWrapper>
                 )} 
                 {activeCountry === "England" && (
                    <SportWrapper style={{width: '200px'}}>
                    <SportIcon><img src={premier} alt="Spain" /></SportIcon>
                    <SportName>PREMIER LEAGUE</SportName>
                </SportWrapper>
                 )} 
                 {activeCountry === "Italy" && (
                    <SportWrapper style={{width: '200px'}}>
                    <SportIcon><img src={serie} alt="Spain" /></SportIcon>
                    <SportName>SERIE A</SportName>
                </SportWrapper>
                 )} 
            
    </motion.div>
  )
}

export default Leagues
