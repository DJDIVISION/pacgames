import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { LoginSection,GoogleButton,GoogleLogo,GoogleText } from './index'
import logo from '../assets/google.png'
import { FantasyState } from '../context/FantasyContext'
import googleDark from '../assets/logos/googleDark.png'
import googleLight from '../assets/logos/googleLight.png'

const Login = () => {

    const navigate = useNavigate()
    const {currentUser, setCurrentUser} = FantasyState();
    const {session, setSession} = FantasyState();
    const handleGoogleSignIn = async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      
      if (error) {
        console.error('Error with Google sign-in:', error.message);
        return;
      }
      
      // Handle successful sign-in
      if (data) {
        const { session, user } = data;
        if (user) {
          console.log('Authenticated user:', user);
          setCurrentUser(user);  // Update user state
          setSession(session)
          navigate('/home');  // Navigate to the home page
        }
        
        if (session) {
          console.log('Session information:', session);
        }
      }
    };
  
    // This useEffect ensures that if the user is already logged in (e.g., after page refresh),
    // they are automatically redirected to the home page
    useEffect(() => {
      const session = supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);  // Set user state if session exists
        navigate('/home');  // Redirect if already logged in
      }
    }, [navigate, setCurrentUser]);


  
    return (
      <LoginSection>
        <GoogleButton onClick={() => handleGoogleSignIn()}>
        <img src={googleDark} alt="googleDark" />
        </GoogleButton>
      </LoginSection>
    )
}

export default Login
