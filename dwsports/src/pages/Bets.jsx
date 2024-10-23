import React, {useState,useEffect,useRef} from 'react'
import Sports from '../components/Sports'
import {BetSection,ArrowUp,SportsButtonRow,item,Match,BetWrapper,MatchColumn,MatchDate,MatchLogo,MatchTime,
    MatchOdds,OddsColumn,StatsIcon,MatchWrapper,MatchTeam,ArrowLeft,MiniArrowDown,MiniArrowup,
    TeamsLogo,
    TeamLogoWrapper,
    TeamLogoText,
    TeamsResult,
    DateRow,
    ArrowRight,
    BetTitleRow
} from './index'
import {CloseStats,StatsSection,SmallStatsWrapper,StatsStadium,StatsStadiumCapacity,MatchLineUp,
    StatsPlayers,StatPlayer,PlayerPicture,PlayerName,PlayerNumber,PlayerPosition,Column,Wrapper,PlayerDisplay
  } from '../components/index'
import Countries from '../components/Countries'
import { BetState } from '../context/BetsContext'
import Leagues from '../components/Leagues'
import { motion } from 'framer-motion'
import {Avatar, Button, CircularProgress,IconButton} from '@mui/material';

import MatchStats from '../components/MatchStats'
import SelectedBet from '../components/menus/SelectedBet'
import {Link as LinkR} from 'react-router-dom'
import { animationOne, animationTwo, transition, transitionLong } from '../animations'
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { supabase } from '../supabase/client'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './functions'
import { FantasyState } from '../context/FantasyContext'
import { message } from 'antd'

