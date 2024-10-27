import React, { useEffect, useState } from 'react'
import { BetState } from '../context/BetsContext';
import { supabase } from '../supabase/client';
import {motion} from 'framer-motion'
import {BetSection,ArrowUp,SportsButtonRow,item,BorderedMatch,BetWrapper,MatchColumn,MatchDate,TeamStatsLogo,AgeAverage,
  MatchOdds,OddsColumn,StatsIcon,MatchWrapper,MatchTeam,ArrowLeft,MiniArrowDown,MiniArrowup,TeamStatsSection,LeftColumn,
  RightColumn,TeamStatsWrapper,TeamStatsName,TeamStatCountry,StatsCountryAvatar,StatsCountryLocation,TeamStatsRating,
  TeamRatingTitle,TeamRating,AccordionTitle,SmallBorderedMatch,TeamMembers,Row,Column,ColumnIcon,SmallColumnText,BigColumnText,
  Stadium,Capacity,Coach,Foundation,RecentForm,TeamStatsRow,SmallBorderedMatchRight,ArrivalsText,ArrivalsTitle,ReadMore,
  TitleRow,TitleColumn,TeamsLogo,TeamsResult,DateRow,ResultRow,TeamLogoWrapper,TeamLogoText,NewHolder
} from './index'
import {CloseStats,StatsSection,StatsWrapper,StatsStadium,StatsStadiumCapacity,MatchLineUp,
  StatsPlayers,StatPlayer,PlayerPicture,PlayerName,PlayerNumber,PlayerPosition,Wrapper,PlayerDisplay,PlayerBigPicture
} from '../components/index'
import { Avatar } from '@mui/material';
import england from '../assets/england.png'
import spain from '../assets/england.png'
import italy from '../assets/england.png'
import CountUp from '../animations/CountUp';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom'
import {Link as LinkR} from 'react-router-dom'
import { FantasyState } from '../context/FantasyContext';



