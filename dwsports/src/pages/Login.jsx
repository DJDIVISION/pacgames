import React from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'

const Login = () => {
    const navigate = useNavigate()

    const handleGoogleSignIn = async () => {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })
  
      if (error) {
        console.error('Error with Google sign-in:', error.message)
      } else {
        // Redirect to the home page on successful login
        navigate('/')
      }
    }
  
    return (
      <div>
        <h1>Login</h1>
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      </div>
    )
}

export default Login
