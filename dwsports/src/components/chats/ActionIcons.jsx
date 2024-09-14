import React from 'react'
import { AttachIcon,EmojiIcon,RecordIcon,SendChatIcon,ActionMenu,Action,actionMenuVariants } from './index';
import { IconButton } from '@mui/material';
import { supabase } from '../../supabase/client';
import { BetState } from '../../context/BetsContext';


const ActionIcons = ({actionMenuOpen,setShowEmojiPicker,showEmojiPicker,message,setMessage,selectedFile,setSelectedFile,
    playerName,socket_id,user_avatar
}) => {

    const { user, setUser } = BetState();
    
    const handleSendMessage = async () => {
        //onSendMessage(message);
        //setMessage("");
        //setSelectedFile(null);
        const updatedData = {
            message: message,
            user_id: user.id,
            user_email: user.email,
            playerName: playerName,
            socket_id: socket_id,
            user_avatar: user_avatar
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
    <ActionMenu variants={actionMenuVariants}
              initial="closed"
              animate={actionMenuOpen ? 'open' : 'closed'}
              transition={{ duration: 0.5 }} >
                {actionMenuOpen && (
                    <>
                     <Action initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: .5 }}
                    exit={{
                      opacity: 0,
                      y: 90,
                      transition: {
                        ease: "easeInOut",
                        delay: .4
                      }
                    }}><IconButton><RecordIcon /></IconButton></Action>
                     <Action initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: .4 }}
                    exit={{
                      opacity: 0,
                      y: 90,
                      transition: {
                        ease: "easeInOut",
                        delay: .3
                      }
                    }}><IconButton><AttachIcon /></IconButton></Action>
                      <Action initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: .3 }}
                    exit={{
                      opacity: 0,
                      y: 90,
                      transition: {
                        ease: "easeInOut",
                        delay: 0.2
                      }
                    }}><IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}><EmojiIcon /></IconButton></Action>
                  <Action initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: .2 }}
                    exit={{
                      opacity: 0,
                      y: 90,
                      transition: {
                        ease: "easeInOut",
                        delay: .1
                      }
                      
                    }}><IconButton><SendChatIcon onClick={handleSendMessage}/></IconButton></Action>
                    </>
                )}
          </ActionMenu>
  )
}

export default ActionIcons
