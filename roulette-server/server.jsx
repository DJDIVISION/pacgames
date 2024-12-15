const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors')
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const webPush = require('web-push');
const supabaseUrl = 'https://qfywnsvevkeuiuxtiqko.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmeXduc3ZldmtldWl1eHRpcWtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUyNzE2MDQsImV4cCI6MjA0MDg0NzYwNH0.sVYe0wlcg_H2Psn_17g32DYDRYLkfH8KIcHk3EP2Hdg'; // Or service role key for server-side operations
const admin = require('firebase-admin');
const supabase = createClient(supabaseUrl, supabaseKey);
require('dotenv').config();


admin.initializeApp({
  credential: admin.credential.cert({
    "type": process.env.type,
  "project_id": process.env.project_id,
  "private_key_id": process.env.private_key_id,
  "private_key": process.env.private_key,
  "client_email": process.env.client_email,
  "client_id": process.env.client_id,
  "auth_uri": process.env.auth_uri,
  "token_uri": process.env.token_uri,
  "auth_provider_x509_cert_url": process.env.auth_provider_x509_cert_url,
  "client_x509_cert_url": process.env.client_x509_cert_url,
  "universe_domain": process.env.universe_domain
  })
});




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
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ['GET', 'POST'],
  credentials: true
}));
app.get('/', (req, res) => {
  res.send('Welcome to the Roulette Game!');
});

app.get('/api/toncoin-price', async (req, res) => {
  
  const options = {
    method: 'GET',
    headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-3qkmGTgTWXenAouD9JshQYt6'}
  };
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/the-open-network', options,
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching CoinGecko data:', error);
    res.status(500).json({ error: 'Failed to fetch data from CoinGecko' });
  }
});

