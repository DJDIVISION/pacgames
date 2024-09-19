import React, {useState, useEffect, useRef}from 'react'
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import chipSound from '../assets/sounds/chipSound.ogg'
import shuffle from '../assets/sounds/shuffle.mp3'
import casinoAmbience from '../assets/sounds/casinoAmbience.ogg'
import winnings from '../assets/sounds/casinoAmbience.ogg'
import karmacoma from '../assets/sounds/karmacoma.ogg'
 
import { supabase } from '../supabase/client';
import { VolumeIcon,VolumeDownIcon } from './index';

export function EffectsVolumeSlider({effectsVolume,setEffectsVolume}) {
    
  const soundEffectsRef = useRef([]);

  const handleEffectVolume = (event, newValue) => {
      setEffectsVolume(newValue / 100); // Normalize value from 0-100 to 0-1
  };

  useEffect(() => {
      soundEffectsRef.current = [
        new Audio(chipSound),
        new Audio(shuffle),
        new Audio(winnings),
      ];
  
      // Apply the initial volume
      soundEffectsRef.current.forEach((sound) => {
        sound.volume = effectsVolume;
      });
    }, []);

  useEffect(() => {
    soundEffectsRef.current.forEach((sound) => {
      sound.volume = effectsVolume;
    });
  }, [effectsVolume]);

  return (
    <Box sx={{ width: '100%', height: '40%' }}>
      <Stack spacing={2} direction="row" sx={{height: '70%',  alignItems: 'center', mb: 1, width: '90%', marginLeft: '10px' }}>
        <VolumeDownIcon />
        <Slider aria-label="Volume" value={effectsVolume * 100} onChange={handleEffectVolume} />
        <VolumeIcon />
      </Stack>
    </Box>
  );
}

export function MusicVolumeSlider({musicVolume,setMusicVolume,allowMusic,setAllowMusic}) {
  

  const musicRef = useRef(new Audio(karmacoma));

  useEffect(() => {
    musicRef.current.volume = musicVolume;
  }, [musicVolume]);
  

  const handleMusicVolume = (event, newValue) => {
      setMusicVolume(newValue / 100); // Normalize value from 0-100 to 0-1
    };

  return (
    <Box sx={{ width: '100%', height: '40%'}}>
      <Stack spacing={2} direction="row" sx={{height: '70%',  alignItems: 'center', mb: 1, width: '90%', marginLeft: '10px' }}>
        <VolumeDownIcon />
        <Slider aria-label="Volume" value={musicVolume * 100} onChange={handleMusicVolume} />
        <VolumeIcon />
      </Stack>
    </Box>
  );
}

export const playWinnings = () => {
    const audio = new Audio(winnings);
    audio.play();
};

export const playAmbience = () => {
  const audio = new Audio(karmacoma);
  audio.play();
};
export const playChipSound = () => {
    const audio = new Audio(chipSound);
    audio.play();
};
export const playShuffle = () => {
    const audio = new Audio(shuffle);
    audio.play();
};

export const autoCloseOff = (message) => {
  toast(message, {
    className: "custom-toast",
    position: "top-right",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
        });
};

export const placeBetNotify  = (message) => {
  toast(message, {
    className: "custom-toast",
    position: "top-right",
    autoClose: 15000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
};

export const waitingtToStarttNotify  = (message) => {
    toast(message, {
      className: "custom-toast",
      position: "top-right",
      autoClose: 75000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
};

export const dismissAll = () =>  toast.dismiss();

export const welcomeNotify = (message) => {
    toast(message, {
      className: "custom-toast",
      position: "top-right",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
          });
};

export const useFetchMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Function to fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('games_chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.log('Error fetching messages:', error);
      }

      if (data) {
        console.log('Fetched messages:', data);
        setMessages(data); // Set the messages to state
      }
    };

    // Call the fetch function on component mount
    fetchMessages();

    // Subscribe to new messages using Supabase real-time feature
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          
          setMessages((prevMessages) => [...prevMessages, payload.new]);
        }
      )
      .subscribe();

    // Cleanup subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { messages,setMessages };
};

export const useAuth = () => {
  const [user, setUser] = useState(null); // Store user state
  const [loading, setLoading] = useState(true); // To handle loading state while session is being checked

  useEffect(() => {
    // Function to check if a session exists
    const checkSession = async () => {
      // Get session from Supabase auth
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user); // Set the user state if session exists
      } else {
        setUser(null); // Clear the user state if no session
      }
      setLoading(false); // Loading finished
    };

    // Call the session checking function
    checkSession();

    // Set up an auth state listener to detect login/logout events
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user); // Set user when signed in
      } else if (event === 'SIGNED_OUT') {
        setUser(null); // Clear user on sign out
      }
    });

    // Cleanup the listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { user, loading }; // Return user and loading state
};

