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
      // Inject the Telegram widget script
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', 'PactonGamingZoneBot'); // Replace with your bot username
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-onauth', 'onTelegramAuth');
      script.setAttribute('data-request-access', 'write');
      document.getElementById('telegram-login-container').appendChild(script);
  
      // Define the onTelegramAuth function globally
      window.onTelegramAuth = (user) => {
        console.log('User Data:', user);
  
        // Example: Send user data to your backend for further processing
        fetch('https://pacgames-roulette-server.onrender.com/auth/telegram', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log('Server response:', data);
            // Redirect to the home page after successful login
            navigate('/home'); // Change '/home' to the route you want
          })
          .catch((err) => {
            console.error('Error sending data to backend:', err);
          });
      };
  
      return () => {
        document.getElementById('telegram-login-container').innerHTML = '';
      };
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
        <GoogleButton>
            <GoogleText div id="telegram-login-container"></GoogleText>
        </GoogleButton>
      </LoginSection>
    )
}

export default Login
