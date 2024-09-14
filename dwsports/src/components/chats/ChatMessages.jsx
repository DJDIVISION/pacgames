import React, {useRef,useEffect} from 'react'
import { useFetchMessages } from '../../pages/functions';
import {MessageHolder,AvatarHolder,MessageText,MessageTime} from './index'
import { Avatar } from '@mui/material';

const ChatMessages = ({chatEndRef}) => {

    const { messages } = useFetchMessages();
    console.log("messages", messages) 

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

  return (
    <div>
      {messages?.map((msg, index) => {
        let date = new Date(msg.created_at)
        let str = date.toLocaleTimeString()
        str = str.substring(0, str.length - 3);
        console.log(str)
        return(
            <MessageHolder key={index} className="chat-message">
            <AvatarHolder>
            <Avatar alt="Image" src={msg.user_avatar} sx={{ width: 30, height: 30 }}/>
            </AvatarHolder>
            <MessageText>{msg.message}</MessageText>
            <MessageTime>{str}</MessageTime>
          </MessageHolder>
        )
      })}
        <div ref={chatEndRef}></div>
    </div>
  )
}

export default ChatMessages


