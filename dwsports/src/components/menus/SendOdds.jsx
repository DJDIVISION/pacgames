import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components';
import { supabase } from '../../supabase/client';
import {motion } from 'framer-motion'
import {TeamStatsSection,LeftColumn
} from '../../pages/index'
import TextField from '@mui/material/TextField';
import {CloseStats,StatsSection,StatsWrapper,StatsStadium,StatsStadiumCapacity,MatchLineUp,
  StatsPlayers,StatPlayer,PlayerPicture,PlayerName,PlayerNumber,PlayerPosition,Wrapper,PlayerDisplay,PlayerBigPicture,
  RowerColumn,
  LowRower,RowerNameEvent,
  RowerRowBets,RowerSmall,RowerLongNameEvent,RowerRowEventLong,
  RowerRowEvent,
  RowerTeamEvent,
  item
} from '../index'
import {useInView} from "react-intersection-observer";

import { Avatar, Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom'
import {Link as LinkR} from 'react-router-dom'
import { FantasyState } from '../../context/FantasyContext';
import { minWidth } from '@mui/system';
import axios from 'axios';
import shirt from '../../assets/logos/shirt.png'
import { TeamBetsHolder, TeamRow } from '../../pages/indexThree';
import { message } from 'antd';



const SendOdds = ({selectedOddsMenu,setSelectedOddsMenu}) => {

    const [one, setOne] = useState(null)
    const [two, setTwo] = useState(null)
    const [draw, setDraw] = useState(null)
    const [homeOverTwoFive, setHomeOverTwoFive] = useState(null)
    const [homeUnderTwoFive, setHomeUnderTwoFive] = useState(null)
    const [awayOverTwoFive, setAwayOverTwoFive] = useState(null)
    const [awayUnderTwoFive, setAwayUnderTwoFive] = useState(null)
    const [btts, setBtts] = useState(null)
    const [btnts, setBtnts] = useState(null)
    const [homeBtts, setHomeBtts] = useState(null)
    const [awayBtts, setAwayBtts] = useState(null)
    const [homeBtnts, setHomeBtnts] = useState(null)
    const [homeMinus1, setHomeMinus1] = useState(null)
    const [awayBtnts, setAwayBtnts] = useState(null)
    const [awayMinus1, setAwayMinus1] = useState(null)

    const sendOdds = async (match) => {
        
        
        if(one === null || draw === null || two === null){
            message.error("Some data missing")
            return
        }
        const odds2 = {
            1224072: {
                home: one,
                draw: draw,
                away: two,
                homeOver2: homeOverTwoFive,
                homeUnder2: homeUnderTwoFive,
                awayOver2: awayOverTwoFive,
                awayUnder2: awayUnderTwoFive,
                btts: btts,
                btnts: btnts,
                homeBTTS: homeBtts,
                homeBTNTS: homeBtnts,
                awayBTTS: awayBtts,
                awayBTNTS: awayBtnts,
                homeMinus1: homeMinus1,
                awayMinus1: awayMinus1 
            }
        }
        
        const { data, error } = await supabase
          .from('fixtures')
          .select('odds')
          .eq('id', 61)
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            console.log('data:', data)
            const userJsonData = data[0].odds || {}; 
            userJsonData.odds = userJsonData.odds || []; 
            console.log(userJsonData)
            
            userJsonData.odds.push(odds2);
            const { error: updateError } = await supabase
                    .from('fixtures')
                    .update({ odds: userJsonData }) // Update the jsonb column
                    .eq('id', 61); // Identify which user to update
    
                if (updateError) {
                    console.error('Error updating user data:', updateError.message);
                } else {
                    message.success("La he metido hasta dentro!")
                }
          }
        
        //console.log(updatedData)
        setOne(null)
        setDraw(null)
        setTwo(null)
        setHomeOverTwoFive(null)
        setHomeUnderTwoFive(null)
        setAwayOverTwoFive(null)
        setAwayUnderTwoFive(null)
        setBtts(null)
        setBtnts(null)
        setHomeBtnts(null)
        setAwayBtnts(null)
        setHomeBtts(null)
        setAwayBtts(null)
        setHomeMinus1(null)
        setAwayMinus1(null)
    }

    const closeSendOdds = () => {
        setSelectedOddsMenu(!selectedOddsMenu)
    }

    


  return (
    <motion.div className="menu-container-one" variants={item}
              initial="initial"
              animate="animate"
              exit="exit" style={{zIndex: '2'}}>
    <TeamStatsSection style={{padding: '40px', background: 'white', height: '100%'}}>
      <CloseStats onClick={() => closeSendOdds()} style={{color: 'black', top: '70%'}}/>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <TextField variant="outlined" style={{width: '100px'}} type='number' onChange={(e) => setOne(e.target.value)} />
                    <TextField style={{width: '100px'}} type='number' onChange={(e) => setDraw(e.target.value)} />
                    <TextField style={{width: '100px'}} type='number' onChange={(e) => setTwo(e.target.value)} />
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <TextField style={{width: '100px', margin: '5px 0'}} type='number' placeholder="HOME OVER 2.5" onChange={(e) => setHomeOverTwoFive(e.target.value)} />
                    <TextField style={{width: '100px', margin: '5px 0'}} type='number' placeholder="BOTH TEAMS SCORE" onChange={(e) => setBtts(e.target.value)} />
                    <TextField style={{width: '100px', margin: '5px 0'}} type='number' placeholder="AWAY OVER 2.5" onChange={(e) => setAwayOverTwoFive(e.target.value)} />
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <TextField style={{width: '100px', margin: '5px 0'}} type='number' placeholder="HOME UNDER 2.5" onChange={(e) => setHomeUnderTwoFive(e.target.value)} />
                    <TextField style={{width: '100px', margin: '5px 0'}} type='number' placeholder="BOTH TEAMS NOT SCORE" onChange={(e) => setBtnts(e.target.value)} />
                    <TextField style={{width: '100px', margin: '5px 0'}} type='number' placeholder="AWAY UNDER 2.5" onChange={(e) => setAwayUnderTwoFive(e.target.value)} />
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <TextField style={{width: '100px', margin: '5px 0'}} type='number' placeholder="HOME BOTH TEAMS SCORE" onChange={(e) => setHomeBtts(e.target.value)} />
                    <TextField style={{width: '100px', margin: '5px 0'}} type='number' placeholder="HOME -1" onChange={(e) => setHomeMinus1(e.target.value)} />
                    <TextField style={{width: '100px', margin: '5px 0'}} type='number' placeholder="AWAY BOTH TEAMS SCORE" onChange={(e) => setAwayBtts(e.target.value)} />
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <TextField style={{width: '100px', margin: '5px 0'}} type='number' placeholder="HOME BOTH TEAMS NOT SCORE" onChange={(e) => setHomeBtnts(e.target.value)} />
                    <TextField style={{width: '100px', margin: '5px 0'}} type='number' placeholder="AWAY -1" onChange={(e) => setAwayMinus1(e.target.value)} />
                    <TextField style={{width: '100px', margin: '5px 0'}} type='number' placeholder="AWAY BOTH NOT TEAMS SCORE" onChange={(e) => setAwayBtnts(e.target.value)} />
                    </div>
                    <StyledButton onClick={() => sendOdds()}>SEND ODDS</StyledButton>
    </TeamStatsSection>
    </motion.div>
  )
}

export default SendOdds

const StyledButton = styled(Button)`
    &&&{
        align-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    cursor: pointer;
    border: 1px solid ${props => props.theme.MainAccent};
    border-radius: 0.58vmin;
    color: ${props => props.theme.MainAccent};
    padding: 10px 20px;
    font-size: 16px;
    text-decoration: none;
    text-transform: uppercase;
    overflow: hidden;
    transition: 0.5s;
    &:hover {
        background: ${props => props.theme.MainAccent};
        color: #ffffff;
        box-shadow: 0 0 5px ${props => props.theme.MainAccent}, 0 0 25px ${props => props.theme.MainAccent},
        0 0 50px ${props => props.theme.MainAccent}, 0 0 100px ${props => props.theme.MainAccent};
        font-weight: bold;
    }
    @media(max-width: 968px){
        font-size: 16px;
        padding: 7.5px 15px;
    }
    @media(max-width: 698px){
        font-size: 14px;
        padding: 7.5px 15px;
    }
    }
`;