const TeamStats = ({selectedTeamMenu,setSelectedTeamMenu}) => {

  const navigate = useNavigate()
  const {activeLeague, setActiveLeague} = FantasyState();
  const {activeTeamId, setActiveTeamId} = FantasyState();
  const [homeMatches, setHomeMatches] = useState([]);
  const [awayMatches, setAwayMatches] = useState([]);
  const [teamData, setTeamData] = useState([])
  const [lineUps, setLineUps] = useState([])
  const [cleanSheets, setCleanSheets] = useState([])
  const [failedToScore, setFailedToScore] = useState([])
  const [draws, setDraws] = useState([])
  const [loses, setLoses] = useState([])
  const [wins, setWins] = useState([])
  const [played, setPlayed] = useState([])
  const [penaltyMissed, setPenaltyMissed] = useState([])
  const [penaltyScored, setPenaltyScored] = useState([])
  const [goalsAgainst, setGoalsAgainst] = useState([])
  const [goalsFor, setGoalsFor] = useState([])
  const [form, setForm] = useState([])
  const [loading, setLoading] = useState(false)

  const BarGraph = ({ results }) => {
    // Function to calculate bar properties based on result
    const validResults = typeof results === 'string' ? results : '';
    const getBarProperties = (result) => {
      switch (result) {
        case 'W':
          return { height: '80px', backgroundColor: 'green', marginTop: '0' }; // Win: bar goes up
        case 'L':
          return { height: '80px', backgroundColor: 'red', marginTop: '160px', marginBottom: '20px' }; // Loss: bar goes down
        case 'D':
          return { height: '40px', backgroundColor: 'grey', marginTop: '80px' }; // Draw: stays at the center
        default:
          return { height: '0px', backgroundColor: 'grey', marginTop: '100px' }; // Default (draw)
      }
    };
  
    return (
      <div style={{ display: 'flex', alignItems: 'center', height: '200px' }}>
        {validResults.split('').map((result, index) => (
          <div
            key={index}
            style={{
              width: '30px',
              margin: '0 5px',
              ...getBarProperties(result), // Apply calculated styles
              transition: '0.3s ease',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
            }}
          ></div>
        ))}
        {validResults.length === 0 && <p>No results available</p>} {/* Display a message if no results */}
      </div>
    );
  };

  
  const fetchData = async () => {
    setLoading(true);
  
    // First query: fetching fixtures data
    const { data: fixtureData, error: fixtureError } = await supabase
      .from('fixtures')
      .select('fixtures')
      .eq("leagueName", activeLeague);
    
    if (fixtureError) {
      console.error('Error fetching fixture data:', fixtureError.message);
    } else if (fixtureData && fixtureData.length > 0) {
      
      
      const homeMatches = [];
      const awayMatches = [];
  
      // Processing fixture data
      fixtureData[0].fixtures.forEach((el) => {
        if (el.teams.home.id === activeTeamId && el.goals.home !== null) {
          homeMatches.push(el);
        } else if (el.teams.away.id === activeTeamId && el.fixture.referee !== null) {
          awayMatches.push(el);
        }
      });
  
      setHomeMatches(homeMatches);
      setAwayMatches(awayMatches);
      console.log(homeMatches)
      console.log(awayMatches)
    } else {
      console.error('No fixture data found');
    }
  
    // Second query: fetching team stats
    const { data: teamStatsData, error: teamStatsError } = await supabase
      .from('teams')
      .select('stats')
      .eq("teamId", activeTeamId);
    
    if (teamStatsError) {
      console.error('Error fetching team stats data:', teamStatsError.message);
    } else if (teamStatsData && teamStatsData.length > 0) {
      setTeamData(teamStatsData[0].stats)
      setLineUps(teamStatsData[0].stats.lineups)
      setCleanSheets(teamStatsData[0].stats.clean_sheet)
      setFailedToScore(teamStatsData[0].stats.failed_to_score)
      setDraws(teamStatsData[0].stats.fixtures.draws)
      setLoses(teamStatsData[0].stats.fixtures.loses)
      setWins(teamStatsData[0].stats.fixtures.wins)
      setForm(teamStatsData[0].stats.form)
      setPlayed(teamStatsData[0].stats.fixtures.played)
      setPenaltyMissed(teamStatsData[0].stats.penalty.missed)
      setPenaltyScored(teamStatsData[0].stats.penalty.scored)
      setGoalsAgainst(teamStatsData[0].stats.goals.against.total)
      setGoalsFor(teamStatsData[0].stats.goals.for.total)
    } else {
      console.error('No team stats data found for the given team ID');
    }
  
    setLoading(false);
  
    /* const str2 = localStorage.getItem(activeTeamId);
    if(str2 !== null){
      const json2 = JSON.parse(str2);
      setTeamData(json2.response)
      setLineUps(json2.response.lineups)
      setCleanSheets(json2.response.clean_sheet)
      setFailedToScore(json2.response.failed_to_score)
      setDraws(json2.response.fixtures.draws)
      setLoses(json2.response.fixtures.loses)
      setWins(json2.response.fixtures.wins)
      setForm(json2.response.form)
      setPlayed(json2.response.fixtures.played)
      setPenaltyMissed(json2.response.penalty.missed)
      setPenaltyScored(json2.response.penalty.scored)
      setGoalsAgainst(json2.response.goals.against.total)
      setGoalsFor(json2.response.goals.for.total)
    } else {
      setTeamData([])
    } */
    
    /* json.response.forEach((el) => {
      if(el.teams.home.id === activeTeamId && el.goals.home !== null){
        homeMatches.push(el)
      } else if(el.teams.away.id === activeTeamId && el.fixture.referee !== null){
        awayMatches.push(el)
      }
    })
    setHomeMatches(homeMatches)
    setAwayMatches(awayMatches) */
  }

  /* console.log(teamData)
  console.log(activeTeamId)  */

  useEffect(() => {
    fetchData();
  }, [])
  

  return (
    <motion.div className="menu-container-one" variants={item}
              initial="initial"
              animate="animate"
              exit="exit">
    <TeamStatsSection>
      <CloseStats onClick={() => setSelectedTeamMenu(false)}/>
      {loading ? (
        <CircularProgress color="secondary" />
      ) : (
            <>
              <TitleRow>
                <TitleColumn>HOME</TitleColumn>
                <TitleColumn>AWAY</TitleColumn>
              </TitleRow>
              <Row>
                <LeftColumn>
                  {homeMatches.map((match) => {
                    const date = new Date(match.fixture.date).toLocaleString();
                    return (
                      <StatsWrapper>
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
                          <ResultRow><h2 style={{ color: match.teams.home.winner === true ? "lime" : "white" }}>{match.score.fulltime.home}</h2> - <h2 style={{ color: match.teams.away.winner === true ? "lime" : "white" }}>{match.score.fulltime.away}</h2></ResultRow>
                          <DateRow>( {match.score.halftime.home} - {match.score.halftime.away} )</DateRow>
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
                      </StatsWrapper>
                    )
                  })}
                </LeftColumn>
                <RightColumn>
                  {awayMatches.map((match) => {
                    const date = new Date(match.fixture.date).toLocaleString();
                    return (
                      <StatsWrapper>
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
                          <ResultRow><h2 style={{ color: match.teams.home.winner === true ? "lime" : "white" }}>{match.score.fulltime.home}</h2> - <h2 style={{ color: match.teams.away.winner === true ? "lime" : "white" }}>{match.score.fulltime.away}</h2></ResultRow>
                          <DateRow>( {match.score.halftime.home} - {match.score.halftime.away} )</DateRow>
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
                      </StatsWrapper>
                    )
                  })}
                </RightColumn>
              </Row>
              <NewHolder>
                <h3>RECENT FORM</h3>
                <BarGraph results={form} />
              </NewHolder>

              <Row>
                <LeftColumn>
                  <NewHolder>
                    <h3>GAMES PLAYED</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      {Object.entries(played).map(([key, value]) => (
                        <div key={key} style={{ margin: '0 10px', textAlign: 'center' }}>
                          <span style={{ fontWeight: 'bold' }}>{key.toUpperCase()}:</span>
                          <span style={{ marginLeft: '5px' }}>{value !== null ? value.toString() : 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </NewHolder>
                  <NewHolder>
                    <h3>GAMES LOST</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      {Object.entries(loses).map(([key, value]) => (
                        <div key={key} style={{ margin: '0 10px', textAlign: 'center' }}>
                          <span style={{ fontWeight: 'bold' }}>{key.toUpperCase()}:</span>
                          <span style={{ marginLeft: '5px' }}>{value !== null ? value.toString() : 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </NewHolder>
                  <NewHolder>
                    <h3>GOALS SCORED</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      {Object.entries(goalsFor).map(([key, value]) => (
                        <div key={key} style={{ margin: '0 10px', textAlign: 'center' }}>
                          <span style={{ fontWeight: 'bold' }}>{key.toUpperCase()}:</span>
                          <span style={{ marginLeft: '5px' }}>{value !== null ? value.toString() : 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </NewHolder>
                  <NewHolder>
                    <h3>CLEAN SHEETS</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      {Object.entries(cleanSheets).map(([key, value]) => (
                        <div key={key} style={{ margin: '0 10px', textAlign: 'center' }}>
                          <span style={{ fontWeight: 'bold' }}>{key.toUpperCase()}:</span>
                          <span style={{ marginLeft: '5px' }}>{value !== null ? value.toString() : 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </NewHolder>
                  <NewHolder>
                    <h3>SCORED PENALTIES</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      {Object.entries(penaltyScored).map(([key, value]) => (
                        <div key={key} style={{ margin: '0 10px', textAlign: 'center' }}>
                          <span style={{ fontWeight: 'bold' }}>{key.toUpperCase()}:</span>
                          <span style={{ marginLeft: '5px' }}>{value !== null ? value.toString() : 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </NewHolder>
                </LeftColumn>
                <RightColumn>
                  <NewHolder>
                    <h3>GAMES WON</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      {Object.entries(wins).map(([key, value]) => (
                        <div key={key} style={{ margin: '0 10px', textAlign: 'center' }}>
                          <span style={{ fontWeight: 'bold' }}>{key.toUpperCase()}:</span>
                          <span style={{ marginLeft: '5px' }}>{value !== null ? value.toString() : 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </NewHolder>
                  <NewHolder>
                    <h3>DRAW GAMES</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      {Object.entries(draws).map(([key, value]) => (
                        <div key={key} style={{ margin: '0 10px', textAlign: 'center' }}>
                          <span style={{ fontWeight: 'bold' }}>{key.toUpperCase()}:</span>
                          <span style={{ marginLeft: '5px' }}>{value !== null ? value.toString() : 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </NewHolder>
                  <NewHolder>
                    <h3>GOALS RECEIVED</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      {Object.entries(goalsAgainst).map(([key, value]) => (
                        <div key={key} style={{ margin: '0 10px', textAlign: 'center' }}>
                          <span style={{ fontWeight: 'bold' }}>{key.toUpperCase()}:</span>
                          <span style={{ marginLeft: '5px' }}>{value !== null ? value.toString() : 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </NewHolder>
                  <NewHolder>
                    <h3>FAILED TO SCORE</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      {Object.entries(failedToScore).map(([key, value]) => (
                        <div key={key} style={{ margin: '0 10px', textAlign: 'center' }}>
                          <span style={{ fontWeight: 'bold' }}>{key.toUpperCase()}:</span>
                          <span style={{ marginLeft: '5px' }}>{value !== null ? value.toString() : 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </NewHolder>
                  <NewHolder>
                    <h3>MISSED PENALTIES</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      {Object.entries(penaltyMissed).map(([key, value]) => (
                        <div key={key} style={{ margin: '0 10px', textAlign: 'center' }}>
                          <span style={{ fontWeight: 'bold' }}>{key.toUpperCase()}:</span>
                          <span style={{ marginLeft: '5px' }}>{value !== null ? value.toString() : 'N/A'}</span>
                        </div>
                      ))}
                    </div>
                  </NewHolder>
                </RightColumn>
              </Row>
            </>
      )}
    </TeamStatsSection>
    </motion.div>
  )
}

export default TeamStats
