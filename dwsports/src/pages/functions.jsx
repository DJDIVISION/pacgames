import React, {useState, useEffect, useRef}from 'react'
import { toast } from 'react-toastify';
import { supabase } from '../supabase/client';
import { motion } from 'framer-motion';
import { SmallTextHolder,BigTextHolder, BigTextWinnings, EurosTextHolder, BigTextHolderSlots } from './indexTwo';
import { FantasyState } from '../context/FantasyContext';

export const WinningsDisplay = ({ winnings }) => {
  const [displayWinnings, setDisplayWinnings] = useState(winnings);

  useEffect(() => {
    const controls = setInterval(() => {
      setDisplayWinnings((prev) => {
        if (prev < winnings) return Math.min(prev + 1, winnings);
        if (prev > winnings) return Math.max(prev - 1, winnings);
        return winnings;
      });
    }, 5); // Speed of counting, adjust as necessary

    return () => clearInterval(controls);
  }, [winnings]);

  return (
    <motion.div
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
    >
     <BigTextWinnings>WINNINGS: {`$${displayWinnings}`}</BigTextWinnings>
    </motion.div>
  );
};

export const BalanceDisplay = ({ balance }) => {
  const [displayBalance, setDisplayBalance] = useState(balance);

  useEffect(() => {
    const controls = setInterval(() => {
      setDisplayBalance((prev) => {
        if (prev < balance) return Math.min(prev + 1, balance);
        if (prev > balance) return Math.max(prev - 1, balance);
        return balance;
      });
    }, 5); // Speed of counting, adjust as necessary

    return () => clearInterval(controls);
  }, [balance]);

  return (
    <motion.div
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
    >
     <SmallTextHolder>BALANCE: {displayBalance} PGZ</SmallTextHolder>
    </motion.div>
  );
};

export const BalanceDisplayBig = ({ balance }) => {
  const [displayBalance, setDisplayBalance] = useState(balance);

  useEffect(() => {
    const controls = setInterval(() => {
      setDisplayBalance((prev) => {
        if (prev < balance) return Math.min(prev + 1, balance);
        if (prev > balance) return Math.max(prev - 1, balance);
        return balance;
      });
    }, 5); // Speed of counting, adjust as necessary

    return () => clearInterval(controls);
  }, [balance]);

  return (
    <motion.div
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
    >
     <BigTextHolder>BALANCE: ${displayBalance}</BigTextHolder>
    </motion.div>
  );
};

export const BalanceDisplaySlots = ({ balance }) => {
  const [displayBalance, setDisplayBalance] = useState(balance);

  useEffect(() => {
    const controls = setInterval(() => {
      setDisplayBalance((prev) => {
        if (prev < balance) return Math.min(prev + 1, balance);
        if (prev > balance) return Math.max(prev - 1, balance);
        return balance;
      });
    }, 5); // Speed of counting, adjust as necessary

    return () => clearInterval(controls);
  }, [balance]);

  return (
    <motion.div
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
    >
     <BigTextHolderSlots>BALANCE: ${displayBalance}</BigTextHolderSlots>
    </motion.div>
  );
};

export const EuroBalanceDisplay = ({ balance }) => {
  const [displayBalance, setDisplayBalance] = useState(balance);

  useEffect(() => {
    const controls = setInterval(() => {
      setDisplayBalance((prev) => {
        if (prev < balance) return Math.min(prev + 1, balance);
        if (prev > balance) return Math.max(prev - 1, balance);
        return balance;
      });
    }, 5); // Speed of counting, adjust as necessary

    return () => clearInterval(controls);
  }, [balance]);

  return (
    <motion.div
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
    >
     <EurosTextHolder>BALANCE: {parseFloat(displayBalance).toFixed(2)}M €</EurosTextHolder>
    </motion.div>
  );
};

export const AverageDisplay = ({ balance }) => {
  const [displayBalance, setDisplayBalance] = useState(balance);

  useEffect(() => {
    const controls = setInterval(() => {
      setDisplayBalance((prev) => {
        if (prev < balance) return Math.min(prev + 1, balance);
        if (prev > balance) return Math.max(prev - 1, balance);
        return balance;
      });
    }, 5); // Speed of counting, adjust as necessary

    return () => clearInterval(controls);
  }, [balance]);

  const average = parseFloat(displayBalance).toFixed(2)

  return (
    <motion.div
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
    >
     <EurosTextHolder>TEAM AVERAGE: <p><span style={{color: getBackgroundColor(average)}}>{parseFloat(displayBalance).toFixed(2)}</span></p></EurosTextHolder>
    </motion.div>
  );
};

