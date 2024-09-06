import React, {useState} from 'react'
import { motion } from 'framer-motion'
import {item,CloseStats,MatchHolder,StatsStadium,StatsStadiumCapacity,BetTeams,BetTeamsLogo,BetTeamsName,
  BetTeamsLogoHolder,BetTeamsColumn,BetBet,BetAmount,BetInput,AntSwitch,Switcher
} from './index'
import { BetState } from '../context/BetsContext'
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { message } from 'antd';
import { supabase } from '../supabase/client';

const SelectedBet = ({setSelectedBetMenu,selectedBetMenu}) => {

  const [checked, setChecked] = useState(false);
  const [checkedMultiple, setCheckedMultiple] = useState(false);
  const [amount, setAmount] = useState(null)
  const [multipleBet, setMultipleBet] = useState(false)
  const [multipleBets, setMultipleBets] = useState([])
  const {selectedBet, setSelectedBet} = BetState()
  const {user, setUser} = BetState();

  console.log(user)

  const closeBetsMenu = () => {
      setSelectedBetMenu(false)
      setSelectedBet(null)
  }

  const handleSwitchSendBet = async (event) => {
    if(amount === null){
      message.error("You must enter the amount for the bet!", [2])
      return
    }
    setChecked(event.target.checked);
    const updatedData = {
      email: user.email,
      name: user.user_metadata.full_name,
      user_id: user.id,
      bet: selectedBet,
      amount: amount
    }
    const { data, error } = await supabase
      .from('bets')
      .insert([updatedData])
      if (error) {
        console.error('Error inserting/updating user session data:', error.message)
      } else {
        console.log('User session data saved:', data)
        setSelectedBetMenu(false)
        setSelectedBet(null)
        message.success("Your bet has been registered")
      }
  };

  const handleSwitchMultiple = (event) => {
    if(amount === null){
      message.error("You must enter the amount for the bet!", [2])
      return
    }
    setCheckedMultiple(event.target.checked);
    multipleBets.push(selectedBet)
    console.log(multipleBets)
    setSelectedBetMenu(false)
    setSelectedBet(null)
    message.success("Choose your next bet")
  };

  console.log(amount)

  return (
    <motion.div className="menu-container-six" variants={item}
    initial={{opacity:0, height: 0}}
    animate={{ opacity:1, height: "100vh"}}
    transition={{duration:.5}}
    exit="exit">
      <CloseStats onClick={closeBetsMenu} />
      <MatchHolder>
        <StatsStadium>{selectedBet.match.date}</StatsStadium>
        <StatsStadiumCapacity>{selectedBet.match.time}</StatsStadiumCapacity>
        <BetTeams>
          <BetTeamsColumn>
          <BetTeamsLogo><BetTeamsLogoHolder><img src={selectedBet.match.homeLogo} alt="homeTeamLogo" /></BetTeamsLogoHolder></BetTeamsLogo>
          <BetTeamsName>{selectedBet.match.home}</BetTeamsName>
          </BetTeamsColumn>
          <BetTeamsColumn>
          <BetTeamsLogo><BetTeamsLogoHolder><img src={selectedBet.match.awayLogo} alt="awayTeamLogo" /></BetTeamsLogoHolder></BetTeamsLogo>
          <BetTeamsName>{selectedBet.match.away}</BetTeamsName>
          </BetTeamsColumn>
        </BetTeams>
        <BetBet><span>YOUR BET: {selectedBet.betType === '1' && selectedBet.match.home}{selectedBet.betType === 'X' && "X"}{selectedBet.betType === '2' && selectedBet.match.away}</span> - <span>ODDS: {selectedBet.oddValue.toFixed(2)}</span></BetBet>
        <BetAmount>SELECT AMOUNT: <BetInput onChange={(e) => setAmount(e.target.value)}></BetInput></BetAmount>
      </MatchHolder>
      <Switcher>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', margin: '0 50px' }}>
        <Typography>SIGN BET</Typography>
        <AntSwitch inputProps={{ 'aria-label': 'ant design' }} checked={checked} onChange={handleSwitchSendBet}/>
        <Typography></Typography>
      </Stack>
      
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', margin: '0 50px' }}>
        <Typography>MULTIPLE BET</Typography>
        <AntSwitch inputProps={{ 'aria-label': 'ant design' }} checked={checkedMultiple} onChange={handleSwitchMultiple}/>
        <Typography></Typography>
      </Stack>
      </Switcher>
    </motion.div>
  )
}

export default SelectedBet
