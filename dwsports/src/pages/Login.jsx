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
      console.log(data);  // Log the authentication data for debugging
  
      // Send data to your backend for validation
      fetch('https://pacgames-roulette-server.onrender.com/telegram-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),  // Send the Telegram authentication data to the backend
      })
      .then((response) => response.json())
      .then((user) => {
        console.log('Authenticated user:', user);  // Log authenticated user data
        // After successful login, redirect the user to the home page
        navigate('/home');  // Redirect to home page (change this to your desired route)
      })
      .catch((error) => {
        console.error('Authentication failed:', error);
        // Optionally show an error message if authentication fails
      });
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
