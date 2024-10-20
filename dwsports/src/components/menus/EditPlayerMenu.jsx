import React from 'react'
import {Holder} from './index'
import { Button, TextField } from '@mui/material';
import { supabase } from '../../supabase/client';
import { message } from 'antd';

const EditPlayerMenu = ({setSelectedPlayerMenu,setPlayerToUpdate,playerLeagueData,playerToUpdate}) => {

    const saveDataToSupabase = async (updatedData) => {
        const one = parseFloat(document.getElementById("one").value)
        const two = parseFloat(document.getElementById("two").value)
        const three = parseFloat(document.getElementById("three").value)
        const four = parseFloat(document.getElementById("four").value)
        const five = parseFloat(document.getElementById("five").value)
        const six = parseFloat(document.getElementById("six").value)
        const seven = parseFloat(document.getElementById("seven").value)
        const eight = parseFloat(document.getElementById("eight").value)
        const nine = parseFloat(document.getElementById("nine").value)
        const ten = parseFloat(document.getElementById("ten").value)
        const eleven = parseFloat(document.getElementById("eleven").value)
        const twelve = parseFloat(document.getElementById("twelve").value)
        const thirteen = parseFloat(document.getElementById("thirteen").value)
        const fourteen = parseFloat(document.getElementById("fourteen").value)
        const fifteen = parseFloat(document.getElementById("fifteen").value)
        const sixteen = parseFloat(document.getElementById("sixteen").value)
        const seventeen = parseFloat(document.getElementById("seventeen").value)
        const eighteen = parseFloat(document.getElementById("eighteen").value)
        const nineteen = parseFloat(document.getElementById("nineteen").value)
        const twenty = parseFloat(document.getElementById("twenty").value)
        const twentyone = parseFloat(document.getElementById("twentyone").value)
        const twentytwo = parseFloat(document.getElementById("twentytwo").value)
        const twentythree = parseFloat(document.getElementById("twentythree").value)
        const twentyfour = parseFloat(document.getElementById("twentyfour").value)
        const twentyfive = parseFloat(document.getElementById("twentyfive").value)
        const twentysix = parseFloat(document.getElementById("twentysix").value)
        const twentyseven = parseFloat(document.getElementById("twentyseven").value)
        const twentyeight = parseFloat(document.getElementById("twentyeight").value)
        const twentynine = parseFloat(document.getElementById("twentynine").value)
        const thirty = parseFloat(document.getElementById("thirty").value)
        const thirtyone = parseFloat(document.getElementById("thirtyone").value)
        const thirtytwo = parseFloat(document.getElementById("thirtytwo").value)
        const thirtythree = parseFloat(document.getElementById("thirtythree").value)
        const thirtyfour = parseFloat(document.getElementById("thirtyfour").value)
        const thirtyfive = parseFloat(document.getElementById("thirtyfive").value)
        const thirtysix = parseFloat(document.getElementById("thirtysix").value)
        const thirtyseven = parseFloat(document.getElementById("thirtyseven").value)
        const thirtyeight = parseFloat(document.getElementById("thirtyeight").value)
        const thirtynine = parseFloat(document.getElementById("thirtynine").value)
        const fourty = parseFloat(document.getElementById("fourty").value)
        const fourtyone = parseFloat(document.getElementById("fourtyone").value)
        const fourtytwo = parseFloat(document.getElementById("fourtytwo").value)

        const updatedDataTwo = [
            {
              "main stats": {
                "goals": one,
                "assists": two,
                "appearences": three,
                "lineups": four,
                "minutes played": five,
                "yellow cards": six,
                "red cards": seven
              },
              "shots": {
                "goals": eight,
                "expected goals": nine,
                "total shots": ten,
                "shots on target": eleven
              },
              "passes": {
                "assists": twelve,
                "expected assists": thirteen,
                "successfull passes": fourteen,
                "passes accuracy": fifteen,
                "long balls": sixteen,
                "long balls accuracy": seventeen,
                "big chances created": eighteen,
                "crosses": nineteen,
                "crosses accuracy": twenty
              },
              "possession": {
                "dribbles": twentyone,
                "dribbles accuracy": twentytwo,
                "touches": twentythree,
                "touches opposite half": twentyfour,
                "possession lost": twentyfive,
                "was fouled": twentysix,
                "penalty won": twentyseven
              },
              "defense": {
                "penalties commited": twentyeight,
                "tackles": twentynine,
                "tackles accuracy": thirty,
                "won duels": thirtyone,
                "won duels accuracy": thirtytwo,
                "aerial duels won": thirtythree,
                "aerial duels accuracy": thirtyfour,
                "interceptions": thirtyfive,
                "blocked": thirtysix,
                "fouls commited": thirtyseven,
                "balls recovered": thirtyeight,
                "possession won opp. half": thirtynine,
                "dribbled": fourty
              },
              "discipline": {
                "yellow cards": fourtyone,
                "red cards": fourtytwo
              }
            }
          ]

          /* const updatedDataGoalkeepers = [
            {
              "main stats": {
                "clean sheets": one,
                "goals conceded": two,
                "saved penalties": three,
                "faced penalties": twentyfive,
                "matches": four,
                "minutes played": five,
                "yellow cards": six,
                "red cards": seven
              },
              "shots": {
                "shots faced": eight,
                "set piece": twentysix,
                "free kick": twentyseven,
                "from corner": nine,
                "shots inside box": ten,
                "shots outside box": eleven
              },
              "saves": {
                "saves": twelve,
                "save percentage": thirteen,
                "goals conceded": fourteen,
                "goals prevented": fifteen,
                "clean sheets": sixteen,
                "error lead to goal": seventeen,
                "acted as sweeper": eighteen,
                "high claim": nineteen
              },
              "distribution": {
                "passes accuracy": twenty,
                "accurate long balls": twentyone,
                "long balls accuracy": twentytwo
              },
              "discipline": {
                "yellow cards": twentythree,
                "red cards": twentyfour
              }
            }
          ] */

        //console.log(updatedDataTwo)
        /* console.log(updatedData)
        const dataThree = [
            updatedData
        ]*/
        const { data, error } = await supabase
          .from('footballPlayers') // replace with your table name
          .update([{laLigaStats: updatedDataTwo}])
          .eq('id', playerToUpdate.id); // replace with the specific record identifier
    
        if (error) {
          console.error('Error updating Supabase:', error);
        } else {
          console.log('Data successfully updated:', data);
          message.success("Data saved successfully!");
          setSelectedPlayerMenu(false)
          setPlayerToUpdate([])
        } 
    };

  return (
    <div>
      <Holder>
                <h3>MAIN STATS</h3>
                <TextField
                    variant="outlined"
                    type="number"
                    label="GOALS"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="one"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="ASSISTS"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="two"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="number"
                    label="APPEARANCES"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="four"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="LINEUP"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="three"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                
                  <TextField
                    variant="outlined"
                    type="number"
                    label="MINUTES PLAYED"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="five"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="number"
                    label="YELLOW CARDS"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="six"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="number"
                    label="RED CARDS"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="seven"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}
                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  </Holder>
                <Holder>
                <h3>SHOTS</h3>
                <TextField
                    variant="outlined"
                    type="number"
                    label="goles"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="eight"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="goles expected"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="nine"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="tiros"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="ten"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="a puerta"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="eleven"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  </Holder>
                  <Holder>
                  <h3>PASES</h3>
                <TextField
                    variant="outlined"
                    type="number"
                    label="assists"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="twelve"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="expected assists"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirteen"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="passes"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="fourteen"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="acc passes"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="fifteen"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="long shots"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="sixteen"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="acc long"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="seventeen"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="chances created"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="eighteen"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="crosses"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="nineteen"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="acc crosses"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="twenty"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  </Holder>
                  <Holder>
                  <h3>POSESION</h3>
                <TextField
                    variant="outlined"
                    type="number"
                    label="regates"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="regates"
                    id="twentyone"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="acc regates"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="twentytwo"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="toques"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="twentythree"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="toques opposite"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="twentyfour"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="perdidas"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="twentyfive"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="faltas recibidas"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="twentysix"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="number"
                    label="penalty won"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="twentyseven"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  </Holder>
                  
                  <Holder>
                  <h3>DEFENSA</h3>
                <TextField
                    variant="outlined"
                    type="number"
                    label="PENALTIES"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="twentyeight"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="number"
                    label="tackles"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="twentynine"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="number"
                    label="tackles acc"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirty"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="DUELOS"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirtyone"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="DUELOS GANADOS"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirtytwo"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="AEREOS"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirtythree"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}
                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="AEREOS GANADOS"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirtyfour"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="number"
                    label="intercepciones"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirtyfive"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="BLOCKED"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirtysix"
                    //defaultValue='0'
                    
                    slotProps={{
                      input:{
                        style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                      },
                      helperText:{
                        style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                      }
                    }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="FALTAS"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirtyseven"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="RECUPERACIONES"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirtyeight"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="POSSESION WON"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirtynine"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="DRIBBLED"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="fourty"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  </Holder>
                  <Holder>
                    <h3>DISCIPLINE</h3>
                    <TextField
                    variant="outlined"
                    type="number"
                    label="AMARILLAS"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="fourtyone"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="number"
                    label="ROJAS"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="fourtytwo"
                    //defaultValue='0'
                    slotProps={{
                        input:{
                          style: {  color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  </Holder>
                  <Button variant="contained" onClick={() => saveDataToSupabase(playerLeagueData)}>Save Changes</Button>
    </div>
  )
}

export default EditPlayerMenu
