const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors')
const supabaseUrl = 'https://qfywnsvevkeuiuxtiqko.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmeXduc3ZldmtldWl1eHRpcWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUyNzE2MDQsImV4cCI6MjA0MDg0NzYwNH0.sVYe0wlcg_H2Psn_17g32DYDRYLkfH8KIcHk3EP2Hdg'; // Or service role key for server-side operations

const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(cors({
  origin: 'https://pacgames-frontend.onrender.com', // Replace with your frontend URL
  methods: ['GET', 'POST'],
  credentials: true
}));
app.get('/', (req, res) => {
  res.send('Welcome to the Blackjack Game!');
});
const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors: {
    origin: "https://pacgames-frontend.onrender.com",
    methods: ["GET", "POST"]  // Client URL
  },
 });


const allUsers = {};
const allRooms = [];
const bets = {}; 
const turns = {};
const roomTimeouts = {};
const playerBets = {}; 
const bettingTimeouts = {};
let hidden;
const roomJoinTimeouts = {};
const roomBettingTimeouts = {};
maxPlayersPerRoom = 3;


function shuffleDeck() {
  let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  let types = ["C", "D", "H", "S"];
  deck = [];

  for (let i = 0; i < types.length; i++) {
      for (let j = 0; j < values.length; j++) {
          deck.push(values[j] + "-" + types[i]);
      }
  }
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  return deck
  
}



