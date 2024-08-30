import React, {useState} from 'react'
import {LeaguesButtonRow,SportWrapper,SportIcon,SportName,item} from './index'
import axios from 'axios'
import UK from '../assets/england.png'
import SPAIN from '../assets/spainFlag.png'
import italy from '../assets/italy.png'
import nba from '../assets/nba.png'
import US from '../assets/usopen.png'
import icc from '../assets/usopen.png'
import { motion } from 'framer-motion'
import { BetState } from '../context/BetsContext'
import {premierLeague} from '../data/sportsData'
import {premierMatches,laLigaMatches,serieAMatches} from '../data/nextMatches'

const Countries = ({activeSportMenu,setActiveSportMenu,activeCountryMenu,setActiveCountryMenu,activeLeaguesMenu,setActiveLeaguesMenu,
    betsMenu,setBetsMenu
}) => {

    
    const {activeSport, setActiveSport} = BetState();
    const {activeCountry, setActiveCountry} = BetState();
    const {activeLeague, setActiveLeague} = BetState();
    const {activeMatches, setActiveMatches} = BetState();

    //setLaLiga(premierMatches)

    const setSpain = () => {
        setActiveCountryMenu(false)
        setActiveLeaguesMenu(true)
        setActiveCountry("Spain")
        setActiveMatches(laLigaMatches)
        setBetsMenu(true)
    }

    const setUK = () => {
        setActiveCountryMenu(false)
        setActiveLeaguesMenu(true)
        setActiveCountry("England")
        setActiveMatches(premierMatches)
        setBetsMenu(true)
        
    }

    const setItaly = () => {
        setActiveCountryMenu(false)
        setActiveLeaguesMenu(true)
        setActiveCountry("Italy")
        setActiveMatches(serieAMatches)
        setBetsMenu(true)
        
    }

  return (
    <motion.div className="menu-container-four" variants={item}
          initial={{height:0,opacity:0}}
          animate={{height:'100%', opacity:1}}
          transition={{duration:.5}}
          exit="exit">
    
        {activeSport === "Soccer" && (
            <>
            <SportWrapper onClick={setItaly}>
                <SportIcon><img src={italy} alt="UK" /></SportIcon>
                <SportName>ITALY</SportName>
            </SportWrapper>
            <SportWrapper onClick={setUK}>
                <SportIcon><img src={UK} alt="UK" /></SportIcon>
                <SportName>ENGLAND</SportName>
            </SportWrapper>
            <SportWrapper onClick={setSpain}>
                <SportIcon><img src={SPAIN} alt="Spain" /></SportIcon>
                <SportName>SPAIN</SportName>
            </SportWrapper>
            </>
        )}
        {activeSport === "Basketball" && (
            <>
            <SportWrapper onClick={setSpain}>
            <SportIcon><img src={nba} alt="Spain" /></SportIcon>
            <SportName>NBA</SportName>
            </SportWrapper>
            </>
        )}
        {activeSport === "Tennis" && (
            <>
            <SportWrapper onClick={setSpain}>
            <SportIcon><img src={US} alt="Spain" /></SportIcon>
            <SportName>US OPEN</SportName>
            </SportWrapper>
            </>
        )}
        {activeSport === "Cricket" && (
            <>
            <SportWrapper onClick={setSpain}>
            <SportIcon><img src={icc} alt="Spain" /></SportIcon>
            <SportName>ICC</SportName>
            </SportWrapper>
            </>
        )}
    
    </motion.div>
  )
}

export default Countries
