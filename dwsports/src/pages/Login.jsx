import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { LoginSection,GoogleButton,GoogleLogo,GoogleText } from './index'
import logo from '../assets/google.png'

const Login = () => {

    const navigate = useNavigate()

    const handleGoogleSignIn = async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })
  
      if (error) {
        console.error('Error with Google sign-in:', error.message)
      } 
      if(data){
        console.log(data)
      }
    }
  
    return (
      <LoginSection>
        <GoogleButton onClick={handleGoogleSignIn}>
            <GoogleLogo><img src={logo} alt="" /></GoogleLogo>
            <GoogleText>SIGN IN WITH GOOGLE</GoogleText>
        </GoogleButton>
      </LoginSection>
    )
}

export default Login
