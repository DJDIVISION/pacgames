import React, {useState, useEffect} from 'react'
import styled from 'styled-components'
import {motion,AnimatePresence} from 'framer-motion'
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { BallColumn,CountryBall,CountryBallText, MiniArrowDownTop, MiniArrowupTop,CountryBallTextTop, PlayerSettingsIcon, Search, SearchIconButton, ArrowLeftRelative, SmallArrowDown, TeamsLogo, TeamLogoWrapper, TeamLogoText, TeamsResult, DateRow, ResultRow, BigDateRow, VenueRow, ArrowRightRelative, StyledButton } from './index';
import {useTranslation} from "react-i18next";
import { Avatar, CircularProgress } from '@mui/material';
import england from '../assets/logos/england.png'
import spain from '../assets/logos/spain.png'
import italy from '../assets/logos/italy.png' 
import germany from '../assets/logos/germany.png' 
import france from '../assets/logos/france.png' 
import chart from '../assets/logos/chart.png' 
import {Section,BottomRow,IconHolder,LeagueRowBets,Container,item,LeagueHolder,AbsoluteIconButton,ArrowUp,ArrowDown,
  Title,AbsoluteIconButtonLeft,TeamCircularRow,TeamRow,TeamBetsHolder,ArrowsHolder,ArrowIconHolder,RoundNameHolder,
  AbsoluteChart
} from './indexThree' 
import { FantasyState } from '../context/FantasyContext';
import axios from 'axios';
import ownGoal from '../assets/logos/ownGoal.png'
import goal from '../assets/logos/goal.png'
import redCard from '../assets/logos/redCard.png'
import penalty from '../assets/logos/penalty.png'
import yellowCard from '../assets/logos/yellowCard.png'
import { LowRower,Rower,RowerColumn,RowerRowBets,MiniRower,MiniRowerType,MiniRowerAmount,RowerFirstEvent, RowerRow, RowerRowEvent, RowerRowName, RowerTeamEvent, AbsoluteScore } from '../components';
import { supabase } from '../supabase/client';
import Skeleton from '@mui/material/Skeleton';
import LeagueStats from '../components/menus/LeagueStats';
import { useAuth } from './functions';
import { CrossAnimation, TickAnimation } from '../animations';

