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
import { HeroSection } from '../components/home'
import Hero from '../components/home/Hero'



const Home = ({toggleTheme}) => {

  const {depositMenu, setDepositMenu} = FantasyState();
  const {walletBalance,setWalletBalance} = FantasyState();
  const { user } = useAuth();

  const storeUserData = async (user) => {
    const { id, email, user_metadata } = user;
    const { full_name: name, avatar_url } = user_metadata || {};

    try {
        // Insert or update user login data
        const { error: loginError } = await supabase
            .from('user_logins')
            .upsert([{ user_id: id, email: email, name: name, avatar: avatar_url }]);

        if (loginError) throw loginError;
        console.log('User login data saved successfully:', { id, email, name, avatar_url });
    } catch (error) {
        console.error('Error storing user login data:', error.message);
    }

    try {
        // Check if user already exists in the users table
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .limit(1); // Limit to 1 row to avoid multiple rows error

        // Check for errors in fetching
        if (fetchError) {
            console.error('Error checking user existence:', fetchError.message);
            return;
        }

        // Check if any users were returned
        if (existingUser.length === 0) {
            // If user does not exist, proceed to save data
            const { data, error } = await supabase
                .from('users')
                .upsert([{ 
                    id: id, // Assign the user's ID to the 'id' column
                    email: email, 
                    name: name, 
                    avatar: avatar_url, 
                    referralLink: `PACTONGZ/${id}` 
                }]);

            if (error) {
                console.error('Error storing user data:', error.message);
                return;
            }

            console.log('User data saved successfully:', data);
        } else {
            console.log('User already exists in the database. No data saved:', existingUser);
        }
    } catch (error) {
        console.error('Unexpected error storing user data:', error.message);
    }
};


  useEffect(() => {
    if(user){
      const signDate = user.last_sign_in_at;
      const date = new Date(signDate);
      const milliseconds = date.getTime();
      const now = Date.now();
      if (now - milliseconds < 50000) {
        storeUserData(user); 
      } else {
        return
      }
    }
  }, [user]);

  return (
    <motion.div initial="out" animate="in" variants={animationOne} transition={transition}>
    
      <NavBar toggleTheme={toggleTheme}/>
      {/* {walletBalance && <WalletAmount>YOUR BALANCE IS: {walletBalance} TON</WalletAmount>} */}
      {/* {depositMenu && (
        <DepositMenu depositMenu={depositMenu} setDepositMenu={setDepositMenu} />
      )} */}
    <Hero />
    </motion.div>
  )
}

export default Home