export const PlacedBetDisplay = ({ placedBet }) => {
  const [displayPlacedBet, setDisplayPlacedBet] = useState(placedBet);

  useEffect(() => {
    const controls = setInterval(() => {
      setDisplayPlacedBet((prev) => {
        if (prev < placedBet) return Math.min(prev + 1, placedBet);
        if (prev > placedBet) return Math.max(prev - 1, placedBet);
        return placedBet;
      });
    }, 5); // Speed of counting, adjust as necessary

    return () => clearInterval(controls);
  }, [placedBet]);

  return (
    <motion.div
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
      style={{ fontSize: '12px', fontWeight: 'bold' }}
    >
     <SmallTextHolder>BET: ${displayPlacedBet}</SmallTextHolder>
    </motion.div>
  );
};

export const PlacedBetDisplayBig = ({ placedBet }) => {
  const [displayPlacedBet, setDisplayPlacedBet] = useState(placedBet);

  useEffect(() => {
    const controls = setInterval(() => {
      setDisplayPlacedBet((prev) => {
        if (prev < placedBet) return Math.min(prev + 1, placedBet);
        if (prev > placedBet) return Math.max(prev - 1, placedBet);
        return placedBet;
      });
    }, 5); // Speed of counting, adjust as necessary

    return () => clearInterval(controls);
  }, [placedBet]);

  return (
    <motion.div
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
      style={{ fontSize: '12px', fontWeight: 'bold' }}
    >
     <BigTextHolder>BET: ${displayPlacedBet}</BigTextHolder>
    </motion.div>
  );
};

export const NumbersBetDisplay = ({ allBets }) => {
  const [displayNumbersBet, setDisplayNumbersBet] = useState(Object.values(allBets).length);

  useEffect(() => {
    const controls = setInterval(() => {
      setDisplayNumbersBet((prev) => {
        if (prev < Object.values(allBets).length) return Math.min(prev + 1, Object.values(allBets).length);
        if (prev > Object.values(allBets).length) return Math.max(prev - 1, Object.values(allBets).length);
        return Object.values(allBets).length;
      });
    }, 5); // Speed of counting, adjust as necessary

    return () => clearInterval(controls);
  }, [allBets]);

  return (
    <motion.div
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
      style={{ fontSize: '12px', fontWeight: 'bold' }}
    >
     <SmallTextHolder>NUMBERS: {displayNumbersBet}</SmallTextHolder>
    </motion.div>
  );
};

export const NumbersBetDisplayBig = ({ allBets }) => {
  const [displayNumbersBet, setDisplayNumbersBet] = useState(Object.values(allBets).length);

  useEffect(() => {
    const controls = setInterval(() => {
      setDisplayNumbersBet((prev) => {
        if (prev < Object.values(allBets).length) return Math.min(prev + 1, Object.values(allBets).length);
        if (prev > Object.values(allBets).length) return Math.max(prev - 1, Object.values(allBets).length);
        return Object.values(allBets).length;
      });
    }, 5); // Speed of counting, adjust as necessary

    return () => clearInterval(controls);
  }, [allBets]);

  return (
    <motion.div
      animate={{ opacity: [0, 1] }}
      transition={{ duration: 0.5 }}
      style={{ fontSize: '12px', fontWeight: 'bold' }}
    >
     <BigTextHolder>NUMBERS: {displayNumbersBet}</BigTextHolder>
    </motion.div>
  );
};

 export const americanRouletteNumbers = [
  { number: 0, color: "lime" },
  { number: 28, color: "black" },
  { number: 9, color: "red" },
  { number: 26, color: "black" },
  { number: 30, color: "red" },
  { number: 11, color: "black" },
  { number: 7, color: "red" },
  { number: 20, color: "black" },
  { number: 32, color: "red" },
  { number: 17, color: "black" },
  { number: 5, color: "red" },
  { number: 22, color: "black" },
  { number: 34, color: "red" },
  { number: 15, color: "black" },
  { number: 3, color: "red" },
  { number: 24, color: "black" },
  { number: 36, color: "red" },
  { number: 13, color: "black" },
  { number: 1, color: "red" },
  { number: "00", color: "lime" },
  { number: 27, color: "red" },
  { number: 10, color: "black" },
  { number: 25, color: "red" },
  { number: 29, color: "black" },
  { number: 12, color: "red" },
  { number: 8, color: "black" },
  { number: 19, color: "red" },
  { number: 31, color: "black" },
  { number: 18, color: "red" },
  { number: 6, color: "black" },
  { number: 21, color: "red" },
  { number: 33, color: "black" },
  { number: 16, color: "red" },
  { number: 4, color: "black" },
  { number: 23, color: "red" },
  { number: 35, color: "black" },
  { number: 14, color: "red" },
  { number: 2, color: "black" },
];

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

