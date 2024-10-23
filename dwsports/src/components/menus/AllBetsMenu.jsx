import React, {useEffect, useState} from 'react'
import { motion } from 'framer-motion'

import { message } from 'antd';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../pages/functions';
import { FantasyState } from '../../context/FantasyContext';
import { item } from '../../pages';
import { CloseStats,StatsWrapper,BetSection,TeamsLogo,AvatarHolder,TypeofBet,TeamsName,HalfColumn } from './index';
import { Avatar } from '@mui/material';
import draw from "../../assets/draw.png"

const AllBetsMenu = ({allBetsMenu,setAllBetsMenu}) => {

  
  const [myBets, setMyBets] = useState([])
  
  const { user } = useAuth();



  

  const fetchBets = async () => {
    const { data, error } = await supabase
          .from('bets')
          .select('*')
          .order('id', { ascending: true });
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            setMyBets(data)
            
    }
  }

  useEffect(() => {
    fetchBets();
  }, [user])
  

  const closeBetsMenu = () => {
    setAllBetsMenu(false)
  }

  const getURL = (betType, match) => {
    if(betType === "home") return match.teams.home.logo
    if(betType === "away") return match.teams.away.logo
    if(betType === "draw") return draw
    return ''
};

const getName = (betType, match) => {
    if(betType === "home") return match.teams.home.name
    if(betType === "away") return match.teams.away.name
    if(betType === "draw") return `${match.teams.home.name} vs ${match.teams.away.name}`
    return ''
};

const getOdd = (betType, match) => {
    if(betType === "home") return match.odds.home
    if(betType === "away") return match.odds.away
    if(betType === "draw") return match.odds.draw
    return ''
};
 

  return (
    <motion.div className="menu-container-seven" variants={item}
    initial={{opacity:0, height: 0}}
    animate={{ opacity:1, height: "100vh"}}
    transition={{duration:.5}}
    exit="exit">
        <BetSection>
      <CloseStats onClick={closeBetsMenu} />
        {myBets?.map((bet) => {
            console.log(bet)
            const type = bet.bet.length === 1 ? "SINGLE BET" : "MULTIPLE BET"
            return(
                <StatsWrapper>
                    <TypeofBet>{type}</TypeofBet>
                    <TeamsLogo>
                    {bet.bet.map((el) => {
                        const url = getURL(el.betType, el.match);
                        return(
                            <AvatarHolder>
                            <Avatar alt="Home Team Logo" src={url} sx={{ width: 30, height: 30}} />
                            </AvatarHolder>
                        )
                    })}
                    </TeamsLogo>
                    <TeamsName>
                    {bet.bet.map((el) => {
                        const name = getName(el.betType, el.match)
                        return(
                            <AvatarHolder>{name}</AvatarHolder>
                        )
                    })}
                    </TeamsName>
                    <TypeofBet>
                    {bet.bet.map((el) => {
                        return(
                            <AvatarHolder>{el.betType}</AvatarHolder>
                        )
                    })}
                    </TypeofBet>
                    <TypeofBet>
                        {bet.bet.map((el) => {
                            const odd = getOdd(el.betType, el.match)
                        return(
                            <AvatarHolder>{odd}</AvatarHolder>
                        )
                    })}
                    </TypeofBet>
                    <TypeofBet><HalfColumn>BET AMOUNT: <span>${bet.amount}</span></HalfColumn></TypeofBet>
                    <TypeofBet>
                        <HalfColumn>
                        POSSIBLE WINNINGS: <span>${bet.possibleWinnings}</span>
                        </HalfColumn>
                    </TypeofBet>
                    <TypeofBet>
                    <HalfColumn>
                        STATUS: <strong>{bet.status}</strong>
                        </HalfColumn>
                    </TypeofBet>
                    

                    {/* <TypeofBet>POSSIBLE WINNINGS: <span>${bet.possibleWinnings}</span>
                    <p>STATUS</p> <strong>{bet.status}</strong></TypeofBet> */}
                </StatsWrapper>
            )
        })}
        </BetSection>
    </motion.div>
  )
}

export default AllBetsMenu
