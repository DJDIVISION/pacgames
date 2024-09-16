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

function startJoinTimeout(room) {
  if (roomJoinTimeouts[room]) {
    clearTimeout(roomJoinTimeouts[room]);
  }

  roomJoinTimeouts[room] = setTimeout(() => {
    if (rooms[room].players.length > 0 && !rooms[room].gameInProgress) {
      console.log(`Join timeout expired in room: ${room}`);
      rooms[room].gameInProgress = true;

      io.in(room).emit('betting-start', { 
        players: rooms[room].players,
        message: `The game has started. You have 15 seconds to place your bet ⏱️`,
        dealer: 'Jack',
        dealer_avatar: 'https://ibb.co/MS5RdHV',
        sendedBy: 'ADMIN' 
      });  //setChipMenuOpen
      startBettingTimeout(room)
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
      io.to(room).emit('allBetsPlaced', {
        message: 'All bets have been placed!'
      });
      startGame(room)
      //console.log("all bets placed, now what!!!")
    }
  }, BETTING_TIMEOUT_DURATION);
}

function startGame(room) {
  console.log(`Starting game for room ${room}`);
  
  // Set currentPlayerIndex to 0 to start with the first player
  rooms[room].currentPlayerIndex = 0;

  // Notify the first player to start their turn
  const firstPlayer = rooms[room].players[rooms[room].currentPlayerIndex];
  //console.log("firstttttttttt", firstPlayer)
  io.to(firstPlayer.id).emit('your-turn');
  rooms[room].deck = shuffleDeck()
  console.log(rooms[room].deck)
  dealCards(room);
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
  console.log("look herererererer",rooms[room].players)
  console.log("look herererererer",rooms[room])
  io.to(room).emit('dealCards', {
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

function nextTurn(room) {
  //console.log("rorororororor",rooms[room])
  console.log("roooooooooooooooooooooooooooooooooom",room)
  rooms[room].currentPlayerIndex++;
  const playerIndex = rooms[room].currentPlayerIndex

  if (rooms[room].currentPlayerIndex < rooms[room].players.length) {
    const nextPlayer = rooms[room].players[rooms[room].currentPlayerIndex];
    io.to(nextPlayer.id).emit('your-second-turn',{
      playerIndex: playerIndex
    });
  } else {
    console.log(rooms[room].players)
    io.in(room).emit('round-ended', {
      dealerSum: rooms[room].dealerSum,
      dealerHidden: rooms[room].dealerHidden,
    });
    endRound(room);
  }
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

const roomPlayers = {};

io.on('connection', (socket) => {
    console.log(`new player in room: ${socket.id}`);
    socket.on('join-room', async (data) => {
      const playerName = data.playerName
      const googleId = data.googleId
      const avatar = data.avatar
      const room = data.room
      socket.playerName = data.playerName;
      rooms[room] = {
        players: [],
        deck: [],
        dealerHand: [],
        dealerHidden: "",
        dealerAceCount: 0,
        dealerSum: 0,
        gameStarted: false,
        waitingList: [],
        room: room,
        currentPlayerIndex: 0
      }
      rooms[room].players.push({ id: socket.id, name: playerName, bet: 0, googleId: googleId, playerSum: 0, hand:[], playerAceCount: 0, avatar: avatar });
      socket.join(room);
      
      
      if (!roomPlayers[room]) {
        roomPlayers[room] = [];
      }
  
      // Add the player to the roomPlayers array if they don't already exist
      roomPlayers[room].push({ id: socket.id, name: playerName, bet: 0, googleId: googleId, playerSum: 0, hand:[], playerAceCount: 0, avatar: avatar });
  
      // Emit the updated list of players to the room
      socket.emit('roomPlayers', {
        players: roomPlayers[room]
      });
      io.to(socket.id).emit('thisIsYourId', {
        playerId: socket.id
      });
  
      console.log(`Player ${playerName} (${socket.id}) joined room ${room}. Players:`, roomPlayers[room]);

    });
    socket.on('getAllRoomPlayers', () => {
      socket.emit('allRoomPlayers', roomPlayers); // Send roomPlayers to the client
    });
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
      
      /* io.to(room).emit('update_players', {
        gameData: rooms[room],
        message: `${playerName} has joined the room 🙂!`,
        dealer: 'Jack',
        dealer_avatar: 'https://ibb.co/MS5RdHV',
        sendedBy: 'ADMIN'
      });
      console.log("players", rooms[room].players) */
  
      // Initialize bet tracking for the room if not done already
      if (!bets[room]) {
        bets[room] = {};
      }
      
      if (!rooms[room].gameInProgress) {
        startJoinTimeout(room);
        console.log("starting join timeout")
      }
    });
    socket.on('next-player', (data) => {
      const room = data.room
      console.log("this is the room", room)
      nextTurn(room);

    })
    socket.on('place-bet', (data) => {
      const bet = data.bet
      const room = data.room
      const playerId = data.id
      //console.log("roooms", rooms[room])
      const player = rooms[room].players.find(p => p.id === playerId);
      const playerName = player.name
      if (!playerBets[room]) {
        playerBets[room] = {};
      }
      if (!player.bet) {
        player.bet = 0 
      }
      player.bet = bet
      playerBets[room][socket.id] = bet;
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
      const bet = data.placedBet
      const currentPlayerIndex = rooms[room].currentPlayerIndex;
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
      
    });
    socket.on('playerStays', (data) => {
      const room = data.room
      console.log(rooms[room].players)
      nextTurn(room);
    });
    socket.on('doubledBet', (data) => {
      const bet = data.placedBet
      const room = data.room
      const id = data.id
      const currentPlayerIndex = rooms[room].currentPlayerIndex;
      const currentPlayer = rooms[room].players[currentPlayerIndex];
      currentPlayer.bet = bet
      console.log("currentPlauer", currentPlayer)
      io.in(room).emit('restoreAmount',{
        players: rooms[room].players
      });
    })
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
      const rooms = Array.from(socket.rooms); // Get the rooms the socket is in

      rooms.forEach((roomName) => {
        // Check if the room exists in roomPlayers
        if (roomPlayers[roomName]) {
          // Remove the disconnecting player from the roomPlayers array
          roomPlayers[roomName] = roomPlayers[roomName].filter(player => player.id !== socket.id);
          console.log(`${socket.id} deleted`)
          // If room is empty, delete the room
          if (roomPlayers[roomName].length === 0) {
            delete roomPlayers[roomName];
          }
        }
      });
    });
  });
  

httpServer.listen(8080, () => {
    console.log("server running on 8080")
});