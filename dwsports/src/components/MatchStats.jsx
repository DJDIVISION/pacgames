import React from 'react'
import { motion } from 'framer-motion'
import {item,CloseStats,StatsSection,StatsWrapper,StatsStadium,StatsStadiumCapacity,MatchLineUp} from './index'
import { BetState } from '../context/BetsContext';

const MatchStats = ({matchStatsMenu,setMatchStatsMenu}) => {

  const {homeTeam, setHomeTeam} = BetState([])
  const {awayTeam, setAwayTeam} = BetState([])
  const {matchToBet, setMatchToBet} = BetState([])

  console.log(homeTeam)
  console.log(awayTeam)
  console.log(matchToBet)

  const closeStatsMenu = () => {
    setMatchStatsMenu(false)
  }

  return (
    <motion.div className="menu-container-six" variants={item}
    initial={{opacity:0, height: 0}}
    animate={{ opacity:1, height: "100vh"}}
    transition={{duration:.5}}
    exit="exit">
      <CloseStats onClick={closeStatsMenu} />
      <StatsSection style={{backgroundImage:`url(${homeTeam.stadiumURL})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'}}>
        <StatsWrapper>
            <StatsStadium>Stadium: {homeTeam.stadium}</StatsStadium>
            <StatsStadiumCapacity>Capacity: {homeTeam.stadiumCapacity} assistants</StatsStadiumCapacity>
            <StatsStadium>POSSIBLE LINEUP</StatsStadium>
            <MatchLineUp>
              <img src={matchToBet.lineup} alt="lineup" />
            </MatchLineUp>
        </StatsWrapper>
      </StatsSection>
    </motion.div>
  )
}

export default MatchStats
