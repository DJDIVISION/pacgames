import React, {useEffect, useState} from 'react'
import { motion,AnimatePresence } from 'framer-motion'
import {CloseStats,MatchHolder,StatsStadium,StatsStadiumCapacity,BetTeams,BetTeamsLogo,BetTeamsName,PossibleWinningsAmount,
  BetTeamsLogoHolder,BetTeamsColumn,BetBet,BetAmount,BetInput,AntSwitch,Switcher,BetTeamsLogoAway,BetTeamsHolder,BalanceAmount
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
  const {pendingBets, setPendingBets} = FantasyState();
  const {balance, setBalance} = FantasyState();
  const { user } = useAuth();

  console.log(user)

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

  const calculateTotalWinnings = () => {
    return selectedBet.reduce((total, bet) => {
      // Get the odds for the selected bet type (home, draw, away)
      let odds = 0;
      if (bet.betType === 'home') odds = bet.match.odds.home;
      else if (bet.betType === 'draw') odds = bet.match.odds.draw;
      else if (bet.betType === 'away') odds = bet.match.odds.away;
      else if (bet.betType === 'homeOver2') odds = bet.match.odds.homeOver2;
      else if (bet.betType === 'btts') odds = bet.match.odds.btts;
      else if (bet.betType === 'awayOver2') odds = bet.match.odds.awayOver2;
      else if (bet.betType === 'homeUnder2') odds = bet.match.odds.homeUnder2;
      else if (bet.betType === 'btnts') odds = bet.match.odds.btnts;
      else if (bet.betType === 'awayUnder2') odds = bet.match.odds.awayUnder2;
      else if (bet.betType === 'homeBTTS') odds = bet.match.odds.homeBTTS;
      else if (bet.betType === 'homeMinus1') odds = bet.match.odds.homeMinus1;
      else if (bet.betType === 'awayBTTS') odds = bet.match.odds.awayBTTS;
      else if (bet.betType === 'homeBTNTS') odds = bet.match.odds.homeBTNTS;
      else if (bet.betType === 'awayMinus1') odds = bet.match.odds.awayMinus1;
      else if (bet.betType === 'awayBTNTS') odds = bet.match.odds.awayBTNTS;
  
      // Calculate winnings for this bet
      const winnings = amount * odds;
  
      // Add it to the total
      return parseInt(total + winnings);
    }, 0);  // Start with 0 as the initial total
  };

  console.log("Selected Bet:", selectedBet);

  const closeBetsMenu = () => {
      setSelectedBet([])
      setSelectedBetMenu(false)
  }

  console.log(betAmounts)

  
  const handleSwitchSendBet = async (event) => {
    if(amount === null){
      message.error("You must enter the amount of the bet!")
      return
    }
    if(amount > balance){
      message.error("You don't have enough balance to place this bet!")
      return
    }
    setPendingBets((prevBets) => prevBets + 1)
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
    setBalance((prevBal) => prevBal - amount)
    const newBalance = balance - amount
    const {data:setData, error: setError} = await supabase
    .from('users')
      .select('wagerBalance')
      .eq('id', user.id)
      if(setError){
        console.log(setError)
      } else {
        console.log("shitty data:", setData)
      }




    /* const { data: firstData, error: firstError } = await supabase
      .from('users')
      .update({appBalance: newBalance})
      .eq('id', user.id)
      if (firstError) {
        console.error('Error inserting/updating user session data:', firstError.message)
      } else {
        console.log('User balance data saved:', firstData)
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
      } */
  };

  const handleSwitchMultiple = (event) => {
    setMultipleBet(true)
    setCheckedMultiple(event.target.checked);
    setSelectedBetMenu(false)
    message.success("Choose your next bet")
  };

  console.log(selectedBet)

  const item={
    initial: { height: 0, opacity: 0 },
    animate: { height: "100vh", opacity: 1, transition: { duration: 0.7 } },
    exit: { height: 0, opacity: 0, transition: { duration: 0.7 } }
}

  return (
    
    <motion.div className="menu-container-six" variants={item}
    initial='initial'
    animate='animate'
    exit='exit' >
      <CloseStats onClick={closeBetsMenu} />
      <BalanceAmount>YOUR BALANCE: <span>{parseFloat(balance?.toFixed(2))} PGZ</span></BalanceAmount>
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
          {selectedBet?.betType === 'homeOver2' && selectedBet?.match?.teams?.home?.name + " OVER 2.5"}
          {selectedBet?.betType === 'homeUnder2' && selectedBet?.match?.teams?.home?.name + " UNDER 2.5"}
          {selectedBet?.betType === 'awayOver2' && selectedBet?.match?.teams?.away?.name + " OVER 2.5"}
          {selectedBet?.betType === 'awayUnder2' && selectedBet?.match?.teams?.away?.name + " UNDER 2.5"}
          {selectedBet?.betType === 'btts' && "BOTH TEAMS SCORE"}
          {selectedBet?.betType === 'btnts' && "BOTH TEAMS NOT SCORE"}
          {selectedBet?.betType === 'homeBTTS' && selectedBet?.match?.teams?.home?.name + " WINS BOTH TEAMS SCORE"}
          {selectedBet?.betType === 'homeMinus1' && selectedBet?.match?.teams?.home?.name + " - 1"}
          {selectedBet?.betType === 'awayMinus1' && selectedBet?.match?.teams?.away?.name + " - 1"}
          {selectedBet?.betType === 'awayBTTS' && selectedBet?.match?.teams?.away?.name + " WINS BOTH TEAMS SCORE"}
          {selectedBet?.betType === 'homeBTNTS' && selectedBet?.match?.teams?.home?.name + " WINS BOTH TEAMS NOT SCORE"}
          {selectedBet?.betType === 'awayBTNTS' && selectedBet?.match?.teams?.away?.name + " WINS BOTH TEAMS NOT SCORE"}
        </span> 
        <span>-</span> ODDS: 
        <span>
          
          {selectedBet?.betType === 'home' && selectedBet?.match?.odds?.home}
          {selectedBet?.betType === 'draw' && selectedBet?.match?.odds?.draw}
          {selectedBet?.betType === 'away' && selectedBet?.match?.odds?.away}
          {selectedBet?.betType === 'homeOver2' && selectedBet?.match?.odds?.homeOver2}
          {selectedBet?.betType === 'homeUnder2' && selectedBet?.match?.odds?.homeUnder2}
          {selectedBet?.betType === 'awayOver2' && selectedBet?.match?.odds?.awayOver2}
          {selectedBet?.betType === 'awayUnder2' && selectedBet?.match?.odds?.awayUnder2}
          {selectedBet?.betType === 'btts' && selectedBet?.match?.odds?.btts}
          {selectedBet?.betType === 'btnts' && selectedBet?.match?.odds?.btnts}
          {selectedBet?.betType === 'homeBTTS' && selectedBet?.match?.odds?.homeBTTS}
          {selectedBet?.betType === 'homeMinus1' && selectedBet?.match?.odds?.homeMinus1}
          {selectedBet?.betType === 'awayBTTS' && selectedBet?.match?.odds?.awayBTTS}
          {selectedBet?.betType === 'homeBTNTS' && selectedBet?.match?.odds?.homeBTNTS}
          {selectedBet?.betType === 'awayMinus1' && selectedBet?.match?.odds?.awayMinus1}
          {selectedBet?.betType === 'awayBTNTS' && selectedBet?.match?.odds?.awayBTNTS}
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
      <PossibleWinningsAmount>POSSIBLE WINNINGS: <span>{calculateTotalWinnings()} PGZ</span> </PossibleWinningsAmount>
      <Switcher>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography style={{color: 'white', fontFamily:'Quicksand'}}>MULTIPLE BET</Typography>
        <AntSwitch inputProps={{ 'aria-label': 'ant design' }} checked={checkedMultiple} onChange={handleSwitchMultiple}/>
        <Typography></Typography>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography style={{color: 'white', fontFamily:'Quicksand'}}>SIGN BET</Typography>
        <AntSwitch inputProps={{ 'aria-label': 'ant design' }} checked={checked} onChange={handleSwitchSendBet}/>
        <Typography></Typography>
      </Stack>
      </Switcher>
      
    </motion.div>
  )
}

export default SelectedBet