export const useFetchRouletteMessages = () => {
  const [rouletteMessages, setRouletteMessages] = useState([]);

  useEffect(() => {
    // Function to fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('roulette_chat_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.log('Error fetching messages:', error);
      }

      if (data) {
        console.log('Fetched messages:', data);
        setRouletteMessages(data); // Set the messages to state
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
          
          setRouletteMessages((prevMessages) => [...prevMessages, payload.new]);
        }
      )
      .subscribe();

    // Cleanup subscription when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { rouletteMessages,setRouletteMessages };
};

export const useAuth = () => {
  const [user, setUser] = useState(null); // Store user state
  const [loading, setLoading] = useState(true); // To handle loading state while session is being checked
  const {session, setSession} = FantasyState();

  useEffect(() => {
    // Function to check if a session exists
    const checkSession = async () => {
      // Get session from Supabase auth
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setSession(session)
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


export const useGetTeams = () => {
  const [teams, setTeams] = useState([]); // Stores the list of teams
  const [loadingTeams, setLoadingTeams] = useState(false); // Loading state for teams
  const [loadingPlayers, setLoadingPlayers] = useState(false); // Loading state for players
  const { activeLeague, setActiveLeague } = FantasyState(); 
  const {activeTeam, setActiveTeam} = FantasyState();
  const { activeTeamId, setActiveTeamId } = FantasyState(); 
  const [players, setPlayers] = useState([]); // Stores the list of players for the active team

  // Function to fetch teams from Supabase
  const getTeams = async () => {
    setLoadingTeams(true);
    const { data, error } = await supabase
      .from('teams')
      .select('*')
      .eq("league", activeLeague.league)
      .order('teamName', { ascending: true });

    if (error) {
      console.error('Error fetching teams:', error.message);
      setLoadingTeams(false);
      return;
    }

    if (data && data.length > 0) {
      setTeams(data);
      /* setActiveTeam(data[0]) */
      setActiveTeamId(data[0].teamId); // Set the first team as active
      getPlayers(data[0].teamId); // Fetch players for the first team
    }

    setLoadingTeams(false);
  };

  // Function to fetch players for a given team from Supabase
  const getPlayers = async (teamId) => {
    /* console.log(teamId) */
    setLoadingPlayers(true);
    const { data, error } = await supabase
      .from('footballPlayers')
      .select('*')
      .eq("teamId", teamId)
      .eq("topPlayer", true)
      .order('position', { ascending: true }); // Fetch players by teamId

    if (error) {
      console.error('Error fetching players:', error.message);
      setLoadingPlayers(false);
      return;
    }

    if (data) {
      setPlayers(data);
      
    }

    setLoadingPlayers(false);
  };

  // Function to handle team selection by user
  const handleTeamChange = (teamId) => {
    setActiveTeamId(teamId); // Update active team
    getPlayers(teamId); // Fetch players for the new team
  };

  return { 
    teams, 
    getTeams, 
    loadingTeams, 
    players, 
    loadingPlayers, 
    handleTeamChange,
    setPlayers,
    setTeams,
    getPlayers // Expose handleTeamChange for use in UI
  };
};

export function startCountdown(date) {
  console.log("date", date)
  const countdownElement = document.getElementById("countdown");
  console.log("element",countdownElement)
    if (!countdownElement) {
        console.error("Countdown element not found.");
        return;
    }
    const updateCountdown = () => {
        const now = Date.now();
        const timeRemaining = date - now;

        if (timeRemaining <= 0) {
            countdownElement.textContent = "There is no training going on!";
            return;
        }
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        countdownElement.textContent = `${hours}h ${minutes}m ${seconds}s \n\r left for next training`;

        setTimeout(updateCountdown, 1000);
    };

    updateCountdown();
}

export const getBackgroundColor = (number) => {
  if (number >= 0 && number < 6) return 'red'; // Color for 5 to <6
  if (number >= 6 && number < 6.5) return 'orange'; // Color for 5 to <6
  if (number >= 6.5 && number < 7) return '#eafa07';  // Color for 6 to <7
  if (number >= 7 && number < 8) return '#12f812'; // Color for 7 to <8
  if (number >= 8 && number < 9) return '#00ccff'; // Color for 8 to <9
  if (number >= 9 && number <= 10) return '#3F00FF'; // Color for 9 to 10
  return 'white'; // Default background color if number is out of range
};

export const getUserBalance = async (id) => {
  const {balance, setBalance} = FantasyState();
  console.log(id)
  const { data, error } = await supabase
      .from('users')
      .select('appBalance')
      .eq("id", id)

    if (error) {
      console.error('Error fetching teams:', error.message);
      return;
    }

    if (data) {
      console.log(data)
    }
}

