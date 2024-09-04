import React, { useEffect, useState } from 'react'
import { BetState } from '../context/BetsContext';
import { supabase } from '../supabase/client';
import {motion} from 'framer-motion'
import {BetSection,ArrowUp,SportsButtonRow,item,BorderedMatch,BetWrapper,MatchColumn,MatchDate,TeamStatsLogo,AgeAverage,
  MatchOdds,OddsColumn,StatsIcon,MatchWrapper,MatchTeam,ArrowLeft,MiniArrowDown,MiniArrowup,TeamStatsSection,LeftColumn,
  RightColumn,TeamStatsWrapper,TeamStatsName,TeamStatCountry,StatsCountryAvatar,StatsCountryLocation,TeamStatsRating,
  TeamRatingTitle,TeamRating,AccordionTitle,SmallBorderedMatch,TeamMembers,Row,Column,ColumnIcon,SmallColumnText,BigColumnText,
  Stadium,Capacity,Coach,Foundation,RecentForm,TeamStatsRow,SmallBorderedMatchRight,ArrivalsText,ArrivalsTitle
} from './index'
import {CloseStats,StatsSection,StatsWrapper,StatsStadium,StatsStadiumCapacity,MatchLineUp,
  StatsPlayers,StatPlayer,PlayerPicture,PlayerName,PlayerNumber,PlayerPosition,Wrapper,PlayerDisplay
} from '../components/index'
import { Avatar } from '@mui/material';
import england from '../assets/england.png'
import spain from '../assets/england.png'
import italy from '../assets/england.png'
import CountUp from '../animations/CountUp';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom'


