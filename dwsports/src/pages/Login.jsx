import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { LoginSection,GoogleButton,GoogleLogo,GoogleText } from './index'
import logo from '../assets/google.png'
import { FantasyState } from '../context/FantasyContext'

const Login = () => {

    const navigate = useNavigate()
    const {user, setUser} = FantasyState();

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

      useEffect(() => {
        // Check if the app is opened inside the Telegram Mini App
        if (window.Telegram && window.Telegram.WebApp) {
          const queryParams = new URLSearchParams(window.location.search);
          const initData = queryParams.get('tgWebAppInitData');
          alert("telegram detected")
          if (initData) {
            // Parse initData (Telegram sends it as a URL parameter)
            const userData = JSON.parse(decodeURIComponent(initData));
            setUser(userData);  // Store the user data to use in the app
            
            // Send user data to your backend for validation and session creation
            fetch('https://pacgames-roulette-server.onrender.comlogin/telegram', {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(userData),
            })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                // User is successfully logged in, redirect or show logged-in state
                console.log('User logged in:', data);
                // You can store JWT or user session here
              }
            });
          }
        }
      }, []);
  
    return (
      <LoginSection>
        <GoogleButton>
            <GoogleText>SIGN IN</GoogleText>
        </GoogleButton>
      </LoginSection>
    )
}

export default Login
