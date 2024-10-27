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
    FilterContainer,
    CloseFilter,CloseFilterTwo
 } from './index';
import { Avatar } from '@mui/material';
import draw from "../../assets/draw.png"
import {  StyledButtonBets } from '../../components'



const AllBetsMenu = ({allBetsMenu,setAllBetsMenu}) => {

  
  const [myBets, setMyBets] = useState([])
  const [disabledButton, setDisabledButton] = useState("Your Bets");
  const [disabledButtonTwo, setDisabledButtonTwo] = useState("Pending Bets");
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false)
  const [fixtures, setFixtures] = useState([])
  const [homeResult, setHomeResult] = useState(null)
  const [awayResult, setAwayResult] = useState(null)
  


  const getFixtures = async (data) => {
    setMyBets([])
    console.log("data",data)
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
          const matchesWithFL = data[0].fixtures.filter(betFixture => betFixture.fixture?.id === id);
  
          if (matchesWithFL.length > 0 && matchesWithFL[0].fixture.status.short === "FT") {
            // Update match goals according to the fetched data
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
  };

  

  

  const leagues = [
    { name: 'Your Bets', logo: premier },
    { name: 'All Bets', logo: laLiga },
  ];
  const leaguesTwo = [
    { name: 'Pending Bets', logo: serieA },
    { name: 'Finished Bets', logo: bundesliga },
    { name: 'By Date', logo: ligue1 }
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
    if(league.name === 'Finished Bets'){
        if(disabledButton === 'Your Bets'){
            fetchFinishedYourBets()
        }
        if(disabledButton === 'All Bets'){
            fetchFinishedBets()
        }
    }
    if(league.name === 'By Date'){
        if(disabledButton === 'Your Bets'){
            fetchBetsByYourDate()
        }
        if(disabledButton === 'All Bets'){
            fetchBetsByDate()
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

  const fetchFinishedBets = async () => {
    const { data, error } = await supabase
          .from('bets')
          .select('*')
          .eq('status', 'Finished')
          .order('id', { ascending: true });
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            getFixtures(data)
            
    }
  }

  const fetchFinishedYourBets = async () => {
    const { data, error } = await supabase
          .from('bets')
          .select('*')
          //.eq('status', 'Finished')
          .eq('user_id', user.id)
          .order('id', { ascending: true });
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            const finished = []
            console.log(data)
            data.forEach((el) => {
              if(el.status !== 'Pending'){
                finished.push(el)
              }
            })
            console.log(finished)
            getFixtures(finished)
            
    }
  }

  const fetchBetsByDate = async () => {
    const { data, error } = await supabase
          .from('bets')
          .select('*')
          //.eq('user_id', user.id)
          .order('created_at', { ascending: true });
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            getFixtures(data)
            
    }
  }

  const fetchBetsByYourDate = async () => {
    const { data, error } = await supabase
          .from('bets')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
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
          .order('id', { ascending: true });
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            getFixtures(data)
            
    }
  }

  useEffect(() => {
    fetchPendingYourBets();
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
    if(betType === "draw") return draw
    return ''
};

const getName = (betType, match) => {
    if(betType === "home") return match.teams.home.name
    if(betType === "away") return match.teams.away.name
    if(betType === "draw") return `${match.teams.home.name} vs ${match.teams.away.name}`
    return ''
};

const getOdd = (betType, match) => {
    if(betType === "home") return match.odds.home
    if(betType === "away") return match.odds.away
    if(betType === "draw") return match.odds.draw
    return ''
};

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

const writePendingBets = () => {
  console.log(myBets)
  const filteredArray = myBets.filter(entry =>
    entry.bet.every(bet => bet.match.goals.home !== null)
  );
  console.log(filteredArray)
  filteredArray.forEach(entry => {
    entry.bet.forEach(bet => {
        const { betType, match } = bet;
        const { home, away } = match.goals;

        // Determine if the bet is a winning one based on the goals
        const isWinningBet =
            (betType === "home" && home > away) ||
            (betType === "away" && away > home) ||
            (betType === "draw" && home === away);

        // Add a property to indicate if this is a winning bet
        bet.isWinningBet = isWinningBet;
    });
  });
  console.log(filteredArray);
  const allWinningBets = getAllWinningBets(filteredArray);
  const mixedOrLosingBets = getMixedOrLosingBets(filteredArray);

  console.log("All Winning Bets:", allWinningBets.length);
  if(allWinningBets.length > 0){
    allWinningBets.forEach(async (bet) => {
        const { data, error } = await supabase
          .from('bets')
          .update({ status: 'WON', bet: bet })
          .eq('id', bet.id)
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            console.log(`Status changed for bet ${bet.id}`)

          }
      })
  }
  console.log("Mixed or Losing Bets:", mixedOrLosingBets.length);
  if(mixedOrLosingBets.length > 0){
    mixedOrLosingBets.forEach(async (bet) => {
      const { data, error } = await supabase
        .from('bets')
        .update({ status: 'LOST', bet: bet })
        .eq('id', bet.id)
        if (error) {
          console.error('Error inserting/updating user session data:', error.message)
        } else {
          console.log(`Status changed for bet ${bet.id}`)

        }
    })
  }
}

useEffect(() => {
  writePendingBets()
}, [myBets])
 

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
                        return(
                            <AvatarHolder>
                            <Avatar alt="Home Team Logo" src={url} sx={{ width: 30, height: 30}} />
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
                    <TeamsName>
                    {bet.bet.map((el) => {
                        const date = new Date(el.match.fixture.date).toLocaleString();
                        return(
                            <AvatarHolder>{date}</AvatarHolder>
                        )
                    })}
                    </TeamsName>
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
                    
                    <TypeofBet><HalfColumn>BET AMOUNT: <span>${bet.amount}</span></HalfColumn></TypeofBet>
                    <TypeofBet>
                        <HalfColumn>
                        POSSIBLE WINNINGS: <span>${bet.possibleWinnings}</span>
                        </HalfColumn>
                    </TypeofBet>
                    <TypeofBet>
                    <HalfColumn>
                        STATUS: <strong>{bet.status}</strong>
                        </HalfColumn>
                    </TypeofBet>
                    

                    {/* <TypeofBet>POSSIBLE WINNINGS: <span>${bet.possibleWinnings}</span>
                    <p>STATUS</p> <strong>{bet.status}</strong></TypeofBet> */}
                </StatsWrapper>
            )
        })}
        </BetSection>
    </motion.div>
  )
}

export default AllBetsMenu
