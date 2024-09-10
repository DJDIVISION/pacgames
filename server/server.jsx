const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const rooms = {}; // Room tracking
const bets = {};  // Track player bets for each room
const turns = {}; // Track active player for each room

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]  // Client URL
  },
});

io.on('connection', (socket) => {
    socket.on('join-room', (data) => {
        const playerName = data.playerName
        const room = data.room
        const googleId = data.id
      if (!rooms[room]) {
        rooms[room] = { players: [], gameInProgress: false, hands: {}, currentPlayerIndex: 0 };
      }
      rooms[room].players.push({ id: socket.id, name: playerName, bet: 0, googleId: googleId });
  
      io.in(room).emit('players-update', rooms[room].players);
  
      // Initialize bet tracking for the room if not done already
      if (!bets[room]) {
        bets[room] = {};
      }
      console.log(rooms[room])
      if (rooms[room].gameInProgress) {
        socket.emit('waiting-for-game', 'Game is in progress. You will play in the next round.');
      } else {
        socket.join(room);
        rooms[room].players.push(currentPlayer);
        rooms[room].room = room
        io.to(room).emit('setPlayersOnScreen', {
          gameData: rooms[room],
          room: room
        });
      }
    });
  
    socket.on('place-bet', (betAmount) => {
      const room = Object.keys(rooms).find((room) =>
        rooms[room].players.find((player) => player.id === socket.id)
      );
  
      if (room) {
        // Store the player's bet
        bets[room][socket.id] = betAmount;
  
        // Check if all players in the room have placed their bets
        if (Object.keys(bets[room]).length === rooms[room].players.length) {
          // All players have bet, start the game
          startGame(room);
        }
      }
    });
  
    // Handle game actions like 'hit' or 'stand'
    socket.on('action', (action) => {
      const room = Object.keys(rooms).find((room) =>
        rooms[room].players.find((player) => player.id === socket.id)
      );
  
      if (room) {
        const currentPlayerIndex = rooms[room].currentPlayerIndex;
        const currentPlayer = rooms[room].players[currentPlayerIndex];
  
        // Check if it's the player's turn
        if (currentPlayer.id === socket.id) {
          // Process the action (e.g., hit, stand)
          processPlayerAction(action, currentPlayer, room);
  
          // Move to the next player after the current player finishes their turn
          nextTurn(room);
        } else {
          // Notify the player that it's not their turn
          socket.emit('not-your-turn');
        }
      }
    });
  
    socket.on('disconnect', () => {
      for (const room in rooms) {
        const playerIndex = rooms[room].players.findIndex(
          (p) => p.id === socket.id
        );
        if (playerIndex !== -1) {
          rooms[room].players.splice(playerIndex, 1);
          io.in(room).emit('players-update', rooms[room].players);
  
          // Remove player's bet from the room
          if (bets[room]) {
            delete bets[room][socket.id];
          }
        }
      }
    });
  });
  
  // Function to start the game after all bets are placed
  function startGame(room) {
    console.log(`Starting game for room ${room}`);
  
    // Set currentPlayerIndex to 0 to start with the first player
    rooms[room].currentPlayerIndex = 0;
  
    // Notify the first player to start their turn
    const firstPlayer = rooms[room].players[rooms[room].currentPlayerIndex];
    io.to(firstPlayer.id).emit('your-turn');
  }
  
  // Function to move to the next player's turn
  function nextTurn(room) {
    rooms[room].currentPlayerIndex++;
  
    if (rooms[room].currentPlayerIndex < rooms[room].players.length) {
      const nextPlayer = rooms[room].players[rooms[room].currentPlayerIndex];
      io.to(nextPlayer.id).emit('your-turn');
    } else {
      // All players have finished their turns, end the round
      endRound(room);
    }
  }
  
  // Function to handle player actions (e.g., hit or stand)
  function processPlayerAction(action, player, room) {
    console.log(`${player.name} in room ${room} chose to ${action}`);
    // Implement the logic for 'hit', 'stand', etc.
  }
  
  // Function to end the round after all players have taken their turns
  function endRound(room) {
    console.log(`Ending round for room ${room}`);
    // Calculate winners, reset for next round
    io.in(room).emit('round-ended', { result: 'Round ended, calculate scores' });
  }

httpServer.listen(8080, () => {
    console.log("server running on 8080")
});