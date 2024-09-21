import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import EmojiPicker from 'emoji-picker-react';
import { EmojiIcon,AttachIcon,RecordIcon,SendChatIcon,UnfoldIcon,FoldIcon,StyledIconButton,item } from "./index"; 
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Box from '@mui/material/Box';
import { supabase } from "../../supabase/client";
import { BetState } from "../../context/BetsContext";
import { useAuth } from "../../pages/functions";




const ChatInput = ({ isExpanded,actionMenuOpen,setActionMenuOpen,showEmojiPicker,playerName,playerId,playerAvatar,
    setShowEmojiPicker,message,setMessage,selectedFile,setSelectedFile,activeRoom
 }) => {
  
  
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audioURL, setAudioURL] = useState('');
  const { user } = useAuth();
  

  const toggleMenu = () => {
    setActionMenuOpen(!actionMenuOpen)
    console.log("clicked")
  }

  const icon = actionMenuOpen ? <UnfoldIcon /> : <FoldIcon />
 
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);
        })
        .catch((err) => console.error('Microphone access denied', err));
    }
  }, []);

  const startRecording = () => {
    console.log("started")
    if (mediaRecorder) {
      mediaRecorder.start();
      setIsRecording(true);
      setAudioChunks([]); // Reset chunks
      mediaRecorder.ondataavailable = (e) => {
        setAudioChunks((prev) => [...prev, e.data]);
      };
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);

      mediaRecorder.onstop = async () => {
        // Combine all audio chunks into a single Blob
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

        // Log the audioBlob to verify its contents
        console.log('Audio Blob:', audioBlob);

        // Create a filename with a timestamp
        const filename = `recording-${Date.now()}.wav`;
        
        // Log the filename to ensure it is correct
        console.log('Filename:', filename);
      }
    }
}

  const onEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    // You can handle file upload or sending logic here
  };

  console.log(user)
    
    const handleSendMessage = async () => {
        //onSendMessage(message);
        //setMessage("");
        //setSelectedFile(null);
        const updatedData = {
            message: message,
            user_id: user.id,
            user_email: user.email,
            playerName: playerName,
            socket_id: playerId,
            user_avatar: user.user_metadata.avatar_url,
            room_id: activeRoom,
            sendedBy: "PLAYER"
          }
          const { data, error } = await supabase
            .from('games_chat_messages')
            .insert([updatedData])
            if (error) {
              console.error('Error inserting/updating user session data:', error.message)
            } else {
              console.log('User session data saved:', data)
            }
            setMessage("");
            setSelectedFile(null);
      };

  

  return (
    <ChatInputContainer>
          
          {showEmojiPicker && (
              <EmojiPickerContainer>
                  <EmojiPicker onEmojiClick={onEmojiClick} />
              </EmojiPickerContainer>
          )}
          <InputWrapper>
              <InputField
                  type="text"
                  value={message}
                  placeholder="Type a message..."
                  onChange={(e) => setMessage(e.target.value)}
              />
          </InputWrapper>
          <DialWrapper>
              <StyledIconButton onClick={handleSendMessage}><SendChatIcon /></StyledIconButton>
          </DialWrapper>
          <DialWrapper>
              <StyledIconButton onClick={toggleMenu}>{icon}</StyledIconButton>
          </DialWrapper>
          <FileInput
              id="fileInput"
              type="file"
              accept="image/*, .gif"
              onChange={handleFileUpload}
          />
    </ChatInputContainer>
  );
};

export default ChatInput;

const ChatInputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  width: 100%;
  padding: 0;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 0 5px;
  margin-bottom: 10px;
  margin-top: auto;
  border-top: 1px solid ${props => props.theme.text};
`;

const InputWrapper = styled.div`
    width: 90%;
    height: 100%;
    display: flex;
    z-index: 4000;
    align-items: center;
    margin-top: 10px;
    padding-left: 15px;
    @media(max-width: 968px){
      padding-left: 10px;
      width: 85%;
    }
`;

const DialWrapper = styled.div`
    width: 5%;
    height: 100%;
    display: flex;
    align-items:center;
    justify-content: center;
    margin-top: 10px;
`;

const InputField = styled.input`
  padding: 0 15px;
  border: 1px solid #c2c2c2;
  border-radius: 20px;
  outline: none;
  font-size: 16px;
  color: ${props => props.theme.text};
  background-color: transparent;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
  z-index: 4000;
  height: 100%;
`;

const FileInput = styled.input`
  display: none;
`;

const EmojiPickerContainer = styled.div`
  position: absolute;
  bottom: 60px;
  right: 20px;
  z-index: 100;
`;
