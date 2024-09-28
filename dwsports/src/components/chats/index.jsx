import * as React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import { IconButton } from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

export const ChatRoomIcon = styled(ChatIcon)`
  &&&{
    color: ${props => props.theme.text};
    
  }
`;

export const CloseChatRoomIcon = styled(CloseIcon)`
  &&&{
      color: ${props => props.theme.text};
  }
`;

export const MessagesWrapper = styled.div`
  width: 100%;
  height: 90%;
  padding: 5px 15px;
  overflow-y: scroll;
`;

export const ButtonAbsolute = styled(IconButton)`
  &&&{
    //border: 0.5px solid ${props => props.theme.MainAccent};
    position: absolute;
    top: 15px;
    left: 15px;
  }
`;

export const ChatContainer = styled(motion.div)`
  width: 25%;
  height: 30vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 1000;
  //background: rgba(0,0,0,0.9);
  //backdrop-filter: blur(20px);
  background: ${({ isExpanded }) => (isExpanded ? "rgba(0,0,0,0.9)" : "transparent")};
  border: 1px solid ${props => props.theme.MainAccent};
  position: absolute;
  top: 0;
  left: 0;
`;

export const RouletteChatContainer = styled(motion.div)`
  width: 30vh;
  height: 60vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 1000;
  //background: rgba(0,0,0,0.9);
  //backdrop-filter: blur(20px);
  background: ${({ isExpanded }) => (isExpanded ? "rgba(0,0,0,0.9)" : "transparent")};
  border: 1px solid ${props => props.theme.MainAccent};
  position: absolute;
  top: 0;
  left: 0;
`;

export const MessageText = styled.div`
  color: ${props => props.theme.text};
  font-size: 16px;
  margin-left: 10px;
`;

export const MessageHolder = styled.div`
  width: 80%;
  //height: auto;
  border: 1px solid aqua;
  margin: 20px 0;
  border-radius: 10px;
  position: relative;
  padding: 0 10px;
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: ${({ isExpanded }) => (isExpanded ? "50px" : "0")};
`;

export const MessageName = styled.div`
  color: ${props => props.theme.text};
  font-size: 14px;
  position: absolute;
  top: -20px;
  
`;

export const AvatarHolder = styled.div`
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    float: left;
    margin: 0px 5px 0px 0px;
`;

export const MessageTime = styled.div`
  width: 30px;
  height: 20px;
  display: flex;
  align-items: center;
  color: ${props => props.theme.MainAccent};
  font-size: 14px;
`;

export const actionMenuVariants = {
  open: {
    height: '200px',
    transition: {
      staggerChildren: 0.5, // Stagger each action by 0.1 seconds
    },
  },
  closed: {
    height: '0',
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1, // Optional: reverses the stagger direction when closing
    },
  },
};

export const item = {
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      ease: "easeInOut",
      duration: 0.3,
      delay: 1
    }
  }
}

export const StyledIconButton = styled(IconButton)`
  &&&{
    box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4, 0 0 100px #03e9f4;
    background: transparent;
  }
`;

export const StyledIconButtonHover = styled(IconButton)`
  &&&:hover{
    box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4, 0 0 100px #03e9f4;
    background: transparent;
  }
`;

export const UnfoldIcon = styled(UnfoldLessIcon)`
  &&&{
    color: ${props => props.theme.MainAccent};
    background: transparent;
  }
`;

export const FoldIcon = styled(UnfoldMoreIcon)`
  &&&{
    color: ${props => props.theme.MainAccent};
    background: transparent;
  }
`;

export const SendChatIcon = styled(SendIcon)`
  &&&{
    color: ${props => props.theme.MainAccent};
    background: transparent;
  }
`;

export const EmojiIcon = styled(InsertEmoticonIcon)`
  &&&{
    color: ${props => props.theme.MainAccent};
    background: transparent;
  }
`;

export const AttachIcon = styled(AttachFileIcon)`
  &&&{
    color: ${props => props.theme.MainAccent}
  }
`;

export const RecordIcon = styled(MicIcon)`
  &&&{
    color: ${props => props.theme.MainAccent}
  }
`;

export const ActionMenu = styled(motion.div)`
  position: absolute;
  width: 60px; 
  height: 150px;
  right: 10px;
  bottom: 20px;
`;

export const Action = styled(motion.div)`
  width: 100%;
  height: 25%;
  display: grid;
  place-items: center;
`;
