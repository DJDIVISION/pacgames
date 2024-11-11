import React, {useEffect, useState} from 'react'
import { motion } from 'framer-motion'
import premier from '../../assets/premier.png'
import laLiga from '../../assets/laliga.png'
import serieA from '../../assets/serieA.png'
import ligue1 from '../../assets/ligue1.png'
import bundesliga from '../../assets/bundesliga.png'
import { message } from 'antd';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../pages/functions';
import { FantasyState } from '../../context/FantasyContext';
import { item } from '../../pages';
import { CloseStats,StatsWrapper,BetSection,TeamsLogo,AvatarHolder,TypeofBet,TeamsName,HalfColumn,AbsoluteAvatar,
    FilterContainer,TeamsDate,TeamsStatus,
    CloseFilter,CloseFilterTwo
 } from './index';
import { Avatar, CircularProgress } from '@mui/material';
import draw from "../../assets/draw.png"
import {  StyledButtonBets } from '../../components'
import axios from 'axios'



const AllBetsMenu = ({allBetsMenu,setAllBetsMenu}) => {

  
  const [myBets, setMyBets] = useState([])
  const [disabledButton, setDisabledButton] = useState("Your Bets");
  const [disabledButtonTwo, setDisabledButtonTwo] = useState("Pending Bets");
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false)
  const [fixtures, setFixtures] = useState([])
  const [homeResult, setHomeResult] = useState(null)
  const [awayResult, setAwayResult] = useState(null)
  const [loading, setLoading] = useState(false)


  

  

  

  const leagues = [
    { name: 'Your Bets', logo: premier },
    { name: 'All Bets', logo: laLiga },
  ];
  const leaguesTwo = [
    { name: 'Pending Bets', logo: serieA },
    { name: 'Won Bets', logo: bundesliga },
    { name: 'Lost Bets', logo: ligue1 }
  ];

  const handleButtonClick = (league) => {
    setDisabledButton(league.name);
    setDisabledButtonTwo("Pending Bets")
    if(league.name === 'Your Bets'){
        fetchBets()
    }
    if(league.name === 'All Bets'){
        fetchAllBets();
    }
    
  };

  const handleButtonClickTwo = (league) => {
    setDisabledButtonTwo(league.name);
    if(league.name === 'Pending Bets'){
        if(disabledButton === 'Your Bets'){
            fetchPendingYourBets()
        }
        if(disabledButton === 'All Bets'){
            fetchPendingBets()
        }
    }
    if(league.name === 'Won Bets'){
        if(disabledButton === 'Your Bets'){
            fetchWonYourBets()
        }
        if(disabledButton === 'All Bets'){
            fetchAllWonBets()
        }
    }
    if(league.name === 'Lost Bets'){
        if(disabledButton === 'Your Bets'){
            fetchLostYourBets()
        }
        if(disabledButton === 'All Bets'){
            fetchAllLostBets()
        }
    }
  }
  

  const fetchBets = async () => {
    const { data, error } = await supabase
          .from('bets')
          .select('*')
          .eq('user_id', user.id)
          .order('id', { ascending: true });
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            getFixtures(data)
            
    }
  }

  const fetchAllWonBets = async () => {
    const { data, error } = await supabase
          .from('bets')
          .select('*')
          .eq('status', 'WON')
          .order('id', { ascending: true });
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            getFixtures(data)
            
    }
  }

  const fetchWonYourBets = async () => {
    const { data, error } = await supabase
          .from('bets')
          .select('*')
          .eq('status', 'WON')
          .eq('user_id', user.id)
          .order('id', { ascending: true });
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            console.log(data)
            getFixtures(data)
    }
  }

  const fetchAllLostBets = async () => {
    const { data, error } = await supabase
          .from('bets')
          .select('*')
          .eq('status', 'LOST')
          .order('id', { ascending: true });
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            console.log(data)
            getFixtures(data)
    }
  }

  const fetchLostYourBets = async () => {
    const { data, error } = await supabase
          .from('bets')
          .select('*')
          .eq('status', 'LOST')
          .eq('user_id', user.id)
          .order('id', { ascending: true });
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            console.log(data)
            getFixtures(data)
    }
  }

  const fetchPendingBets = async () => {
    const { data, error } = await supabase
          .from('bets')
          .select('*')
          .eq('status', 'Pending')
          .order('id', { ascending: true });
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            getFixtures(data)

            console.log("data before", data)
            
    }
  }

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
            getFixtures(data)
            
    }
  }

  const fetchAllBets = async () => {
    const { data, error } = await supabase
          .from('bets')
          .select('*')
          .eq('status', 'Pending')
          .order('id', { ascending: true });
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            getFixtures(data)
            
    }
  }

  useEffect(() => {
    if(user){
      fetchPendingYourBets();
    }
  }, [user])
  

  const closeBetsMenu = () => {
    setAllBetsMenu(false)
  }

  const closeFilterMenu = () => {
    setIsExpanded(!isExpanded)
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
    return '✅'
  }
  if(el.isWinningBet === false){
    return '❌'
  }
  return ''
}

