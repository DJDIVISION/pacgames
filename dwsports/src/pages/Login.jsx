import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { LoginSection,GoogleButton,GoogleLogo,GoogleText } from './index'
import logo from '../assets/google.png'
import { FantasyState } from '../context/FantasyContext'
import TelegramLogin from '../components/home/TelegramLogin'

const Login = () => {

    const navigate = useNavigate()
    const {user, setUser} = FantasyState();


    useEffect(() => {
      const tg = window.Telegram?.WebApp; // Access Telegram Web Apps API
      if (!tg) {
        console.error("Telegram WebApp is not available. Ensure you are testing in Telegram.");
        return;
      }
  
      tg.ready(); // Notify Telegram that the app is ready
  
      // Extract Telegram Init Data
      const initData = tg.initData; // Raw signed initData
      console.log("Telegram Init Data:", initData);
  
      if (initData) {
        // Send Telegram Init Data to the Backend for Validation
        fetch("https://pacgames-roulette-server.onrender.com/api/auth/telegram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ initData }), // Send the signed payload
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              console.log("Authentication successful:", data);
              navigate("/home"); // Redirect to home page
            } else {
              console.error("Authentication failed:", data.message);
              alert("Authentication failed. Please try again.");
            }
          })
          .catch((err) => {
            console.error("Error during authentication:", err);
          });
      } else {
        console.error("initData not found.");
        alert("Failed to retrieve Telegram user data.");
      }
    }, [navigate]);

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
        <GoogleButton style={{background: 'orange'}}>
            <GoogleText div id="telegram-login-container"></GoogleText>
        </GoogleButton>
      </LoginSection>
    )
}

export default Login
