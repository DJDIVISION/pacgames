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
    CloseFilter
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
            setMyBets(data)
            
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
            setMyBets(data)
            
    }
  }

  const fetchFinishedYourBets = async () => {
    const { data, error } = await supabase
          .from('bets')
          .select('*')
          .eq('status', 'Finished')
          .eq('user_id', user.id)
          .order('id', { ascending: true });
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            setMyBets(data)
            
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
            setMyBets(data)
            
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
            setMyBets(data)
            
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
            setMyBets(data)
            
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
            setMyBets(data)
            
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
            setMyBets(data)
            
    }
  }

  useEffect(() => {
    fetchPendingYourBets();
  }, [user])

  console.log(myBets.bet)
  

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
 
console.log(disabledButton)
  return (
    <motion.div className="menu-container-seven" variants={item}
    initial={{opacity:0, height: 0}}
    animate={{ opacity:1, height: "100vh"}}
    transition={{duration:.5}}
    exit="exit">
        
        <FilterContainer initial={{ height: 0, width: 0}} 
        animate={{ height: isExpanded ? '130px' : 0, width: isExpanded ? '90%' : '90%' }} 
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
      <CloseFilter onClick={closeFilterMenu}/>
        {myBets?.map((bet) => {
            console.log(bet)
            const type = bet.bet.length === 1 ? "SINGLE BET" : "MULTIPLE BET"
            return(
                <StatsWrapper>
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
