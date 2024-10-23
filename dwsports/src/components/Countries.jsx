import React, {useEffect, useState} from 'react'
import {LeaguesButtonRow,SportWrapper,SportIcon,SportName,item} from './index'
import axios from 'axios'

import nba from '../assets/nba.png'
import US from '../assets/usopen.png'
import icc from '../assets/usopen.png'
import { motion } from 'framer-motion'
import { BetState } from '../context/BetsContext'

import {premierMatches,laLigaMatches,serieAMatches} from '../data/nextMatches'
import { supabase } from '../supabase/client'
import { FantasyState } from '../context/FantasyContext'
import { ArrowLeft, ArrowRight, BetTitleRow } from '../pages'

const Countries = ({loading,setLoading,activeCountryMenu,setActiveCountryMenu,activeLeaguesMenu,setActiveLeaguesMenu,
    betsMenu,setBetsMenu
}) => {

    
    const {activeSport, setActiveSport} = BetState();
    const {activeCountry, setActiveCountry} = BetState();
    const {activeMatches, setActiveMatches} = FantasyState();
    const {activeLeague, setActiveLeague} = FantasyState();
    const {activeLeagueId, setActiveLeagueId} = FantasyState();
    const {activeRound,setActiveRound} = FantasyState();
    

    

    

  return (
    <motion.div className="menu-container-four" variants={item}
          initial={{height:0,opacity:0}}
          animate={{height:'100%', opacity:1}}
          transition={{duration:.5}}
          exit="exit">
    
            
        {activeSport === "Basketball" && (
            <>
            <SportWrapper /* onClick={setSpain} */>
            <SportIcon><img src={nba} alt="Spain" /></SportIcon>
            <SportName>NBA</SportName>
            </SportWrapper>
            </>
        )}
        {activeSport === "Tennis" && (
            <>
            <SportWrapper /* onClick={setSpain} */>
            <SportIcon><img src={US} alt="Spain" /></SportIcon>
            <SportName>US OPEN</SportName>
            </SportWrapper>
            </>
        )}
        {activeSport === "Cricket" && (
            <>
            <SportWrapper /* onClick={setSpain} */>
            <SportIcon><img src={icc} alt="Spain" /></SportIcon>
            <SportName>ICC</SportName>
            </SportWrapper>
            </>
        )}
          
    </motion.div>
  )
}

export default Countries
