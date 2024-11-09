import React, {useState, useEffect} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { animationOne, transition } from '../animations'
import { ArrowLeft, ArrowRight, BetSection, BetTitleRow, DateRow, MatchOdds, OddsColumn, SportsButtonRow, TeamLogoText, TeamLogoWrapper, TeamsLogo, TeamsResult,
    LoadingSection,AllBets,AllBetsText,AllBetsBadge,OddsColumnBig,LiveWrapper,
    ResultRow,BigDateRow,VenueRow,
    ArrowDown,BackStyledIconButton,
    SmallArrowDown,
    StyledButton,
    ArrowLeftRelative,
    ArrowRightMiddle,
    ArrowRightRelative,
    SpinningBorder
 } from './index'
import Stack from '@mui/material/Stack';
import allBets from '../assets/allBets.png'
import { FantasyState } from '../context/FantasyContext'
import { SmallStatsWrapper,Rower, SportIcon, SportName, SportWrapper, BetConatiner, StyledButtonBets, LowRower, RowerRow } from '../components'
import { Avatar, Button, CircularProgress } from '@mui/material'
import { supabase } from '../supabase/client'
import premier from '../assets/premier.png'
import laLiga from '../assets/laliga.png'
import serieA from '../assets/serieA.png'
import ligue1 from '../assets/ligue1.jpg'
import aaa from '../assets/aaa.png'
import bundesliga from '../assets/bundesliga.png'
import { message } from 'antd'
import SelectedBet from '../components/menus/SelectedBet'
import AllBetsMenu from '../components/menus/AllBetsMenu'
import { useAuth } from './functions';
import Badge from '@mui/material/Badge';
import TeamStats from './TeamStats';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

