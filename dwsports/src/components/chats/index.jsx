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
  height: 200px;
  right: 0;
  bottom: 60px;
`;

export const Action = styled(motion.div)`
  width: 100%;
  height: 25%;
  display: grid;
  place-items: center;
`;
