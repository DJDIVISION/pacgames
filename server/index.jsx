const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors: {
    origin: "http://localhost:5173",
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
  const players = room.players;
  const hands = {};

  // Deal two cards to each player (standard in blackjack)
  players.forEach((player) => {
    let card = deck.pop();
    player.playerSum += getValue(card)
    player.hand.push(card)
    let card2 = deck.pop()
    player.playerSum += getValue(card2)
    player.hand.push(card2)
    });
    room.players = players
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
  /* if (!canHit) {
      return;
  } */
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

  // Notify the first player to start their turn
  const firstPlayer = room.players[room.currentPlayerIndex];
  console.log("firstPlayer", firstPlayer)
  console.log("firstPlayer", room.currentPlayerIndex)
  io.to(firstPlayer.playerId).emit('your-turn');
}  

function nextTurn(roomId) {
  const room = rooms.find((room) => room.id === roomId);
  room.currentPlayerIndex++;

  if (room.currentPlayerIndex < room.players.length) {
    const nextPlayer = room.players[room.currentPlayerIndex];
    io.to(nextPlayer.playerId).emit('your-turn');
  } else {
    // All players have finished their turns, end the round
    endRound(room);
  }
}

function calculatePayout(player, dealerSum) {
  const { playerSum, bet, hand } = player;
  let payout = 0;

  // Check for Blackjack (21 with two cards)
  const isPlayerBlackjack = playerSum === 21 && hand.length === 2;
  const isDealerBlackjack = dealerSum === 21 && hand.length === 2;

  // Check if player has busted
  if (playerSum > 21) {
    // Player busts, loses bet
    return { result: 'Lose!', payout: 0 };
  }

  // Dealer busts, player wins
  if (dealerSum > 21) {
    return { result: 'Win!', payout: bet * 2 };
  }

  // Player has Blackjack, wins 1.5x their bet if dealer doesn't have Blackjack
  if (isPlayerBlackjack && !isDealerBlackjack) {
    return { result: 'BlackJack!', payout: bet * 2.5 }; // Wins 1.5x + original bet
  }

  // Push if both have Blackjack
  if (isPlayerBlackjack && isDealerBlackjack) {
    return { result: 'Push!', payout: bet }; // Player gets their bet back
  }

  // Player wins if their sum is greater than dealer's
  if (playerSum > dealerSum) {
    return { result: 'Win!', payout: bet * 2 }; // Wins 1x + original bet
  }

  // Push if sums are equal
  if (playerSum === dealerSum) {
    return { result: 'Push!', payout: bet }; // Player gets their bet back
  }

  // Dealer wins if their sum is greater
  return { result: 'Lose!', payout: 0 };
}

function endRound(room) {
  console.log(`Ending round for room ${room}`);
  const players = rooms[room].players
  const dealerSum = rooms[room].dealerSum
  const results = players.map(player => {
    const result = calculatePayout(player, dealerSum);
    const playerId = player.id
    const playerName = player.name
    const status = result.result
    const payout = result.payout
    io.to(playerId).emit('balanceUpdate',{
      playerName: playerName,
      status: status,
      payout: payout
    });
    
  });
  console.log(results)
}

const getAllPlayers = () => {
  return rooms.map((room) => ({
    roomId: room.id,
    players: room.players.filter((player) => player.playerId !== ""), // Only map active players
  }));
};

function resetRoomTimeout(roomId) {
  // Clear existing timeout if there is one
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
  bettingTimeouts[room] = setTimeout(() => {
    console.log(`Betting time ended in room: ${room}`);

    // Check which players haven't placed their bets and disconnect them
    room.players.forEach(player => {
      if (player.bet === 0) {
        console.log(`Disconnecting player ${player.name} for not betting in time`);
        io.to(player.id).emit('disconnected-for-no-bet');
        io.sockets.sockets.get(player.id).disconnect();
      }
    });

    // Proceed to start the game with players who placed their bets
    if (room.players.length > 0) {
      io.in(room).emit('game-started', room.players); // Notify remaining players
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
    const playerId = socket.id
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

      // Notify all clients about the updated players and bets
      io.to(roomId).emit('roomsUpdate', room);
      io.to(roomId).emit('allPlayersUpdate', getAllPlayers());
      if(room.players.every(player => player.hasBet)){
        clearTimeout(bettingTimeouts[room]);
        io.to(roomId).emit('game-started')
        startGame(room)
        room.gameStarted = true
        room.deck = shuffleDeck()
        dealCards(room,roomId);
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
    console.log("currrrrrrrrrrrrrrrent", currentPlayer)
    room.dealerHand = data.gameData.dealerHand
    room.dealerHidden = data.gameData.dealerHidden
    room.dealerSum = data.gameData.dealerSum
    room.dealerAceCount = data.gameData.dealerAceCount
    const deck = room.deck
    const playerSum = currentPlayer.playerSum
    const playerAceCount = currentPlayer.playerAceCount
    console.log("player sum before hit",playerSum)
    console.log("player ace account before hit",playerAceCount)
    hit(deck,room,playerSum,playerAceCount,currentPlayer,roomId);
    
  });

  socket.on('playerStays', (data) => {
    const roomId = data.room
    nextTurn(roomId);
  })

  

  


















  socket.on("firstBetPlaced", (data) => {
    const id = data.id
    const room = data.room
    const totalBetAmount = data.totalBetAmount
    const player = rooms[room].players.find(p => p.id === socket.id);
    player.totalBetAmount = totalBetAmount
    bets[room][socket.id] = totalBetAmount
    const currentPlayerIndex = rooms[room].currentPlayerIndex;
    const currentPlayer = rooms[room].players[currentPlayerIndex];
    if (Object.keys(bets[room]).length === rooms[room].players.length){
      io.in(room).emit('all-bets-placed');
      startGame(room)
      rooms[room].gameStarted = true
      rooms[room].deck = shuffleDeck()
      dealCards(room);
      
      if (currentPlayer.socket === socket.id){
        socket.emit("nextTurn", {
          room: room,
          currentPlayer: currentPlayer
        });
      }
    } else {
      io.in(room).emit('not-all-bets-placed');
    }
  });
  socket.on("playerLost", (data) => {
    const room = data.room

    nextTurn(room);
  });
  
  socket.on('gameStarted', (data) => {
    console.log("game started!!!!")
    const room = data.room
    //console.log("roooooom", room)
    rooms[room].gameStarted = true
    rooms[room].deck = shuffleDeck();
    //console.log(rooms[room].deck)
    /* dealCards(room,socket);
    io.to(room).emit('firstRound', {
      gameData: rooms[room]
    }); */
  });
  socket.on('manual-disconnect', (data) => {

    const currentPlayer = allUsers[socket.id].playerName

    let roomToLeave = null;
    for (const room in rooms) {
      const playerIndex = rooms[room].players.findIndex(player => player.socket === socket.id);
      if (playerIndex !== -1) {
        roomToLeave = room;
        // Remove the player from the room's players array
        rooms[room].players.splice(playerIndex, 1);
        // If the room is now empty, delete it
        if (rooms[room].players.length === 0) {
          delete rooms[room];
        } else {
          io.to(room).emit('playerLeft', {
            playerLeft: currentPlayer,
            players: rooms[room].players
          });
        }
        break; // Stop searching after finding the room
      }
    }
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