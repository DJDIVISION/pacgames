const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors')
const supabaseUrl = 'https://qfywnsvevkeuiuxtiqko.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmeXduc3ZldmtldWl1eHRpcWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUyNzE2MDQsImV4cCI6MjA0MDg0NzYwNH0.sVYe0wlcg_H2Psn_17g32DYDRYLkfH8KIcHk3EP2Hdg'; // Or service role key for server-side operations

const supabase = createClient(supabaseUrl, supabaseKey);

const americanRouletteNumbers = [
    { number: 0, color: "lime" },
    { number: 28, color: "black" },
    { number: 9, color: "red" },
    { number: 26, color: "black" },
    { number: 30, color: "red" },
    { number: 11, color: "black" },
    { number: 7, color: "red" },
    { number: 20, color: "black" },
    { number: 32, color: "red" },
    { number: 17, color: "black" },
    { number: 5, color: "red" },
    { number: 22, color: "black" },
    { number: 34, color: "red" },
    { number: 15, color: "black" },
    { number: 3, color: "red" },
    { number: 24, color: "black" },
    { number: 36, color: "red" },
    { number: 13, color: "black" },
    { number: 1, color: "red" },
    { number: "00", color: "lime" },
    { number: 27, color: "red" },
    { number: 10, color: "black" },
    { number: 25, color: "red" },
    { number: 29, color: "black" },
    { number: 12, color: "red" },
    { number: 8, color: "black" },
    { number: 19, color: "red" },
    { number: 31, color: "black" },
    { number: 18, color: "red" },
    { number: 6, color: "black" },
    { number: 21, color: "red" },
    { number: 33, color: "black" },
    { number: 16, color: "red" },
    { number: 4, color: "black" },
    { number: 23, color: "red" },
    { number: 35, color: "black" },
    { number: 14, color: "red" },
    { number: 2, color: "black" },
];

const app = express();
app.use(cors({
  origin: 'https://pacgames-frontend.onrender.com', // Replace with your frontend URL
  methods: ['GET', 'POST'],
  credentials: true
}));
app.get('/', (req, res) => {
  res.send('Welcome to the Roulette Game!');
});
const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors: {
    origin: "https://pacgames-frontend.onrender.com",
    methods: ["GET", "POST"]  // Client URL
  },
 });

 let rooms = Array.from({ length: 20 }, (_, index) => ({
  id: (index + 1).toString(),
  players: [],
  gameStarted: false,
  allBets: [],
  room: "",
  latestNumbers: [],
  winningNumber: null
}));


const getAllPlayers = () => {
  return rooms.map((room) => ({
    roomId: room.id,
    players: room.players.filter((player) => player.playerId !== ""), // Only map active players
  }));
};

 const declareWinningNumber = (roomId) => {
    // Randomly pick a number
    const winningNumberIndex = Math.floor(Math.random() * americanRouletteNumbers.length);
    const winningNumber = americanRouletteNumbers[winningNumberIndex];
    console.log(winningNumber)
    const room = rooms.find((room) => room.id === roomId);
    room.latestNumbers.push(winningNumber)
    room.winningNumber = winningNumber
    // Emit the result to all connected clients
    io.emit('winning-number', winningNumber);
};

const bettingTimeouts = {};

function startBettingTimeout(roomId) {
  console.log("betting time started")
  const room = rooms.find((room) => room.id === roomId);
  console.log("rooooooooooooooooooooooomn",room.gameStarted)
  io.emit('roomsUpdate', rooms);
  bettingTimeouts[room] = setTimeout(() => {
  

    // Check which players haven't placed their bets and disconnect them
    room.players.forEach(player => {
      if (player.bet === 0) {
        console.log(`${player.playerName} has not placed any bet`)
        io.to(player.playerId).emit('close-betting-table');
        /* console.log(`Disconnecting player ${player.name} for not betting in time`);
        io.to(player.playerId).emit('disconnected-for-no-bet');
        const socket = io.sockets.sockets.get(player.playerId); // Fetch socket by playerId
        if (socket) {
          socket.disconnect();  // Disconnect the socket
          console.log(`Player ${player.name} has been disconnected`);
        }
        room.players = room.players.filter(p => p.playerId === player.playerId)
        console.log("this",room.players.length)
        if(room.players.length === 0){
          room.gameStarted = false
          io.emit('roomsUpdate', rooms);
          //io.emit('allPlayersUpdate', getAllPlayers()); 
        } */
      }
    });
    // Proceed to start the game with players who placed their bets
    if (room.players.length > 0) {
      io.to(roomId).emit('game-started')
      declareWinningNumber(roomId);
    }
  }, 1700000000);
}

