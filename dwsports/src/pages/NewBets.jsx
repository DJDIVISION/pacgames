import React, {useState, useEffect} from 'react'
import { motion } from 'framer-motion'
import { animationOne, transition } from '../animations'
import { ArrowLeft, ArrowRight, BetSection, BetTitleRow, DateRow, MatchOdds, OddsColumn, SportsButtonRow, TeamLogoText, TeamLogoWrapper, TeamsLogo, TeamsResult,
    LoadingSection,AllBets,AllBetsText,
    ResultRow,BigDateRow
 } from './index'
import allBets from '../assets/allBets.png'
import { FantasyState } from '../context/FantasyContext'
import { SmallStatsWrapper, SportIcon, SportName, SportWrapper, BetConatiner } from '../components'
import { Avatar, CircularProgress } from '@mui/material'
import { supabase } from '../supabase/client'
import premier from '../assets/premier.png'
import laLiga from '../assets/laliga.png'
import serieA from '../assets/serieA.png'
import ligue1 from '../assets/ligue1.png'
import bundesliga from '../assets/bundesliga.png'
import { message } from 'antd'
import SelectedBet from '../components/menus/SelectedBet'
import AllBetsMenu from '../components/menus/AllBetsMenu'

const NewBets = () => {

    const {activeMatches, setActiveMatches} = FantasyState();
    const {activeLeague, setActiveLeague} = FantasyState();
    const {activeLeagueId, setActiveLeagueId} = FantasyState();
    const {activeRound,setActiveRound} = FantasyState();
    const [loading, setLoading] = useState(false)
    const [one, setOne] = useState(null)
    const [two, setTwo] = useState(null)
    const [draw, setDraw] = useState(null)
    const {selectedBet, setSelectedBet} = FantasyState();
    const [selectedBetMenu, setSelectedBetMenu] = useState(false);
    const [allBetsMenu, setAllBetsMenu] = useState(false);

    const raiseRound = () => {
        setActiveRound((prevRound) => prevRound + 1)
    }
    const lowRound = () => {
        setActiveRound((prevRound) => prevRound - 1)
    }
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
            console.log(`Current round for league ${teamId}:`, currentRound);
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
            setActiveMatches(matchData[0][string]); // Store the fetched matches in state
            console.log(`Matches for round ${round}:`, matchData[0][string]);
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

    const setSpain = () => {
        setActiveMatches([])
        setActiveRound(null)
        setActiveLeague("La Liga")
        setActiveLeagueId(140)
    }

    const setUK = async () => {
        setActiveMatches([])
        setActiveRound(null)
        setActiveLeagueId(39)
        setActiveLeague("Premier League")
    }

    const setItaly = () => {
        setActiveMatches([])
        setActiveRound(null)
        setActiveLeagueId(135)
        setActiveLeague("Serie A")
    }

    const setFrance = () => {
        setActiveMatches([])
        setActiveRound(null)
        setActiveLeagueId(61)
        setActiveLeague("Ligue 1")
    }

    const setGermany = () => {
        setActiveMatches([])
        setActiveRound(null)
        setActiveLeagueId(78)
        setActiveLeague("Bundesliga")
    }

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
          .update([{"12": activeMatches}])
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
    console.log(selectedBet)
  return (
      <motion.div initial="out" animate="in" variants={animationOne} transition={transition}>
          <BetSection>
            <SportsButtonRow>
            <SportWrapper onClick={setUK}>
                <SportIcon><img src={premier} alt="premier" /></SportIcon>
                <SportName>PREMIER LEAGUE</SportName>
            </SportWrapper>
            <SportWrapper onClick={setSpain}>
                <SportIcon><img src={laLiga} alt="laLiga" /></SportIcon>
                <SportName>LA LIGA</SportName>
            </SportWrapper>
            <SportWrapper onClick={setItaly}>
                <SportIcon><img src={serieA} alt="serieA" /></SportIcon>
                <SportName>SERIE A</SportName>
            </SportWrapper>
            <SportWrapper onClick={setFrance}>
                <SportIcon><img src={ligue1} alt="ligue1" /></SportIcon>
                <SportName>LIGUE 1</SportName>
            </SportWrapper>
            <SportWrapper onClick={setGermany}>
                <SportIcon><img src={bundesliga} alt="bundesliga" /></SportIcon>
                <SportName>BUNDESLIGA</SportName>
            </SportWrapper>
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
    {Array.isArray(activeMatches) && activeMatches.length > 0 ? (
        activeMatches.map((match, index) => {
            const date = new Date(match.fixture.date).toLocaleString();
            return (
                <SmallStatsWrapper key={index}>
                    <TeamsLogo>
                        <TeamLogoWrapper>
                            <Avatar alt="Home Team Logo" src={match.teams.home.logo} sx={{
                                width: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 },
                                height: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 }, transform: 'translateY(-5px)'
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
                            {match.odds ? (
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
                            <div>
                                <input type='number' onChange={(e) => setOne(e.target.value)} />
                                <input type='number' onChange={(e) => setDraw(e.target.value)} />
                                <input type='number' onChange={(e) => setTwo(e.target.value)} />
                                <button onClick={() => sendOdds(match)}>SEND</button>
                            </div>
                        )}
                            </>
                        )}
          <DateRow>{match.fixture.venue.name}, {match.fixture.venue.city}</DateRow>
        </TeamsResult>
        <TeamsLogo>
          <TeamLogoWrapper>
            <Avatar alt="Away Team Logo" src={match.teams.away.logo} sx={{
                      width: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 },
                      height: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 }, transform: 'translateY(-5px)'}} />
          </TeamLogoWrapper>
          <TeamLogoText>{match.teams.away.name}</TeamLogoText>
        </TeamsLogo>
      </SmallStatsWrapper>
    );
  })
) : (
  <LoadingSection>No matches found</LoadingSection>
)}
            </BetConatiner>
          )}
          <AllBets onClick={() => setAllBetsMenu(true)}><img src={allBets} alt='betsLogo' /></AllBets>
          <AllBetsText>YOUR BETS</AllBetsText>
          </BetSection>
          {selectedBetMenu && (
                <SelectedBet selectedBetMenu={selectedBetMenu} setSelectedBetMenu={setSelectedBetMenu} />
            )}
            {allBetsMenu && (
                <AllBetsMenu allBetsMenu={allBetsMenu} setAllBetsMenu={setAllBetsMenu} />
            )}
      </motion.div>
  )
}

export default NewBets