function getAllWinningBets(bets) {
  return bets.filter(entry =>
      entry.bet.every(bet => bet.isWinningBet === true)
  );
}

// Function to get entries with one or more losing bets
function getMixedOrLosingBets(bets) {
  return bets.filter(entry =>
      entry.bet.some(bet => bet.isWinningBet === false)
  );
}

console.log(myBets)

const writePendingBets = () => {
  
  const filteredArray = myBets.filter(entry =>
    entry.bet.every(bet => bet.match.goals.home !== null)
  );
  if(filteredArray.length > 0){
    console.log(filteredArray)
    filteredArray.forEach(entry => {
      entry.bet.forEach(bet => {
          const { betType, match } = bet;
          const { home, away } = match.goals;
  
          // Determine if the bet is a winning one based on the goals
          const isWinningBet =
              (betType === "home" && home > away) ||
              (betType === "away" && away > home) ||
              (betType === "draw" && home === away) ||
              (betType === "homeOver2" && home >= 3) ||
              (betType === "btts" && home >= 1 && away >= 1) ||
              (betType === "awayOver2" && away >= 3) ||
              (betType === "homeUnder2" && home <= 2) ||
              (betType === "btnts" && home === 0 || away === 0) ||
              (betType === "awayUnder2" && away <= 2) ||
              (betType === "homeBTTS" && home > away && away >= 1) ||
              (betType === "homeMinus1" && home > away + 1) ||
              (betType === "awayBTTS" && away > home && home >= 1) ||
              (betType === "homeBTNTS" && home > away && away === 0) ||
              (betType === "awayMinus1" && away > home + 1) ||
              (betType === "awayBTNTS" && away > home && home === 0);
  
          // Add a property to indicate if this is a winning bet
          bet.isWinningBet = isWinningBet;
      });
    });
    console.log(filteredArray);
    const allWinningBets = getAllWinningBets(filteredArray);
    const mixedOrLosingBets = getMixedOrLosingBets(filteredArray);
  
    console.log("All Winning Bets:", allWinningBets);
    if(allWinningBets.length > 0){
      allWinningBets.forEach(async (bet) => {
          const { data, error } = await supabase
            .from('bets')
            .update({ status: 'WON', bet: bet.bet })
            .eq('id', bet.id)
            if (error) {
              console.error('Error inserting/updating user session data:', error.message)
            } else {
              console.log(`Status changed for bet ${bet.id}`)
  
            }
        })
    }
    console.log("Mixed or Losing Bets:", mixedOrLosingBets);
    if(mixedOrLosingBets.length > 0){
      mixedOrLosingBets.forEach(async (bet) => {
        const { data, error } = await supabase
          .from('bets')
          .update({ status: 'LOST', bet: bet.bet })
          .eq('id', bet.id)
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            console.log(`Status changed for bet ${bet.id}`)
  
          }
      })
    }
  } 
}

/* useEffect(() => {
  writePendingBets()
}, [myBets]) */

const writeFixtures = async () => {
  const leagueIds = [39, 135, 140, 78, 61]; 
  const season = '2024';
  const apiKey = '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2';
  const apiHost = 'api-football-v1.p.rapidapi.com';
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

    // Update Supabase JSONB column for each league’s response data
    const updatePromises = responses.map((response, index) => {
      const leagueId = leagueIds[index];  // Ensure each response corresponds to a leagueId
      const fixturesData = response.data.response; // Modify this if response structure varies

      // Update the Supabase table where the league ID matches
      return supabase
        .from('fixtures')              // Replace with your actual table name
        .update({ fixtures: fixturesData }) // Update the JSONB column (`fixtures_data`) with new data
        .eq('id', leagueId);           // Ensure correct league row is updated
    });

    // Wait for all updates to finish
    const updateResults = await Promise.all(updatePromises);

    console.log('Updated successfully:', updateResults);
  } catch (error) {
    console.error('Error fetching or updating fixtures:', error);
  }
}

/* useEffect(() => {
  writeFixtures();
}, []) */

