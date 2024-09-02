import React, {useState, useEffect} from 'react'
import {HomeSection} from './index'
import {motion} from 'framer-motion'
import NavBar from '../components/NavBar'
import { animationOne, animationTwo, transition } from '../animations'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'


const Home = () => {

    const [user, setUser] = useState(null)
    const navigate = useNavigate()

  useEffect(() => {
    // Get the current user session
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log(session)
      if (session) {
        setUser(session.user)
      } else {
        // If no user is found, redirect to the login page
        navigate('/login')
      }
    }

    getUser()
  }, [navigate])

  console.log(user)

  return (
    <motion.div initial="out" animate="in" variants={animationTwo} transition={transition}>
    <HomeSection>
      <NavBar />
    </HomeSection>
    </motion.div>
  )
}

export default Home
