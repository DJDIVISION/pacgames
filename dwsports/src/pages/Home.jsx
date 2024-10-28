import React, {useState, useEffect} from 'react'
import {HomeSection,WalletAmount} from './index'
import {motion} from 'framer-motion'
import NavBar from '../components/NavBar'
import { animationOne, animationTwo, transition } from '../animations'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { BetState } from '../context/BetsContext'
import { useAuth, useFetchMessages } from './functions'
import { Button } from '@mui/material'
import { message } from 'antd'
import { FantasyState } from '../context/FantasyContext'
import DepositMenu from '../components/menus/DepositMenu'



const Home = () => {

  const {depositMenu, setDepositMenu} = FantasyState();
  const {walletBalance,setWalletBalance} = FantasyState();
  const fetchData =  () => {
    const data = localStorage.getItem("barcelonaStats")
    const json = JSON.parse(data)
    const stats = (json.response[0].statistics)
    stats.forEach(async (stat) => {
      if(stat.team.name === 'Arsenal'){
        if(stat.league.name === 'Premier League'){
          console.log(stat)
          const updatedData = [
            stat
          ]
          console.log(updatedData)
          const json = JSON.stringify(stat)
          const { data, error } = await supabase
            .from('footballPlayers')
            .update([{laLigaStats: updatedData}])
            .eq("id", 643)
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            console.log('User session data saved:', data)
            message.success("Your bet has been registered")
          }
        }
      }
    })
  }

    const navigate = useNavigate()
    /* const { messages } = useFetchMessages(); */
    const { user } = useAuth();

  
  /* useEffect(() => {
    // Get the current user session
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        localStorage.setItem("user", JSON.stringify(session.user))
        const user = session.user
        
      } else {
        // If no user is found, redirect to the login page
        navigate('/login')
      }
    }

    getUser()
  }, [navigate]) */
  


  return (
    <motion.div initial="out" animate="in" variants={animationOne} transition={transition}>
    <HomeSection>
      <NavBar />
      {walletBalance && <WalletAmount>YOUR BALANCE IS: {walletBalance} TON</WalletAmount>}
      {depositMenu && (
        <DepositMenu depositMenu={depositMenu} setDepositMenu={setDepositMenu} />
      )}
      {/* <Button onClick={fetchData} variant="contained">FETCH DATA</Button> */}
    </HomeSection>
    </motion.div>
  )
}

export default Home
