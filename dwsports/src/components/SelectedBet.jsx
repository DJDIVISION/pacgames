import React, {useState} from 'react'
import { motion } from 'framer-motion'
import {item,CloseStats,MatchHolder,StatsStadium,StatsStadiumCapacity,BetTeams,BetTeamsLogo,BetTeamsName,
  BetTeamsLogoHolder,BetTeamsColumn,BetBet,BetAmount,BetInput,AntSwitch,Switcher
} from './index'
import { BetState } from '../context/BetsContext'
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { message } from 'antd';

const SelectedBet = ({setSelectedBetMenu,selectedBetMenu,setSelectedBet,selectedBet}) => {

  const {homeTeamLogo, setHomeTeamLogo} = BetState()
  const {awayTeamLogo, setAwayTeamLogo} = BetState()
  const [checked, setChecked] = useState(false);

  console.log(homeTeamLogo)
  console.log(awayTeamLogo)
  console.log(selectedBet)

  const closeBetsMenu = () => {
      setSelectedBetMenu(false)
      setSelectedBet(null)
  }

  const handleSwitchChange = (event) => {
    setChecked(event.target.checked);
    console.log("Switch pressed, new state:", event.target.checked);
    // Call your desired function here
    myFunction();
  };

  const myFunction = () => {
    // Your custom logic here
    console.log("Custom function called.");
    setSelectedBetMenu(false)
    message.success("Your bet has been registered!", [2])

  };

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
          <BetTeamsLogo><BetTeamsLogoHolder><img src={homeTeamLogo} alt="homeTeamLogo" /></BetTeamsLogoHolder></BetTeamsLogo>
          <BetTeamsName>{selectedBet.match.home}</BetTeamsName>
          </BetTeamsColumn>
          <BetTeamsColumn>
          <BetTeamsLogo><BetTeamsLogoHolder><img src={awayTeamLogo} alt="awayTeamLogo" /></BetTeamsLogoHolder></BetTeamsLogo>
          <BetTeamsName>{selectedBet.match.away}</BetTeamsName>
          </BetTeamsColumn>
        </BetTeams>
        <BetBet><span>YOUR BET: {selectedBet.betType === '1' && selectedBet.match.home}{selectedBet.betType === 'X' && "X"}{selectedBet.betType === '2' && selectedBet.match.away}</span> - <span>ODDS: {selectedBet.oddValue.toFixed(2)}</span></BetBet>
        <BetAmount>SELECT AMOUNT: <BetInput></BetInput></BetAmount>
      </MatchHolder>
      <Switcher>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Typography></Typography>
        <AntSwitch inputProps={{ 'aria-label': 'ant design' }} checked={checked} onChange={handleSwitchChange}/>
        <Typography>SIGN BET</Typography>
      </Stack>
      </Switcher>
    </motion.div>
  )
}

export default SelectedBet