const TeamStats = () => {

  const {activeTeam, setActiveTeam} = BetState();
  const {activeCountry, setActiveCountry} = BetState();
  const [summary, setSummary] = useState([])
  const [attacking, setAttacking] = useState([])
  const [defense, setDefense] = useState([])
  const [passes, setPasses] = useState([])
  const [other, setOther] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isAttackExpanded, setIsAttackExpanded] = useState(false)
  const [isDefenseExpanded, setIsDefenseExpanded] = useState(false)
  const [isPassesExpanded, setIsPassesExpanded] = useState(false)
  const [isOtherExpanded, setIsOtherExpanded] = useState(false)
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false)
  const {homeTeamPlayers, setHomeTeamPlayers} = BetState()
  const {awayTeamPlayers, setAwayTeamPlayers} = BetState()
  const {activeLeague, setActiveLeague} = BetState();
  const navigate = useNavigate()

  console.log(activeCountry)
  console.log(activeLeague)

  const letterColors = {
    'W': 'green',
    'E': 'grey',
    'L': 'red',
  };

  const fetchData = async () => {
    console.log(activeTeam)
    const sum = activeTeam.Summary
    const att = activeTeam.Attacking
    const deff = activeTeam.Defending
    const pass = activeTeam.Passes
    const oth = activeTeam.Other
    setSummary(sum[0])
    setAttacking(att[0])
    setDefense(deff[0])
    setPasses(pass[0])
    setOther(oth[0])
    const { data, error } = await supabase.from('premierLeague').select(activeTeam.name).eq("id", 1);
        if(error){
          console.log(error)
        }
        if(data){
          console.log(data[0][activeTeam.name])
          setHomeTeamPlayers(data[0][activeTeam.name][0].players)
        }
  }

  console.log(homeTeamPlayers)

  useEffect(() => {
    fetchData();
  }, [])

  const togglePlayerExpand = () => {
    if(!isPlayerExpanded){
      setIsPlayerExpanded(true)
    } else {
      setIsPlayerExpanded(false)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
    setIsAttackExpanded(false)
    setIsDefenseExpanded(false)
    setIsPassesExpanded(false)
    setIsOtherExpanded(false)
  }

  const toggleAttackExpand = () => {
    if(!isAttackExpanded){
      setIsAttackExpanded(true)
      setIsExpanded(false)
      setIsDefenseExpanded(false)
      setIsPassesExpanded(false)
      setIsOtherExpanded(false)
    } else {
      setIsAttackExpanded(false)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const toggleDefenseExpand = () => {
    if(!isDefenseExpanded){
      setIsAttackExpanded(false)
      setIsExpanded(false)
      setIsDefenseExpanded(true)
      setIsPassesExpanded(false)
      setIsOtherExpanded(false)
    } else {
      setIsDefenseExpanded(false)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const togglePassesExpand = () => {
    if(!isPassesExpanded){
      setIsAttackExpanded(false)
      setIsExpanded(false)
      setIsDefenseExpanded(false)
      setIsPassesExpanded(true)
      setIsOtherExpanded(false)
    } else {
      setIsPassesExpanded(false)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const toggleOtherExpand = () => {
    if(!isOtherExpanded){
      setIsAttackExpanded(false)
      setIsExpanded(false)
      setIsDefenseExpanded(false)
      setIsPassesExpanded(false)
      setIsOtherExpanded(true)
    } else {
      setIsOtherExpanded(false)
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  console.log(activeTeam.recentForm)
  

  return (
    <TeamStatsSection>
      <LeftColumn>
        <ArrowLeft onClick={() => navigate("/bets")}/>
        <RecentForm>
          {activeTeam.recentForm.map((letter, index) => {
            return(
            <div
              key={index}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: letterColors[letter],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
              }}
            >
                {letter}
            </div>
            )
          })}
        </RecentForm>
      <BorderedMatch style={{border: '1px solid white'}}>
        <TeamStatsLogo>
        <Avatar alt="Image" src={activeTeam.logo} sx={{ width: 120, height: 120, border: '1px solid gold' }}/>
      </TeamStatsLogo>
          <TeamStatsWrapper>
              <TeamStatsName>{activeTeam.name}</TeamStatsName>
              <TeamStatCountry>
                <StatsCountryAvatar>
                {activeCountry === "England" && <Avatar alt="Image" src={england} sx={{ width: 30, height: 30}}/>}
                </StatsCountryAvatar>
                <StatsCountryLocation>{activeTeam.city}</StatsCountryLocation>
              </TeamStatCountry>
              <TeamStatsRating>
              <TeamRatingTitle>TEAM RATING:</TeamRatingTitle> <TeamRating><strong><CountUp endValue={activeTeam.teamRating} duration={500}/></strong></TeamRating><span></span>
              </TeamStatsRating>
              
          </TeamStatsWrapper> 
      </BorderedMatch>
      <TeamStatsRow>
      <SmallBorderedMatch style={{border: '1px solid #c2c2c2'}}>
              <Row>
                <Column><ColumnIcon><Stadium /></ColumnIcon><SmallColumnText>STADIUM</SmallColumnText><BigColumnText>{activeTeam.stadium}</BigColumnText></Column>
                <Column><ColumnIcon><Capacity /></ColumnIcon><SmallColumnText>CAPACITY</SmallColumnText><BigColumnText>{activeTeam.stadiumCapacity}</BigColumnText></Column>
              </Row>
              <Row>
                <Column><ColumnIcon><Coach/></ColumnIcon><SmallColumnText>COACH</SmallColumnText><BigColumnText>{activeTeam.coach}</BigColumnText></Column>
                <Column><ColumnIcon><Foundation/></ColumnIcon><SmallColumnText>FUNDATION DATE</SmallColumnText><BigColumnText>{activeTeam.foundationDate}</BigColumnText></Column>
              </Row>
      </SmallBorderedMatch>
      <SmallBorderedMatch style={{border: '1px solid #c2c2c2'}}>
              <Row>
                <Column><ColumnIcon><TeamMembers /></ColumnIcon><SmallColumnText>TOTAL PLAYERS</SmallColumnText><BigColumnText>{activeTeam.totalPlayers}</BigColumnText></Column>
                <Column><ColumnIcon><AgeAverage /></ColumnIcon><SmallColumnText>AVERAGE PLAYER AGE</SmallColumnText><BigColumnText>{activeTeam.averagePlayerAge}</BigColumnText></Column>
              </Row>
              <Row>
                <Column><ColumnIcon><CircularProgress variant="determinate" value={(activeTeam.nationalTeamPlayers * 100)/(activeTeam.totalPlayers)} sx={{ width: 30, height: 30 }}/></ColumnIcon><SmallColumnText>NATIONAL PLAYERS</SmallColumnText><BigColumnText>{activeTeam.nationalTeamPlayers}</BigColumnText></Column>
                <Column><ColumnIcon><CircularProgress variant="determinate" value={(activeTeam.foreignPlayers * 100)/(activeTeam.totalPlayers)} sx={{ width: 30, height: 30 }}/></ColumnIcon><SmallColumnText>FOREIGN PLAYERS</SmallColumnText><BigColumnText>{activeTeam.foreignPlayers}</BigColumnText></Column>
              </Row>
      </SmallBorderedMatch>
      </TeamStatsRow>
      <motion.div
                initial={{ height: 50, border: '1px solid white', borderRadius: '10px'}} // Initial height
                animate={{ height: isPlayerExpanded ? 'auto' : 50 }} // Height transitions between 100px and 300px
                transition={{ duration: 0.3 }} // Duration of the animation
                className="expandable-smalldiv"
                style={{
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid white',
                  marginTop: '40px'
                }}
              >
                {!isPlayerExpanded && <MiniArrowDown onClick={togglePlayerExpand}></MiniArrowDown>}
                {isPlayerExpanded && <MiniArrowup onClick={togglePlayerExpand}></MiniArrowup>}
                <AccordionTitle>PLAYERS</AccordionTitle>
                {isPlayerExpanded && <div className="hidden-content2">
                  <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                  {homeTeamPlayers?.map(player => {
                return(
                  <StatPlayer key={player.name}>
                    <PlayerPicture style={{backgroundImage: `url(${player.photo})`, backgroundPosition: 'center',
                  backgroundSize: 'cover'}}>
                    </PlayerPicture>
                    <PlayerName>{player.name}</PlayerName>
                    <PlayerPicture><PlayerDisplay>{player.number}</PlayerDisplay></PlayerPicture>
                    <PlayerPosition>{player.position}</PlayerPosition>
                    <PlayerPicture>{player.yellow}</PlayerPicture>
                    <PlayerPicture>{player.goals}</PlayerPicture>
                    <PlayerPicture>{player.assists}</PlayerPicture>
                    <PlayerPicture>{player.rating}</PlayerPicture>
                    <PlayerPicture>{player.available}</PlayerPicture>
                  </StatPlayer>
                )
              })}
                </div>
                              </div>}
            </motion.div>
      </LeftColumn>
      <RightColumn>
              <motion.div
                initial={{ height: 50, border: '1px solid white', borderRadius: '10px' }} // Initial height
                animate={{ height: isExpanded ? 220 : 50 }} // Height transitions between 100px and 300px
                transition={{ duration: 0.3 }} // Duration of the animation
                className="expandable-smalldiv"
                style={{
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid white'
                }}
              >
                {!isExpanded && <MiniArrowDown onClick={toggleExpand}></MiniArrowDown>}
                {isExpanded && <MiniArrowup onClick={toggleExpand}></MiniArrowup>}
                <AccordionTitle>SUMMARY</AccordionTitle>
                {isExpanded && <div className="hidden-content2">
                  <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                  {Object.entries(summary).map(([key, value], index) => (
                    <React.Fragment key={index}>
                      <div style={{ flex: '1 1 90%', padding: '5px', fontWeight: 'bold', color: 'white' }}>
                        {key}
                      </div>
                      <div style={{ flex: '1 1 10%', padding: '5px', color: 'white', textAlign: 'right' }}>
                        {value}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                              </div>}
            </motion.div>
            <motion.div
                initial={{ height: 50, border: '1px solid white', borderRadius: '10px'}} // Initial height
                animate={{ height: isAttackExpanded ? 800 : 50 }} // Height transitions between 100px and 300px
                transition={{ duration: 0.3 }} // Duration of the animation
                className="expandable-smalldiv"
                style={{
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid white'
                }}
              >
                {!isAttackExpanded && <MiniArrowDown onClick={toggleAttackExpand}></MiniArrowDown>}
                {isAttackExpanded && <MiniArrowup onClick={toggleAttackExpand}></MiniArrowup>}
                <AccordionTitle>ATTACKING</AccordionTitle>
                {isAttackExpanded && <div className="hidden-content2">
                  <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                  {Object.entries(attacking).map(([key, value], index) => (
                    <React.Fragment key={index}>
                      <div style={{ flex: '1 1 85%', padding: '5px', fontWeight: 'bold', color: 'white' }}>
                        {key}
                      </div>
                      <div style={{ flex: '1 1 15%', padding: '5px', color: 'white', textAlign: 'right' }}>
                        {value}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                              </div>}
            </motion.div>
            <motion.div
                initial={{ height: 50, border: '1px solid white', borderRadius: '10px'}} // Initial height
                animate={{ height: isDefenseExpanded ? 500 : 50 }} // Height transitions between 100px and 300px
                transition={{ duration: 0.3 }} // Duration of the animation
                className="expandable-smalldiv"
                style={{
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid white'
                }}
              >
                {!isDefenseExpanded && <MiniArrowDown onClick={toggleDefenseExpand}></MiniArrowDown>}
                {isDefenseExpanded && <MiniArrowup onClick={toggleDefenseExpand}></MiniArrowup>}
                <AccordionTitle>DEFENSE</AccordionTitle>
                {isDefenseExpanded && <div className="hidden-content2">
                  <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                  {Object.entries(defense).map(([key, value], index) => (
                    <React.Fragment key={index}>
                      <div style={{ flex: '1 1 85%', padding: '5px', fontWeight: 'bold', color: 'white' }}>
                        {key}
                      </div>
                      <div style={{ flex: '1 1 15%', padding: '5px', color: 'white', textAlign: 'right' }}>
                        {value}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                              </div>}
            </motion.div>
            <motion.div
                initial={{ height: 50, border: '1px solid white', borderRadius: '10px'}} // Initial height
                animate={{ height: isPassesExpanded ? 280 : 50 }} // Height transitions between 100px and 300px
                transition={{ duration: 0.3 }} // Duration of the animation
                className="expandable-smalldiv"
                style={{
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid white'
                }}
              >
                {!isPassesExpanded && <MiniArrowDown onClick={togglePassesExpand}></MiniArrowDown>}
                {isPassesExpanded && <MiniArrowup onClick={togglePassesExpand}></MiniArrowup>}
                <AccordionTitle>PASSES</AccordionTitle>
                {isPassesExpanded && <div className="hidden-content2">
                  <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                  {Object.entries(passes).map(([key, value], index) => (
                    <React.Fragment key={index}>
                      <div style={{ flex: '1 1 70%', padding: '5px', fontWeight: 'bold', color: 'white' }}>
                        {key}
                      </div>
                      <div style={{ flex: '1 1 30%', padding: '5px', color: 'white', textAlign: 'right' }}>
                        {value}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                              </div>}
            </motion.div>
            <motion.div
                initial={{ height: 50, border: '1px solid white', borderRadius: '10px'}} // Initial height
                animate={{ height: isOtherExpanded ? 400 : 50 }} // Height transitions between 100px and 300px
                transition={{ duration: 0.3 }} // Duration of the animation
                className="expandable-smalldiv"
                style={{
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid white'
                }}
              >
                {!isOtherExpanded && <MiniArrowDown onClick={toggleOtherExpand}></MiniArrowDown>}
                {isOtherExpanded && <MiniArrowup onClick={toggleOtherExpand}></MiniArrowup>}
                <AccordionTitle>OTHER</AccordionTitle>
                {isOtherExpanded && <div className="hidden-content2">
                  <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%' }}>
                  {Object.entries(other).map(([key, value], index) => (
                    <React.Fragment key={index}>
                      <div style={{ flex: '1 1 70%', padding: '5px', fontWeight: 'bold', color: 'white' }}>
                        {key}
                      </div>
                      <div style={{ flex: '1 1 30%', padding: '5px', color: 'white', textAlign: 'right' }}>
                        {value}
                      </div>
                    </React.Fragment>
                  ))}
                </div>
                              </div>}
            </motion.div>
            <SmallBorderedMatchRight style={{border: '1px solid #c2c2c2'}}>
              <Column>
              <ArrivalsTitle>ARRIVALS</ArrivalsTitle>
              <ArrivalsText>
                {activeTeam.Arrivals.map(player => {
                  return(
                    <div style={{flex: '1 1 33%', textAlign: 'center'}}>{player}</div>
                  )
                })}
              </ArrivalsText>
              </Column>
              <Column>
              <ArrivalsTitle>DEPARTURES</ArrivalsTitle>
              <ArrivalsText>
                {activeTeam.Departures.map(player => {
                  return(
                    <div style={{flex: '1 1 33%', textAlign: 'center'}}>{player}</div>
                  )
                })}
              </ArrivalsText>
              </Column>
            </SmallBorderedMatchRight>
      </RightColumn>
    </TeamStatsSection>
  )
}

export default TeamStats
