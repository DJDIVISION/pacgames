const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const rooms = {}; // Room tracking
const bets = {};  // Track player bets for each room
const turns = {}; 
maxPlayersPerRoom = 3;
const JOIN_TIMEOUT_DURATION = 10000; // 10 seconds to wait for other players
const BETTING_TIMEOUT_DURATION = 15000
const roomJoinTimeouts = {};
const roomBettingTimeouts = {};
const playerBets = {}; 

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]  // Client URL
  },
});

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


function findPlayerRoom(playerId) {
  return Object.keys(rooms).find(room =>
    rooms[room].players.some(player => player.id === playerId)
  );
}

function startJoinTimeout(room) {
  if (roomJoinTimeouts[room]) {
    clearTimeout(roomJoinTimeouts[room]);
  }

  roomJoinTimeouts[room] = setTimeout(() => {
    if (rooms[room].players.length > 0 && !rooms[room].gameInProgress) {
      console.log(`Join timeout expired in room: ${room}`);
      rooms[room].gameInProgress = true;

      io.in(room).emit('betting-start', { players: rooms[room].players });  //setChipMenuOpen
      //startBettingTimeout(room)
      console.log("time expired!!!")
    }
  }, JOIN_TIMEOUT_DURATION);
}

function startBettingTimeout(room) {
  console.log(`Betting phase started in room: ${room}`);
  
  roomBettingTimeouts[room] = setTimeout(() => {
    console.log(`Betting time ended in room: ${room}`);
    
    // Disconnect players who didn't place a bet
    const playersToDisconnect = [];
    rooms[room].players.forEach(player => {
      if (!playerBets[room] || !playerBets[room][player.id]) {
        playersToDisconnect.push(player);
      }
    });

    // Disconnect all players who didn't bet
    playersToDisconnect.forEach(player => {
      console.log(`Disconnecting player ${player.name} for not betting`);
      io.to(player.id).emit('disconnected-for-no-bet');
      const socket = io.sockets.sockets.get(player.id);
      if (socket) {
        socket.disconnect();
      }
    });

    // Start the game with the remaining players
    const remainingPlayers = rooms[room].players.filter(player => playerBets[room] && playerBets[room][player.id]);
    if (remainingPlayers.length > 0) {
      io.to(room).emit('allBetsPlaced');
    }
  }, BETTING_TIMEOUT_DURATION);
}


function setActivePlayer(room){
  io.in(room).emit('all-bets-placed', {
    message: "All bets placed!!!!!!"
  });
  startGame(room)
  rooms[room].gameStarted = true
  rooms[room].deck = shuffleDeck()
  console.log(rooms[room].deck)
  dealCards(room);
}

function startGame(room) {
  console.log(`Starting game for room ${room}`);

  // Set currentPlayerIndex to 0 to start with the first player
  rooms[room].currentPlayerIndex = 0;

  // Notify the first player to start their turn
  const firstPlayer = rooms[room].players[rooms[room].currentPlayerIndex];
  console.log("firstttttttttt", firstPlayer)
  io.to(firstPlayer.id).emit('your-turn', {
    playerName: firstPlayer.name
  });
}

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
    //console.log("new card value", value)
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

function dealCards(room) {
  const deck = rooms[room].deck
  hidden = deck.pop();
  rooms[room].dealerHidden = hidden;
  rooms[room].dealerSum += getValue(hidden);
  rooms[room].dealerAceCount += checkAce(hidden);
  while (rooms[room].dealerSum < 17){
    let card = deck.pop();
    rooms[room].dealerHand.push(card);
    rooms[room].dealerSum += getValue(card);
    rooms[room].dealerAceCount += checkAce(card);
  }
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
  //setNextTurn(room);
  io.to(room).emit('dealCards', {
    gameData: rooms[room]
  });
}

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
}


