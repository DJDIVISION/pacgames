import React, {useState, useEffect} from 'react'
import {HomeSection} from './index'
import {motion} from 'framer-motion'
import NavBar from '../components/NavBar'
import { animationOne, animationTwo, transition } from '../animations'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { BetState } from '../context/BetsContext'



const Home = () => {

    const {user, setUser} = BetState();
    const navigate = useNavigate()
    console.log(user)

  useEffect(() => {
    // Get the current user session
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
        localStorage.setItem("user", JSON.stringify(session.user))
        const user = session.user
        const updatedData = {
          email: user.email,
          name: user.user_metadata.full_name,
          avatar: user.user_metadata.avatar_url
        }
        /* const { data, error } = await supabase
          .from('user_logins')
          .insert([updatedData])
          if (error) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            console.log('User session data saved:', data)
          } */
      } else {
        // If no user is found, redirect to the login page
        navigate('/login')
      }
    }

    getUser()
  }, [navigate])
  


  return (
    <motion.div initial="out" animate="in" variants={animationTwo} transition={transition}>
    <HomeSection>
      <NavBar />
    </HomeSection>
    </motion.div>
  )
}

export default Home
