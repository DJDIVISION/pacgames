import React, {useState, useEffect} from 'react'
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
          console.log('New message payload:', payload);
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

