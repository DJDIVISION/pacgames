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
      const tg = window.Telegram.WebApp; // Access Telegram Web App API
  
      tg.ready(); // Notify Telegram that the app is ready
  
      // Extract user info from Telegram Web App context
      const initData = tg.initData || "";
      const initDataUnsafe = tg.initDataUnsafe || {};
  
      console.log("Telegram Init Data:", initDataUnsafe);
  
      if (initDataUnsafe?.user) {
        // Send user data to the backend for validation
        fetch("https://pacgames-roulette-server.onrender.com/api/auth/telegram", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(initDataUnsafe.user),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Backend response:", data);
  
            if (data.success) {
              // Redirect to the home page upon successful authentication
              navigate("/home");
            } else {
              alert("Authentication failed. Please try again.");
            }
          })
          .catch((err) => {
            console.error("Error communicating with backend:", err);
          });
      } else {
        alert("Unable to retrieve Telegram user data. Please ensure you are logged into Telegram.");
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