function setNextTurn (room) {
  console.log(`Starting game for room ${room}`);

  // Set currentPlayerIndex to 0 to start with the first player
  rooms[room].currentPlayerIndex = 0;

  // Notify the first player to start their turn
  const firstPlayer = rooms[room].players[rooms[room].currentPlayerIndex];
  console.log("firstPlayer", firstPlayer)
  console.log("keysssss",io.sockets.sockets.keys()); 

  const playerRooms = io.sockets.sockets.get(firstPlayer.id)?.rooms;
  console.log(`Player rooms:`, playerRooms);
  const id = firstPlayer.id
  io.to(id).emit('your-turn', {
    message: "Ready to go"
  });
}

io.on('connection', (socket) => {
    socket.on('request_to_play', (data) => {
      const playerName = data.playerName
      const googleId = data.id
      const avatar = data.avatar
      const room = findOrCreateRoom();
      rooms[room].room = room
      playerBets[room] = {};
      rooms[room].players.push({ id: socket.id, name: playerName, bet: 0, googleId: googleId, playerSum: 0, hand:[], playerAceCount: 0, avatar: avatar });
      socket.join(room);
      io.to(socket.id).emit('thisIsYourId', {
        playerId: socket.id,
      });
      io.to(room).emit('update_players', {
        gameData: rooms[room],
        message: `!🙂 ${playerName} has joined the room`
      });
      console.log("firstPlayer", rooms[room].players)
  
      // Initialize bet tracking for the room if not done already
      if (!bets[room]) {
        bets[room] = {};
      }
      
      if (!rooms[room].gameInProgress) {
        startJoinTimeout(room);
        console.log("now")
      }
    });

    socket.on('firstBetPlaced', (data) => {

      const bet = data.bet
      const room = data.room
      const playerId = data.playerId
      const player = rooms[room].players.find(p => p.id === socket.id);
      console.log("playereeeeee", player)
      /* player.bet = bet
      const playerName = player.name
      if (!playerBets[room]) {
        playerBets[room] = {};
      }
      playerBets[room][socket.id] = bet;
      io.in(room).emit('new_update_players', {
        gameData: rooms[room],
        playerName: playerName,
        bet: bet
      }); */
    })
  
    socket.on('place-bet', (data) => {
      console.log("dataaaaaaaa", data)
      const bet = data.bet
      const room = data.room
      const playerId = data.playerId
      console.log("roooms", rooms[room])
      const players = rooms[room].players
      const player = players.find(el => el.id = socket.id)
      console.log("playerlater", player)
      
      const playerName = player.name
      if (!playerBets[room]) {
        playerBets[room] = {};
      }
      if (!player.bet) {
        player.bet = 0 
      }
      player.bet = bet
      playerBets[room][socket.id] = bet;
      console.log("playerlater", player)
      io.in(room).emit('new_update_players', {
        gameData: rooms[room],
        playerName: playerName,
        bet: bet
      });
    });

    socket.on('askForHit', (data) => {
      console.log("dataaaaaaaaaaaaaa", data);
      const id = data.id
      const room = data.room
      //console.log("222222222222222222222222",rooms[room])
      const totalBetAmount = data.placedBet
      const currentPlayerIndex = data.currentPlayerIndex;
      const currentPlayer = rooms[room].players[currentPlayerIndex];
      console.log("currrrrrrrrrrrrrrrent", currentPlayer)
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
    socket.on('manual-disconnect', (data) => {
      for (const room in rooms) {
        const playerIndex = rooms[room].players.findIndex(
          (p) => p.id === socket.id
        );
        if (playerIndex !== -1) {
          rooms[room].players.splice(playerIndex, 1);
          io.in(room).emit('selfDisconnected',{
            gameData: rooms[room].players
          });
    
          // Remove player's bet from the room
          if (bets[room]) {
            delete bets[room][socket.id];
          }
          if (rooms[room].players.length === 0) {
          delete rooms[room];
          console.log(`Room ${room} deleted as it is empty`);
        }
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
          io.in(room).emit('selfDisconnected',{
            gameData: rooms[room].players
          });
    
          // Remove player's bet from the room
          if (bets[room]) {
            delete bets[room][socket.id];
          }
          if (rooms[room].players.length === 0) {
          delete rooms[room];
          console.log(`Room ${room} deleted as it is empty`);
        }
        }
      }
    });
  });
  
  // Function to start the game after all bets are placed
  
  
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