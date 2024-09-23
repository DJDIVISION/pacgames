import React, {useState, useEffect, useRef}from 'react'
import { toast } from 'react-toastify';
import { supabase } from '../supabase/client';

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

export const initWheel = () => {
  let wheelContent = [];
  for (let x = 0; x < 35; x++) {
    wheelContent.push(
      <div className="row" key={x}>
        <div className="card red">28</div>
        <div className="card black">12</div>
        <div className="card red">35</div>
        <div className="card black">3</div>
        <div className="card red">26</div>
        <div className="card green">0</div>
        <div className="card black">32</div>
        <div className="card red">15</div>
        <div className="card black">9</div>
        <div className="card red">4</div>
        <div className="card black">21</div>
        <div className="card red">2</div>
        <div className="card black">25</div>
        <div className="card red">17</div>
        <div className="card black">34</div>
        <div className="card red">6</div>
        <div className="card black">27</div>
        <div className="card red">13</div>
        <div className="card black">36</div>
        <div className="card red">11</div>
        <div className="card black">30</div>
        <div className="card red">8</div>
        <div className="card black">23</div>
        <div className="card red">10</div>
        <div className="card black">5</div>
        <div className="card red">24</div>
        <div className="card black">16</div>
        <div className="card red">33</div>
        <div className="card black">1</div>
        <div className="card red">20</div>
        <div className="card black">14</div>
        <div className="card red">31</div>
        <div className="card black">9</div>
        <div className="card red">22</div>
        <div className="card black">18</div>
        <div className="card red">29</div>
        <div className="card black">7</div>
        
      </div>
    );
  }
  return wheelContent;
};

