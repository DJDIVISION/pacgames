import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { supabase } from '../../supabase/client';
import {motion} from 'framer-motion'
import {BetSection,ArrowUp,SportsButtonRow,item,BorderedMatch,BetWrapper,MatchColumn,MatchDate,TeamStatsLogo,AgeAverage,
  MatchOdds,OddsColumn,StatsIcon,MatchWrapper,MatchTeam,ArrowLeft,MiniArrowDown,MiniArrowup,TeamStatsSection,LeftColumn,
  RightColumn,TeamStatsWrapper,TeamStatsName,TeamStatCountry,StatsCountryAvatar,StatsCountryLocation,TeamStatsRating,
  TeamRatingTitle,TeamRating,AccordionTitle,SmallBorderedMatch,TeamMembers,Row,Column,ColumnIcon,SmallColumnText,BigColumnText,
  Stadium,Capacity,Coach,Foundation,RecentForm,TeamStatsRow,SmallBorderedMatchRight,ArrivalsText,ArrivalsTitle,ReadMore,
  TitleRow,TitleColumn,TeamsLogo,TeamsResult,DateRow,ResultRow,TeamLogoWrapper,TeamLogoText,NewHolder,TopRow
} from '../../pages/index'
import {CloseStats,StatsSection,StatsWrapper,StatsStadium,StatsStadiumCapacity,MatchLineUp,
  StatsPlayers,StatPlayer,PlayerPicture,PlayerName,PlayerNumber,PlayerPosition,Wrapper,PlayerDisplay,PlayerBigPicture
} from '../index'
import { Avatar, Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom'
import {Link as LinkR} from 'react-router-dom'
import { FantasyState } from '../../context/FantasyContext';
import { minWidth } from '@mui/system';
import axios from 'axios';



const TeamStats = ({selectedTeamMenu,setSelectedTeamMenu}) => {

  const navigate = useNavigate()
  const {activeLeague, setActiveLeague} = FantasyState();
  const {activeTeamId, setActiveTeamId} = FantasyState();
  const {activeLeagueId, setActiveLeagueId} = FantasyState();
  const [homeMatches, setHomeMatches] = useState([]);
  const [awayMatches, setAwayMatches] = useState([]);
  const [activeMatches, setActiveMatches] = useState([]);
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
  const [activeBackground, setActiveBackground] = useState('home')

  const GraphWrapper = styled.div`
    display: flex;
    align-items: center;
    height: 200px;
    max-width: 95%;
    overflow-y: hidden;
    overflow-x: scroll;
  `;

  const BarGraph = ({ results }) => {
    // Function to calculate bar properties based on result
    const validResults = typeof results === 'string' ? results : '';
    const getBarProperties = (result) => {
      switch (result) {
        case 'W':
          return { height: '80px', backgroundColor: 'green', marginTop: '-60px', minWidth: '30px' }; // Win: bar goes up
        case 'L':
          return { height: '80px', backgroundColor: 'red', marginTop: '100px', marginBottom: '20px', minWidth: '30px' }; // Loss: bar goes down
        case 'D':
          return { height: '40px', backgroundColor: 'grey', marginTop: '20px', minWidth: '30px' }; // Draw: stays at the center
        default:
          return { height: '0px', backgroundColor: 'grey', marginTop: '100px', minWidth: '30px' }; // Default (draw)
      }
    };
  
    return (
      <GraphWrapper>
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
      </GraphWrapper>
    );
  };

  
  const fetchData = async () => {
    setLoading(true);
    const options = {
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
      params: {
        season: '2024',
        team: activeTeamId
      },
      headers: {
        'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
      }
    };
    
    try {
      
      const response = await axios.request(options);
      
      const data = response.data.response 
      console.log(data);
      const homeMatches = [];
      const awayMatches = [];
      data.forEach((el) => {
        if (el.teams.home.id === activeTeamId && el.goals.home !== null) {
          homeMatches.push(el);
        } else if (el.teams.away.id === activeTeamId && el.fixture.referee !== null) {
          awayMatches.push(el);
        }
      })
      setHomeMatches(homeMatches);
      setAwayMatches(awayMatches);
      setActiveMatches(homeMatches);
    } catch (error) {
      console.error(error);
    }

    const optionsTwo = {
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/teams/statistics',
      params: {
        league: activeLeagueId,
        season: '2024',
        team: activeTeamId
      },
      headers: {
        'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(optionsTwo);
      console.log(response.data.response);
      const data = response.data.response
      setTeamData(data)
      setLineUps(data.lineups)
      setCleanSheets(data.clean_sheet)
      setFailedToScore(data.failed_to_score)
      setDraws(data.fixtures.draws)
      setLoses(data.fixtures.loses)
      setWins(data.fixtures.wins)
      setForm(data.form)
      setPlayed(data.fixtures.played)
      setPenaltyMissed(data.penalty.missed)
      setPenaltyScored(data.penalty.scored)
      setGoalsAgainst(data.goals.against.total)
      setGoalsFor(data.goals.for.total)
    } catch (error) {
      console.error(error);
    }
  
    // Second query: fetching team stats
    /* const { data: teamStatsData, error: teamStatsError } = await supabase
      .from('teams')
      .select('stats')
      .eq("teamId", activeTeamId);
    
    if (teamStatsError) {
      console.error('Error fetching team stats data:', teamStatsError.message);
    } else if (teamStatsData && teamStatsData.length > 0) {
      setTeamData(data.stats)
      setLineUps(data.stats.lineups)
      setCleanSheets(data.stats.clean_sheet)
      setFailedToScore(data.stats.failed_to_score)
      setDraws(data.stats.fixtures.draws)
      setLoses(data.stats.fixtures.loses)
      setWins(data.stats.fixtures.wins)
      setForm(data.stats.form)
      setPlayed(data.stats.fixtures.played)
      setPenaltyMissed(data.stats.penalty.missed)
      setPenaltyScored(data.stats.penalty.scored)
      setGoalsAgainst(data.stats.goals.against.total)
      setGoalsFor(data.stats.goals.for.total)
    } else {
      console.error('No team stats data found for the given team ID');
    } */
    setLoading(false);
  }

  /* console.log(teamData)
  console.log(activeTeamId)  */

  useEffect(() => {
    fetchData();
  }, [])
  
  const changeMatches = (e) => {
    if(e.target.id === 'home'){
      setActiveMatches(homeMatches)
      setActiveBackground('home')
    }
    if(e.target.id === 'away'){
      setActiveMatches(awayMatches)
      setActiveBackground('away')
    }
    
  }

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
                <TitleColumn><StyledButton className={`button ${activeBackground === 'home' ? 'active' : ''}`} id="home" onClick={(e) => changeMatches(e)}>HOME</StyledButton></TitleColumn>
                <TitleColumn><StyledButton className={`button ${activeBackground === 'away' ? 'active' : ''}`} id="away" onClick={(e) => changeMatches(e)}>AWAY</StyledButton></TitleColumn>
              </TitleRow>
              <TopRow>
              {activeMatches?.map((match) => {
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
              </TopRow>
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
              </RightColumn>
              </Row>

              <Row>
              <LeftColumn>
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
              </LeftColumn>
              <RightColumn>
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
              </RightColumn>
              </Row>

              <Row>
              <LeftColumn>
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
              </LeftColumn>
              <RightColumn>
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
              </RightColumn>
              </Row>

              <Row>
              <LeftColumn>
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
              </LeftColumn>
              <RightColumn>
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
              </RightColumn>
              </Row>

              <Row>
              <LeftColumn>
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