const Bets = () => {

    const [activeSportMenu, setActiveSportMenu] = useState(true);
    const [activeCountryMenu, setActiveCountryMenu] = useState(false);
    const [activeLeaguesMenu, setActiveLeaguesMenu] = useState(false);
    const [selectedBetMenu, setSelectedBetMenu] = useState(false);
    const [betsMenu, setBetsMenu] = useState(false);
    const {activeSport, setActiveSport} = BetState();
    const {activeCountry, setActiveCountry} = BetState();
    const {activeLeague, setActiveLeague} = BetState();
    const {activeTeam, setActiveTeam} = BetState();
    const {activeMatches, setActiveMatches} = FantasyState();
    const {activeLeagueId, setActiveLeagueId} = FantasyState();
    const {activeRound,setActiveRound} = FantasyState();
    const {homeTeam, setHomeTeam} = BetState([])
    const {awayTeam, setAwayTeam} = BetState([])
    const {matchToBet, setMatchToBet} = BetState([])
    const [matchStatsMenu, setMatchStatsMenu] = useState(false)
    const {selectedBet, setSelectedBet} = BetState()
    const {homeTeamLogo, setHomeTeamLogo} = BetState()
    const {awayTeamLogo, setAwayTeamLogo} = BetState()
    const {homeTeamPlayers, setHomeTeamPlayers} = BetState()
    const {awayTeamPlayers, setAwayTeamPlayers} = BetState()
    const [expandedId, setExpandedId] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const { user } = useAuth();
    const [one, setOne] = useState(null)
    const [two, setTwo] = useState(null)
    const [draw, setDraw] = useState(null)
    
    console.log(activeMatches)
    const toggleExpand = async (match) => {
        setLoading(true)
        setExpandedId(expandedId === match.id ? null : match.id)
        const home = match.home.replace(/\s+/g, '');
        const away = match.away.replace(/\s+/g, '');
        console.log(home,away)
        const { data, error } = await supabase.from('premierLeague').select(`${home}, ${away}`).eq("id", 1);
        if(error){
          console.log(error)
        }
        if(data){
            console.log(data[0])
            setHomeTeamPlayers(data[0][home][0].players)
            setHomeTeam(data[0][home][0].name)
            setAwayTeamPlayers(data[0][away][0].players)
            setAwayTeam(data[0][away][0].name)
        }
        setLoading(false)
    }



    const Switch = () => {
        if(activeCountryMenu === true){
            setActiveCountryMenu(false)
            setActiveSportMenu(true)
        }
        if(activeLeaguesMenu === true){
            setActiveLeaguesMenu(false)
            setActiveCountryMenu(true)
        }
        setBetsMenu(false)
    }


    const openHomeTeam = async (match) => {
        const home = match.home.replace(/\s+/g, '');
        const { data, error } = await supabase.from('teamStats').select(home).eq("id", 1);
        if(error){
          console.log(error)
        }
        if(data){
            setActiveTeam(data[0][home][0])
            
        }
        navigate(`/team/${match.homeId}`)
    }

    const openAwayTeam = async (match) => {
        const away = match.away.replace(/\s+/g, '');
        console.log(away)
        const { data, error } = await supabase.from('teamStats').select(away).eq("id", 1);
        if(error){
          console.log(error)
        }
        if(data){
            setActiveTeam(data[0][away][0])
            
        }
        navigate(`/team/${match.awayId}`)
    }

    

    const handleBetClick = (match, betType, oddValue, homeTeam, awayTeam) => {
        if(selectedBet === null){
            setSelectedBet({ match, betType, oddValue });
            setSelectedBetMenu(true)
            setHomeTeamLogo(homeTeam.logo)
            setAwayTeamLogo(awayTeam.logo)
            //setBetsMenu(false)
            console.log(match)
            console.log(betType)
            console.log(oddValue)
        } else {
            setSelectedBet(null)
        }
        // Perform additional actions if needed, such as updating the state elsewhere or logging
    };

    const sendOdds = async (match) => {
        console.log(activeMatches)
        if(one === null || draw === null || two === null){
            message.error("Some data missing")
            return
        }
        const odds = {
            home: one,
            draw: draw,
            away: two
        }
        
       
        const game = activeMatches.filter((el) => el.fixture.id === match.fixture.id)
        console.log(game[0])
        game[0].odds = odds
        console.log(activeMatches)
        const { data, error } = await supabase
          .from('fixtures')
          .update([{"nextRound": activeMatches}])
          .eq("id", activeLeagueId)
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            console.log('User session data saved:', data)
            message.success("data inserted!")
          }
        //console.log(updatedData)
        setOne(null)
        setDraw(null)
        setTwo(null)
    }
    console.log(activeLeagueId)
    const sendMatches = async () => {
        
    }

    

    return (
        <motion.div initial="out" animate="in" variants={animationOne} transition={transition}>
        <BetSection>
            <SportsButtonRow>
            { !activeCountryMenu && !activeLeaguesMenu && !selectedBetMenu && <LinkR to="/"><ArrowLeft /></LinkR>}
            {activeSportMenu && (
                <Sports activeSportMenu={activeSportMenu} setActiveSportMenu={setActiveSportMenu} activeCountryMenu={activeCountryMenu} setActiveCountryMenu={setActiveCountryMenu}/>
            )}
            {activeCountryMenu && (
            <>
            <ArrowUp onClick={Switch} />
                 <Countries activeSportMenu={activeSportMenu} setActiveSportMenu={setActiveSportMenu} activeCountryMenu={activeCountryMenu} setActiveCountryMenu={setActiveCountryMenu}
                activeLeaguesMenu={activeLeaguesMenu} setActiveLeaguesMenu={setActiveLeaguesMenu} betsMenu={betsMenu} setBetsMenu={setBetsMenu}/>
                </>
            )}
            {activeLeaguesMenu && (
                <>
                <ArrowUp onClick={Switch} />
                <Leagues />
                </>
            )}
            {selectedBetMenu && (
                <SelectedBet selectedBetMenu={selectedBetMenu} setSelectedBetMenu={setSelectedBetMenu} setSelectedBet={setSelectedBet} selectedBet={selectedBet}/>
            )}
            </SportsButtonRow>
                {betsMenu && (
                <>
                {!selectedBetMenu && <ArrowUp onClick={Switch} />}
                <BetWrapper>
                  <BetTitleRow>
                    <ArrowLeft onClick={lowRound}></ArrowLeft>
                  <h2>Round: {activeRound}</h2>
                    <ArrowRight onClick={raiseRound}></ArrowRight>
                  </BetTitleRow>
                    {activeMatches && activeMatches.map((match) => {
                        const date = new Date(match.fixture.date).toLocaleString();
                        return(
                            <SmallStatsWrapper>
                        <TeamsLogo>
                          <TeamLogoWrapper>
                            <Avatar alt="Image" src={match.teams.home.logo} sx={{
                              width: { xs: 50, sm: 50, md: 70, lg: 80, xl: 80 },
                              height: { xs: 50, sm: 50, md: 70, lg: 80, xl: 80 }, transform: 'translateY(5px)'
                            }} />
                          </TeamLogoWrapper>
                          <TeamLogoText>{match.teams.home.name}</TeamLogoText>
                        </TeamsLogo>
                        <TeamsResult>
                          <DateRow>{date}</DateRow>
                          {match.odds ? (
                          <>
                          {/* <div style={{display: 'flex'}}>
                            <input type='number' onChange={(e) => setOne(e.target.value)} style={{width: '40px', height: '40px'}}></input>
                            <input type='number' onChange={(e) => setDraw(e.target.value)} style={{width: '40px', height: '40px'}}></input>
                            <input type='number' onChange={(e) => setTwo(e.target.value)} style={{width: '40px', height: '40px'}}></input>
                            <button onClick={() => sendOdds(match)}>SEND</button>
                          </div> */}
                            <MatchOdds>
                                <OddsColumn>{match.odds.home}</OddsColumn>
                                <OddsColumn>{match.odds.draw}</OddsColumn>
                                <OddsColumn>{match.odds.away}</OddsColumn>
                            </MatchOdds>
                            </>
                          ) : (
                            <div style={{display: 'flex'}}>
                            <input type='number' onChange={(e) => setOne(e.target.value)} style={{width: '40px', height: '40px'}}></input>
                            <input type='number' onChange={(e) => setDraw(e.target.value)} style={{width: '40px', height: '40px'}}></input>
                            <input type='number' onChange={(e) => setTwo(e.target.value)} style={{width: '40px', height: '40px'}}></input>
                            <button onClick={() => sendOdds(match)}>SEND</button>
                          </div>
                          )}
                          <DateRow style={{ fontSize: '12px' }}>{match.fixture.venue.name}, {match.fixture.venue.city}</DateRow>
                        </TeamsResult>
                        <TeamsLogo>
                          <TeamLogoWrapper>
                            <Avatar alt="Image" src={match.teams.away.logo} sx={{
                              width: { xs: 50, sm: 50, md: 70, lg: 80, xl: 80 },
                              height: { xs: 50, sm: 50, md: 70, lg: 80, xl: 80 }, transform: 'translateY(5px)'
                            }} />
                          </TeamLogoWrapper>
                          <TeamLogoText>{match.teams.away.name}</TeamLogoText>
                        </TeamsLogo>
                      </SmallStatsWrapper>
                        )
                    })}
                    {/* <Button onClick={sendMatches}>SEND MATCHES</Button> */}
                {/* <motion.div  variants={item}
                initial={{height:0,opacity:0}}
                animate={{height: '100%', opacity:1}}
                transition={{duration:.5}}
                exit="exit">
                    {activeMatches.map((match) => {
                        return(
                            <motion.div
                            key={match.id}
                            initial={{ height: 150, border: '1px solid white', borderRadius: '10px' }} // Initial height
                            animate={{ height: expandedId === match.id ? 'auto' : 150 }} // Conditionally expand based on id
                            transition={{ duration: 0.5 }} // Duration of the animation
                            className="expandable-div"
                            style={{
                                overflow: 'hidden',
                                position: 'relative'
                              }}
                            >
                            {!expandedId && <MiniArrowDown onClick={() => toggleExpand(match)}></MiniArrowDown>}
                            {expandedId && <MiniArrowup onClick={() => toggleExpand(match)}></MiniArrowup>}
                        <Match >
                            <MatchColumn style={{transform: 'translateX(-50px)', cursor: 'pointer'}} onClick={() => openHomeTeam(match)}>
                                <MatchLogo>
                                    <img src={match.homeLogo} alt="homeTeam" />
                                </MatchLogo>
                                <MatchTeam>{match.home}</MatchTeam>
                            </MatchColumn>
                            <MatchColumn>
                                <MatchDate>{match.date}</MatchDate>
                                <MatchTime>{match.time}</MatchTime>
                                <MatchOdds>
                                    <OddsColumn isSelected={selectedBet?.match.id === match.id && selectedBet?.betType === '1'}
                                        onClick={() => handleBetClick(match, '1', match[1], homeTeam, awayTeam)}><span>1 - </span>{(match[1]).toFixed(2)}</OddsColumn>
                                    <OddsColumn isSelected={selectedBet?.match.id === match.id && selectedBet?.betType === 'X'}
                                        onClick={() => handleBetClick(match, 'X', match.X, homeTeam, awayTeam)}><span>X - </span>{(match.X).toFixed(2)}</OddsColumn>
                                    <OddsColumn isSelected={selectedBet?.match.id === match.id && selectedBet?.betType === '2'}
                                        onClick={() => handleBetClick(match, '2', match[2], homeTeam, awayTeam)}><span>2 - </span>{(match[2]).toFixed(2)}</OddsColumn>
                                </MatchOdds>
                            </MatchColumn>
                            <MatchColumn style={{transform: 'translateX(50px)', cursor: 'pointer'}} onClick={() => openAwayTeam(match)}>
                                <MatchLogo>
                                    <img src={match.awayLogo} alt="awayTeam" />
                                </MatchLogo>
                                <MatchTeam>{match.away}</MatchTeam>
                            </MatchColumn>
                        </Match>
                        {expandedId === match.id && (
                            <div className="hidden-content">
                            {loading ? (
                                <CircularProgress color="secondary" />
                            ) : (
                                <Wrapper>
            <StatsPlayers>
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
            </StatsPlayers>
            <StatsPlayers>
              {awayTeamPlayers?.map(player => {
                return(
                  <StatPlayer key={player.name}>
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
                            )}
                            
                            </div>
                        )}
                        <StatsIcon onClick={() => setHomes(match)}/>
                        </motion.div>
                        )
                    })}
                </motion.div> */}
                </BetWrapper>
                </>
            )}
            {matchStatsMenu && (
                <MatchStats matchStatsMenu={matchStatsMenu} setMatchStatsMenu={setMatchStatsMenu}/>
            )}
            
            
        </BetSection>
        </motion.div>
    );
}

export default Bets
