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

export const fetchMessages = async () => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
        const { data, error } = await supabase.from('games_chat_messages').select('*').order('created_at', { ascending: true });
          if(error){
            console.log(error)
          }
          if(data){
            console.log(data[0])
            setMessages(data)
          }
    };

    fetchMessages();

    // Subscribe to new messages
    
      const channel = supabase
          .channel('schema-db-changes')
          .on(
              'postgres_changes',
              {
                  event: '*',
                  schema: 'public',
              },
              (payload) => console.log(payload)
          )
          .subscribe()

    // Cleanup subscription on unmount
    return () => {
        supabase.removeChannel(channel)
    };
  }, []);
  return {messages, setMessages}
};