function getValue(card,card2) {
  if(card){
    let data = card.split("-");
    let value = data[0];
    if (isNaN(value)) { 
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
  }
  if(card2){
    let data = card2.split("-");
    let value = data[0];
    if (isNaN(value)) { 
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
  }
  
}

function checkAce(card) {
  if (card[0] == "A") {
      return 1;
  }
  return 0;
}

function dealCards(room,roomId) {
  const deck = room.deck
  hidden = deck.pop();
  room.dealerHidden = hidden;
  room.dealerSum += getValue(hidden);
  room.dealerAceCount += checkAce(hidden);
  while (room.dealerSum < 17){
    let card = deck.pop();
    room.dealerHand.push(card);
    room.dealerSum += getValue(card);
    room.dealerAceCount += checkAce(card);
  }
  console.log("roooooomdealersum", room.dealerSum)
  const players = room.players;
  const hands = {};

  // Deal two cards to each player (standard in blackjack)
  players.forEach((player) => {
    player.dealerSum = room.dealerSum
    let card = deck.pop();
    player.playerSum += getValue(card)
    player.hand.push(card)
    let card2 = deck.pop()
    player.playerSum += getValue(card2)
    player.hand.push(card2)
    });
    room.players = players
    console.log("roomPlayerssssssssssssss",room.players)
    io.to(roomId).emit('firstRound', {
      gameData: room
    });
}

function reduceAce(playerSum, playerAceCount, room) {
  while (playerSum > 21 && playerAceCount > 0) {
      playerSum -= 10;
      playerAceCount -= 1;
  }
  return {playerSum,playerAceCount};
}

let CardToHit

function hit(deck,room,playerSum,playerAceCount,currentPlayer,roomId) {

  let card = deck.pop();
  playerSum += getValue(card);
  playerAceCount += checkAce(card);
  const final = reduceAce(playerSum, playerAceCount,room)
  currentPlayer.playerSum = playerSum
  currentPlayer.playerAceCount = playerAceCount
  currentPlayer.cardToHit = card
  currentPlayer.hand.push(card)
  io.to(roomId).emit('cardAfterHit',{
    playerName: currentPlayer.playerName,
    playerSum: currentPlayer.playerSum,
    gameData: room
  });


}

function startGame(room) {
  room.currentPlayerIndex = 0;
  const firstPlayer = room.players[room.currentPlayerIndex];
  io.to(firstPlayer.playerId).emit('your-turn');
}  

function nextTurn(roomId) {
  const room = rooms.find((room) => room.id === roomId);
  room.currentPlayerIndex++;
  
  if (room.currentPlayerIndex < room.players.length) {
    const nextPlayer = room.players[room.currentPlayerIndex];
    io.to(nextPlayer.playerId).emit('your-turn');
  } else {
    io.to(roomId).emit("reveal-card", {
      hidden: hidden
    })
    endRound(roomId);
  }
}

function calculatePayout(player,room) {
  const { playerSum, bet, hand, name, playerId } = player;
  let payout = 0;
  const dealerSum = room.dealerSum
  console.log("playerSum", playerSum)
  console.log("dealerSum", dealerSum)
  const roomId = player.room
  const isPlayerBlackjack = playerSum === 21 && hand.length === 2;
  const isDealerBlackjack = dealerSum === 21 && hand.length === 2;
  if (playerSum > 21) {
    io.to(playerId).emit('balanceUpdate',{
      playerName: name,
      status: 'Lose',
      payout: 0
    });
    io.to(roomId).emit('gameResults', {
      message: `${name} has lost the game!`,
      dealer: 'Jack',
      dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
      sendedBy: 'ADMIN',
      hidden: room.dealerHidden
    });
    return { result: `${name} has lost the game!`, payout: 0 };
  }

  if (dealerSum > 21 && playerSum < 21) {
    io.to(playerId).emit('balanceUpdate',{
      playerName: name,
      status: "Win",
      payout: (bet * 2)
    });
    io.to(roomId).emit('gameResults', {
      message: `${name} wins ${bet}$`,
      dealer: 'Jack',
      dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
      sendedBy: 'ADMIN'
    });
    return { result: `${name} wins ${bet}$`, payout: bet * 2 };
  }

  if (isPlayerBlackjack && !isDealerBlackjack) {
    io.to(playerId).emit('balanceUpdate',{
      playerName: name,
      status: "BlackJack",
      payout: (bet * 2.5)
    });
    io.to(roomId).emit('gameResults', {
      message: `${name} hits BlackJack and wins ${(bet * 2.5)}$`,
      dealer: 'Jack',
      dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
      sendedBy: 'ADMIN'
    });
    return { result: `${name} hits BlackJack and wins ${(bet * 1.5)}$`, payout: bet * 2.5 }; 
  }

  if (isPlayerBlackjack && isDealerBlackjack) {
    io.to(playerId).emit('balanceUpdate',{
      playerName: name,
      status: "Push",
      payout: bet 
    });
    io.to(roomId).emit('gameResults', {
      message: `Push! ${name}'s bet has been returned`,
      dealer: 'Jack',
      dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
      sendedBy: 'ADMIN',
      
    });
    return { result: `Push! ${name}'s bet has been returned`, payout: bet }; 
  }

  if (playerSum > dealerSum) {
    io.to(playerId).emit('balanceUpdate',{
      playerName: name,
      status: "Win",
      payout: (bet * 2)
    });
    io.to(roomId).emit('gameResults', {
      message: `${name} wins ${bet}$`,
      dealer: 'Jack',
      dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
      sendedBy: 'ADMIN'
    });
    return { result: `${name} wins ${bet}$`, payout: bet * 2 }; 
  }

  if (playerSum === dealerSum) {
    io.to(playerId).emit('balanceUpdate',{
      playerName: name,
      status: "Push",
      payout: bet
    });
    io.to(roomId).emit('gameResults', {
      message: `Push! ${name}'s bet has been returned`,
      dealer: 'Jack',
      dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
      sendedBy: 'ADMIN'
    });
    return { result: `Push! ${name}'s bet has been returned`, payout: bet };
  }
  io.to(playerId).emit('balanceUpdate',{
    playerName: name,
    status: 'Lose',
    payout: 0
  });
  io.to(roomId).emit('gameResults', {
    message: `${name} has lost the game`,
    dealer: 'Jack',
    dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
    sendedBy: 'ADMIN'
  });
  return { result: `${name} has lost the game`, payout: 0 };
}

async function endRound (roomId) {
  const room = rooms.find((room) => room.id === roomId);
  const players = room.players
  const dealerSum = room.dealerSum
  console.log("rooooooooooooooomsomsosmsomsosm", dealerSum)
  const playerResults = room.players.map(player => ({
    playerId: player.playerId,
    name: player.name,
    bet: player.bet,
    googleId: player.googleId,
    dealerSum: dealerSum,
    finalHand: player.hand, 
    finalSum: player.playerSum, 
    result: calculatePayout(player,room), 
  }));
  startStayLeaveTimeout(roomId)
  const { data, error } = await supabase
    .from('blackJack')
    .insert([
      {
        room_id: roomId,         // Store the room ID
        results: playerResults,   // Store the results as a JSONB object
      }
    ]);

  if (error) {
    console.error('Error inserting game results into Supabase:', error.message);
  } else {
    console.log('Game results successfully inserted into Supabase:', data);
  }
}

const startStayLeaveTimeout = (roomId) => {
  const room = rooms.find((room) => room.id === roomId);
  room.players.forEach(player => {
    if(!player.playerMessage){
      player.playerMessage = null
    }
  })
  console.log(room.players)
  const startOrLeave = setTimeout(() => {
    room.players.forEach((player, index) => {
      if(player.playerMessage === "leaving" || player.playerMessage === null){
        console.log(`Player ${player.name} has left the room`);
        io.to(player.playerId).emit('removed-by-own-decision');
        room.players.splice(index, 1);
      }
      if(player.playerMessage === "staying"){
        console.log(`Player ${player.name} stays in the room`);
      }
    });
    room.players.forEach((player, index) => {
      player.hand = [];
      player.playerSum = 0;
      player.playerAceCount = 0;
      player.bet = 0;
      player.hasBet = false;
      player.playerMessage = null;
    })
    room.dealerAceCount = 0
    room.dealerHand = []
    room.dealerHidden = ""
    room.dealerSum = 0
    room.deck = []
    console.log("roooomPlayerrrrs", room.players)
    if(room.players.length > 0){
      room.gameStarted = false
      io.emit('roomsUpdate', rooms);
      io.to(roomId).emit('player-keeps-playing', {
        room: room,
        message: `The game will start in 10 seconds!`,
        dealer: 'Jack',
        dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
        sendedBy: 'ADMIN'
      })
      resetRoomTimeout(roomId)
    }
  }, 15000)
}


const getAllPlayers = () => {
  return rooms.map((room) => ({
    roomId: room.id,
    players: room.players.filter((player) => player.playerId !== ""), // Only map active players
  }));
};

function resetRoomTimeout(roomId) {
  console.log("waiting timeout has started! Yeah!!!!!!")
  const room = rooms.find((room) => room.id === roomId);
  if (roomTimeouts[room]) {
    clearTimeout(roomTimeouts[room]);
  }

  // Set new timeout to start the game if no one joins in 10 seconds
  roomTimeouts[room] = setTimeout(() => {
    if (room.players.length > 0 && !room.gameStarted) {
      io.to(roomId).emit('timeoutExpired')
      startBettingTimeout(roomId)
    }
  }, 10000);
}

function startBettingTimeout(roomId) {
  const room = rooms.find((room) => room.id === roomId);
  room.gameStarted = true
  io.emit('roomsUpdate', rooms);
  bettingTimeouts[room] = setTimeout(() => {
    console.log(`Betting time ended in room: ${room}`);

    // Check which players haven't placed their bets and disconnect them
    room.players.forEach(player => {
      if (player.bet === 0) {
        console.log(`Disconnecting player ${player.name} for not betting in time`);
        io.to(player.playerId).emit('disconnected-for-no-bet');
        io.sockets.sockets.get(player.playerId).disconnect();
        room.players = room.players.filter(p => p.playerId === player.playerId)
        console.log("this",room.players.length)
        if(room.players.length === 0){
          room.gameStarted = false
          io.emit('roomsUpdate', rooms);
          //io.emit('allPlayersUpdate', getAllPlayers()); 
        }
      }
    });
    console.log(room.players.length)
    // Proceed to start the game with players who placed their bets
    if (room.players.length > 0) {
      io.to(room).emit('game-started',{
        players: room.players,

      }); // Notify remaining players
    }
  }, 15000);
}


let rooms = Array.from({ length: 20 }, (_, index) => ({
  id: (index + 1).toString(),
  players: [],
  deck: [],
  dealerHand: [],
  dealerHidden: "",
  dealerAceCount: 0,
  dealerSum: 0,
  gameStarted: false,
  waitingList: [],
  room: "",
  currentPlayerIndex: 0,
}));

io.on("connection", (socket) => {
  console.log("user connected")

  socket.on('getRooms', () => {
    socket.emit('roomsUpdate', rooms);
  });
  
  socket.on("join-room", async (data) => {
    const playerName = data.playerName
    const googleId = data.googleId
    const avatar = data.avatar
    
    const roomId = data.roomId
    console.log("doomddddddeddddddddddd",roomId)
    const room = rooms.find((room) => room.id === roomId);
    if (room) {
      if (room.players.length < 5) { // Check if room has space
        // Add the player to the room
        room.players.push({
          playerId: socket.id,
          name: playerName,
          bet: 0,
          googleId: googleId,
          playerSum: 0,
          hand: [],
          playerAceCount: 0,
          avatar: avatar,
          room: roomId
        });

        socket.join(roomId);
        io.to(socket.id).emit('thisIsYourId', {
          playerId: socket.id,
          room: roomId
        });
        io.to(roomId).emit('update_players', {
          message: `${playerName} has joined the room. The game will start in 10 seconds!`,
          dealer: 'Jack',
          dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
          sendedBy: 'ADMIN'
        });
        // Update all clients about the room and players
        io.emit('roomsUpdate', rooms);
        io.emit('allPlayersUpdate', getAllPlayers()); // Emit all players after a change
        if (!room.gameStarted) {
          io.to(roomId).emit('timeoutStarting')
          resetRoomTimeout(roomId)
        }
      } else {
        console.log(`Room ${roomId} is full.`);
        socket.emit('roomFull', roomId); // Notify the client that the room is full
      }
    } else {
      console.log(`Room ${roomId} does not exist.`);
    }
    

  });
  socket.on('getAllPlayers', () => {
    const allPlayers = getAllPlayers();
    socket.emit('allPlayersUpdate', allPlayers);
  });

  socket.on('placeBet', ({ roomId, betAmount, playerId }) => {
    const room = rooms.find(room => room.id === roomId);
    const player = room.players.find(p => p.playerId === socket.id);

    if (room && player) {
      player.bet = betAmount;
      player.hasBet = true; // Mark player as having placed the bet
      console.log(`Player ${socket.id} placed a bet of ${betAmount} in room ${roomId}`);
      io.to(roomId).emit('bets-placed', {
        message: `${player.name} has placed a bet of ${betAmount}$`,
        dealer: 'Jack',
        dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
        sendedBy: 'ADMIN'
      })
      // Notify all clients about the updated players and bets
      io.to(roomId).emit('roomsUpdate', room);
      io.to(roomId).emit('allPlayersUpdate', getAllPlayers());
      if(room.players.every(player => player.hasBet)){
        clearTimeout(bettingTimeouts[room]);
        io.to(roomId).emit('all.bets-placed', {
          message: `All bets have been placed. The game starts!`,
          dealer: 'Jack',
          dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
          sendedBy: 'ADMIN'
        })
        
        
        room.deck = shuffleDeck()
        dealCards(room,roomId);
        startGame(room)
      }
      /* io.in(room).emit('new_update_players', {
        gameData: rooms[room],
        playerName: playerName,
        bet: betAmount
      }); */
      
    }
  });
  socket.on('askForHit', (data) => {
    const roomId = data.room
    const room = rooms.find(room => room.id === roomId);
    const currentPlayerIndex = room.currentPlayerIndex;
    const currentPlayer = room.players[currentPlayerIndex];
    room.dealerHand = data.gameData.dealerHand
    room.dealerHidden = data.gameData.dealerHidden
    //room.dealerSum = data.gameData.dealerSum
    room.dealerAceCount = data.gameData.dealerAceCount
    const deck = room.deck
    const playerSum = currentPlayer.playerSum
    const playerAceCount = currentPlayer.playerAceCount
    hit(deck,room,playerSum,playerAceCount,currentPlayer,roomId);
  });

  socket.on('playerStays', (data) => {
    const roomId = data.roomId
    nextTurn(roomId);
  })

  socket.on('next-match-players', (data) => {
    const roomId = data.roomId
    const playerId = data.playerId
    const playerMessage = data.message
    const room = rooms.find(room => room.id === roomId);

    
    room.players.forEach(player => {
      if(player.playerId === playerId){
        player.playerMessage = playerMessage
      }
    })
    /* setTimeout(() => {
      room.players.forEach(player => {
        if(player.playerMessage === 'leaving'){
          room.players = room.players.filter(p => p.playerId !== playerId)
          io.sockets.sockets.get(playerId).disconnect();
          io.to(playerId).emit('you-are-disconnected')
        }
      })
    }, 10000)
    console.log("playerrrrrrrrrrrrrrrrrrrs", room.players) */
  });
  
  socket.on('manual-disconnect', (data) => {
    const playerId = data.playerId
    rooms.forEach((room) => {
      // Remove player from room if they were in one
      const playerIndex = room.players.findIndex(p => p.playerId === playerId);
      if (playerIndex !== -1) {
        room.players[playerIndex] = {
          playerId: "",
          name: "",
          bet: 0,
          googleId: "",
          playerSum: 0,
          hand: [],
          playerAceCount: 0,
          avatar: "",
          room: ""
        };
      }
    });
  })
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    rooms.forEach((room) => {
      // Remove player from room if they were in one
      const playerIndex = room.players.findIndex(p => p.playerId === socket.id);
      if (playerIndex !== -1) {
        room.players[playerIndex] = {
          playerId: "",
          name: "",
          bet: 0,
          googleId: "",
          playerSum: 0,
          hand: [],
          playerAceCount: 0,
          avatar: "",
          room: ""
        };
      }
    });
    // Update the clients about the new room status
    io.emit('roomsUpdate', rooms);
  });
  
});



httpServer.listen(3030, () => {
  console.log("server running on 3030")
});