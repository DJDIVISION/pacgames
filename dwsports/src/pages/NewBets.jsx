import React, {useState, useEffect} from 'react'
import { motion } from 'framer-motion'
import { animationOne, transition } from '../animations'
import { ArrowLeft, ArrowRight, BetSection, BetTitleRow, DateRow, MatchOdds, OddsColumn, SportsButtonRow, TeamLogoText, TeamLogoWrapper, TeamsLogo, TeamsResult,
    LoadingSection,AllBets,AllBetsText,AllBetsBadge,OddsColumnBig,
    ResultRow,BigDateRow,VenueRow,
    ArrowDown,
    SmallArrowDown,
    StyledButton
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
    const [allBetsMenu, setAllBetsMenu] = useState(false);
    const [disabledButton, setDisabledButton] = useState("Premier League");
    const { user } = useAuth();
    const {pendingBets, setPendingBets} = FantasyState();
    const [selectedTeamMenu, setSelectedTeamMenu] = useState(false)
    const [betsToCheck, setBetsToCheck] = useState([])
    const [allFixtures, setAllFixtures] = useState([])
    const [expandedIndex, setExpandedIndex] = useState(null);

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
          .update([{"9": activeMatches}])
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
    console.log(allFixtures)
    const str = localStorage.getItem("round")
    const json = JSON.parse(str)
    /* const filter = json.response.filter((bet) => bet.goals.home !== null)
    console.log(filter)
    filter.forEach((el) => {
      allFixtures.forEach((match) => {
        if(el.fixture.id === match.fixture.id){
          console.log(el)
          el.goals.away = match.goals.away
          el.goals.home = match.goals.home
        }
      })
    }) */
    console.log(json.response)
    allFixtures.forEach((item2) => {
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
    
    console.log(allFixtures);
    const { data, error } = await supabase
            .from('fixtures')
            .update([{fixtures: allFixtures}])
            .eq("leagueName", activeLeague)
            if (error) {
                console.error('Error inserting/updating user session data:', error.message)
            } else {
                console.log("Status changed")
                message.success("data successfully inserted on your ass")
                
        }
  }
    
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

      const writePendingBets = () => {
        console.log(betsToCheck)
        console.log(allFixtures)
        betsToCheck.forEach((entry) => {
          entry.bet.forEach((bet) => {
            console.log(bet)
            const match = allFixtures.find(item1 => item1.fixture.id === bet.match.fixture.id);
            console.log(match)
          });
          /* entry.bet.forEach((bet) => {
            // Check if there is a matching fixture in array1 based on fixture.id
            const match = allFixtures.find(item1 => item1.fixture.id === bet.match.fixture.id);
            console.log("match", match)
            // If a matching fixture is found, update fixture, goals, and score
            if (match) {
              bet.match.fixture = match.fixture;
              bet.match.goals = match.goals;
              bet.match.score = match.score;
            }
          }); */
        });
        
        
        /* if(betsToCheck){
            const matchesWithFL = betsToCheck.filter(bet => bet.bet[0]?.match?.fixture?.status?.short === "FT");
            
            //console.log(matchesWithFL);
            matchesWithFL.forEach((betEntry) => {
                const {id, possibleWinnings} = betEntry
                betEntry.bet.forEach(async (individualBet) => {
                    const { betType, match} = individualBet;
                    
                    // Check if the team's winner status matches the betType
                    const isWinningBet = match.teams[betType]?.winner === true;
            
                    console.log(`Bet on ${betType} for match ${match.fixture.id} is ${isWinningBet ? 'a win' : 'a loss'}`);
                    
                    // You could also save the result back to the bet object if you need to
                    individualBet.isWinningBet = isWinningBet;
                    individualBet.id = id
                    individualBet.possibleWinnings = possibleWinnings
                    if(individualBet.isWinningBet === true){
                        const { data, error } = await supabase
                            .from('bets')
                            .update({status: 'Won'})
                            .eq('id', id)
                            if (error) {
                                console.error('Error inserting/updating user session data:', error.message)
                            } else {
                                console.log("Status changed")
                                
                        }
                    } else {
                        const { data, error } = await supabase
                            .from('bets')
                            .update({status: 'Lost'})
                            .eq('id', id)
                            if (error) {
                                console.error('Error inserting/updating user session data:', error.message)
                            } else {
                                console.log("Status changed")
                                
                        }
                    }
                });
            });
        } */
      }

      useEffect(() => {
        fetchPendingYourBets();
      }, [user])

      /* useEffect(() => {
        writePendingBets();
      }, [betsToCheck,allFixtures]) */

      const openTeamMenu = (id) => {
        setActiveTeamId(id)
        setSelectedTeamMenu(true)
      }

      const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
        
      };
      
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
              <ArrowLeft onClick={lowRound}></ArrowLeft>
              <h2>Round: {activeRound}</h2>
              <ArrowRight onClick={raiseRound}></ArrowRight>
          </BetTitleRow>
          {loading ? (
            <LoadingSection>
            <CircularProgress />
            </LoadingSection>
          ) : (
            <BetConatiner>
              <StyledButton onClick={sendOddsTwo}>SEND</StyledButton>
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
                        {match.fixture.status.short === "FT" ? (
                            <>
                            <ResultRow><h2 style={{ color: match.teams.home.winner === true ? "lime" : "white" }}>{match.score.fulltime.home}</h2> - <h2 style={{ color: match.teams.away.winner === true ? "lime" : "white" }}>{match.score.fulltime.away}</h2></ResultRow>
                            <BigDateRow>( {match.score.halftime.home} - {match.score.halftime.away} )</BigDateRow>
                            </>
                        ) : (
                            <>
                            {match.odds && dateNow < dateMS ? (
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
                              {/* <OddsColumn>MATCH STARTED</OddsColumn> */}
                                <input style={{width: '50px'}} type='number' onChange={(e) => setOne(e.target.value)} />
                                <input style={{width: '50px'}} type='number' onChange={(e) => setDraw(e.target.value)} />
                                <input style={{width: '50px'}} type='number' onChange={(e) => setTwo(e.target.value)} />
                                <button onClick={() => sendOdds(match)}>SEND</button>
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
            <LowRower className="hidden-content">
              <RowerRow>
                {match?.odds?.homeOver2 ? <OddsColumnBig>{match.teams.home.name} OVER 2.5 : {match?.odds?.homeOver2}</OddsColumnBig> : <input type='number' placeholder="HOME OVER 2.5" onChange={(e) => setHomeOverTwoFive(e.target.value)} />}
                {match?.odds?.btts ? <OddsColumnBig>BOTH TEAMS SCORE : {match?.odds?.btts}</OddsColumnBig> : <input type='number' placeholder="BOTH TEAMS SCORE" onChange={(e) => setBtts(e.target.value)} />}
                {match?.odds?.awayOver2 ? <OddsColumnBig>{match.teams.away.name} OVER 2.5 : {match?.odds?.awayOver2}</OddsColumnBig> : <input type='number' placeholder="AWAY OVER 2.5" onChange={(e) => setAwayOverTwoFive(e.target.value)} />}
              </RowerRow>
              <RowerRow>
                {match?.odds?.homeUnder2 ? <OddsColumnBig>{match.teams.home.name} UNDER 2.5 : {match?.odds?.homeUnder2}</OddsColumnBig> : <input type='number' placeholder="HOME UNDER 2.5" onChange={(e) => setHomeUnderTwoFive(e.target.value)} />}
                {match?.odds?.btnts ? <OddsColumnBig>BOTH TEAMS NOT SCORE : {match?.odds?.btnts}</OddsColumnBig> : <input type='number' placeholder="BOTH TEAMS NOT SCORE" onChange={(e) => setBtnts(e.target.value)} />}
                {match?.odds?.awayUnder2 ? <OddsColumnBig>{match.teams.away.name} UNDER 2.5 : {match?.odds?.awayUnder2}</OddsColumnBig> : <input type='number' placeholder="AWAY UNDER 2.5" onChange={(e) => setAwayUnderTwoFive(e.target.value)} />}
              </RowerRow>
              <RowerRow>
              {match?.odds?.homeBTTS ? <OddsColumnBig>{match.teams.home.name} BOTH TEAMS SCORE: {match?.odds?.homeBTTS}</OddsColumnBig> : <input type='number' placeholder="HOME BOTH TEAMS SCORE" onChange={(e) => setHomeBtts(e.target.value)} />}
              {match?.odds?.homeMinus1 ? <OddsColumnBig>{match.teams.home.name} -1 : {match?.odds?.homeMinus1}</OddsColumnBig> : <input type='number' placeholder="HOME -1" onChange={(e) => setHomeMinus1(e.target.value)} />}
                {match?.odds?.awayBTTS ? <OddsColumnBig>{match.teams.away.name} BOTH TEAMS SCORE : {match?.odds?.awayBTTS}</OddsColumnBig> : <input type='number' placeholder="AWAY BOTH TEAMS SCORE" onChange={(e) => setAwayBtts(e.target.value)} />}
              </RowerRow>
              <RowerRow>
              {match?.odds?.homeBTNTS ? <OddsColumnBig>{match.teams.home.name} BOTH TEAMS NOT SCORE : {match?.odds?.homeBTNTS}</OddsColumnBig> : <input type='number' placeholder="HOME BOTH TEAMS NOT SCORE" onChange={(e) => setHomeBtnts(e.target.value)} />}
              {match?.odds?.awayMinus1 ? <OddsColumnBig>{match.teams.away.name} -1 : {match?.odds?.awayMinus1}</OddsColumnBig> : <input type='number' placeholder="AWAY -1" onChange={(e) => setAwayMinus1(e.target.value)} />}
                {match?.odds?.awayBTNTS ? <OddsColumnBig>{match.teams.away.name} BOTH TEAMS NOT SCORE : {match?.odds?.awayBTNTS}</OddsColumnBig> : <input type='number' placeholder="AWAY BOTH NOT TEAMS SCORE" onChange={(e) => setAwayBtnts(e.target.value)} />}
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
          <AllBetsText onClick={() => setAllBetsMenu(true)}><img src={aaa} alt="" /></AllBetsText>
          </BetSection>
          {selectedBetMenu && (
                <SelectedBet selectedBetMenu={selectedBetMenu} setSelectedBetMenu={setSelectedBetMenu} />
            )}
            {allBetsMenu && (
                <AllBetsMenu allBetsMenu={allBetsMenu} setAllBetsMenu={setAllBetsMenu} />
            )}
            {selectedTeamMenu && (
                <TeamStats selectedTeamMenu={selectedTeamMenu} setSelectedTeamMenu={setSelectedTeamMenu} />
            )}
      </motion.div>
  )
}

export default NewBets