io.on("connection", (socket) => {
    console.log("user connected")

    socket.on('getAllPlayers', () => {
      const allPlayers = getAllPlayers();
      console.log("payrs requested")
      socket.emit('allPlayersUpdate', allPlayers);
    });

    socket.on('getRooms', () => {
      console.log("rooms requested")
      socket.emit('roomsUpdate', rooms);
    });

    socket.on("join-room", async (data) => {
      console.log(`player requests to join room ${data.roomId}`)
      const playerName = data.playerName
      const googleId = data.googleId
      const avatar = data.avatar
      
      const roomId = data.roomId
      const room = rooms.find((room) => room.id === roomId);
      if (room) {
        if (room.players.length < 20) { // Check if room has space
          // Add the player to the room
          room.players.push({
            playerId: socket.id,
            playerName: playerName,
            bet: 0,
            playerBets: [],
            googleId: googleId,
            avatar: avatar,
            room: roomId
          });
  
          socket.join(roomId);
          io.to(socket.id).emit('thisIsYourId', {
            playerId: socket.id,
            room: roomId
          });
          if(room.players.length === 1){
            io.to(roomId).emit('update_players', {
              message: `${playerName} has joined the room. You have 30 seconds to place your bet.`,
              dealer: 'Jack',
              dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
              sendedBy: 'ADMIN'
            });
          } else {
            io.to(roomId).emit('update_players', {
              message: `${playerName} has joined the room.`,
              dealer: 'Jack',
              dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
              sendedBy: 'ADMIN'
            });
          }
          // Update all clients about the room and players
          io.emit('roomsUpdate', rooms);
          io.emit('allPlayersUpdate', getAllPlayers()); // Emit all players after a change
          if (!room.gameStarted) {
            io.to(roomId).emit('timeoutStarting')
            startBettingTimeout(roomId)
          }
        } else {
          console.log(`Room ${roomId} is full.`);
          socket.emit('roomFull', roomId); // Notify the client that the room is full
        }
      } else {
        console.log(`Room ${roomId} does not exist.`);
      }
    });

    socket.on('spin-request', () => {
        console.log('Spin requested');
        declareWinningNumber();  // Declare and send the winning number
    });
    socket.on('placeBet', ({playerBets,roomId,playerId,placedBet}) => {
      console.log("betPlaced!!!!!!")
        const room = rooms.find((room) => room.id === roomId);
        const player = room.players.find(p => p.playerId === playerId);
        player.playerBets = playerBets
        console.log("playerBetssssssssssss", playerBets)
        io.to(roomId).emit('message-sent', {
          message: `${player.playerName} has placed a bet of $${placedBet}`,
          dealer: 'Jack',
          dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
          sendedBy: 'ADMIN'
        });
        io.to(player.playerId).emit('update-balance', {
          placedBet: placedBet
        });
    });
    socket.on('game-finished', ({activeRoom, myId}) => {
      const roomId = activeRoom
      const playerId = myId
      console.log(roomId)
      console.log(playerId)
      const room = rooms.find((room) => room.id === roomId);
      const player = room.players.find(p => p.playerId === playerId)
      const number = room.winningNumber.number
      const playerBets = player.playerBets;
      console.log("playerBetsssssssssssssssss", playerBets)
      let playerWon = false;
      let winnings
      //console.log("object entriessssssssss",Object.entries(playerBets))
      Object.entries(playerBets).forEach(([betNumber, valueArray]) => {
        // Check if the bet number matches the winning number
        if (betNumber == number) {
          playerWon = true;
          const amount = valueArray[0].amount; 
          console.log("betNumber", betNumber)
          console.log("amounttttt", amount)
          const typeofBet = valueArray[0].typeofBet; 
          console.log("typeofBet", typeofBet)
          if(typeofBet === "Straight"){
            winnings = amount * 35
          } else if(typeofBet === "Corner"){
            winnings = amount * 8
          } else if(typeofBet === "Six Line"){
            winnings = amount * 5
          } else if(typeofBet === "Split"){
            winnings = amount * 17
          } else if(typeofBet === "Street"){
            winnings = amount * 11
          } else if(typeofBet === "Dozen"){
            winnings = amount * 2
          } else if(typeofBet === "Low (1-18)" || typeofBet === "High (19-36)" || typeofBet === "Even" 
            || typeofBet === "Odd" || typeofBet === "Blacks" || typeofBet === "Reds"){
            winnings = amount 
          } else if(typeofBet === "Column"){
            winnings = amount * 2
          }
        }
      });
      const latest = room.latestNumbers
      // If no winning bet was found, emit the loss result
      if (playerWon) {
        console.log("Player wins with winnings:", winnings);
        io.to(player.playerId).emit("player-wins", { winnings,latest });
        
      } else {
        console.log("Player has lost");
        io.to(player.playerId).emit("player-lost", {latest});
        
      }
      room.gameStarted = false
      player.playerBets = []
      player.bet = 0
      io.to(roomId).emit('update_players-again', {
        message: `Next game starts in 30 seconds!.`,
        dealer: 'Jack',
        dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
        sendedBy: 'ADMIN'
      });
      if (!room.gameStarted) {
        io.to(roomId).emit('timeoutStarting')
        startBettingTimeout(roomId)
      }
      
      
    });
})

// Start server
httpServer.listen(8080, () => {
  console.log('Server listening on port 8080');
});