const NewBets = () => {

    const {activeMatches, setActiveMatches} = FantasyState();
    const {activeLeague, setActiveLeague} = FantasyState();
    const {activeLeagueId, setActiveLeagueId} = FantasyState();
    const {activeRound,setActiveRound} = FantasyState();
    const [loading, setLoading] = useState(false)
    const [one, setOne] = useState(null)
    const [two, setTwo] = useState(null)
    const [draw, setDraw] = useState(null)
    const [homeOverTwoFive, setHomeOverTwoFive] = useState(null)
    const [homeUnderTwoFive, setHomeUnderTwoFive] = useState(null)
    const [awayOverTwoFive, setAwayOverTwoFive] = useState(null)
    const [awayUnderTwoFive, setAwayUnderTwoFive] = useState(null)
    const [btts, setBtts] = useState(null)
    const [btnts, setBtnts] = useState(null)
    const [homeBtts, setHomeBtts] = useState(null)
    const [awayBtts, setAwayBtts] = useState(null)
    const [homeBtnts, setHomeBtnts] = useState(null)
    const [homeMinus1, setHomeMinus1] = useState(null)
    const [awayBtnts, setAwayBtnts] = useState(null)
    const [awayMinus1, setAwayMinus1] = useState(null)
    const {selectedBet, setSelectedBet} = FantasyState();
    const {activeTeamId, setActiveTeamId} = FantasyState();
    const [selectedBetMenu, setSelectedBetMenu] = useState(false);
    const [isLiveOpen, setIsLeaveOpen] = useState(false)
    const [allBetsMenu, setAllBetsMenu] = useState(false);
    const [disabledButton, setDisabledButton] = useState("Premier League");
    const { user } = useAuth();
    const {pendingBets, setPendingBets} = FantasyState();
    const [selectedTeamMenu, setSelectedTeamMenu] = useState(false)
    const [betsToCheck, setBetsToCheck] = useState([])
    const [allFixtures, setAllFixtures] = useState([])
    const [expandedIndex, setExpandedIndex] = useState(null);
    const {balance, setBalance} = FantasyState();
    const navigate = useNavigate()


    const raiseRound = () => {
        setActiveRound((prevRound) => prevRound + 1)
    }
    const lowRound = () => {
        setActiveRound((prevRound) => prevRound - 1)
    }

    const getAllMatches = async () => {
      const { data, error } = await supabase
          .from('fixtures')
          .select('fixtures')
          .eq("leagueName", activeLeague)
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            setAllFixtures(data[0].fixtures)
          }
    }

    const setLiveMatches = async () => {
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
        const matches = []
        response.data.response.forEach((match) => {
          if(match.league.id === 135 || match.league.id === 140 || match.league.id === 61 || match.league.id === 78 || match.league.id === 39){
            matches.push(match)
          }
        })
        setActiveMatches(matches)
        setIsLeaveOpen(true)
      } catch (error) {
        console.error(error);
      }
    }

    useEffect(() => {
      getAllMatches();
    }, [])
 
    /* const getOdds = () => {
      if(activeMatches){
        console.log(activeMatches)
      }
    }

    useEffect(() => {
      getOdds();
    }, [activeMatches]) */

    const fetchCurrentRound = async (teamId) => {
        setLoading(true);
        try {
          const { data: roundData, error: roundError } = await supabase
            .from('fixtures') // Assuming this is your table
            .select('currentRound')
            .eq('leagueName', activeLeague); // Match the active team id (or league id)
    
          if (roundError) throw new Error(roundError.message);
          if (roundData && roundData.length > 0) {
            const currentRound = roundData[0].currentRound;
            setActiveRound(currentRound); // Set the active round
            //console.log(`Current round for league ${teamId}:`, currentRound);
          } else {
            console.error('No current round found for the team');
          }
        } catch (error) {
          console.error('Error fetching current round:', error);
        } finally {
          setLoading(false);
        }
      };
  
      const fetchMatchesForRound = async (round) => {
        setLoading(true);
        try {
            const string = round.toString();
          const { data: matchData, error: matchError } = await supabase
            .from('fixtures') // Assuming this is your table
            .select(string) // Fetch all match data, or specify the columns you need
            
            .eq('leagueName', activeLeague); // Also filter by the active team/league
    
          if (matchError) throw new Error(matchError.message);
          if (matchData && matchData.length > 0) {
            //console.log(matchData[0][string])
            setActiveMatches(matchData[0][string]); // Store the fetched matches in state
            //console.log(`Matches for round ${round}:`, matchData[0][string]);
          } else {
            console.log('No matches found for the selected round');
          }
        } catch (error) {
          console.error('Error fetching matches:', error);
          setActiveMatches([])
        } finally {
          setLoading(false);
        }
      };
  
    useEffect(() => {
        if (activeLeagueId) {
            fetchCurrentRound(activeLeagueId); // Fetch current round based on active team
        }
    }, [activeLeagueId]);

    useEffect(() => {
        if (activeRound !== null) {
            fetchMatchesForRound(activeRound); // Fetch matches for the active round
        }
    }, [activeRound]);
   
    const sendOdds = async (match) => {
        console.log(activeMatches)
        
        if(one === null || draw === null || two === null){
            message.error("Some data missing")
            return
        }
        const odds = {
            home: one,
            draw: draw,
            away: two,
            homeOver2: homeOverTwoFive,
            homeUnder2: homeUnderTwoFive,
            awayOver2: awayOverTwoFive,
            awayUnder2: awayUnderTwoFive,
            btts: btts,
            btnts: btnts,
            homeBTTS: homeBtts,
            homeBTNTS: homeBtnts,
            awayBTTS: awayBtts,
            awayBTNTS: awayBtnts,
            homeMinus1: homeMinus1,
            awayMinus1: awayMinus1
        }
        
       
        const game = activeMatches.filter((el) => el.fixture.id === match.fixture.id)
        console.log(game[0])
        game[0].odds = odds
        console.log(game)
        const gameTwo = allFixtures.filter((el) => el.fixture.id === match.fixture.id)
        console.log(gameTwo)
        gameTwo[0].odds = odds
        console.log(allFixtures)
        const { data, error } = await supabase
          .from('fixtures')
          .update([{"11": activeMatches}])
          .eq("leagueName", activeLeague)
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            console.log('User session data saved:', data)
            message.success("data inserted!")
          }
          const { data2, error2 } = await supabase
          .from('fixtures')
          .update([{fixtures: allFixtures}])
          .eq("leagueName", activeLeague)
          if (error2) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            console.log('User session data saved:', data2)
            message.success("data inserted!")
          }
        //console.log(updatedData)
        setOne(null)
        setDraw(null)
        setTwo(null)
        setHomeOverTwoFive(null)
        setHomeUnderTwoFive(null)
        setAwayOverTwoFive(null)
        setAwayUnderTwoFive(null)
        setBtts(null)
        setBtnts(null)
        setHomeBtnts(null)
        setAwayBtnts(null)
        setHomeBtts(null)
        setAwayBtts(null)
        setHomeMinus1(null)
        setAwayMinus1(null)
    }

    

    const sendOddsTwo = async (match) => {
    const str = localStorage.getItem("round")
    const json = JSON.parse(str)
    
    activeMatches.forEach((item2) => {
      // Find the corresponding item in array1 by matching the fixture id
      const match = json.response.find((item1) => item1.fixture.id === item2.fixture.id);
    
      // If a matching item is found, update fixture, goals, and score in array2
      if (match) {
        item2.fixture = match.fixture;
        item2.goals = match.goals;
        item2.score = match.score;
        item2.teams = match.teams;
      }
    });

    console.log(activeMatches)
    const { data, error } = await supabase
            .from('fixtures')
            .update([{"11": activeMatches}])
            .eq("leagueName", activeLeague)
            if (error) {
                console.error('Error inserting/updating user session data:', error.message)
            } else {
                console.log("Status changed")
                message.success("data successfully inserted on your ass")
                
        }
    }

    const sendOddsThree = async () => {
      const { data, error } = await supabase
      .from('fixtures')
      .select('fixtures')
      .eq("leagueName", activeLeague)
      if (error) {
          console.error('Error inserting/updating user session data:', error.message)
      } else {
          const fixtures = []
          data[0].fixtures.forEach((fix) => {
            if(fix.league.round === "Regular Season - 10"){
              fixtures.push(fix)
            }
          })
          console.log("fixtures", fixtures)
          const { error: updateError } = await supabase
                    .from('fixtures')
                    .update([{"10": fixtures}]) // Update the jsonb column
                    .eq("leagueName", activeLeague); // Identify which user to update
    
                if (updateError) {
                    console.error('Error updating user data:', updateError.message);
                } else {
                    
                    message.success('data inserted with my dick');
                }
          
  }
    }


    const sendOddsFour = async () => {
      try {
        const { data, error } = await supabase
          .from('teams')
          .select('teamId')
          .eq("league", activeLeague);
        
        if (error) {
          console.error('Error fetching team IDs:', error.message);
          return;
        }
    
        // Use a for...of loop to handle async delays correctly
        for (const team of data) {
          console.log(team.teamId);
          
          // Set up the API request options for each team
          const optionsThree = {
            method: 'GET',
            url: 'https://api-football-v1.p.rapidapi.com/v3/teams/statistics',
            params: {
              league: '61',
              season: '2024',
              team: team.teamId
            },
            headers: {
              'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
              'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
            }
          };
    
          try {
            const response = await axios.request(optionsThree);
            console.log(response.data);
    
            // Update the team stats in Supabase
            const { error: updateError } = await supabase
              .from('teams')
              .update({ stats: response.data.response })
              .eq('teamId', team.teamId); // Match the specific teamId for updating
    
            if (updateError) {
              console.error("Error updating team stats:", updateError.message);
            } else {
              console.log("Team stats updated successfully for teamId:", team.teamId);
            }
    
          } catch (error) {
            console.error("Error fetching team statistics:", error.message);
          }
    
          // Delay of 1 second before moving to the next request
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
    
      } catch (error) {
        console.error("Unexpected error in sendOddsFour:", error.message);
      }
    };
    
    const handleBetClick = (match, betType) => {
        setSelectedBet((prevBets) => {
          const isAlreadySelected = prevBets.some(
            (bet) => bet.match.fixture.id === match.fixture.id && bet.betType === betType
          );
          
          if (isAlreadySelected) {
            return prevBets.filter(
              (bet) => !(bet.match.fixture.id === match.fixture.id && bet.betType === betType)
            );
          } else {
            setSelectedBetMenu(true)
            return [...prevBets, { match, betType }];
          }
        });
      };
    //console.log(selectedBet)

    const handleButtonClick = (league) => {
        setDisabledButton(league.name);
        if(league.name === 'Premier League'){
            setActiveMatches([])
            setActiveRound(null)
            setActiveLeagueId(39)
            setActiveLeague("Premier League")
        }
        if(league.name === 'La Liga'){
            setActiveMatches([])
            setActiveRound(null)
            setActiveLeagueId(140)
            setActiveLeague("La Liga")
        }
        if(league.name === 'Serie A'){
            setActiveMatches([])
            setActiveRound(null)
            setActiveLeagueId(135)
            setActiveLeague("Serie A")
        }
        if(league.name === 'Bundesliga'){
            setActiveMatches([])
            setActiveRound(null)
            setActiveLeagueId(78)
            setActiveLeague("Bundesliga")
        }
        if(league.name === 'Ligue 1'){
            setActiveMatches([])
            setActiveRound(null)
            setActiveLeagueId(61)
            setActiveLeague("Ligue 1")
        }
      };

    const leagues = [
        { name: 'Premier League', logo: premier },
        { name: 'La Liga', logo: laLiga },
        { name: 'Serie A', logo: serieA },
        { name: 'Bundesliga', logo: bundesliga },
        { name: 'Ligue 1', logo: ligue1 }
      ];

      const fetchPendingYourBets = async () => {
        const { data, error } = await supabase
              .from('bets')
              .select('*')
              .eq('status', 'Pending')
              .eq('user_id', user.id)
              .order('id', { ascending: true });
              if (error) {
                console.error('Error inserting/updating user session data:', error.message)
              } else {
                setPendingBets(data.length)
                
                setBetsToCheck(data)
                
        }
      }

      useEffect(() => {
        fetchPendingYourBets();
      }, [user])

      const openTeamMenu = (id) => {
        setActiveTeamId(id)
        setSelectedTeamMenu(true)
      }

      const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
        
      };

      const goBack = () => {
        navigate(`/`)
      }

      console.log(activeMatches)
      
  return (
      <motion.div initial="out" animate="in" variants={animationOne} transition={transition}>
          <BetSection>
            <SportsButtonRow>
            {leagues.map((league, index) => (
        <StyledButtonBets
          key={index}
          variant="outlined"
          startIcon={<img src={league.logo} alt={league.name} style={{ width: 24, height: 24 }} />}
          onClick={() => handleButtonClick(league)}
          disabled={disabledButton === league.name}
          style={{
            marginRight: '10px',
            backgroundColor: disabledButton === league.name ? 'aqua' : 'transparent',
            color: disabledButton === league.name ? '#f8452e' : 'white',
            borderColor: disabledButton === league.name ? '#f8452e' : '#ccc',
            boxShadow: disabledButton === league.name ? '0 0 5px aqua, 0 0 25px aqua' : '',
            fontWeight: disabledButton === league.name ? 'bold' : ''
          }}
        >
          {league.name}
        </StyledButtonBets>
      ))}
            </SportsButtonRow>
            <BetTitleRow>
              <LiveWrapper onClick={setLiveMatches}>
              <SpinningBorder /> {/* Only this element will spin */}
              <span>LIVE</span> {/* This text will remain static */}
              </LiveWrapper>
              
              {isLiveOpen ? "" : <ArrowLeftRelative onClick={lowRound}></ArrowLeftRelative>}
              
              {isLiveOpen ? <h2>LIVE MATCHES</h2> : <h2>Round: {activeRound}</h2>}
              {isLiveOpen ? "" : <ArrowRightRelative onClick={raiseRound}></ArrowRightRelative>}
              
          </BetTitleRow>
          {loading ? (
            <LoadingSection>
            <CircularProgress />
            </LoadingSection>
          ) : (
            <BetConatiner>
             {/*  <StyledButton onClick={sendOddsTwo}>SEND</StyledButton> */}
    {Array.isArray(activeMatches) && activeMatches.length > 0 ? (
        activeMatches.map((match, index) => {
          
            const date = new Date(match.fixture.date).toLocaleString();
            const dateMS = new Date(match.fixture.date).getTime();
            const dateNow = new Date();
            
            return (
                <SmallStatsWrapper key={index}
                initial={{ minHeight: '130px' }}
                animate={{ minHeight: expandedIndex === index ? '330px' : '130px' }}
                transition={{ duration: 0.5 }}>
                  <Rower>
                    <TeamsLogo>
                        <TeamLogoWrapper>
                            <Avatar onClick={() => openTeamMenu(match.teams.home.id)} alt="Home Team Logo" src={match.teams.home.logo} sx={{
                                width: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 },
                                height: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 }, transform: 'translateY(5px)'
                            }} />
                        </TeamLogoWrapper>
                        <TeamLogoText>{match.teams.home.name}</TeamLogoText>
                    </TeamsLogo>
                    <TeamsResult>
                        <DateRow>{date}</DateRow>
                        {(match.fixture.status.short === "FT" || match.fixture.status.short === "1H" || match.fixture.status.short === "2H" || match.fixture.status.short === "HT") ? (
                            <>
                            <ResultRow><h2 style={{ color: match.teams.home.winner === true ? "lime" : "white" }}>{match.goals.home}</h2> - <h2 style={{ color: match.teams.away.winner === true ? "lime" : "white" }}>{match.goals.away}</h2></ResultRow>
                            <BigDateRow>( {match.score.halftime.home} - {match.score.halftime.away} )</BigDateRow>
                            </>
                        ) : (
                            <>
                            {(match.odds && dateNow < dateMS) ? (
                            <MatchOdds>
                            <OddsColumn
                                id={`${match.fixture.id}-home`}
                                isSelected={selectedBet.some(
                                    (bet) => bet.match.fixture.id === match.fixture.id && bet.betType === 'home'
                                )}
                                onClick={() => handleBetClick(match, 'home')}
                            >
                                {match.odds.home}
                            </OddsColumn>
                            <OddsColumn
                                id={`${match.fixture.id}-draw`}
                                isSelected={selectedBet.some(
                                    (bet) => bet.match.fixture.id === match.fixture.id && bet.betType === 'draw'
                                )}
                                onClick={() => handleBetClick(match, 'draw')}
                            >
                                {match.odds.draw}
                            </OddsColumn>
                            <OddsColumn
                                id={`${match.fixture.id}-away`}
                                isSelected={selectedBet.some(
                                    (bet) => bet.match.fixture.id === match.fixture.id && bet.betType === 'away'
                                )}
                                onClick={() => handleBetClick(match, 'away')}
                            >
                                {match.odds.away}
                            </OddsColumn>
                        </MatchOdds>
                        ) : (
                            <MatchOdds>
                              <OddsColumn style={{width: '50%'}}>{match.fixture.status.short === "PST" ? "MATCH POSTPONED" : match.fixture.status.short === "NS" ? "NOT STARTED" : match.fixture.status.short === "TBD" ? "TIME NOT DEFINED" : "MATCH STARTED"}
                                
                              </OddsColumn>
                                {/* <input style={{width: '50px'}} type='number' onChange={(e) => setOne(e.target.value)} />
                                <input style={{width: '50px'}} type='number' onChange={(e) => setDraw(e.target.value)} />
                                <input style={{width: '50px'}} type='number' onChange={(e) => setTwo(e.target.value)} />
                                <button onClick={() => sendOdds(match)}>SEND</button> */}
                            </MatchOdds>
                        )}
                            </>
                        )}
          <VenueRow>{match.fixture.venue.name}, {match.fixture.venue.city}</VenueRow>
          {(match.fixture.status.short !== "FT" && dateNow < dateMS) && <SmallArrowDown onClick={() => toggleExpand(index)}/>}
        </TeamsResult>
        <TeamsLogo>
          <TeamLogoWrapper>
            <Avatar onClick={() => openTeamMenu(match.teams.away.id)} alt="Away Team Logo" src={match.teams.away.logo} sx={{
                      width: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 },
                      height: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 }, transform: 'translateY(5px)'}} />
          </TeamLogoWrapper>
          <TeamLogoText>{match.teams.away.name}</TeamLogoText>
        </TeamsLogo>
        </Rower>
        {expandedIndex === index && (
            <LowRower >
              <RowerRow>
                {match?.odds?.homeOver2 ? <OddsColumnBig isSelected={selectedBet.some(
                                    (bet) => bet.match.fixture.id === match.fixture.id && bet.betType === 'homeOver2'
                                )}
                                onClick={() => handleBetClick(match, 'homeOver2')}>{match.teams.home.name} OVER 2.5 : {match?.odds?.homeOver2}</OddsColumnBig> : <input type='number' placeholder="HOME OVER 2.5" onChange={(e) => setHomeOverTwoFive(e.target.value)} />}
                {match?.odds?.btts ? <OddsColumnBig isSelected={selectedBet.some(
                                    (bet) => bet.match.fixture.id === match.fixture.id && bet.betType === 'btts'
                                )}
                                onClick={() => handleBetClick(match, 'btts')}>BOTH TEAMS SCORE : {match?.odds?.btts}</OddsColumnBig> : <input type='number' placeholder="BOTH TEAMS SCORE" onChange={(e) => setBtts(e.target.value)} />}
                {match?.odds?.awayOver2 ? <OddsColumnBig isSelected={selectedBet.some(
                                    (bet) => bet.match.fixture.id === match.fixture.id && bet.betType === 'awayOver2'
                                )}
                                onClick={() => handleBetClick(match, 'awayOver2')}>{match.teams.away.name} OVER 2.5 : {match?.odds?.awayOver2}</OddsColumnBig> : <input type='number' placeholder="AWAY OVER 2.5" onChange={(e) => setAwayOverTwoFive(e.target.value)} />}
              </RowerRow>
              <RowerRow>
                {match?.odds?.homeUnder2 ? <OddsColumnBig isSelected={selectedBet.some(
                                    (bet) => bet.match.fixture.id === match.fixture.id && bet.betType === 'homeUnder2'
                                )}
                                onClick={() => handleBetClick(match, 'homeUnder2')}>{match.teams.home.name} UNDER 2.5 : {match?.odds?.homeUnder2}</OddsColumnBig> : <input type='number' placeholder="HOME UNDER 2.5" onChange={(e) => setHomeUnderTwoFive(e.target.value)} />}
                {match?.odds?.btnts ? <OddsColumnBig isSelected={selectedBet.some(
                                    (bet) => bet.match.fixture.id === match.fixture.id && bet.betType === 'btnts'
                                )}
                                onClick={() => handleBetClick(match, 'btnts')}>BOTH TEAMS NOT SCORE : {match?.odds?.btnts}</OddsColumnBig> : <input type='number' placeholder="BOTH TEAMS NOT SCORE" onChange={(e) => setBtnts(e.target.value)} />}
                {match?.odds?.awayUnder2 ? <OddsColumnBig isSelected={selectedBet.some(
                                    (bet) => bet.match.fixture.id === match.fixture.id && bet.betType === 'awayUnder2'
                                )}
                                onClick={() => handleBetClick(match, 'awayUnder2')}>{match.teams.away.name} UNDER 2.5 : {match?.odds?.awayUnder2}</OddsColumnBig> : <input type='number' placeholder="AWAY UNDER 2.5" onChange={(e) => setAwayUnderTwoFive(e.target.value)} />}
              </RowerRow>
              <RowerRow>
              {match?.odds?.homeBTTS ? <OddsColumnBig isSelected={selectedBet.some(
                                    (bet) => bet.match.fixture.id === match.fixture.id && bet.betType === 'homeBTTS'
                                )}
                                onClick={() => handleBetClick(match, 'homeBTTS')}>{match.teams.home.name} WINS BOTH TEAMS SCORE: {match?.odds?.homeBTTS}</OddsColumnBig> : <input type='number' placeholder="HOME BOTH TEAMS SCORE" onChange={(e) => setHomeBtts(e.target.value)} />}
              {match?.odds?.homeMinus1 ? <OddsColumnBig isSelected={selectedBet.some(
                                    (bet) => bet.match.fixture.id === match.fixture.id && bet.betType === 'homeMinus1'
                                )}
                                onClick={() => handleBetClick(match, 'homeMinus1')}>{match.teams.home.name} -1 : {match?.odds?.homeMinus1}</OddsColumnBig> : <input type='number' placeholder="HOME -1" onChange={(e) => setHomeMinus1(e.target.value)} />}
                {match?.odds?.awayBTTS ? <OddsColumnBig isSelected={selectedBet.some(
                                    (bet) => bet.match.fixture.id === match.fixture.id && bet.betType === 'awayBTTS'
                                )}
                                onClick={() => handleBetClick(match, 'awayBTTS')}>{match.teams.away.name} WINS BOTH TEAMS SCORE : {match?.odds?.awayBTTS}</OddsColumnBig> : <input type='number' placeholder="AWAY BOTH TEAMS SCORE" onChange={(e) => setAwayBtts(e.target.value)} />}
              </RowerRow>
              <RowerRow>
              {match?.odds?.homeBTNTS ? <OddsColumnBig isSelected={selectedBet.some(
                                    (bet) => bet.match.fixture.id === match.fixture.id && bet.betType === 'homeBTNTS'
                                )}
                                onClick={() => handleBetClick(match, 'homeBTNTS')}>{match.teams.home.name} WINS BOTH TEAMS NOT SCORE : {match?.odds?.homeBTNTS}</OddsColumnBig> : <input type='number' placeholder="HOME BOTH TEAMS NOT SCORE" onChange={(e) => setHomeBtnts(e.target.value)} />}
              {match?.odds?.awayMinus1 ? <OddsColumnBig isSelected={selectedBet.some(
                                    (bet) => bet.match.fixture.id === match.fixture.id && bet.betType === 'awayMinus1'
                                )}
                                onClick={() => handleBetClick(match, 'awayMinus1')}>{match.teams.away.name} -1 : {match?.odds?.awayMinus1}</OddsColumnBig> : <input type='number' placeholder="AWAY -1" onChange={(e) => setAwayMinus1(e.target.value)} />}
                {match?.odds?.awayBTNTS ? <OddsColumnBig isSelected={selectedBet.some(
                                    (bet) => bet.match.fixture.id === match.fixture.id && bet.betType === 'awayBTNTS'
                                )}
                                onClick={() => handleBetClick(match, 'awayBTNTS')}>{match.teams.away.name} WINS BOTH TEAMS NOT SCORE : {match?.odds?.awayBTNTS}</OddsColumnBig> : <input type='number' placeholder="AWAY BOTH NOT TEAMS SCORE" onChange={(e) => setAwayBtnts(e.target.value)} />}
              </RowerRow>
            </LowRower>
          )}
      </SmallStatsWrapper>
    );
  })
) : (
  <LoadingSection>No matches found</LoadingSection>
)}           
            </BetConatiner>
          )}
          <AllBetsBadge>{pendingBets}</AllBetsBadge>
          <BackStyledIconButton onClick={goBack}><ArrowLeftRelative style={{transform: 'scale(1.5) rotate(90deg)'}}/></BackStyledIconButton>
          <AllBetsText onClick={() => setAllBetsMenu(true)}><img src={aaa} alt="" /></AllBetsText>
          </BetSection>
          <AnimatePresence>
          {selectedBetMenu && (
                <SelectedBet selectedBetMenu={selectedBetMenu} setSelectedBetMenu={setSelectedBetMenu} />
            )}
            {allBetsMenu && (
                <AllBetsMenu allBetsMenu={allBetsMenu} setAllBetsMenu={setAllBetsMenu} />
            )}
            {selectedTeamMenu && (
                <TeamStats selectedTeamMenu={selectedTeamMenu} setSelectedTeamMenu={setSelectedTeamMenu} />
            )}
            </AnimatePresence>
      </motion.div>
  )
}

export default NewBets
