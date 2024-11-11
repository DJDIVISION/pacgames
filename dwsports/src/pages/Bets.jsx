import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {motion,AnimatePresence} from 'framer-motion'
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { BallColumn,CountryBall,CountryBallText, MiniArrowDownTop, MiniArrowupTop,CountryBallTextTop, PlayerSettingsIcon, Search, SearchIconButton, ArrowLeftRelative, SmallArrowDown, TeamsLogo, TeamLogoWrapper, TeamLogoText, TeamsResult, DateRow, ResultRow, BigDateRow, VenueRow, ArrowRightRelative } from './index';
import {useTranslation} from "react-i18next";
import { Avatar, CircularProgress } from '@mui/material';
import england from '../assets/logos/england.png'
import spain from '../assets/logos/spain.png'
import italy from '../assets/logos/italy.png' 
import germany from '../assets/logos/germany.png' 
import france from '../assets/logos/france.png' 
import {Section,BottomRow,IconHolder,LeagueRowBets,Container,item,LeagueHolder,AbsoluteIconButton,ArrowUp,ArrowDown,
  Title,AbsoluteIconButtonLeft,TeamCircularRow,TeamRow,TeamBetsHolder,ArrowsHolder,ArrowIconHolder,RoundNameHolder
} from './indexThree' 
import { FantasyState } from '../context/FantasyContext';
import axios from 'axios';
import ownGoal from '../assets/logos/ownGoal.png'
import goal from '../assets/logos/goal.png'
import redCard from '../assets/logos/redCard.png'
import yellowCard from '../assets/logos/yellowCard.png'
import { LowRower, Rower, RowerFirstEvent, RowerRow, RowerRowEvent, RowerRowName, RowerTeamEvent } from '../components';
import { supabase } from '../supabase/client';
import Skeleton from '@mui/material/Skeleton';

