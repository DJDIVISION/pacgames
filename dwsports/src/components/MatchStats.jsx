import React from 'react'
import { motion } from 'framer-motion'
import {item,CloseStats,StatsSection,StatsWrapper,StatsStadium,StatsStadiumCapacity,MatchLineUp,
  StatsPlayers,StatPlayer,PlayerPicture,PlayerName,PlayerNumber,PlayerPosition,Column,Wrapper,PlayerDisplay
} from './index'
import { BetState } from '../context/BetsContext';
import { premierLeague } from '../data/sportsData';



const MatchStats = ({matchStatsMenu,setMatchStatsMenu}) => {

  const {homeTeam, setHomeTeam} = BetState([])
  const {awayTeam, setAwayTeam} = BetState([])
  const {matchToBet, setMatchToBet} = BetState([])
  const {homeTeamPlayers, setHomeTeamPlayers} = BetState()
  const {awayTeamPlayers, setAwayTeamPlayers} = BetState()
  const {activeLeague, setActiveLeague} = BetState();

  const home = activeLeague[homeTeam] 
  const away = activeLeague[awayTeam]

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
      <StatsSection style={{backgroundImage:`url(${home.stadiumURL})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'}}>
        <StatsWrapper>
            <StatsStadium>Stadium: {home.stadium}</StatsStadium>
            <StatsStadiumCapacity>Capacity: {home.stadiumCapacity} assistants</StatsStadiumCapacity>
            <StatsStadium>PLAYERS</StatsStadium>
            <Wrapper>
            <StatsPlayers>
            <div style={{marginBottom: '10px'}}>{homeTeam}</div>
              {home.players?.map(player => {
                return(
                  <StatPlayer>
                    <PlayerPicture style={{backgroundImage: `url(${player.photo})`, backgroundPosition: 'center',
                  backgroundSize: 'cover'}}>
                    </PlayerPicture>
                    <PlayerName>{player.name}</PlayerName>
                    <PlayerNumber><PlayerDisplay>{player.number}</PlayerDisplay></PlayerNumber>
                    <PlayerPosition>{player.position}</PlayerPosition>
                    <PlayerPicture>{player.yellow}</PlayerPicture>
                    <PlayerPicture>{player.goals}</PlayerPicture>
                    <PlayerPicture>{player.assists}</PlayerPicture>
                    <PlayerPicture>{player.rating}</PlayerPicture>
                    <PlayerPicture>{player.available}</PlayerPicture>
                  </StatPlayer>
                )
              })}
            </StatsPlayers>
            <StatsPlayers>
            <div style={{marginBottom: '10px'}}>{awayTeam}</div>
              {away.players?.map(player => {
                return(
                  <StatPlayer>
                    <PlayerPicture style={{backgroundImage: `url(${player.photo})`, backgroundPosition: 'center',
                  backgroundSize: 'cover'}}>
                    </PlayerPicture>
                    <PlayerName>{player.name}</PlayerName>
                    <PlayerNumber><PlayerDisplay>{player.number}</PlayerDisplay></PlayerNumber>
                    <PlayerPosition>{player.position}</PlayerPosition>
                    <PlayerPicture>{player.yellow}</PlayerPicture>
                    <PlayerPicture>{player.goals}</PlayerPicture>
                    <PlayerPicture>{player.assists}</PlayerPicture>
                    <PlayerPicture>{player.rating}</PlayerPicture>
                    <PlayerPicture>{player.available}</PlayerPicture>
                  </StatPlayer>
                )
              })}
            </StatsPlayers>
            </Wrapper>
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
