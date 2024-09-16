import React, {useRef,useEffect,useState} from 'react'
import { useFetchMessages } from '../../pages/functions';
import {MessageHolder,AvatarHolder,MessageText,MessageTime,ChatContainer,ButtonAbsolute,MessagesWrapper,CloseChatRoomIcon,
    ChatRoomIcon,MessageName 
} from './index'
import { Avatar } from '@mui/material';
import ActionIcons from './ActionIcons';
import ChatInput from './ChatInput';
import './styles.css'

const ChatMessages = ({isExpanded,setIsExpanded,activeRoom}) => {

    /* const { messages } = useFetchMessages(); */
    const [actionMenuOpen, setActionMenuOpen] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const chatEndRef = useRef(null);

    const icon =  isExpanded ? <CloseChatRoomIcon /> : <ChatRoomIcon />
    
    const closeChat = () => {
        setIsExpanded(!isExpanded)
        setActionMenuOpen(false)
        setTimeout(() => {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500)
      }

    /* useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages,isExpanded]); */

  return (
    <ChatContainer id="smallChat" initial={{ height: '40vh', width: '25vw' }} animate={{ height: isExpanded ? '100vh' : '40vh', width: isExpanded ? '100vw' : '25vw' }} transition={{ duration: 0.5 }}>
       {/*  <ButtonAbsolute onClick={closeChat}>{icon}</ButtonAbsolute>
        <ActionIcons actionMenuOpen={actionMenuOpen} setShowEmojiPicker={setShowEmojiPicker} showEmojiPicker={showEmojiPicker}
          message={message} setMessage={setMessage} selectedFile={selectedFile} setSelectedFile={setSelectedFile}
        />
        <MessagesWrapper>
              {messages?.map((msg, index) => {
                  let date = new Date(msg.created_at)
                  let str = date.toLocaleTimeString()
                  str = str.substring(0, str.length - 3);
                  return (
                      <MessageHolder key={index} className={`${msg.sendedBy}`}>
                        <MessageName className={`${msg.sendedBy}NAME`}>{msg.playerName}</MessageName>
                          <AvatarHolder>
                              <Avatar alt="Image" src={msg.user_avatar} sx={{ width: 30, height: 30 }} />
                          </AvatarHolder>
                          <MessageText>{msg.message}</MessageText>
                          <MessageTime className={`${msg.sendedBy}TIME`}>{str}</MessageTime>
                      </MessageHolder>
                  )
              })}
              <div ref={chatEndRef}></div>
        </MessagesWrapper>
        {isExpanded && (
            <ChatInput isExpanded={isExpanded} activeRoom={activeRoom}
            actionMenuOpen={actionMenuOpen} setActionMenuOpen={setActionMenuOpen} showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker} message={message} setMessage={setMessage} selectedFile={selectedFile} setSelectedFile={setSelectedFile}/>
          )} */}
    </ChatContainer>
  )
}

export default ChatMessages


