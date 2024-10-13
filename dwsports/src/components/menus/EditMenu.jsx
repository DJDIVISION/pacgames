import React,{useEffect, useState, useRef} from 'react'
import styled from 'styled-components'
import { motion,AnimatePresence } from 'framer-motion'
import { FantasyState } from '../../context/FantasyContext';
import { ButtonAbsolute, CloseChatRoomIcon } from '../chats';
import { StyledAbsolute } from '../../pages/indexTwo';
import { Formik } from "formik";
import { TextField, Box, Button } from '@mui/material';
import { supabase } from '../../supabase/client';
import { message } from 'antd';
import axios from 'axios'


const EditMenu = ({openEditMenu,setOpenEditMenu}) => {

    const {playerToUpdate, setPlayerToUpdate} = FantasyState();

    console.log(playerToUpdate)


    const item={
        initial: { height: 0, opacity: 0 },
        animate: { height: "100vh", opacity: 1, transition: { duration: 0.7 } },
        exit: { height: 0, opacity: 0, transition: { duration: 0.7 } }
    }

    const handleEditFormSubmit = async () => {
      const id = document.getElementById('idField').value
      const leagueName = document.getElementById('leagueNameField').value
      const name = document.getElementById('nameField').value
      const position = document.getElementById('positionField').value
      //const height = document.getElementById('heightField').value
      const nationality = document.getElementById('nationalityField').value
      const photo = document.getElementById('photoField').value
      const preferredFoot = document.getElementById('preferredFootField').value
      const value = document.getElementById('valueField').value
      const rating = document.getElementById('ratingField').value
      const topPlayer = document.getElementById('topPlayerField').value
      /* const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/players',
        params: {
          id: id,
          season: '2024'
        },
        headers: {
          'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
      };
      try {
        const response = await axios.request(options);
        console.log(response.data);
        localStorage.setItem("barcelonaStats", JSON.stringify(response.data))
        message.success("data fetched!")
      } catch (error) {
        console.error(error);
      } */
      const updatedData = {
        name: name,
        position: position
        /* height: height,
        nationality: nationality,
        photo: photo,
        preferredFoot: preferredFoot,
        value: value,
        rating: rating,
        topPlayer: topPlayer,
        leagueName: leagueName, */
      }
      console.log(updatedData)
      const { data, error } = await supabase
      .from('footballPlayers')
      .update([updatedData])
      .eq("id", id)
      if (error) {
        console.error('Error inserting/updating user session data:', error.message)
      } else {
        console.log('User session data saved:', data)
        message.success("Your bet has been registered")
        
        setOpenEditMenu(false)   
        setPlayerToUpdate({}) 
      }
      
    }

    const initialValues = {
      id: playerToUpdate.id,
      name: playerToUpdate.name,
      position: playerToUpdate.position
      /* height: playerToUpdate.height,
      number: playerToUpdate.number,
      nationality: playerToUpdate.nationality,
      preferredFoot: playerToUpdate.preferredFoot,
      value: playerToUpdate.value,
      photo: playerToUpdate.photo,
      rating: playerToUpdate.rating,
      topPlayer: playerToUpdate.topPlayer,
      leagueName: "Bundesliga", */
    };

    console.log(initialValues)

    const fetchData =  async () => {
      const id = document.getElementById('idField').value
      const name = document.getElementById('nameField').value
      const position = document.getElementById('positionField').value
      const { data, error } = await supabase
              .from('footballPlayers')
              .update({name: name, position: position})
              .eq("id", id)
            if (error) {
              console.error('Error inserting/updating user session data:', error.message)
            } else {
              console.log('User session data saved:', data)
              message.success("Your bet has been registered")
            }
    }

  return (
    <AnimatePresence>
          <motion.div className="menu-container-two" variants={item}
              initial="initial"
              animate="animate"
              exit="exit">
                <StyledAbsolute onClick={() => setOpenEditMenu(false)}><CloseChatRoomIcon /></StyledAbsolute>
                <Formik
                    onSubmit={handleEditFormSubmit}
                    initialValues={initialValues}
                >
                  {({
                    values,
                    handleChange,
                  }) => (
                    <form onSubmit={handleEditFormSubmit}>
                         <Box
                          display="grid"
                          gridTemplateColumns="repeat(4,1fr)"
                          width="100vw"
                          //marginTop="5vh"
                        >
                  <TextField
                    variant="outlined"
                    type="text"
                    label="id"
                    disabled
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    onChange={handleChange}
                    value={values.id}
                    name="id"
                    id="idField"
                    slotProps={{
                      style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                    }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="text"
                    label="leagueName"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    onChange={handleChange}
                    value={values.leagueName}
                    name="leagueName"
                    id="leagueNameField"
                    slotProps={{
                      style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                    }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="text"
                    label="name"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    onChange={handleChange}
                    value={values.name}
                    name="name"
                    id="nameField"
                    slotProps={{
                      style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                    }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="text"
                    label="position"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    onChange={handleChange}
                    value={values.position}
                    name="position"
                    id="positionField"
                    slotProps={{
                      style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                    }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="text"
                    label="nationality"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    onChange={handleChange}
                    value={values.nationality}
                    name="nationality"
                    id="nationalityField"
                    slotProps={{
                      style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                    }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="text"
                    label="photo"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    onChange={handleChange}
                    value={values.photo}
                    name="photo"
                    id="photoField"
                    slotProps={{
                      style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                    }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="text"
                    label="preferredFoot"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    onChange={handleChange}
                    value={values.preferredFoot}
                    name="preferredFoot"
                    id="preferredFootField"
                    slotProps={{
                      style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                    }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="text"
                    label="value"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    onChange={handleChange}
                    value={values.value}
                    name="value"
                    id="valueField"
                    slotProps={{
                      style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                    }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="text"
                    label="rating"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    onChange={handleChange}
                    value={values.rating}
                    name="rating"
                    id="ratingField"
                    slotProps={{
                      style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                    }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="text"
                    label="topPlayer"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    onChange={handleChange}
                    value={values.topPlayer}
                    name="topPlayer"
                    id="topPlayerField"
                    slotProps={{
                      style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                    }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />

    
          
            
               <motion.div initial={{y:100,opacity:0}} animate={{y:0, opacity:1}}
                 transition={{delay:1.2}}
                 exit={{
                  opacity:0,
                  y:90,
                    transition:{
                      ease:"easeInOut",
                      delay:1.1
                    }
                 }} style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                <Button id="sendEditProducts" variant="contained" /* type="submit" */ onClick={handleEditFormSubmit} style={{marginTop: "10px"}}>
                FETCH DATA
                  </Button>
                  <Button id="sendEditProducts" variant="contained" /* type="submit" */ onClick={fetchData} style={{marginTop: "10px"}}>
                SEND DATA
                  </Button>
                  </motion.div>
                </Box>
                    </form>
                  )}
                </Formik>
          </motion.div>
    </AnimatePresence>
  )
}

export default EditMenu