const getFixtures = async (data) => {
    setMyBets([])
    setLoading(true)
    //console.log("data",data)
    const updatedBets = data.map(async (bet) => {
      const updatedBetMatches = await Promise.all(bet.bet.map(async (match) => {
        const { data, error } = await supabase
          .from('fixtures')
          .select('fixtures')
          .eq('leagueName', match.match.league.name);
  
        if (error) {
          console.error('Error retrieving data from Supabase:', error.message);
          return match; // Return the match as-is if there's an error
        }
  
        if (data && data[0]?.fixtures) {
          const id = match.match.fixture.id;
          const date = match.match.fixture.date;
          
         /*  const firstMatchWithNoHomeGoals = data[0].fixtures.find(match => match.goals.home === null);
          const matchDate = firstMatchWithNoHomeGoals.fixture.date
          const dateInMs = new Date(matchDate).getTime();

          // Get the current date in milliseconds
          const currentDateInMs = Date.now();

          // Compare the dates
          if (dateInMs > currentDateInMs) {
            return
          } else if (dateInMs < currentDateInMs) {
            console.log("The date is in the past.");
            
          } else {
            console.log("The date is now.");
            
          } */
          const matchesWithFL = data[0].fixtures.filter(betFixture => betFixture.fixture?.id === id);
          
          if (matchesWithFL.length > 0 && matchesWithFL[0].fixture.status.short === "FT") {
            // Update match goals according to the fetched data
            

              const isWinningBet =
              (match.betType === "home" && matchesWithFL[0].goals.home > matchesWithFL[0].goals.away) ||
              (match.betType === "away" && matchesWithFL[0].goals.away > matchesWithFL[0].goals.home) ||
              (match.betType === "draw" && matchesWithFL[0].goals.home === matchesWithFL[0].goals.away) ||
              (match.betType === "homeOver2" && matchesWithFL[0].goals.home >= 3) ||
              (match.betType === "btts" && matchesWithFL[0].goals.home >= 1 && matchesWithFL[0].goals.away >= 1) ||
              (match.betType === "awayOver2" && matchesWithFL[0].goals.away >= 3) ||
              (match.betType === "homeUnder2" && matchesWithFL[0].goals.home <= 2) ||
              (match.betType === "btnts" && matchesWithFL[0].goals.home === 0 || matchesWithFL[0].goals.away === 0) ||
              (match.betType === "awayUnder2" && matchesWithFL[0].goals.away <= 2) ||
              (match.betType === "homeBTTS" && matchesWithFL[0].goals.home > matchesWithFL[0].goals.away && matchesWithFL[0].goals.away >= 1) ||
              (match.betType === "homeMinus1" && matchesWithFL[0].goals.home > matchesWithFL[0].goals.away + 1) ||
              (match.betType === "awayBTTS" && matchesWithFL[0].goals.away > matchesWithFL[0].goals.home && matchesWithFL[0].goals.home >= 1) ||
              (match.betType === "homeBTNTS" && matchesWithFL[0].goals.home > matchesWithFL[0].goals.away && matchesWithFL[0].goals.away === 0) ||
              (match.betType === "awayMinus1" && matchesWithFL[0].goals.away > matchesWithFL[0].goals.home + 1) ||
              (match.betType === "awayBTNTS" && matchesWithFL[0].goals.away > matchesWithFL[0].goals.home && matchesWithFL[0].goals.home === 0);
  
          // Add a property to indicate if this is a winning bet
            match.isWinningBet = isWinningBet;
            
            match.match.goals.home = matchesWithFL[0].goals.home;
            match.match.goals.away = matchesWithFL[0].goals.away;
          }
        }
  
        return match; // Return the updated match
      }));
  
      return {
        ...bet,
        bet: updatedBetMatches, // Assign updated matches to each bet's `bet` array
      };
    });
  
    const resolvedUpdatedBets = await Promise.all(updatedBets); // Await all bets processing
    setMyBets(resolvedUpdatedBets); // Update the state with the fully updated bets array
    setLoading(false)
  };
 

  return (
    <motion.div className="menu-container-seven" variants={item}
    initial={{opacity:0, height: 0}}
    animate={{ opacity:1, height: "100vh"}}
    transition={{duration:.5}}
    exit="exit">
        
        <FilterContainer initial={{ height: 0, width: 0}} 
        animate={{ height: isExpanded ? '80px' : 0, width: isExpanded ? '90%' : '90%' }} 
        transition={{ duration: 0.5 }}>
        {isExpanded && leagues.map((league, index) => (
        <StyledButtonBets
          key={index}
          variant="outlined"
          //startIcon={<img src={league.logo} alt={league.name} style={{ width: 24, height: 24 }} />}
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
        </FilterContainer>
          <FilterContainer initial={{ height: 0, width: 0 }}
              animate={{ height: isExpanded ? '130px' : 0, width: isExpanded ? '90%' : '90%' }}
              transition={{ duration: 0.5 }}>
              {isExpanded && leaguesTwo.map((league, index) => (
                  <StyledButtonBets
                      key={index}
                      variant="outlined"
                      //startIcon={<img src={league.logo} alt={league.name} style={{ width: 24, height: 24 }} />}
                      onClick={() => handleButtonClickTwo(league)}
                      disabled={disabledButtonTwo === league.name}
                      style={{
                          marginRight: '10px',
                          backgroundColor: disabledButtonTwo === league.name ? 'aqua' : 'transparent',
                          color: disabledButtonTwo === league.name ? '#f8452e' : 'white',
                          borderColor: disabledButtonTwo === league.name ? '#f8452e' : '#ccc',
                          boxShadow: disabledButtonTwo === league.name ? '0 0 5px aqua, 0 0 25px aqua' : '',
                          fontWeight: disabledButtonTwo === league.name ? 'bold' : ''
                      }}
                  >
          {league.name}
        </StyledButtonBets>
      ))}
        </FilterContainer>
        <BetSection>
      <CloseStats onClick={closeBetsMenu} />
      {isExpanded ? <CloseFilterTwo onClick={closeFilterMenu}/> : <CloseFilter onClick={closeFilterMenu}/>}
        {loading ? (
          <CircularProgress sx={{width: 80, height: 80}} />
        ) : (
          <>
          {myBets?.map((bet,index) => {
            const type = bet.bet.length === 1 ? "SINGLE BET" : "MULTIPLE BET"
            return(
                <StatsWrapper key={index}>
                    <AbsoluteAvatar>
                    <Avatar alt="Home Team Logo" src={bet.user_avatar} sx={{ width: 55, height: 55}}/>
                    </AbsoluteAvatar>
                    <TypeofBet>{type}</TypeofBet>
                    <TeamsLogo>
                    {bet.bet.map((el) => {
                        const url = getURL(el.betType, el.match);
                        const homeLogo = getURL("home", el.match);
                        const awayLogo = getURL("away", el.match);
                        return(
                            <AvatarHolder>
                            {(el.betType === 'draw' || el.betType === 'btts' || el.betType === 'btnts') ? (
                              <>
                                <Avatar alt="Home Team Logo" src={homeLogo} sx={{ width: 30, height: 30}} />
                                <Avatar alt="Home Team Logo" src={awayLogo} sx={{ width: 30, height: 30}} />
                              </>
                            ) : (
                              <Avatar alt="Home Team Logo" src={url} sx={{ width: 30, height: 30}} />
                            )}
                            </AvatarHolder>
                        )
                    })}
                    </TeamsLogo>
                    <TeamsName>
                    {bet.bet.map((el) => {
                        const name = getName(el.betType, el.match)
                        return(
                            <AvatarHolder>{name}</AvatarHolder>
                        )
                    })}
                    </TeamsName>
                    <TeamsDate>
                    {bet.bet.map((el) => {
                        const date = new Date(el.match.fixture.date).toLocaleString();
                        return(
                            <AvatarHolder>{date}</AvatarHolder>
                        )
                    })}
                    </TeamsDate>
                    <TypeofBet>
                        {bet.bet.map((el) => {
                        return(
                            <AvatarHolder>{el.match.goals.home} - {el.match.goals.away}</AvatarHolder>
                        )
                    })}
                    </TypeofBet>
                    <TypeofBet>
                        {bet.bet.map((el) => {
                            const odd = getOdd(el.betType, el.match)
                        return(
                            <AvatarHolder>{odd}</AvatarHolder>
                        )
                    })}
                    </TypeofBet>
                    <TeamsStatus>
                    {bet.bet.map((el) => {
                      
                            const winnings = getWinnings(el)
                        return(
                            <AvatarHolder>{winnings}</AvatarHolder>
                        )
                    })}
                    </TeamsStatus>
                    <TypeofBet><HalfColumn>BET AMOUNT: <span>{bet.amount} PGZ</span></HalfColumn></TypeofBet>
                    <TypeofBet>
                        <HalfColumn>
                        POSSIBLE WINNINGS: <span>{bet.possibleWinnings} PGZ</span>
                        </HalfColumn>
                    </TypeofBet>
                    <TypeofBet>
                    <HalfColumn>
                        STATUS: <strong>{bet.status}</strong>
                        </HalfColumn>
                    </TypeofBet>
                </StatsWrapper>
            )
        })}
        </>
        )}
        
        </BetSection>
    </motion.div>
  )
}

export default AllBetsMenu
