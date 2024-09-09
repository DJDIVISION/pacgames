import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:8080');

const Poker = () => {

  const [gameState, setGameState] = useState(null);  // Store game state from server
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    // Listen for game state updates from the server
    socket.on('updateGameState', (state) => {
      console.log(state)
        setGameState(state);
    });
}, []);


  return (
    <div>
      
    </div>
  )
}

export default Poker
