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
      const tg = window.Telegram?.WebApp;
  
      if (!tg) {
        console.error("Telegram WebApp is not available. Open this inside Telegram.");
        return;
      }
  
      // Telegram WebApp Initialization
      tg.ready(); // Notify Telegram that the app is ready
  
      console.log("Telegram WebApp initialized:", tg.initDataUnsafe);
  
      // Example UI customization
      tg.MainButton.setText("Connect to Telegram");
      tg.MainButton.show();
  
      // Attach handler to Main Button
      tg.MainButton.onClick(() => {
        console.log("MainButton clicked!");
        fetch("https://pacgames-roulette-server.onrender.com/api/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData: tg.initData }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              console.log("Authentication successful:", data.user);
              alert(`Welcome, ${data.user.first_name}`);
            } else {
              console.error("Authentication failed:", data.message);
              alert("Authentication failed. Try again.");
            }
          })
          .catch((err) => {
            console.error("Error during authentication:", err);
          });
      });
    }, []);

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
        <h1>Telegram Mini App</h1>
        <p>Tap the button below to authenticate with Telegram.</p>
        </GoogleButton>
      </LoginSection>
    )
}

export default Login