app.get('/api/cryptocurrency/:id/chart', async (req, res) => {
  const { id } = req.params;
  const { days, currency } = req.query;
 
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart`,
      {
        params: {
          vs_currency: currency,
          days,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching CoinGecko data:', error);
    res.status(500).json({ error: 'Failed to fetch data from CoinGecko' });
  }
});

const TELEGRAM_BOT_TOKEN = '7529504868:AAFjZyVfPmiSlGxtoQ_gMhDcErmyMZnMrgs';
const CHAT_ID = '-1002433451813';

app.post('/send-message', async (req, res) => {
  const { messageToSend, imageUrl, imageUrls, inlineButtons } = req.body;

  // Validate inputs
  if (!messageToSend && !imageUrl && (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0)) {
    return res.status(400).send('Either message content, a single image URL, or multiple image URLs are required');
  }

  // Validate inlineButtons format
  if (inlineButtons && (!Array.isArray(inlineButtons) || !inlineButtons.every(row => Array.isArray(row)))) {
    return res.status(400).send('Inline buttons must be a two-dimensional array of button objects');
  }

  // Construct reply markup for inline buttons
  const replyMarkup = inlineButtons
    ? { reply_markup: { inline_keyboard: inlineButtons } }
    : {};

  try {
    let response;

    // Send media group (multiple images)
    if (imageUrls && Array.isArray(imageUrls) && imageUrls.length > 0) {
      if (imageUrls.length > 10) {
        return res.status(400).send('A maximum of 10 images are allowed');
      }

      const mediaGroup = imageUrls.map((url, index) => ({
        type: 'photo',
        media: url,
        caption: index === 0 && messageToSend ? messageToSend : undefined, // Add caption only to the first image
      }));

      response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMediaGroup`, {
        chat_id: CHAT_ID,
        media: mediaGroup,
        ...replyMarkup,
      });
    } else if (imageUrl) {
      // Send a single image
      response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
        chat_id: CHAT_ID,
        photo: imageUrl,
        caption: messageToSend,
        ...replyMarkup,
      });
    } else {
      // Send a text message
      response = await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID,
        text: messageToSend,
        ...replyMarkup,
      });
    }

    // Store message data to Supabase, including like/dislike counts (set to 0 initially)
    const messageId = response.data.result.message_id;
    const chatId = CHAT_ID;

    if (inlineButtons && inlineButtons.some(row => row.some(button => button.text.includes("👍") || button.text.includes("👎")))) {
      // Check if inline buttons contain like/dislike buttons
      const { error } = await supabase
        .from('telegram_messages')
        .insert([
          {
            message_id: parseInt(messageId), // Ensure it's parsed as an integer
            chat_id: parseInt(chatId),         // Ensure it's parsed as an integer
            likes: 0,  // Initialize like count to 0
            dislikes: 0,  // Initialize dislike count to 0
          }
        ]);

      if (error) {
        console.error('Error inserting message data into Supabase:', error.message);
        return res.status(500).json({ success: false, error: 'Failed to save message data' });
      }
    }

    console.log('Message sent and data saved successfully!');
    res.status(200).json({ success: true, response: response.data });
  } catch (error) {
    console.error('Error sending message to Telegram:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

app.post('/webhook', async (req, res) => {
  const update = req.body;

  if (update.callback_query) {
    const { data: action, message } = update.callback_query;
    const messageId = message.message_id;
    const chatId = message.chat.id;

    try {
      // Fetch current counts from Supabase
      const { data, error } = await supabase
        .from('telegram_messages')
        .select('likes, dislikes')
        .eq('message_id', messageId)
        .eq('chat_id', chatId)
        .single();

      if (error || !data) {
        console.error('Error fetching message data:', error?.message || 'Not found');
        return res.status(500).json({ success: false, error: 'Failed to fetch message data' });
      }

      // Update likes or dislikes based on the action
      const updatedCounts = {
        likes: action === "like" ? data.likes + 1 : data.likes,
        dislikes: action === "dislike" ? data.dislikes + 1 : data.dislikes,
      };

      const { error: updateError } = await supabase
        .from('telegram_messages')
        .update(updatedCounts)
        .eq('message_id', messageId)
        .eq('chat_id', chatId);

      if (updateError) {
        console.error('Error updating message data:', updateError.message);
        return res.status(500).json({ success: false, error: 'Failed to update message data' });
      }

      // Update the message's inline keyboard
      const updatedKeyboard = [
        [
          { text: `👍 ${updatedCounts.likes}`, callback_data: "like" },
          { text: `👎 ${updatedCounts.dislikes}`, callback_data: "dislike" }
        ]
      ];

      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageReplyMarkup`, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: { inline_keyboard: updatedKeyboard }
      });

      // Acknowledge the callback query
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
        callback_query_id: update.callback_query.id,
        text: action === "like" ? "You liked this!" : "You disliked this!",
        show_alert: false
      });

      console.log('Like/dislike counts updated successfully!');
      res.sendStatus(200);
    } catch (error) {
      console.error('Error handling callback query:', error.message);
      res.status(500).json({ success: false, error: 'Failed to process callback query' });
    }
  } else {
    res.sendStatus(200);
  }
});



const subscriptions = {};

// Endpoint to subscribe to notifications
app.post('/subscribe', (req, res) => {
  const { subscription, userId } = req.body;
  console.log("subs", subscription)
  console.log("id", userId)
  if (!subscriptions[userId]) {
    subscriptions[userId] = [];
  }
  subscriptions[userId].push(subscription);
  res.status(201).json({});
  console.log("aaaaall subscriptions", subscriptions)
});

const vapidKeys = {
  publicKey: 'BLei-NwbbRtrn0qUWICUbxD2wdExl4ra67PPQX7ImPq107Rs76tDOwUjHoqbrYwI26FrsQgxQkv_DiN8zD9Lheo',
  privateKey: 'ybgqwG2c9lxh8AOmbu0hEgM2vcTWTDUf8Llxye81wmk'
};

webPush.setVapidDetails(
  'mailto:bodegaflamenca666@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Endpoint to send notifications to a specific user
app.post('/send-notification', (req, res) => {
  const { userId, notificationPayload } = req.body;
  console.log("id on send", userId)
  console.log(notificationPayload)
  const payload = JSON.stringify(notificationPayload);
  console.log("subscriptions",subscriptions)
  console.log("payload",payload)
  if (subscriptions[userId]) {
    console.log("sending push")
    Promise.all(subscriptions[userId].map(sub => webPush.sendNotification(sub, payload)))
      .then(() => res.status(200).json({ message: 'Notification sent successfully.' }))
      .catch(err => {
        console.error('Error sending notification, reason: ', err);
        res.sendStatus(500);
      });
  } else {
    res.status(404).json({ message: 'No subscriptions found for this user.' });
  }
});


const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]  // Client URL
  },
 });

 let rooms = Array.from({ length: 20 }, (_, index) => ({
  id: (index + 1).toString(),
  players: [],
  gameStarted: false,
  allBets: [],
  room: "",
  matchId: null,
  winningNumber: null,
  allDroppedChips: [],
  allDroppedCornerChips: [],
  allDroppedRowChips: [],
  allDroppedLastRowChips: [],
  allDroppedColumnChips: [],
  allDroppedBorderLeftChips: [],
  allDroppedBorderTopChips: [],
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
    room.winningNumber = winningNumber
    const matchId = room.matchId
    console.log("matchIDDDDDDDDDDDDDDDDDDDDDDDDD", matchId)
    // Emit the result to all connected clients
    io.emit('winning-number', {
      winningNumber, matchId
    });
};

const bettingTimeouts = {};
const roomTimeouts = {};

    
const sendAllBetsToPlayers = (roomId) => {
  const room = rooms.find((r) => r.id === roomId);

  if (room) {
      // Initialize empty arrays for all chip types
      const allDroppedChips = {};  // Storing as an object
      const allDroppedCornerChips = {};
      const allDroppedRowChips = {};
      const allDroppedLastRowChips = {};
      const allDroppedColumnChips = {};
      const allDroppedBorderLeftChips = {};
      const allDroppedBorderTopChips = {};

      room.players.forEach((player) => {
          const playerBets = player.bets || {}; // Ensure player.bets is defined

          // Aggregate droppedChips
          if (playerBets.droppedChips) {
              Object.keys(playerBets.droppedChips).forEach(key => {
                  allDroppedChips[key] = allDroppedChips[key] || []; // Initialize if undefined
                  allDroppedChips[key].push(...playerBets.droppedChips[key]); // Push the chips
              });
          }

          // Aggregate droppedCornerChips
          if (playerBets.droppedCornerChips) {
              Object.keys(playerBets.droppedCornerChips).forEach(key => {
                  allDroppedCornerChips[key] = allDroppedCornerChips[key] || []; // Initialize if undefined
                  allDroppedCornerChips[key].push(...playerBets.droppedCornerChips[key]); // Push the chips
              });
          }

          // Repeat this structure for the other chip types
          if (playerBets.droppedRowChips) {
              Object.keys(playerBets.droppedRowChips).forEach(key => {
                  allDroppedRowChips[key] = allDroppedRowChips[key] || [];
                  allDroppedRowChips[key].push(...playerBets.droppedRowChips[key]);
              });
          }

          if (playerBets.droppedLastRowChips) {
              Object.keys(playerBets.droppedLastRowChips).forEach(key => {
                  allDroppedLastRowChips[key] = allDroppedLastRowChips[key] || [];
                  allDroppedLastRowChips[key].push(...playerBets.droppedLastRowChips[key]);
              });
          }

          if (playerBets.droppedColumnChips) {
              Object.keys(playerBets.droppedColumnChips).forEach(key => {
                  allDroppedColumnChips[key] = allDroppedColumnChips[key] || [];
                  allDroppedColumnChips[key].push(...playerBets.droppedColumnChips[key]);
              });
          }

          if (playerBets.droppedBorderLeftChips) {
              Object.keys(playerBets.droppedBorderLeftChips).forEach(key => {
                  allDroppedBorderLeftChips[key] = allDroppedBorderLeftChips[key] || [];
                  allDroppedBorderLeftChips[key].push(...playerBets.droppedBorderLeftChips[key]);
              });
          }

          if (playerBets.droppedBorderTopChips) {
              Object.keys(playerBets.droppedBorderTopChips).forEach(key => {
                  allDroppedBorderTopChips[key] = allDroppedBorderTopChips[key] || [];
                  allDroppedBorderTopChips[key].push(...playerBets.droppedBorderTopChips[key]);
              });
          }
      });

      // Emit the combined data to all players in the room
      io.to(roomId).emit('game-started', {
          allDroppedChips,
          allDroppedCornerChips,
          allDroppedRowChips,
          allDroppedLastRowChips,
          allDroppedColumnChips,
          allDroppedBorderLeftChips,
          allDroppedBorderTopChips
      });
  }
};

function resetRoomTimeout(roomId) {
  const room = rooms.find((room) => room.id === roomId);
  console.log("room.gameStarted: ", room.gameStarted)
  if (roomTimeouts[roomId]) {
    clearTimeout(roomTimeouts[roomId]);
  }
  
  roomTimeouts[roomId] = setTimeout(() => {
    if (room.players.length > 0 && !room.gameStarted) {
      io.to(roomId).emit('timeoutExpired');
      startBettingTimeout(roomId);
    }
  }, 10000);
}

function startBettingTimeout(roomId) {
    
    
  console.log("betting time started")
  const room = rooms.find((room) => room.id === roomId);
  const uniqueId = uuidv4(); // Generate a unique ID
  console.log('Generated Unique ID:', uniqueId);
  room.matchId = uniqueId; 
  io.to(roomId).emit('uniqueId', {
    uniqueId,roomId
  });
  room.gameStarted = true
  console.log("room.gameStarted: ", room.gameStarted)
  io.emit('roomsUpdate', rooms);
  bettingTimeouts[room] = setTimeout(() => {
  

    // Check which players haven't placed their bets and disconnect them
    room.players.forEach(player => {
      
      if (player.bet === 0) {
        console.log(`${player.playerName} has not placed any bet`)
        io.to(player.playerId).emit('close-betting-table',{
          message: `${player.playerName} has not placed any bet!`,
          dealer: 'Jack',
          dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
          sendedBy: 'ADMIN',
        });
        //declareWinningNumber(roomId);
      }
    })
    // Proceed to start the game with players who placed their bets
    if (room.players.every(player => player.bets)) {
        // If all players have placed bets, emit the bets back to all players in the room
      
      // Emit the data to all players in the room
      io.to(roomId).emit('message-sent', {
        message: `All bets placed!`,
        dealer: 'Jack',
        dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
        sendedBy: 'ADMIN',
      });
        sendAllBetsToPlayers(roomId)
        declareWinningNumber(roomId);
      }
      
  }, 20000);
}

io.on("connection", (socket) => {
    console.log("user connected")

    socket.on('getAllPlayers', () => {
      const allPlayers = getAllPlayers();
      console.log("players requested")
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
          io.to(roomId).emit('update_players', {
            message: `${playerName} has joined the room all alone.`,
            dealer: 'Jack',
            dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
            sendedBy: 'ADMIN'
          });
          // Update all clients about the room and players
          io.emit('roomsUpdate', rooms);
          io.emit('allPlayersUpdate', getAllPlayers()); // Emit all players after a change
          if (!room.gameStarted) {
            console.log("requesting match")
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

    
    socket.on('placeBet', ({allChips,roomId,playerId,placedBet}) => {
      const { droppedChips,droppedCornerChips,droppedRowChips,droppedLastRowChips,droppedColumnChips,droppedBorderLeftChips,droppedBorderTopChips } = allChips;
        const room = rooms.find((room) => room.id === roomId);
        const player = room.players.find(p => p.playerId === playerId);
        player.bet = placedBet
        player.bets = player.bets || {};
        player.bets.droppedChips = droppedChips || []; // Ensure these are arrays
        player.bets.droppedCornerChips = droppedCornerChips || [];
        player.bets.droppedRowChips = droppedRowChips || [];
        player.bets.droppedLastRowChips = droppedLastRowChips || [];
        player.bets.droppedColumnChips = droppedColumnChips || [];
        player.bets.droppedBorderLeftChips = droppedBorderLeftChips || [];
        player.bets.droppedBorderTopChips = droppedBorderTopChips || [];
        io.to(roomId).emit('message-sent', {
          message: `${player.playerName} has placed a bet of $${placedBet}`,
          dealer: 'Jack',
          dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
          sendedBy: 'ADMIN',
        });
        io.to(playerId).emit('bet-placed');
    });
    socket.on('game-finished', ({activeRoom, myId, allBets, matchId}) => {
      console.log("gameFinished");
      const roomId = activeRoom;
      const playerId = myId;
      console.log(roomId);
      console.log(playerId);

      const room = rooms.find((room) => room.id === roomId);
      const player = room.players.find((p) => p.playerId === playerId);
      const number = room.winningNumber.number; // Winning number
      const playerBets = allBets;

      let playerWon = false;
      let winnings = 0;
      let winningBetDetails = null; // To store the array of bets for the winning number

      // Iterate through all bets to determine winnings
      Object.entries(playerBets).forEach(([betNumber, valueArray]) => {
        if (betNumber == number) { // Check if the bet matches the winning number
          playerWon = true;

          const amount = valueArray[0].amount; // First bet's amount
          const typeofBet = valueArray[0].typeofBet; // Type of bet

          console.log("Winning Bet Found -> Bet Array:", valueArray);

          // Calculate winnings based on the type of bet
          if (typeofBet === "Straight") {
            winnings = amount * 35;
          } else if (typeofBet === "Corner") {
            winnings = amount * 8;
          } else if (typeofBet === "Six Line") {
            winnings = amount * 5;
          } else if (typeofBet === "Split") {
            winnings = amount * 17;
          } else if (typeofBet === "Street") {
            winnings = amount * 11;
          } else if (typeofBet === "Dozen") {
            winnings = amount * 2;
          } else if (["Low (1-18)", "High (19-36)", "Even", "Odd", "Blacks", "Reds"].includes(typeofBet)) {
            winnings = amount * 2;
          } else if (typeofBet === "Column") {
            winnings = amount * 2;
          }

          // Assign the valueArray (array of bets for the winning number)
          winningBetDetails = {
            [betNumber]: valueArray, // Format: { 20: Array(1) }
          };
        }
      });

      const latest = room.latestNumbers;

      if (playerWon) {
        const id = player.googleId;
        const bets = player.bets;

        console.log("Player wins with winnings:", winnings);
        console.log("Winning Bet Details:", winningBetDetails);

        // Emit the win result with the winning bet details
        io.to(player.playerId).emit("player-wins", {
          winnings,
          number: room.winningNumber,
          matchId,
          id,
          bets,
          winningBetDetails, // Send the detailed bet array
        });

        io.to(roomId).emit('message-sent', {
          message: `${player.playerName} wins $${winnings}.`,
          dealer: 'Jack',
          dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
          sendedBy: 'ADMIN'
        });
      } else {
        console.log("Player has lost");

        // Emit the loss result
        io.to(player.playerId).emit("player-lost", { number: room.winningNumber });

        io.to(roomId).emit('message-sent', {
          message: `${player.playerName} has lost this round.`,
          dealer: 'Jack',
          dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
          sendedBy: 'ADMIN'
        });
      }
      room.gameStarted = false
      console.log("room.gameStarted: ", room.gameStarted)
      room.matchId = null
      player.bets = {}; 
      player.playerBets = []
      player.bet = 0
      io.to(roomId).emit('update_players-again', {
        message: `Next game starts in 10 seconds!.`,
        dealer: 'Jack',
        dealer_avatar: 'https://i.postimg.cc/zGGx0q0n/dealer1.jpg',
        sendedBy: 'ADMIN'
      });
      if (!room.gameStarted) {
        setTimeout(() => {
          console.log("requesting match")
          io.to(roomId).emit('timeoutStarting')
          resetRoomTimeout(roomId)
        }, 10000)
      }
      
      
    });
    socket.on('disconnect', () => {
      console.log("requesting disconnect")
      console.log('A user disconnected:', socket.id);
    rooms.forEach((room) => {
      // Remove player from room if they were in one
      const playerIndex = room.players.findIndex(p => p.playerId === socket.id);
      if (playerIndex !== -1) { // Ensure player is in the room
        // Remove player from room's players array
        room.players.splice(playerIndex, 1);
        console.log(`Removed player with ID ${socket.id} from room ${room.id}`);
      }
      if(room.players.length === 0){
        room.gameStarted = false
      }
    });
    // Update the clients about the new room status
    io.emit('roomsUpdate', rooms);
    io.emit('allPlayersUpdate', getAllPlayers());
    })
})

// Start server
httpServer.listen(8080, () => {
  console.log('Server listening on port 8080');
});