const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",  // Client URL
  },
});

const maxPlayersPerRoom = 3;
let rooms = {};
const allUsers = {};

const findOrCreateRoom = () => {
  for (let room in rooms) {
    if (rooms[room].length < maxPlayersPerRoom) {
      return room;
    }
  }
  const newRoom = `room-${Object.keys(rooms).length + 1}`;
  rooms[newRoom] = [];
  return newRoom;
};

let currentUser;


io.on("connection", (socket) => {
  allUsers[socket.id] = {
    socket: socket,
    online: true,
  };
  console.log("allUSers", allUsers)
  socket.on("request_to_play", (data) => {
    currentUser = allUsers[socket.id];
    currentUser.playerName = data.playerName;
    console.log('A player connected:', socket.id);

    const room = findOrCreateRoom();
    socket.join(room);
    rooms[room].push(socket.id);
    
    console.log(`Player ${socket.id} joined ${room}`);

    socket.emit('room-assigned', {
      currentUser: currentUser.playerName,
      room: room,
      playersInRoom: rooms[room].length, // Example of sending number of players in the room
      gameStage: 'waiting',              // You could send any other relevant game data
      welcomeMessage: `Welcome to ${room}!`, // Send a custom message
    });

  socket.on("disconnect", () => {
    console.log(`Player ${socket.id} disconnected`);
    rooms[room] = rooms[room].filter(player => player !== socket.id);
    if (rooms[room].length === 0) {
      delete rooms[room];
    }
  });
  })
});



httpServer.listen(8080, () => {
  console.log('Server is running on port 8080');
});
