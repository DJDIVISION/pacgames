import React, {useRef,useEffect,useState} from 'react'
import { useFetchMessages } from '../../pages/functions';
import {MessageHolder,AvatarHolder,MessageText,MessageTime,ChatContainer,ButtonAbsolute,MessagesWrapper,CloseChatRoomIcon,
    ChatRoomIcon 
} from './index'
import { Avatar } from '@mui/material';
import ActionIcons from './ActionIcons';
import ChatInput from './ChatInput';

const ChatMessages = ({isExpanded,setIsExpanded}) => {

    const { messages } = useFetchMessages();
    console.log("messages", messages) 
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

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages,isExpanded]);

  return (
    <ChatContainer id="smallChat" initial={{ height: '40vh', width: '25vw' }} animate={{ height: isExpanded ? '100vh' : '40vh', width: isExpanded ? '100vw' : '25vw' }} transition={{ duration: 0.5 }}>
        <ButtonAbsolute onClick={closeChat}>{icon}</ButtonAbsolute>
        <ActionIcons actionMenuOpen={actionMenuOpen} setShowEmojiPicker={setShowEmojiPicker} showEmojiPicker={showEmojiPicker}
          message={message} setMessage={setMessage} selectedFile={selectedFile} setSelectedFile={setSelectedFile}
        />
        <MessagesWrapper>
              {messages?.map((msg, index) => {
                  let date = new Date(msg.created_at)
                  let str = date.toLocaleTimeString()
                  str = str.substring(0, str.length - 3);
                  console.log(str)
                  return (
                      <MessageHolder key={index} className="chat-message">
                          <AvatarHolder>
                              <Avatar alt="Image" src={msg.user_avatar} sx={{ width: 30, height: 30 }} />
                          </AvatarHolder>
                          <MessageText>{msg.message}</MessageText>
                          <MessageTime>{str}</MessageTime>
                      </MessageHolder>
                  )
              })}
              <div ref={chatEndRef}></div>
        </MessagesWrapper>
        {isExpanded && (
            <ChatInput isExpanded={isExpanded} 
            actionMenuOpen={actionMenuOpen} setActionMenuOpen={setActionMenuOpen} showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker} message={message} setMessage={setMessage} selectedFile={selectedFile} setSelectedFile={setSelectedFile}/>
          )}
    </ChatContainer>
  )
}

export default ChatMessages