const Bets = () => {

  const leagues = [
    {
        league: "Premier League",
        logo: england,
        name: "England",
        id: 39
    },
    {
        league: "La Liga",
        logo: spain,
        name: "Spain",
        id: 140
    },
    {
        league: "Serie A",
        logo: italy,
        name: "Italy",
        id: 135
    },
    {
        league: "Ligue 1",
        logo: france,
        name: "France",
        id: 61
    },
    {
        league: "Bundesliga",
        logo: germany,
        name: "Germany",
        id: 78
    }
]

  const [openLeagueMenu, setOpenLeagueMenu] = useState(true)
  const isMobile = useMediaQuery({ query: '(max-width: 498px)' });
  const [availableLeagues, setAvailableLeagues] = useState(leagues)
  const [t, i18n] = useTranslation("global");
  const [isDateExpanded, setIsDateExpanded] = useState(false)
  const [openMatchesMenu, setOpenMatchesMenu] = useState(false)
  const [openLiveMatchesMenu, setOpenLiveMatchesMenu] = useState(false)
  const [loadingMatches, setLoadingMatches] = useState(false)
  const [loadingLiveMatches, setLoadingLiveMatches] = useState(false)
  const {activeLeague, setActiveLeague} = FantasyState();
  const {activeRound,setActiveRound} = FantasyState();
  const [activeLeagueId, setActiveLeagueId] = useState(null)
  const [activeBall, setActiveBall] = useState(1)
  const [currentLiveMaches, setCurrentLiveMatches] = useState([])
  const [currentRoundMaches, setCurrentRoundMatches] = useState([])
  const [expandedIndex, setExpandedIndex] = useState(null);
  const navigate = useNavigate()

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleButtonClick = (league) => {
    setActiveLeagueId(league.id)
    setActiveLeague(league.league)
    setOpenLeagueMenu(false)
    setTimeout(() => {
      setOpenMatchesMenu(true)
    })
  };

  const variants = {
    expanded: {
        height: isMobile ? '10vh' : '10vh'
    },
    collapsed: {
        height: '0vh'
    },
  };
  const variantsTwo = {
      expanded: {
          height: isMobile ? '90vh' : '85vh'
      },
      collapsed: {
          height: isMobile ? '80vh' : '75vh'
      },
  };
  const closeDate = () => {
    setIsDateExpanded((prev) => !prev);
  }
  const setAllTeams = (league) => {
    console.log(league)
    setActiveLeague(league.legue); 
    setActiveBall(league.id)
    setActiveLeagueId(league.id)
    setOpenLeagueMenu(false); 
    setOpenLiveMatchesMenu(false)
    setTimeout(() => {
      setOpenMatchesMenu(true)
    }, 500)
  }
  const startAll = (league) => {
    setOpenMatchesMenu(false)
    setOpenLiveMatchesMenu(false)
   setCurrentRoundMatches([])
    setTimeout(() => {
      setOpenLeagueMenu(true); 
    }, 500)
  }
  const openLiveMatches = () => {
    setOpenLeagueMenu(false); 
    setOpenMatchesMenu(false)
    setTimeout(() => {
      setOpenLiveMatchesMenu(true)
    }, 500)
  }

  const getAllLiveMatches = async () => {
    setLoadingLiveMatches(true)
    const options = {
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
      params: {live: 'all'},
      headers: {
        'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
      }
    };
    try {
      const response = await axios.request(options);
      console.log(response.data);
      const data = (response.data.response) 
      const matches = []
      data.forEach((match) => {
        matches.push(match)
        /* if(match.league.id === 39 || match.league.id === 140 || match.league.id === 135 || match.league.id === 61 || match.league.id === 78){
          matches.push(match)
        } */
      })
      setCurrentLiveMatches(matches)
      setLoadingLiveMatches(false)
    } catch (error) {
      console.error(error);
    }
  }

  const fetchCurrentRound = async () => {
    setLoadingMatches(true)
    try {
      const { data: roundData, error: roundError } = await supabase
        .from('fixtures') // Assuming this is your table
        .select('currentRound')
        .eq('leagueName', activeLeague); // Match the active team id (or league id)

      if (roundError) throw new Error(roundError.message);
      if (roundData) {
        console.log(roundData)
        setActiveRound(roundData[0].currentRound)
        setLoadingMatches(false)
      } else {
        console.error('No current round found for the team');
      }
    } catch (error) {
      console.error('Error fetching current round:', error);
    } 
  };

  const fetchCurrentMatches = async () => {
    const options = {
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
      params: {
        league: activeLeagueId,
        season: '2024',
        round: `Regular Season - ${activeRound}`
      },
      headers: {
        'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
      }
    };
    try {
      const response = await axios.request(options);
      setCurrentRoundMatches(response.data.response);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (activeLeagueId) {
        fetchCurrentRound(activeLeagueId); 
    }
}, [activeLeagueId]);

useEffect(() => {
  if (activeRound) {
      fetchCurrentMatches(activeRound); 
  }
}, [activeRound]);

  console.log(activeRound)

  useEffect(() => {
    if(openLiveMatchesMenu){
      getAllLiveMatches();
    }
  }, [openLiveMatchesMenu])

  const raiseRound = () => {
    setCurrentRoundMatches([])
    setActiveRound((prevRound) => prevRound + 1)
  }
  const lowRound = () => {
      setCurrentRoundMatches([])
      setActiveRound((prevRound) => prevRound - 1)
  }


  return (
    <Section>
      {isDateExpanded ? <AbsoluteIconButton onClick={closeDate}><ArrowDown /></AbsoluteIconButton> : <AbsoluteIconButton onClick={closeDate}><ArrowUp /></AbsoluteIconButton>}
      <Title initial="expanded" style={{border: '1px solid red'}}
        animate={isDateExpanded ? "expanded" : "collapsed"} 
        variants={variants}
        transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}>
            <h2></h2>
        </Title>
        <AbsoluteIconButtonLeft onClick={() => navigate('/')}><ArrowLeftRelative style={{transform: 'translateY(0) rotate(90deg)'}}/></AbsoluteIconButtonLeft>
      <AnimatePresence>
        {openLeagueMenu && (
          <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"}
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}>
            <LeagueRowBets variants={item}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
              {availableLeagues?.map((league, index) => {
                return (

                  <LeagueHolder whileHover={{ scale: 1.05 }} key={league.name} onClick={() => handleButtonClick(league)}>
                    <BallColumn key={league.id}>
                      <CountryBall><img src={league.logo} alt="england" /></CountryBall>
                      <CountryBallTextTop>{league.name === "England" && `${t("fantasy.england")}`}{league.name === "Spain" && `${t("fantasy.spain")}`}{league.name === "Italy" && `${t("fantasy.italy")}`}
                        {league.name === "Germany" && `${t("fantasy.germany")}`}{league.name === "France" && `${t("fantasy.france")}`}</CountryBallTextTop><CountryBallTextTop>{league.league}</CountryBallTextTop>
                    </BallColumn>
                  </LeagueHolder>
                )
              })}
            </LeagueRowBets>
          </Container>
        )}
        {openMatchesMenu && (
          <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} >
            {loadingMatches ? (
              <TeamCircularRow>
                <CircularProgress sx={{ width: 80, height: 80 }} />
              </TeamCircularRow>
            ) : (
              <TeamRow variants={item}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                  <ArrowsHolder>
                    <ArrowIconHolder><ArrowLeftRelative onClick={lowRound} style={{transform: 'translateX(15px) rotate(90deg)'}}></ArrowLeftRelative></ArrowIconHolder>
                    <RoundNameHolder><h2>Round: {activeRound}</h2></RoundNameHolder>
                    <ArrowIconHolder><ArrowRightRelative onClick={raiseRound} style={{transform: 'translateX(-15px) rotate(270deg)'}}></ArrowRightRelative></ArrowIconHolder>
                  </ArrowsHolder>
                {currentRoundMaches?.map((match, index) => {
                  const date = new Date(match.fixture.date).toLocaleString();
                  return (
                    <TeamBetsHolder key={index} style={{margin: '0'}}
                      initial={{ height: '130px' }}
                      animate={{ height: expandedIndex === index ? '330px' : '130px' }}
                      transition={{ duration: 0.5 }}>
                      {expandedIndex === index ? <SmallArrowDown style={{ transform: 'rotate(180deg)' }} onClick={() => toggleExpand(index)} /> : <SmallArrowDown onClick={() => toggleExpand(index)} />}
                      <Rower>
                        <TeamsLogo>
                          {loadingMatches ? (
                            <Skeleton variant="circular" width={50} height={50} />
                          ) : (
                            <TeamLogoWrapper>
                            <Avatar /* onClick={() => openTeamMenu(match.teams.home.id)} */ alt="Home Team Logo" src={match.teams.home.logo} sx={{
                              width: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 },
                              height: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 }, transform: 'translateY(5px)'
                            }} />
                          </TeamLogoWrapper>
                          )}
                          <TeamLogoText>{match.teams.home.name}</TeamLogoText>
                        </TeamsLogo>
                        <TeamsResult>
                          <DateRow>{date}</DateRow>
                          <ResultRow><h2 style={{ color: match.teams.home.winner === true ? "lime" : "white" }}>{match.goals.home}</h2> - <h2 style={{ color: match.teams.away.winner === true ? "lime" : "white" }}>{match.goals.away}</h2></ResultRow>
                          <BigDateRow>{match.fixture.status.long}</BigDateRow>
                          <VenueRow>{match.fixture.venue.name}, {match.fixture.venue.city}</VenueRow>
                        </TeamsResult>
                        <TeamsLogo>
                          <TeamLogoWrapper>
                            <Avatar onClick={() => openTeamMenu(match.teams.away.id)} alt="Away Team Logo" src={match.teams.away.logo} sx={{
                              width: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 },
                              height: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 }, transform: 'translateY(5px)'
                            }} />
                          </TeamLogoWrapper>
                          <TeamLogoText>{match.teams.away.name}</TeamLogoText>
                        </TeamsLogo>
                      </Rower>
                      {expandedIndex === index && (
                        <LowRower >
                          {match?.events?.map((event) => {
                            console.log(event)
                            return (
                              <RowerRow>
                                <RowerRowEvent><RowerTeamEvent><img src={event?.team?.logo} alt="owngoal" /></RowerTeamEvent></RowerRowEvent>
                                <RowerFirstEvent>{event?.detail === "Own Goal" ? <img style={{ transform: 'rotate(180deg)' }} src={ownGoal} alt="owngoal" /> : event.detail === "Yellow Card" ? <img src={yellowCard} alt="owngoal" /> : event.detail === "Red Card" ? <img src={redCard} alt="owngoal" /> : event.detail === "Normal Goal" ? <img src={goal} alt="owngoal" /> :
                                  event.detail.startsWith("Substitution") ? <h2>OUT: {event?.assist?.name}</h2> : event.detail.startsWith("Goal Disallowed") ? <img src={ownGoal} alt="owngoal" /> : event?.detail}</RowerFirstEvent>
                                <RowerRowName><h2>{event?.player?.name}</h2></RowerRowName>
                                <RowerRowEvent><h2>{event?.time?.elapsed}'</h2></RowerRowEvent>

                              </RowerRow>
                            )
                          })}

                        </LowRower>
                      )}
                    </TeamBetsHolder>
                  )
                })}
              </TeamRow>
            )}
          </Container>
        )}
        {openLiveMatchesMenu && (
          <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"}
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} style={{
              paddingTop: isMobile ? "50px" : "0px"
            }}>
            {loadingLiveMatches ? (
              <TeamCircularRow>
                <CircularProgress sx={{ width: 80, height: 80 }} />
              </TeamCircularRow>
            ) : (
              <TeamRow variants={item}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                {currentLiveMaches?.map((match, index) => {
                  const date = new Date(match.fixture.date).toLocaleString();
                  return (
                    <TeamBetsHolder key={index}
                      initial={{ height: '130px' }}
                      animate={{ height: expandedIndex === index ? '330px' : '130px' }}
                      transition={{ duration: 0.5 }}>
                      {expandedIndex === index ? <SmallArrowDown style={{ transform: 'rotate(180deg)' }} onClick={() => toggleExpand(index)} /> : <SmallArrowDown onClick={() => toggleExpand(index)} />}
                      <Rower>
                        <TeamsLogo>
                          <TeamLogoWrapper>
                            <Avatar /* onClick={() => openTeamMenu(match.teams.home.id)} */ alt="Home Team Logo" src={match.teams.home.logo} sx={{
                              width: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 },
                              height: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 }, transform: 'translateY(5px)'
                            }} />
                          </TeamLogoWrapper>
                          <TeamLogoText>{match.teams.home.name}</TeamLogoText>
                        </TeamsLogo>
                        <TeamsResult>
                          <DateRow>{date}</DateRow>
                          <ResultRow><h2 style={{ color: match.teams.home.winner === true ? "lime" : "white" }}>{match.goals.home}</h2> - <h2 style={{ color: match.teams.away.winner === true ? "lime" : "white" }}>{match.goals.away}</h2></ResultRow>
                          <BigDateRow>{match.fixture.status.long}</BigDateRow>
                          <VenueRow>{match.fixture.venue.name}, {match.fixture.venue.city}</VenueRow>
                        </TeamsResult>
                        <TeamsLogo>
                          <TeamLogoWrapper>
                            <Avatar onClick={() => openTeamMenu(match.teams.away.id)} alt="Away Team Logo" src={match.teams.away.logo} sx={{
                              width: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 },
                              height: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 }, transform: 'translateY(5px)'
                            }} />
                          </TeamLogoWrapper>
                          <TeamLogoText>{match.teams.away.name}</TeamLogoText>
                        </TeamsLogo>
                      </Rower>
                      {expandedIndex === index && (
                        <LowRower >
                          {match?.events?.map((event) => {
                            console.log(event)
                            return (
                              <RowerRow>
                                <RowerRowEvent><RowerTeamEvent><img src={event?.team?.logo} alt="owngoal" /></RowerTeamEvent></RowerRowEvent>
                                <RowerFirstEvent>{event?.detail === "Own Goal" ? <img style={{ transform: 'rotate(180deg)' }} src={ownGoal} alt="owngoal" /> : event.detail === "Yellow Card" ? <img src={yellowCard} alt="owngoal" /> : event.detail === "Red Card" ? <img src={redCard} alt="owngoal" /> : event.detail === "Normal Goal" ? <img src={goal} alt="owngoal" /> :
                                  event.detail.startsWith("Substitution") ? <h2>OUT: {event?.assist?.name}</h2> : event.detail.startsWith("Goal Disallowed") ? <img src={ownGoal} alt="owngoal" /> : event?.detail}</RowerFirstEvent>
                                <RowerRowName><h2>{event?.player?.name}</h2></RowerRowName>
                                <RowerRowEvent><h2>{event?.time?.elapsed}'</h2></RowerRowEvent>

                              </RowerRow>
                            )
                          })}

                        </LowRower>
                      )}
                    </TeamBetsHolder>
                  )
                })}
              </TeamRow>

            )}

          </Container>
        )} 
      </AnimatePresence>
      <BottomRow>
        <IconHolder onClick={startAll}><h2 style={{color: openLeagueMenu ? "rgba(244,215,21,1)" : ""}}>{t("fantasy.title20")}</h2></IconHolder>
        <IconHolder>
          {openMatchesMenu ? <h2 style={{color: openMatchesMenu ? "rgba(244,215,21,1)" : ""}}>PICK A MATCH</h2> : <h2 onClick={() => openLiveMatches(true)}>LIVE MATCHES</h2>}
        </IconHolder>
        <IconHolder></IconHolder>
        <IconHolder></IconHolder>
      </BottomRow>
    </Section>
  )
}

export default Bets


