import React, {useEffect, useState} from 'react'
import { motion } from 'framer-motion'
import {item,CloseStats,MatchHolder,StatsStadium,StatsStadiumCapacity,BetTeams,BetTeamsLogo,BetTeamsName,PossibleWinningsAmount,
  BetTeamsLogoHolder,BetTeamsColumn,BetBet,BetAmount,BetInput,AntSwitch,Switcher,BetTeamsLogoAway,BetTeamsHolder
} from '../index'
import { BetState } from '../../context/BetsContext'
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { message } from 'antd';
import { supabase } from '../../supabase/client';
import { useAuth } from '../../pages/functions';
import { FantasyState } from '../../context/FantasyContext';

const SelectedBet = ({setSelectedBetMenu,selectedBetMenu}) => {

  const [checked, setChecked] = useState(false);
  const [checkedMultiple, setCheckedMultiple] = useState(false);
  const [amount, setAmount] = useState(null)
  const [multipleBet, setMultipleBet] = useState(false)
  const [multipleBets, setMultipleBets] = useState([])
  const {selectedBet, setSelectedBet} = FantasyState();
  const {betAmounts, setBetAmounts} = FantasyState();
  const { user } = useAuth();

  console.log(user)

  const calculateTotalWinnings = () => {
    return selectedBet.reduce((total, bet) => {
      // Get the odds for the selected bet type (home, draw, away)
      let odds = 0;
      if (bet.betType === 'home') odds = bet.match.odds.home;
      else if (bet.betType === 'draw') odds = bet.match.odds.draw;
      else if (bet.betType === 'away') odds = bet.match.odds.away;
  
      // Calculate winnings for this bet
      const winnings = amount * odds;
  
      // Add it to the total
      return parseInt(total + winnings);
    }, 0);  // Start with 0 as the initial total
  };

  console.log("Selected Bet:", selectedBet);

  const closeBetsMenu = () => {
      setSelectedBetMenu(false)
      setSelectedBet(null)
  }

  console.log(betAmounts)
  const handleSwitchSendBet = async (event) => {
    const winnings = calculateTotalWinnings();
    console.log(winnings)
    setChecked(event.target.checked);
    const updatedData = {
      email: user.email,
      name: user.user_metadata.full_name,
      user_id: user.id,
      bet: selectedBet,
      amount: amount,
      user_avatar: user.user_metadata.avatar_url,
      possibleWinnings: winnings,
      status: "Pending"
    }
    const { data, error } = await supabase
      .from('bets')
      .insert([updatedData])
      if (error) {
        console.error('Error inserting/updating user session data:', error.message)
      } else {
        console.log('User session data saved:', data)
        setSelectedBetMenu(false)
        setSelectedBet([])
        message.success("Your bet has been registered")
      }
  };

  const handleSwitchMultiple = (event) => {
    setMultipleBet(true)
    setCheckedMultiple(event.target.checked);
    setSelectedBetMenu(false)
    message.success("Choose your next bet")
  };

  console.log(selectedBet)

  return (
    <motion.div className="menu-container-six" variants={item}
    initial={{opacity:0, height: 0}}
    animate={{ opacity:1, height: "100vh"}}
    transition={{duration:.5}}
    exit="exit">
      <CloseStats onClick={closeBetsMenu} />
      {selectedBet.length > 0 ? (
      selectedBet.map((selectedBet, index) => (
    <MatchHolder key={index}>
      <StatsStadium>{selectedBet?.match?.fixture?.venue?.name}</StatsStadium>
      <StatsStadiumCapacity>{selectedBet?.match?.fixture?.venue?.city}</StatsStadiumCapacity>
      
      <BetTeams>
        <BetTeamsHolder>
        <BetTeamsColumn>
          <BetTeamsLogo>
            <BetTeamsLogoHolder>
              <img src={selectedBet?.match?.teams?.home?.logo} alt="homeTeamLogo" />
            </BetTeamsLogoHolder>
          </BetTeamsLogo>
          <BetTeamsName>{selectedBet?.match?.teams?.home?.name}</BetTeamsName>
        </BetTeamsColumn>
        <BetTeamsColumn>
          <BetTeamsLogoAway>
            <BetTeamsLogoHolder>
              <img src={selectedBet?.match?.teams?.away?.logo} alt="awayTeamLogo" />
            </BetTeamsLogoHolder>
          </BetTeamsLogoAway>
          <BetTeamsName>{selectedBet?.match?.teams?.away?.name}</BetTeamsName>
        </BetTeamsColumn>
        </BetTeamsHolder>
      </BetTeams>

      <BetBet>
      YOUR BET: 
        <span>
          
          {selectedBet?.betType === 'home' && selectedBet?.match?.teams?.home?.name}
          {selectedBet?.betType === 'draw' && "DRAW"}
          {selectedBet?.betType === 'away' && selectedBet?.match?.teams?.away?.name}
        </span> 
        <span>-</span> ODDS: 
        <span>
          
          {selectedBet?.betType === 'home' && selectedBet?.match?.odds?.home}
          {selectedBet?.betType === 'draw' && selectedBet?.match?.odds?.draw}
          {selectedBet?.betType === 'away' && selectedBet?.match?.odds?.away}
        </span>
      </BetBet>

      
    </MatchHolder>
    
  ))
) : (
  <div>No bets selected</div>
)}
      <BetAmount>
        SELECT AMOUNT: 
        <BetInput onChange={(e) => setAmount(e.target.value)}  />
      </BetAmount>
      <PossibleWinningsAmount>POSSIBLE WINNINGS: <span>${calculateTotalWinnings()}</span> </PossibleWinningsAmount>
      <Switcher>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', margin: '0 50px' }}>
        <Typography style={{color: 'white'}}>SIGN BET</Typography>
        <AntSwitch inputProps={{ 'aria-label': 'ant design' }} checked={checked} onChange={handleSwitchSendBet}/>
        <Typography></Typography>
      </Stack>
      
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', margin: '0 50px' }}>
        <Typography style={{color: 'white'}}>MULTIPLE BET</Typography>
        <AntSwitch inputProps={{ 'aria-label': 'ant design' }} checked={checkedMultiple} onChange={handleSwitchMultiple}/>
        <Typography></Typography>
      </Stack>
      </Switcher>
      
    </motion.div>
  )
}

export default SelectedBet
