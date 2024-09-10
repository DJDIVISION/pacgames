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

const rooms = {};
const allUsers = {};
const allRooms = [];
const bets = {}; 
const turns = {};


let hidden;
let player1;
let player2;
let player3;
let player4;
let player5;
maxPlayersPerRoom = 3;
console.log(player1)
console.log(player2)

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
  console.log(deck)
  return deck
  
}

const findOrCreateRoom = () => {
  for (let room in rooms) {
    if (rooms[room].players.length < maxPlayersPerRoom) {
      return room;
    }
  }
  const newRoom = `room-${Object.keys(rooms).length + 1}`;
  rooms[newRoom] = {
        players: [],
        deck: [],
        dealerHand: [],
        dealerHidden: "",
        dealerAceCount: 0,
        dealerSum: 0,
        gameStarted: false,
        waitingList: [],
        room: "",
        currentPlayerIndex: 0
  };
  return newRoom;
};

function getValue(card,card2) {
  if(card){
    let data = card.split("-");
    let value = data[0];
    console.log("new card value", value)
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
    console.log("new card value", value)
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

function dealCards(room,socket) {
  const deck = rooms[room].deck
  hidden = deck.pop();
  console.log("hidden", hidden)
  console.log("roooooomsbefooooooore", rooms[room])
  rooms[room].dealerHidden = hidden;
  rooms[room].dealerSum += getValue(hidden);
  rooms[room].dealerAceCount += checkAce(hidden);
  console.log("roooooomsafteeeeerrrr", rooms[room])
  while (rooms[room].dealerSum < 17){
    let card = deck.pop();
    rooms[room].dealerHand.push(card);
    rooms[room].dealerSum += getValue(card);
    rooms[room].dealerAceCount += checkAce(card);
  }
  console.log("roooommmmmmmmmmmafteralllllllllll", rooms[room])
  const players = rooms[room].players;
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
  //console.log("rooooooomsplayerssss", rooms[room].players)
  rooms[room].players = players
  io.to(room).emit('firstRound', {
    gameData: rooms[room]
  });
}

function reduceAce(playerSum, playerAceCount, room) {
  while (playerSum > 21 && playerAceCount > 0) {
      playerSum -= 10;
      playerAceCount -= 1;
  }
  console.log("playerSum after reduce",playerSum)
  console.log("playerAceAcount after reduce",playerAceCount)
  return {playerSum,playerAceCount};
}

let CardToHit

function hit(deck,room,playerSum,playerAceCount,currentPlayer) {
  /* if (!canHit) {
      return;
  } */
  let card = deck.pop();
  playerSum += getValue(card);
  playerAceCount += checkAce(card);
  console.log("player sum in hit",playerSum)
  console.log("player aceaccount in hit",playerAceCount)
  const final = reduceAce(playerSum, playerAceCount,room)
  //console.log("final",final)
  console.log("currentPlayer",currentPlayer)
  currentPlayer.playerSum = playerSum
  currentPlayer.playerAceCount = playerAceCount
  currentPlayer.cardToHit = card
  //console.log("currentPlayer22222",currentPlayer)
  //console.log(rooms[room])
  console.log("playerAce after all", playerAceCount);
  currentPlayer.hand.push(card)
  io.to(room).emit('cardAfterHit',{
    playerName: currentPlayer.playerName,
    playerSum: currentPlayer.playerSum,
    gameData: rooms[room]
  });
  //console.log("reduceace here",reduceAce(playerSum, playerAceCount))

}

function startGame(room) {
  console.log(`Starting game for room ${room}`);

  // Set currentPlayerIndex to 0 to start with the first player
  rooms[room].currentPlayerIndex = 0;

  // Notify the first player to start their turn
  const firstPlayer = rooms[room].players[rooms[room].currentPlayerIndex];
  console.log("1111111111111111111111111", firstPlayer)
  io.to(firstPlayer.socket).emit('your-turn');
}  

function nextTurn(room) {
  console.log(rooms[room]);

  if (rooms[room].currentPlayerIndex < rooms[room].players.length) {
    const nextPlayer = rooms[room].players[rooms[room].currentPlayerIndex];
    io.to(nextPlayer.id).emit('your-turn');
  } else {
    // All players have finished their turns, end the round
    endRound(room);
  }
}

function endRound(room) {
  console.log(`Ending round for room ${room}`);
  // Calculate winners, reset for next round
  io.in(room).emit('round-ended', { result: 'Round ended, calculate scores' });
}

io.on("connection", (socket) => {
  allUsers[socket.id] = {
    socket: socket.id,
    online: true,
    playerName: "",
    hand: [],
    startingBet: 0,
    raisingBet: 0,
    totalBet: 0,
    playerAceCount: 0,
    playerSum: 0,
    activePlayer: false,
    cardToHit: "",
    totalBetAmount: 0,
    id: "",
    avatar: ""
  };
  
  socket.on("request_to_play", (data) => {
    const currentPlayer = allUsers[socket.id];
    currentPlayer.playerName = data.playerName;
    currentPlayer.id = socket.id
    allUsers[socket.id].playerName = data.playerName;
    allUsers[socket.id].avatar = data.avatar;
    console.log(allUsers)
    const room = findOrCreateRoom();
    if (!bets[room]) {
      bets[room] = {};
    }
    console.log("gamsStarteterered",rooms[room].gameStarted)
    if (rooms[room].gameStarted) {
      socket.emit('waiting-for-game', 'Game is in progress. You will play in the next round.');
    } else {
      const roomNumber = room.slice(-1);
      socket.join(room);
      rooms[room].players.push(currentPlayer);
      rooms[room].room = room
      io.to(room).emit('setPlayersOnScreen', {
        gameData: rooms[room],
        room: room
      });
    }
    
  
    
  });
  socket.on("firstBetPlaced", (data) => {
    const id = data.id
    const room = data.room
    const totalBetAmount = data.totalBetAmount
    console.log(id)
    console.log("roooooomssssss", rooms[room])
    const player = rooms[room].players.find(p => p.id === socket.id);
    player.totalBetAmount = totalBetAmount
    bets[room][socket.id] = totalBetAmount
    //console.log("betsRoooooooooooooom",bets[room])
    const currentPlayerIndex = rooms[room].currentPlayerIndex;
    const currentPlayer = rooms[room].players[currentPlayerIndex];
    if (Object.keys(bets[room]).length === rooms[room].players.length){
      io.in(room).emit('all-bets-placed');
      startGame(room)
      rooms[room].gameStarted = true
      rooms[room].deck = shuffleDeck()
      console.log(rooms[room].deck)
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
    console.log("datatatatatatatatatata", data)
    const room = data.room
    console.log("roooomlost", room)
    nextTurn(room);
  });
  socket.on('askForHit', (data) => {
    console.log("dataaaaaaaaaaaaaa", data);
    const id = data.id
    const room = data.room
    //console.log("222222222222222222222222",rooms[room])
    const totalBetAmount = data.placedBet
    const currentPlayerIndex = rooms[room].currentPlayerIndex;
    const currentPlayer = rooms[room].players[currentPlayerIndex];
    //console.log("currrrrrrrrrrrrrrrent", currentPlayer)
    rooms[room].dealerHand = data.gameData.dealerHand
    rooms[room].dealerHidden = data.gameData.dealerHidden
    rooms[room].dealerSum = data.gameData.dealerSum
    rooms[room].dealerAceCount = data.gameData.dealerAceCount
    const deck = rooms[room].deck
    const playerSum = currentPlayer.playerSum
    const playerAceCount = currentPlayer.playerAceCount
    console.log("player sum before hit",playerSum)
    console.log("player ace account before hit",playerAceCount)
    hit(deck,room,playerSum,playerAceCount,currentPlayer);
    
  })
  socket.on('gameStarted', (data) => {
    console.log("game started!!!!")
    const room = data.room
    console.log("roooooom", room)
    rooms[room].gameStarted = true
    rooms[room].deck = shuffleDeck();
    console.log(rooms[room].deck)
    /* dealCards(room,socket);
    io.to(room).emit('firstRound', {
      gameData: rooms[room]
    }); */
  })
  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
    const currentPlayer = allUsers[socket.id].playerName
    console.log(currentPlayer)
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
  });
  
});



httpServer.listen(8080, () => {
  console.log("server running on 8080")
});