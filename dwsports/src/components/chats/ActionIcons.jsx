import React from 'react'
import { AttachIcon,EmojiIcon,RecordIcon,ActionMenu,Action,actionMenuVariants,StyledIconButtonHover } from './index';
import { IconButton } from '@mui/material';
import { supabase } from '../../supabase/client';
import { BetState } from '../../context/BetsContext';


const ActionIcons = ({actionMenuOpen,setShowEmojiPicker,showEmojiPicker,message,setMessage,selectedFile,setSelectedFile,
    
}) => {

    

  return (
    <ActionMenu variants={actionMenuVariants}
              initial="closed"
              animate={actionMenuOpen ? 'open' : 'closed'}
              transition={{ duration: 0.5 }} >
                {actionMenuOpen && (
                    <>
                     <Action initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: .25 }}
                    exit={{
                      opacity: 0,
                      y: 90,
                      transition: {
                        ease: "easeInOut",
                        delay: .2
                      }
                    }}><StyledIconButtonHover><RecordIcon /></StyledIconButtonHover></Action>
                     <Action initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: .15 }}
                    exit={{
                      opacity: 0,
                      y: 90,
                      transition: {
                        ease: "easeInOut",
                        delay: .1
                      }
                    }}><StyledIconButtonHover><AttachIcon /></StyledIconButtonHover></Action>
                      <Action initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: .1 }}
                    exit={{
                      opacity: 0,
                      y: 90,
                      transition: {
                        ease: "easeInOut",
                        delay: 0.05
                      }
                    }}><StyledIconButtonHover onClick={() => setShowEmojiPicker(!showEmojiPicker)}><EmojiIcon /></StyledIconButtonHover></Action>
                    </>
                )}
          </ActionMenu>
  )
}

export default ActionIcons
