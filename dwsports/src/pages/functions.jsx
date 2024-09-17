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
    const fetchMessages = async () => {
      try {
        const response = await fetch('https://pacton-server.vercel.app/api/messages'); // Call the serverless function
        const data = await response.json();

        if (response.ok) {
          setMessages(data);
        } else {
          console.error('Error fetching messages:', data.error);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  return { messages };
};