const Bets = () => {

  const leagues = [
    {
        league: "Premier League",
        logo: england,
        name: "England",
        id: 39,
        currentRound: 12
    },
    {
        league: "La Liga",
        logo: spain,
        name: "Spain",
        id: 140,
        currentRound: 14
    },
    {
        league: "Serie A",
        logo: italy,
        name: "Italy",
        id: 135,
        currentRound: 13
    },
    {
        league: "Ligue 1",
        logo: france,
        name: "France",
        id: 12
    },
    {
        league: "Bundesliga",
        logo: germany,
        name: "Germany",
        id: 78,
        currentRound: 11
    }
]

  const [openLeagueMenu, setOpenLeagueMenu] = useState(true)
  const { user } = useAuth();
  const isMobile = useMediaQuery({ query: '(max-width: 498px)' });
  const [availableLeagues, setAvailableLeagues] = useState(leagues)
  const [t, i18n] = useTranslation("global");
  const [isDateExpanded, setIsDateExpanded] = useState(false)
  const [openMatchesMenu, setOpenMatchesMenu] = useState(false)
  const [openLiveMatchesMenu, setOpenLiveMatchesMenu] = useState(false)
  const [openMyBetsMenu, setOpenMyBetsMenu] = useState(false)
  const [loadingMatches, setLoadingMatches] = useState(false)
  const [loadingLiveMatches, setLoadingLiveMatches] = useState(false)
  const [loadingBets, setLoadingBets] = useState(false)
  const {activeLeague, setActiveLeague} = FantasyState();
  const {activeRound,setActiveRound} = FantasyState();
  const {balance, setBalance} = FantasyState();
  const {activeLeagueId, setActiveLeagueId} = FantasyState();
  const [activeBall, setActiveBall] = useState(1)
  const [currentLiveMaches, setCurrentLiveMatches] = useState([])
  const [currentRoundMaches, setCurrentRoundMatches] = useState([])
  const [myBets, setMyBets] = useState([])
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [leagueStatsMenu, setLeagueStatsMenu] = useState(false);
  const navigate = useNavigate()
  const [premier, setPremier] = useState([])
  const [serieA, setSerieA] = useState([])
  const [bundesliga, setBundesliga] = useState([])
  const [ligue1, setLigue1] = useState([])
  const [laLiga, setLaLiga] = useState([])

  

  const getFixtures = async () => {
    const leagueIds = [39, 135, 140, 78, 61]; 
    const season = '2024';
    const apiKey = '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2';
    const apiHost = 'api-football-v1.p.rapidapi.com';
    const premier = localStorage.getItem("Premier League")
    if(premier === null){
      try {
        // Map each leagueId to an axios request
        const requests = leagueIds.map(leagueId => {
          const options = {
            method: 'GET',
            url: `https://${apiHost}/v3/fixtures`,
            params: { league: leagueId, season },
            headers: {
              'x-rapidapi-key': apiKey,
              'x-rapidapi-host': apiHost,
            },
          };
    
          return axios.request(options);
        });
    
        // Execute all requests at once
        const responses = await Promise.all(requests);
        responses.forEach((res) => {
          if(res.data.parameters.league === "39"){
            setPremier(res.data.response)
            const str = JSON.stringify(res.data.response)
            localStorage.setItem("Premier League", str)
          } else if(res.data.parameters.league === "140"){
            setLaLiga(res.data.response)
            const str = JSON.stringify(res.data.response)
            localStorage.setItem("La Liga", str)
          } else if(res.data.parameters.league === "135"){
            setSerieA(res.data.response)
            const str = JSON.stringify(res.data.response)
            localStorage.setItem("Serie A", str)
          } else if(res.data.parameters.league === "61"){
            setLigue1(res.data.response)
            const str = JSON.stringify(res.data.response)
            localStorage.setItem("Ligue 1", str)
          } else if(res.data.parameters.league === "78"){
            setBundesliga(res.data.response)
            const str = JSON.stringify(res.data.response)
            localStorage.setItem("Bundesliga", str)
          }
        })
      } catch (error) {
        console.error('Error fetching or updating fixtures:', error);
      }
    } else {
      console.log("this is from local")
      const prem = localStorage.getItem("Premier League")
      const json = JSON.parse(prem)
      setPremier(json)
      const prem2 = localStorage.getItem("La Liga")
      const json2 = JSON.parse(prem2)
      setLaLiga(json2)
      const prem3 = localStorage.getItem("Serie A")
      const json3 = JSON.parse(prem3)
      setSerieA(json3)
      const prem4 = localStorage.getItem("Ligue 1")
      const json4 = JSON.parse(prem4)
      setLigue1(json4)
      const prem5 = localStorage.getItem("Bundesliga")
      const json5 = JSON.parse(prem5)
      setBundesliga(json5)
    }
  }

  const getBets = async () => {
    if(user){
      const { data, error } = await supabase
          .from('bets')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', "Pending");
  
        if (error) {
          console.error('Error retrieving data from Supabase:', error.message);
        }
        if(data){
          setMyBets(data)
        }
    }
  }

  const writePendingBets = async () => {
    const updatedBets = myBets.map(bet => ({
      ...bet,
      bet: bet.bet.map(matchBet => {
        const fixtureId = matchBet.match.fixture.id;
        const league = matchBet.match.league.name;
  
        // Fetch matches for the league from local storage
        const matches = JSON.parse(localStorage.getItem(league));
  
        // Find and update the matching match with its goals
        const matchedGame = matches?.find(match => match.fixture.id === fixtureId);
        if (matchedGame) {
          /* const isWinningBet =
              (matchedGame.betType === "home" && matchedGame.goals.home > matchedGame.goals.away) ||
              (matchedGame.betType === "away" && matchedGame.goals.away > matchedGame.goals.home) ||
              (matchedGame.betType === "draw" && matchedGame.goals.home === matchedGame.goals.away) ||
              (matchedGame.betType === "homeOver2" && matchedGame.goals.home >= 3) ||
              (matchedGame.betType === "btts" && matchedGame.goals.home >= 1 && matchedGame.goals.away >= 1) ||
              (matchedGame.betType === "awayOver2" && matchedGame.goals.away >= 3) ||
              (matchedGame.betType === "homeUnder2" && matchedGame.goals.home <= 2) ||
              (matchedGame.betType === "btnts" && matchedGame.goals.home === 0 || matchedGame.goals.away === 0) ||
              (matchedGame.betType === "awayUnder2" && matchedGame.goals.away <= 2) ||
              (matchedGame.betType === "homeBTTS" && matchedGame.goals.home > matchedGame.goals.away && matchedGame.goals.away >= 1) ||
              (matchedGame.betType === "homeMinus1" && matchedGame.goals.home > matchedGame.goals.away + 1) ||
              (matchedGame.betType === "awayBTTS" && matchedGame.goals.away > matchedGame.goals.home && matchedGame.goals.home >= 1) ||
              (matchedGame.betType === "homeBTNTS" && matchedGame.goals.home > matchedGame.goals.away && matchedGame.goals.away === 0) ||
              (matchedGame.betType === "awayMinus1" && matchedGame.goals.away > matchedGame.goals.home + 1) ||
              (matchedGame.betType === "awayBTNTS" && matchedGame.goals.away > matchedGame.goals.home && matchedGame.goals.home === 0); */
          return {
            ...matchBet,
            match: {
              ...matchBet.match,
              goals: matchedGame.goals,
              teams: matchedGame.teams,
              fixture: matchedGame.fixture
            },
          };
        }
        return matchBet; // Return unchanged if no match found
      })
    }));
  
    // Update state with the modified bets array
    setMyBets(updatedBets);
  } 

  
  
  function isBetFulfilled(bet) {
    const { betType, match } = bet;
    const { home, away } = match.goals;
  
    switch (betType) {
      case "home":
        return home > away;
        case "away":
        return away > home;
        case "draw":
        return home === away;
      case "homeOver2":
        return home >= 3;
      case "homeUnder2":
        return home <= 2;
      case "homeBTTS":
        return home > 0 && away > 0;
      case "awayBTTS":
        return home > 0 && away > 0;
      case "homeBTNTS":
        return home > away && away === 0;
      case "awayBTNTS":
        return away > home || home === 0;
      case "btts":
        return home > 0 && away > 0;
      case "btnts":
        return home === 0 || away === 0;
      case "homeMinus1":
        return home - away >= 2;
      case "awayMinus1":
        return away - home >= 2;
      case "awayOver2":
        return away >= 3;
      case "awayUnder2":
        return away <= 2;
      default:
        return false;
    }
  }
  
  // Loop through each bet and check conditions
 


  const checkBets = () => {
    if(myBets){
      myBets.forEach(bet => {
        bet.bet.forEach(matchBet => {
          const isFulfilled = isBetFulfilled(matchBet);
          console.log(`Bet Type: ${matchBet.betType}, Fulfilled: ${isFulfilled}`);
          
          // Optionally update the bet object with the result
          matchBet.isWinningBet = isFulfilled;
        });
      });
    }
  }

  useEffect(() => {
    getBets();
  }, [user])

  useEffect(() => {
    checkBets();
  }, [myBets])

  

  useEffect(() => {
    if(openMyBetsMenu){
      getFixtures();
      writePendingBets();
    }
  }, [openMyBetsMenu])

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
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
    setOpenMyBetsMenu(false)
   setCurrentRoundMatches([])
   setActiveLeague("Premier League")
   setActiveLeagueId(39)
    setTimeout(() => {
      setOpenLeagueMenu(true); 
    }, 500)
  }
  const openLiveMatches = () => {
    setOpenLeagueMenu(false); 
    setOpenMyBetsMenu(false)
    setOpenMatchesMenu(false)
    setTimeout(() => {
      setOpenLiveMatchesMenu(true)
    }, 500)
  }
  const openBets = () => {
    setOpenLeagueMenu(false); 
    setOpenMatchesMenu(false)
    setTimeout(() => {
      setOpenMyBetsMenu(true)
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

  const handleButtonClick = (league) => {
    setActiveLeagueId(league.id)
    setActiveLeague(league.league)
    setActiveRound(league.currentRound)
    setOpenLeagueMenu(false)
    setTimeout(() => {
      setOpenMatchesMenu(true)
    })
  };

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

  const setOpenLeague = (league) => {
    setActiveLeagueId(league.id)
    setLeagueStatsMenu(true)
  }

  const fetchBets = async () => {
    const { data, error } = await supabase
          .from('bets')
          .select('*')
          .eq('leagueName', match.match.league.name);
  
        if (error) {
          console.error('Error retrieving data from Supabase:', error.message);
          return match; // Return the match as-is if there's an error
        }
  }

  const getURL = (betType, match) => {
    if(betType === "home") return match.teams.home.logo
    if(betType === "away") return match.teams.away.logo
    if(betType === "awayOver2") return match.teams.away.logo
    if(betType === "awayUnder2") return match.teams.away.logo
    if(betType === "awayBTTS") return match.teams.away.logo
    if(betType === "awayBTNTS") return match.teams.away.logo
    if(betType === "awayMinus1") return match.teams.away.logo
    if(betType === "homeOver2") return match.teams.home.logo
    if(betType === "homeBTTS") return match.teams.home.logo
    if(betType === "homeUnder2") return match.teams.home.logo
    if(betType === "homeBTNTS") return match.teams.home.logo
    if(betType === "homeMinus1") return match.teams.home.logo
    return ''
};

const getName = (betType, match) => {
    if(betType === "home") return `${match.teams.home.name} wins to ${match.teams.away.name}`
    if(betType === "away") return `${match.teams.away.name} wins to ${match.teams.home.name}`
    if(betType === "draw") return `${match.teams.home.name} draws with ${match.teams.away.name}`
    if(betType === "homeOver2") return `${match.teams.home.name} OVER 2.5`
    if(betType === "btts") return `${match.teams.home.name} & ${match.teams.away.name} score`
    if(betType === "homeBTTS") return `${match.teams.home.name} Wins both teams score`
    if(betType === "btnts") return `${match.teams.home.name} & ${match.teams.away.name} both not score`
    if(betType === "awayOver2") return `${match.teams.away.name} over 2.5`
    if(betType === "homeUnder2") return `${match.teams.home.name} under 2.5`
    if(betType === "awayUnder2") return `${match.teams.away.name} under 2.5`
    if(betType === "homeMinus1") return `${match.teams.home.name} - 1`
    if(betType === "awayBTTS") return `${match.teams.away.name} Wins both teams score`
    if(betType === "homeBTNTS") return `${match.teams.home.name} Wins both teams not score`
    if(betType === "awayMinus1") return `${match.teams.away.name} - 1`
    if(betType === "awayBTNTS") return `${match.teams.away.name} Wins both teams not score`
    return ''
};

const getOdd = (betType, match) => {
    if(betType === "home") return match.odds.home
    if(betType === "away") return match.odds.away
    if(betType === "draw") return match.odds.draw
    if(betType === "homeOver2") return match.odds.homeOver2
    if(betType === "btts") return match.odds.btts
    if(betType === "awayOver2") return match.odds.awayOver2
    if(betType === "homeUnder2") return match.odds.homeUnder2
    if(betType === "btnts") return match.odds.btnts
    if(betType === "awayUnder2") return match.odds.awayUnder2
    if(betType === "homeBTTS") return match.odds.homeBTTS
    if(betType === "homeMinus1") return match.odds.homeMinus1
    if(betType === "awayBTTS") return match.odds.awayBTTS
    if(betType === "homeBTNTS") return match.odds.homeBTNTS
    if(betType === "awayMinus1") return match.odds.awayMinus1
    if(betType === "awayBTNTS") return match.odds.awayBTNTS
    return ''
};

const getWinnings = (el) => {
  if(el.isWinningBet === true){
    return <TickAnimation />
  }
  if(el.isWinningBet === false){
    return <CrossAnimation />
  }
  return ''
}


  return (
    <Section>
      {isDateExpanded ? <AbsoluteIconButton onClick={closeDate}><ArrowDown /></AbsoluteIconButton> : <AbsoluteIconButton onClick={closeDate}><ArrowUp /></AbsoluteIconButton>}
      <Title initial="expanded" 
        animate={isDateExpanded ? "expanded" : "collapsed"} 
        variants={variants}
        transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}>
            <h2>YOUR BALANCE: {parseFloat(balance?.toFixed(2))} PGZ</h2>
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
                  <LeagueHolder whileHover={{ scale: 1.05 }} key={league.name} >
                    <AbsoluteChart onClick={() => setOpenLeague(league)}><img src={chart} alt="chart" /></AbsoluteChart>
                    <BallColumn key={league.id}>
                      <CountryBall onClick={() => handleButtonClick(league)}><img src={league.logo} alt="england" /></CountryBall>
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
                  console.log(match)
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
                          <RowerRow>
                              {match.fixture.status.short === "FT" ? <StyledButton>MATCH STATS</StyledButton> : ""}  
                          </RowerRow>

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
                {currentLiveMaches.length > 0 ? (
                    <>
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
                                  event.detail.startsWith("Substitution") ? <h2>OUT: {event?.assist?.name}</h2> : event.detail.startsWith("Goal Disallowed") ? <img src={ownGoal} alt="owngoal" /> : event.detail === "Penalty" ? <img src={penalty} alt="owngoal" /> : event?.detail}</RowerFirstEvent>
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
                    </>
                ) : (
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                  <h2 style={{fontSize: '18px', fontWeight: 'bold', color: 'aqua', width: '70%'}}>THERE ARE NO LIVE EVENTS AT THIS MOMENT</h2>
                  </div>
                )}
              </TeamRow>

            )}

          </Container>
        )} 
        {openMyBetsMenu && (
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
                exit="exit"  style={{paddingTop: '60px'}}
                transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                
                {myBets?.map((bet, index) => {
                  const type = bet.bet.length === 1 ? "SINGLE BET" : "MULTIPLE BET"
                  const date = bet.created_at
                  const newdate = new Date(date);
                  const localDateTime = newdate.toLocaleString();
                  return (
                    <TeamBetsHolder key={index} style={{margin: '0'}}
                      initial={{ height: '130px' }}
                      animate={{ height: expandedIndex === index ? '330px' : '130px' }}
                      transition={{ duration: 0.5 }}>
                      {expandedIndex === index ? <SmallArrowDown style={{ transform: 'rotate(180deg)' }} onClick={() => toggleExpand(index)} /> : <SmallArrowDown onClick={() => toggleExpand(index)} />}
                      <RowerColumn>
                          <MiniRower><MiniRowerType><h2>{type}</h2></MiniRowerType><MiniRowerAmount><span>{bet.amount} PGZ</span></MiniRowerAmount></MiniRower>
                          <MiniRower><h2>{localDateTime}</h2></MiniRower>
                          <MiniRower><MiniRowerType><h2 style={{fontSize: isMobile ? "16px" : "20px", transform: isMobile ? "translateY(5px)" : "translateY(10px)"}}>POSSIBLE WINNINGS</h2></MiniRowerType><MiniRowerAmount><span>{bet.possibleWinnings} PGZ</span></MiniRowerAmount></MiniRower>
                      </RowerColumn>
                      {expandedIndex === index && (
                        <LowRower >
                          {bet.bet.map((match) => {
                           
                            const url = getURL(match.betType, match.match);
                            const homeLogo = getURL("home", match.match);
                            const awayLogo = getURL("away", match.match);
                            const name = getName(match.betType, match.match)
                            const winnings = getWinnings(match)
                            
                            return(
                              <RowerRowBets>
                                <RowerFirstEvent><h2>{name}</h2></RowerFirstEvent>
                                <RowerRowEvent style={{backgroundImage: `url(${homeLogo})`, backgroundSize: '70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}><AbsoluteScore><h2 style={{color: match.match.teams.home.winner === true ? '#2cff02' : match.match.teams.home.winner === false ? '#ff2802' : '#eeff00'}}>{match.match.goals.home}</h2></AbsoluteScore></RowerRowEvent>
                                <RowerTeamEvent><h2>-</h2></RowerTeamEvent>
                                <RowerRowEvent style={{backgroundImage: `url(${awayLogo})`, backgroundSize: '70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}><AbsoluteScore><h2 style={{color: match.match.teams.away.winner === true ? '#2cff02' : match.match.teams.away.winner === false ? '#ff2802' : '#eeff00'}}>{match.match.goals.away}</h2></AbsoluteScore></RowerRowEvent>
                                <RowerRowEvent><h2 style={{fontSize: '22px'}}>{winnings}</h2></RowerRowEvent>
                              </RowerRowBets>
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
        {leagueStatsMenu && (
              <LeagueStats variants={item} 
              initial="initial"
              animate="animate"
              exit="exit" style={{justifyContent: 'space-around'}} leagueStatsMenu={leagueStatsMenu} setLeagueStatsMenu={setLeagueStatsMenu}/>
        )}
      </AnimatePresence>
      <BottomRow>
        <IconHolder onClick={startAll}><h2 style={{color: openLeagueMenu ? "rgba(244,215,21,1)" : ""}}>{t("fantasy.title20")}</h2></IconHolder>
        <IconHolder>
          {openMatchesMenu ? <h2 style={{color: openMatchesMenu ? "rgba(244,215,21,1)" : ""}}>PICK A MATCH</h2> : <h2 onClick={() => openLiveMatches(true)}>LIVE MATCHES</h2>}
        </IconHolder>
        <IconHolder></IconHolder>
        <IconHolder onClick={() => openBets()}><h2>YOUR BETS</h2></IconHolder>
      </BottomRow>
    </Section>
  )
}

export default Bets


