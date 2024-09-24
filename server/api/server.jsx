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
  origin: 'http://localhost:5173', // Replace with your frontend URL
  methods: ['GET', 'POST'],
  credentials: true
}));
app.get('/', (req, res) => {
  res.send('Welcome to the Blackjack Game!');
});
const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]  // Client URL
  },
 });

 const declareWinningNumber = () => {
    // Randomly pick a number
    const winningNumberIndex = Math.floor(Math.random() * americanRouletteNumbers.length);
    const winningNumber = americanRouletteNumbers[winningNumberIndex];
    console.log(winningNumber)
    // Emit the result to all connected clients
    io.emit('winning-number', winningNumber);
};


io.on("connection", (socket) => {
    console.log("user connected")

    socket.on('spin-request', () => {
        console.log('Spin requested');
        declareWinningNumber();  // Declare and send the winning number
    });
})

// Start server
httpServer.listen(8080, () => {
  console.log('Server listening on port 8080');
});