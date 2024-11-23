import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { LoginSection,GoogleButton,GoogleLogo,GoogleText } from './index'
import logo from '../assets/google.png'
import { FantasyState } from '../context/FantasyContext'
import TelegramLogin from '../components/home/TelegramLogin'
import { LoginButton } from '@telegram-auth/react';

const Login = () => {

    const navigate = useNavigate()
    const {user, setUser} = FantasyState();
    
    const handleAuthCallback = (data) => {
      console.log(data);
      // Call your backend to validate and sign in the user
      // You can send 'data' to your backend API for further validation
      fetch('https://pacgames-roulette-server.onrender.com/telegram-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then((response) => response.json())
      .then((user) => {
        console.log('Authenticated user:', user);
        // Store user data and handle post-login behavior
      })
      .catch((error) => console.error('Authentication failed:', error));
    };

    /* const handleGoogleSignIn = async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })
  
      if (error) {
        console.error('Error with Google sign-in:', error.message)
      } 
      if(data){
        console.log(data)
      }
    } */
  
    return (
      <LoginSection>
        <GoogleButton>
        <LoginButton
        botUsername="PactonGamingZoneBot"
        onAuthCallback={handleAuthCallback}
        buttonSize="medium" // Adjust the button size
        cornerRadius={5}    // Button corner radius
        showAvatar={true}   // Show user's avatar on the button
        lang="en"           // Language for the button
      />
        </GoogleButton>
      </LoginSection>
    )
}

export default Login
