import React, { useEffect, useState } from 'react'
import { BetState } from '../context/BetsContext';
import { supabase } from '../supabase/client';
import {motion} from 'framer-motion'
import { Avatar } from '@mui/material';
import CountUp from '../animations/CountUp';
import {BetSection,ArrowUp,SportsButtonRow,item,BorderedPlayer,BetWrapper,MatchColumn,MatchDate,TeamStatsLogo,AgeAverage,
  MatchOdds,OddsColumn,StatsIcon,MatchWrapper,MatchTeam,ArrowLeft,MiniArrowDown,MiniArrowup,TeamStatsSection,LeftColumn,
  RightColumn,TeamStatsWrapper,TeamStatsName,TeamStatCountry,StatsCountryAvatar,StatsCountryLocation,TeamStatsRating,
  TeamRatingTitle,TeamRating,AccordionTitle,SmallBorderedMatch,TeamMembers,Row,Column,ColumnIcon,SmallColumnText,BigColumnText,
  Stadium,Capacity,Coach,Foundation,RecentForm,TeamStatsRow,SmallBorderedMatchRight,ArrivalsText,ArrivalsTitle,ReadMore
} from './index'
import { useNavigate } from 'react-router-dom'


const PlayerStats = () => {

  const {activePlayer, setActivePlayer} = BetState();
  const {activeTeam, setActiveTeam} = BetState();
  const navigate = useNavigate()

  console.log(activePlayer)
  console.log(activeTeam)

  const goBack = () => {
    setActivePlayer([])
    navigate(`/team/${activeTeam.id}`)
  }

  return (
    <TeamStatsSection>
      <LeftColumn>
        <ArrowLeft onClick={goBack}/>
        <BorderedPlayer style={{border: '1px solid white'}}>
        <TeamStatsLogo>
        <Avatar alt="Image" src={activePlayer.photo} sx={{ width: 120, height: 120, border: '1px solid gold' }}/>
      </TeamStatsLogo>
          <TeamStatsWrapper>
              <TeamStatsName>{activePlayer.name}</TeamStatsName>
              <TeamStatCountry>
                <StatsCountryLocation>NATIONALITY: {activePlayer.nationality}</StatsCountryLocation>
              </TeamStatCountry>
              <TeamStatsRating>
              <TeamRatingTitle>PLAYER RATING:</TeamRatingTitle> <TeamRating><strong><CountUp endValue={activePlayer.rating} duration={500}/></strong></TeamRating><span></span>
              </TeamStatsRating>
              
          </TeamStatsWrapper> 
      </BorderedPlayer>
      </LeftColumn>
      <RightColumn>

      </RightColumn>
    </TeamStatsSection>
  )
}

export default PlayerStats
