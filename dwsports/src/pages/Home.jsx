import React, {useState, useEffect} from 'react'
import {HomeSection} from './index'
import {motion} from 'framer-motion'
import NavBar from '../components/NavBar'
import { animationOne, animationTwo, transition } from '../animations'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { BetState } from '../context/BetsContext'
import { useAuth, useFetchMessages } from './functions'



const Home = () => {

    const navigate = useNavigate()
    const { messages } = useFetchMessages();
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
    <motion.div initial="out" animate="in" variants={animationTwo} transition={transition}>
    <HomeSection>
      <NavBar />
    </HomeSection>
    </motion.div>
  )
}

export default Home
